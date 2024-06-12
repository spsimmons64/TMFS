import os,base64,json,copy
from pprint import pprint
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class SMTPProfiles(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"domainname","text":"This Domain Name Is Required!"},            
            {"id":"endpoint","text":"This Domain End-Point Is Required!"},            
            {"id":"sslport","text":"This Port Is Required!"},            
        ]
        dup_list = [            
            {"id":"domainname","text":"This Domain Name Already Exists!"},            
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(domainname,endpoint,apikey,username) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "domainname": sort =f"""a.domainname {order}"""
                case "endpoint": sort = f"""a.endpoint {order}"""                                
                case "usessl": sort = f"""a.usessl {order}"""
                case "sslport": sort=f"""a.sslport {order}"""
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):        
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("smtpprofiles",record)    
        new_rec["isdefault"] = True if new_rec["isdefault"] else False
        new_rec["usessl"] = True if new_rec["usessl"] else False
        new_rec["password"] = decrypt_with_salt(new_rec["password"],res_rec["tokenid"],res_rec["tokenkey"]) if new_rec["password"] else ""
        return new_rec
                      
    def get(self,user):        
        sql = f"""SELECT a.* FROM smtpprofiles a WHERE 1=1 {self.__set_sql_where()}"""                
        rec_set,rec_count = Database().query(sql,tuple(self.params))        
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):        
        errors = self.__validate(user)
        if errors: return errors
        res_rec = get_reseller_from_user(user["recordid"])        
        rec = copy.deepcopy(self.payload)              
        rec["password"]  = encrypt_with_salt(rec["password"],res_rec["tokenid"],res_rec["tokenkey"]) if rec["password"] else None
        rec["isdefault"] = update_default_field("smtpprofiles",rec,[])                    
        new_rec = Database().insert("smtpprofiles",rec)                   
        if new_rec: return build_response(status=200,message=f"The SMTP Profile Record Was Added Successfully!")
        return build_response(status=400,message="The SMTP Profile Record Was Not Added. Contact Support")            
        
    def put(self,user):        
        errors = self.__validate(user)
        if errors: return errors
        res_rec = get_reseller_from_user(user["recordid"])        
        rec = copy.deepcopy(self.payload)
        rec["password"]  = encrypt_with_salt(rec["password"],res_rec["tokenid"],res_rec["tokenkey"]) if rec["password"] else None
        rec["isdefault"] = update_default_field("smtpprofiles",rec,[])                    
        rec["deleted"] = None
        usr_rec = Database().update("smtpprofiles",rec)
        if usr_rec: return build_response(status=200,message=f"The SMTP Profile Record Was Updated Successfully!")
        return build_response(status=400,message="The SMTP Profile Record Was Not Updated. Contact Support")            

    def delete(self,user):
        if Database().delete("smtpprofiles",self.payload["recordid"]):            
            return build_response(status=200,message="The SMTP Profile Record Was Deactivated Successfully!")
        return build_response(status=400,message="The SMTP Profile Record Was Not Deactivated. Contact Support")            