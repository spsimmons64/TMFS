import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class ThirdPartyAds(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""      
        if "search" in self.payload and self.payload["search"] != "":  
            sql = f"""{sql} AND CONCAT(thirdpartads,lookupcode,emailaddress,telephone,notes) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "title": sort =f"""title {order}"""
                case "link": sort =f"""link {order}"""                
                case "added": sort = f"""a.added {order}"""
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("thirdpartyads",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")                          
        new_rec["logo"] = get_ad_logo(new_rec["recordid"],460,120,True)                        
        return new_rec
                          
    def get(self,user):        
        res_rec = get_reseller_from_user(user["recordid"])        
        self.params = [res_rec["recordid"]]        
        sql = f"""SELECT * FROM thirdpartyads WHERE resellerid=%s {self.__set_sql_where()}"""                        
        rec_set,rec_count = Database().query(sql,tuple(self.params))        
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):               
        pass
        
    def put(self,user):
        pass

    def delete(self,user):
        if Database().delete("thirdpartyads",self.payload["recordid"]):
            return build_response(status=200,message="The Ad Was Deactivated Successfully!")
        return build_response(status=400,message="The Ad Was Not Deactivated. Contact Support")            