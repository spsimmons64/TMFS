import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Affiliates(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"lookupcode","text":"Affiliate Code Is Required"},
            {"id":"affiliatename","text":"Affiliate Name Is Required"},
            {"id":"emailaddress","text":" Email Address Is Required"},
            {"id":"telephone","text":"Telephone Is Required"},
            {"id":"ein","text":"The EIN/Tax ID Is Required"},
            {"id":"notes","text":"The Employer Name Is Required"},
        ]
        dup_list = [
            {"id":"lookupcode","text":"This Code Already Exists!"},
            {"id":"affiliatename","text":"The Affiliate Already Exists!"}
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False


    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""      
        if "search" in self.payload and self.payload["search"] != "":  
            sql = f"""{sql} AND CONCAT(affiliatename,lookupcode,emailaddress,telephone,notes) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "affiliatename": sort =f"""a.affiliatename {order}"""
                case "lookupcode": sort =f"""a.lookupcode {order}"""                
                case "referrals": sort =f"""referrals {order}"""                
                case "added": sort = f"""a.added {order}"""
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])        
        new_rec = Database().assign("affiliates",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")  
        new_rec["telephone"] = format_telephone(new_rec["telephone"])
        new_rec["referrals"] = record["referrals"]
        new_rec["notes"] = new_rec["notes"].decode('utf-8')    
        new_rec["ein"] = decrypt_with_salt(new_rec["ein"],res_rec["tokenid"],res_rec["tokenkey"])
        return new_rec
                          
    def get(self,user):        
        sql = f"""SELECT a.*,(SELECT count(*) FROM accounts c WHERE c.affiliateid=a.recordid AND c.deleted IS NULL) as referrals
                  FROM affiliates a WHERE 1=1 {self.__set_sql_where()}"""                        
        rec_set,rec_count = Database().query(sql,tuple(self.params))        
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):               
        err_list = self.__validate(user)    
        if err_list != False: return err_list              
        rec = copy.deepcopy(self.payload)          
        res_rec = get_reseller_from_user(user["recordid"])        
        rec["userid"] = user["recordid"]        
        rec["ein"] = encrypt_with_salt(rec["ein"],res_rec["tokenid"],res_rec["tokenkey"])
        new_rec = Database().insert("affiliates",rec)                              
        if new_rec: return build_response(status=200,message=f"The Affiliate Was Added Successfully.")
        return build_response(status=400,message="The Affiliate Was Not Added. Contact Support")            
        
    def put(self,user):
        err_list = self.__validate(user)    
        if err_list != False: return err_list        
        res_rec = get_reseller_from_user(user["recordid"])        
        rec = copy.deepcopy(self.payload)                                
        rec["ein"] = encrypt_with_salt(rec["ein"],res_rec["tokenid"],res_rec["tokenkey"])
        rec["deleted"] = None                        
        upd_rec = Database().update("affiliates",rec)
        if upd_rec: return build_response(status=200,message=f"The Affiliate Was Updated Successfully.")
        return build_response(status=400,message="The Affiliate Was Not Updated. Contact Support")            

    def delete(self,user):
        if Database().delete("affiliates",self.payload["recordid"]):
            return build_response(status=200,message="The Affiliate Was Deactivated Successfully!")
        return build_response(status=400,message="The Affiliate Was Not Deactivated. Contact Support")            