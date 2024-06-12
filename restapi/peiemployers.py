import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class PEIEmployers(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"employername","text":"Employer Name Is Required"},
            {"id":"notes","text":"Information Is Required"},
        ]
        dup_list = [
            {"id":"employername","text":"This Employer Already Exists!"},            
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(employername,contactlastname,contactfirstname,emailaddress,notes,updatedby) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "employername": sort =f"""a.employername {order}"""
                case "contactname": sort = f"""a.contactlastname {order}, a.contactfirstname {order}"""
                case "emailaddress": sort = f"""a.emailaddress {order}"""
                case "updatedby": sort = f"""a.updatedby {order}"""
                case "added": sort = f"""a.added {order}"""
                case "updated": sort = f"""a.updated {order}"""
                case __: sort= "a.employername"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("peiemployers",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")            
        new_rec["updated"] = format_date_time(local_date_time(record["updated"],res_rec["timezone"]),"human_date")            
        return new_rec
                          
    def get(self,user):
        sql = f"""SELECT a.*FROM peiemployers a WHERE 1=1 {self.__set_sql_where()}"""        
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):               
        err_list = self.__validate(user)    
        if err_list != False: return err_list           
        rec = copy.deepcopy(self.payload)        
        rec["updatedby"] = f'{user["firstname"]} {user["lastname"]}'
        new_rec = Database().insert("peiemployers",rec)                               
        if new_rec: return build_response(status=200,message=f"The PEI Employer Was Added Successfully.")
        return build_response(status=400,message="The PEI Employer Was Not Added. Contact Support")            
        
    def put(self,user):
        err_list = self.__validate(user)    
        if err_list != False: return err_list                   
        rec = copy.deepcopy(self.payload)
        rec["updatedby"] = f'{user["firstname"]} {user["lastname"]}'
        rec["deleted"] = None                
        upd_rec = Database().update("peiemployers",rec)
        if upd_rec: return build_response(status=200,message=f"The PEI Employer Was Updated Successfully.")
        return build_response(status=400,message="The PEI Employer Was Not Updated. Contact Support")            

    def delete(self,user):
        if Database().delete("peiemployers",self.payload["recordid"]):
            return build_response(status=200,message="The PEI Employer Was Deactivated Successfully!")
        return build_response(status=400,message="The PEI Employer Was Not Deactivated. Contact Support")            