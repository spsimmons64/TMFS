import os,base64,json,pprint,copy
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Pricing(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"packagename","text":"Package Name Is Required"},            
        ]
        dup_list = [
            {"id":"packagename","text":"This Package Name Already Exists!"},                        
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False                

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND a.search_text like %s"""            
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "packagename": sort =f"""a.packagename {order}"""
                case "packagetype": sort = f"""a.packagetype {order}"""
                case "frequency": sort = f"""a.frequency {order}"""
                case "priceby": sort = f"""a.priceby {order}"""
                case "added": sort=f"""a.added {order}"""
                case "updated": sort=f"""a.update {order}"""
                case __: sort= "a.packagename"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        order_by = ""
        new_rec = Database().assign("pricing",record)        
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec["added"] = format_date_time(local_date_time(new_rec["added"],res_rec["timezone"]),"human_date")                            
        new_rec["fees"] = []
        new_rec["isdefault"] =True if new_rec["isdefault"] else False
        if record["priceby"] == "driver": order_by = " ORDER BY driverstart ASC"        
        rec_set,rec_count = Database().query(f'SELECT * FROM pricingfees WHERE pricingid=%s AND deleted IS NULL {order_by}',(new_rec["recordid"]))
        for rec in rec_set:
            new_rec["fees"].append({
                "recordid": rec["recordid"],                
                "driverstart": rec["driverstart"],
                "driverend": rec["driverend"],
                "price": format_currency(rec["price"]),
                "cost": format_currency(rec["cost"]),
                "flatfee": rec["flatfee"]                
            })            
        return new_rec
    
    def __add_fee_record(self,rec):        
        new_rec = Database().prime("pricingfees")        
        new_rec.update(rec)        
        return Database().insert("pricingfees",new_rec)
    
    def __update_fees(self,record):
        sql = f"UPDATE pricingfees SET deleted=%s WHERE pricingid=%s and deleted IS NULL"
        if Database().query(sql,(get_sql_date_time(),record["recordid"])):            
            for fee in json.loads(self.payload["fees"]):                  
                if record["priceby"] == "flat":                     
                    self.__add_fee_record({
                        "pricingid":record["recordid"],
                        "price":fee["price"],
                        "cost":fee["cost"],                        
                        "flatfee": 1
                    })
                if record["priceby"] == "driver": 
                    self.__add_fee_record({
                        "pricingid":record["recordid"],
                        "driverstart":fee["driverstart"],
                        "driverend":fee["driverend"],
                        "price":fee["price"],
                        "cost":fee["cost"],                        
                        "flatfee": int(fee["flatfee"])
                    })
                        
    def get(self,user):                
        sql = f"""SELECT a.* FROM pricing a WHERE 1=1 {self.__set_sql_where()}"""        
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):                
        errors = self.__validate(user)
        if errors: return errors        
        rec = copy.deepcopy(self.payload)        
        rec["isdefault"] = update_default_field("pricing",rec,["packagetype","frequency"])            
        new_rec = Database().insert("pricing",rec)
        if new_rec:
            self.__update_fees(new_rec)            
            return build_response(status=200,message=f"The Pricing Record Was Added Successfully!")
        return build_response(status=400,message="The Pricing Record Was Not Added. Contact Support")            
        
    def put(self,user):
        errors = self.__validate(user)    
        if errors: return errors
        rec = copy.deepcopy(self.payload)
        rec["deleted"] = None
        rec["isdefault"] = update_default_field("pricing",rec,["packagetype","frequency"])                    
        upd_rec = Database().update("pricing",rec)
        if upd_rec:                  
            self.__update_fees(upd_rec)            
            return build_response(status=200,message=f"The Pricing Record Was Updated Successfully!")
        return build_response(status=400,message="The Pricing Record Was Not Updated. Contact Support")            


    def delete(self,user):
        if Database().delete("pricing",self.payload["recordid"]):
            return build_response(status=200,message="The Pricing Record Was Deactivated Successfully!")
        return build_response(status=400,message="The Pricing Record Was Not Deactivated. Contact Support")            