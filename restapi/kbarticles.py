import copy,base64
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class KBArticles(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __validate(self,user):
        req_list = [
            {"id":"title","text":"Article Title Is Required"},
            {"id":"articletype","text":"Article Type Is Required"},
            {"id":"articletext","text":"Article Text Is Required"},
        ]
        dup_list = [
            {"id":"title","text":"This KB Article Title Already Exists!"},                        
        ]
        errors = check_missing(self.payload,req_list)
        if errors: return build_response(status=400,errors=errors,message="Please Address The Field Errors On Your Submission")     
        return False

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(title,articletext,articletype) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        sql=f"""{sql} ORDER BY position ASC"""            
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""        
        return sql

    def __serialize(self,record,user):        
        new_rec = Database().assign("kbarticles",record)             
        new_text= new_rec["articletext"].decode("utf-8")        
        new_rec["articletext"] = new_text
        return new_rec
       
    def __reset_order(self,user):        
        sql = "SELECT * FROM kbarticles WHERE deleted IS NULL ORDER BY position ASC"
        counter = 0
        res_set,count = Database().query(sql,())
        for res_rec in res_set:
            counter +=1
            res_rec["position"] = counter
            Database().update("kbarticles",res_rec)
   
    def __move_record(self, user):        
        kb_rec = Database().fetch("kbarticles",self.payload["recordid"])                                
        sql = ""
        if self.payload["direction"]=="up":
            sql = "SELECT * FROM kbarticles WHERE position < %s AND deleted IS NULL ORDER BY position DESC LIMIT 1"            
        if self.payload["direction"]=="down":
            sql = "SELECT * FROM kbarticles WHERE position > %s and deleted IS NULL ORDER BY position ASC LIMIT 1"            
        rec_set,rec_count = Database().query(sql,(kb_rec["position"]))        
        if rec_count:
            new_pos = rec_set[0]["position"]
            old_pos = kb_rec["position"]
            kb_rec["position"] = new_pos
            if Database().update("kbarticles",kb_rec):
                rec_set[0]["position"] = old_pos
                if Database().update("kbarticles",rec_set[0]):
                    self.__reset_order(user)
                    return build_response(status=200)
        return build_response(status=400,message="Unable To Move The Article.  Contact Support!")
    
    def __fetch_by_key(self):
        print(self.payload)
        kba_set,kba_cnt = Database().query("SELECT * FROM kbarticles WHERE kbkey=%s AND deleted IS NULL",(self.payload["key"]))
        if kba_cnt: 
            kba_set[0]["articletext"] = kba_set[0]["articletext"].decode("utf-8")
            return build_response(status=200,data=kba_set[0])
        return build_response(status=400,message="Unable To Locate The Selected Resource! Contact Support")

    def get(self,user):        
        if self.payload["action"] == "fetchbykey": return self.__fetch_by_key()
        if self.payload["action"] == "grid": 
            sql = f"""SELECT a.* FROM kbarticles a WHERE 1=1 {self.__set_sql_where()}"""             
            rec_set,rec_count = Database().query(sql,tuple(self.params))
            data = [ self.__serialize(r,user) for r in rec_set]        
            return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):     
        if request.endpoint=="kb-move": return self.__move_record(user)         
        errors = self.__validate(user)          
        if errors: return errors
        rec = copy.deepcopy(self.payload)                
        rec["position"] = 999999
        new_rec = Database().insert("kbarticles",rec)                   
        if new_rec:         
            self.__reset_order(user)                   
            return build_response(status=200,message=f"The KB Article  Was Added Successfully.")
        return build_response(status=400,message="The KB Article Was Not Added. Contact Support!")            
        
    def put(self,user):
        errors = self.__validate(user)          
        if errors: return errors
        rec = copy.deepcopy(self.payload)                        
        rec["deleted"] = None
        upd_rec = Database().update("kbarticles",rec)
        if upd_rec:
            self.__reset_order(user)            
            return build_response(status=200,message=f"The KB Article Was Updated Successfully.")
        return build_response(status=400,message="The KB Article Was Not Updated. Contact Support!")            

    def delete(self,user):
        upd_rec = Database().fetch("kbarticles",self.payload["recordid"])
        if upd_rec:                                    
            upd_rec["deleted"] = get_sql_date_time()
            upd_rec["position"] = 0
            new_rec = Database().update("kbarticles",upd_rec)
            if new_rec: 
                self.__reset_order(user)            
                return build_response(status=200,message="The KB Article Was Deactivated Successfully.")
        return build_response(status=400,message="The KB Article Was Not Deactivated. Contact Support!")