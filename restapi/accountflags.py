import copy
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class AccountFlags(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = convert_incoming_payload(request.args.to_dict() if request.method == "GET" else request.form.to_dict())
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"flagreason","text":"The Flag Reason Is Required"}            
        ]
        dup_list = []
        errors = check_for_errors(user,"accountflags",self.payload,req_list,dup_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND a.search_text like %s"""            
            self.params.append(f"""%{self.payload["search"]}%""")            
        sql=f"""{sql} ORDER BY position ASC"""            
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):        
        new_rec = Database().assign("accountflags",record)                             
        return convert_outgoing_payload("accountflags",new_rec)
       

    def get(self,user):                
        self.params = [self.payload["parentid"]]
        sql = f"""SELECT a.* FROM accountflags a WHERE accountid=%s {self.__set_sql_where()}"""        
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):             
        errors = self.__validate(user)          
        if errors: return errors
        rec = copy.deepcopy(self.payload)               
        print(rec) 
        new_rec = Database().insert("accountflags",rec)                   
        if new_rec:                     
            return build_response(status=200,message=f"The Account Flag  Was Added Successfully.")
        return build_response(status=400,message="The Account Flag Was Not Added. Contact Support!")            
        
    def put(self,user):
        errors = self.__validate(user)          
        if errors: return errors
        rec = copy.deepcopy(self.payload)                
        rec["deleted"] = None
        upd_rec = Database().update("accountflags",rec)
        if upd_rec:            
            return build_response(status=200,message=f"The Account Flag Was Updated Successfully.")
        return build_response(status=400,message="The Account Flag Was Not Updated. Contact Support!")            