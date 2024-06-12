import copy,json
from datetime import timedelta
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *
from drivers import Drivers

class APIProfiles(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
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
                case "apiname": sort =f"""a.apiname {order}"""
                case "supportemail": sort = f"""a.supportemail {order}"""                                
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):         
        res_rec = get_reseller_from_user(user["recordid"])           
        new_rec = Database().assign("apiprofiles",record)        
        new_rec["supportemail"] = record["supportemail"].lower()
        new_rec["supportphone"] = format_telephone(record["supportphone"])
        new_rec["password"]  = decrypt_with_salt(new_rec["password"],res_rec["tokenid"],res_rec["tokenkey"]) if new_rec["password"] else None
        if record["passwordexpire"] and record["passwordlastchange"]:            
            expireDate = record["passwordlastchange"] + timedelta(days=record["passwordexpire"])
            new_rec["passwordlastchange"] = format_date_time(new_rec["passwordlastchange"],"human_date")
            new_rec["passwordexpiredate"] = format_date_time(expireDate,"human_date")
        else:
            new_rec["passwordlastchange"] = "Never"
            new_rec["passwordexpiredate"] = "Never"        
        new_rec["pricing"] = []
        pricing_set,pricing_cnt = Database().query("SELECT * FROM apipricing WHERE apiprofileid=%s AND deleted IS NULL",(new_rec["recordid"]))        
        for price in pricing_set:
            new_rec["pricing"].append({
                "state": price["state"],
                "price": format_currency(price["price"]),
                "cost": format_currency(price["cost"])
            })
        return new_rec
    
    def __update_pricing(self,rec):
        data = json.loads(self.payload["pricing"])
        if Database().query("UPDATE apipricing SET deleted=%s WHERE apiprofileid=%s AND deleted IS NULL",(get_sql_date_time(),rec["recordid"])):
            for price in data:
                new_rec = {
                    "recordid": None,
                    "apiprofileid": rec["recordid"],
                    "state": price["state"],
                    "cost": price["cost"],
                    "price": price["price"]
                }
                Database().insert("apipricing",new_rec)
    
    def __fetch_api_price(self,user):        
        api_set,api_cnt = Database().query("SELECT * FROM apiprofiles WHERE apitype=%s AND deleted IS NULL",(self.payload["apitype"]))                
        if api_set:
            pri_rec = get_api_price(self.payload["apitype"])                    
            if self.payload["apitype"] != "MVR":                
                if pri_rec:                        
                    data = {"price":format_currency(pri_rec["price"])}
                    return build_response(status=200,data=data)            
            else:            
                mvrprices = []
                lic_set = Drivers().get_driver_licenses(self.payload["driverid"])
                for lic_rec in lic_set:
                    pri_rec = get_api_price(self.payload["apitype"],lic_rec["state"])
                    if pri_rec: mvrprices.append({"id": lic_rec["recordid"],"cost": pri_rec["price"]})                                         
                return build_response(status=200,data=mvrprices)
        return build_response(status=400,message="Unable To Retrieve API Pricing")
    
    def get(self,user):                
        if request.endpoint=="fetch_price": return self.__fetch_api_price(user)
        sql = f"""SELECT a.* FROM apiprofiles a WHERE 1=1 {self.__set_sql_where()}"""                
        rec_set,rec_count = Database().query(sql,(self.params))        
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
           
    def put(self,user):        
        err_list = self.__validate(user)    
        if err_list != False: return err_list           
        res_rec = get_reseller_from_user(user["recordid"])        
        rec = copy.deepcopy(self.payload)              
        rec["password"]  = encrypt_with_salt(rec["password"],res_rec["tokenid"],res_rec["tokenkey"]) if ("password" in self.payload and rec["password"]) else None
        rec["deleted"] = None
        upd_rec = Database().update("apiprofiles",rec)
        if upd_rec: 
            self.__update_pricing(rec)
            return build_response(status=200,message=f"The API Profile Record Was Updated Successfully!")
        return build_response(status=400,message="The API Profile Record Was Not Updated. Contact Support")            