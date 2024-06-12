import copy
from uuid import uuid4
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

from templates import new_consultant

class Consultants(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"lookupcode","text":"Lookup Code Name Is Required!"},            
            {"id":"companyname","text":"Company Name Is Required!"},            
            {"id":"contactfirstname","text":"Contact First Name Is Required!"},            
            {"id":"contactlastname","text":"Contact Last Name Is Required!"},            
            {"id":"emailgeneral","text":"Email Address Is Required!"},            
            {"id":"address","text":"Address Is Required!"},            
            {"id":"telephone","text":"Telephone Is Required!"},            
            {"id":"ein","text":"EIN/Tax ID Is Required!"},            
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        # if "recordid" in self.payload and "resellerid" in self.payload:
        #     sql = """SELECT * FROM consultants WHERE resellerid=%s AND recordid <> %s AND deleted IS NULL"""
        #     rec_set,count = Database().query(sql,(self.payload["usertype"],self.payload["usertypeid"],self.payload["recordid"]))
        #     for rec in rec_set:
        #         # Check For Duplicate Email Address
        #         odata = rec["emailgeneral"].upper()
        #         ndata = self.payload["emailgeneral"].upper()
        #         if odata == ndata: errors.append({"id":"consultants_emailgeneral","text":"Email Address Already In Use By Another Consultant."})
        #         # Check For Duplicate Lookip Code
        #         odata = rec["lookupcode"].upper()
        #         ndata = self.payload["lookupcode"].upper()
        #         if odata == ndata: errors.append({"id":"consultants_lookupcode","text":"Lookup Code Alreade Used."})
        #     if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
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
                case "companyname": sort =f"""a.companyname {order}"""
                case "contactname": sort = f"""a.contactlastname {order}, a.contactfirstname {order}"""
                case "emailaddress": sort = f"""a.emailaddress {order}"""
                case "telephone": sort = f"""a.telephone {order}"""
                case "accounts": sort = f"""count {order}"""
                case "added": sort = f"""a.added {order}"""                                
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])        
        new_rec = Database().assign("consultants",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")  
        new_rec["telephone"] = format_telephone(record["telephone"])
        new_rec["accounts"] = record["count"]        
        return new_rec
                                        
    def get(self,user):
        sql = f"""SELECT a.*,
                  (SELECT count(*) FROM accounts c WHERE c.consultantid=a.recordid AND c.deleted IS NULL) as count
                  FROM consultants a WHERE 1=1 {self.__set_sql_where()}"""            
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):               
        errors  = self.__validate(user)    
        if errors: return errors
        rec = copy.deepcopy(self.payload)
        res_rec = get_reseller_from_user(user["recordid"])
        rec["resellerid"] = res_rec["recordid"]
        new_rec = Database().insert("consultants",rec)                                       
        if new_rec: 
            usr_rec = {}
            usr_rec["usertype"] = "consultants"
            usr_rec["usertypeid"] = new_rec["recordid"]
            usr_rec["lastname"] = new_rec["contactlastname"]
            usr_rec["firstname"] = new_rec["contactfirstname"]
            usr_rec["emailaddress"] = new_rec["emailgeneral"]
            usr_rec["securitylevel"] = "admin"
            usr_rec["ismaster"] = 1
            usr_rec["language"] = "English"
            usr_rec["telephone"] = new_rec["telephone"]
            usr_rec["position"] = ""
            usr_rec["passwordreset"] = str(uuid4())
            new_usr = Database().insert("users",usr_rec)
            if new_usr: 
                #new_consultant.send_message(new_usr)
                return build_response(status=200,message=f"The Consultant Was Added Successfully.")
        return build_response(status=400,message="The Consultant Was Not Added. Contact Support")            
        
    def put(self,user):
        errors  = self.__validate(user)    
        if errors: return errors        
        rec = copy.deepcopy(self.payload)                            
        rec["deleted"] = None   
        upd_rec = Database().update("consultants",rec)         
        if upd_rec: return build_response(status=200,message=f"The Consultant Was Updated Successfully.")
        return build_response(status=400,message="The Consultant Was Not Updated. Contact Support")            

    def delete(self,user):
        if Database().delete("consultants",self.payload["recordid"]):            
            return build_response(status=200,message="The Consultant Was Deactivated Successfully!")
        return build_response(status=400,message="The Consultant Was Not Deactivated. Contact Support")            