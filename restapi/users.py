import os,base64,copy
from pprint import pprint
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *
from templates import new_consultant

class Users(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()            
        
    def get_user_esignature(self,userid):
        sig_set,sig_cnt = Database().query("SELECT * FROM esignatures WHERE resourceid=%s AND deleted IS NULL",(userid))    
        sig_rec = sig_set[0] if sig_cnt else False                        
        if sig_rec:
            sig_rec["esignature"] = base64.b64encode(sig_set[0]["esignature"]).decode("utf-8")
            sig_rec["signaturedate"] = format_date_time(sig_rec["added"],"sql_date")
        return sig_rec   

    def __validate(self,user):                   
        req_list = [
            {"id":"position","text":"Company Position/Title  Is Required"},
            {"id":"telephone","text":"Telephone Number Is Required"},
            {"id":"lastname","text":"User Last Name Is Required"},            
            {"id":"firstname","text":"User First Name Is Required"},            
            {"id":"emailaddress","text":"User Email Address Is Required"},            
        ]    
        errors = check_missing(self.payload,req_list)                 
        if len(errors): return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")                        
        if "usertype" in self.payload and "usertypeid" in self.payload and "recordid" in self.payload:
            sql = """SELECT * FROM users WHERE usertype=%s AND usertypeid=%s AND recordid <> %s AND deleted is NULL"""                    
            rec_set,count = Database().query(sql,(self.payload["usertype"],self.payload["usertypeid"],self.payload["recordid"]))
            for rec in rec_set:
                # Check For Duplicate Email Address
                oemail = rec["emailaddress"].upper()
                nemail = self.payload["emailaddress"].upper()
                if oemail == nemail: errors.append({"id":"emailaddress","text":"Email Address Already In Use."})
            if len(errors): return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")
        return False                
        
       
    def __set_sql_where(self):
        sql=""        
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""      
        if "search" in self.payload and self.payload["search"] != "":                                    
            sql = f"""{sql} AND CONCAT(lastname,firstname,emailaddress,telephone,position) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":                        
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "username": sort =f"""username {order}"""
                case "emailaddress": sort = f"""a.emailaddress {order}"""
                case "lastlogin": sort = f"""a.lastlogin {order}"""
                case "securitylevel": sort = f"""a.securitylevel {order}"""
                case "telephone": sort = f"""a.telephone {order}"""                
                case "added": sort = f"""a.added {order}"""                
                case "lastlogin": sort = f"""a.lastlogin {order}"""                
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("users",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")  
        new_rec["lastlogin"] = format_date_time(local_date_time(record["lastlogin"],res_rec["timezone"]),"human_date_time") if new_rec["lastlogin"] else "Never Logged In"
        new_rec["username"] = f'{record["lastname"]}, {record["firstname"]}'
        new_rec["telephone"] = format_telephone(new_rec["telephone"])                
        return new_rec
   
    def __logout(self,user):        
        resp = make_response({"status":200})
        resp.set_cookie(key="TMFSCorpToken",value="",secure=True,httponly=True)                                        
        return(resp)
    
    def get(self,user):        
        self.params = [self.payload["parent"],self.payload["parentid"]]
        sql = f"""SELECT a.*,CONCAT(lastname,", ",firstname) as username FROM users a WHERE usertype=%s and usertypeid=%s {self.__set_sql_where()}"""                    
        rec_set,rec_count = Database().query(sql,tuple(self.params))        
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):                      
        if request.endpoint=="logout": return self.__logout(user)         
        errors = self.__validate(user)    
        if errors != False: return errors     
        rec = copy.deepcopy(self.payload)                   
        new_rec = Database().insert("users",rec)                              
        if new_rec:
            if new_rec["usertype"] == "consultants":new_consultant.send_message(new_rec)
            return build_response(status=200,message=f"The User Was Added Successfully.")
        return build_response(status=400,message="The User Was Not Added. Contact Support")            
        
    def put(self,user):
        errors = self.__validate(user)    
        if errors != False: return errors           
        rec = copy.deepcopy(self.payload)
        rec["deleted"] = None                 
        upd_rec = Database().update("users",rec)
        if upd_rec: return build_response(status=200,message=f"The User Was Updated Successfully.")
        return build_response(status=400,message="The User Was Not Updated. Contact Support")            

    def delete(self,user):        
        if Database().delete("users",self.payload["recordid"]):            
            return build_response(status=200,message="The User Was Deactivated Successfully!")
        return build_response(status=400,message="The User Was Not Deactivated. Contact Support")            
