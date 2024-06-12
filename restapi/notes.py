import pprint,base64,json,copy
from io import BytesIO
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Notes(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND a.note LIKE %s"""            
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "note": sort =f"""a.note {order}"""                
                case __: sort= f"a.added {order}"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])        
        usr_rec = Database().fetch("users",record["userid"])        
        typ_rec = Database().fetch(record["notetype"],record["notetypeid"])        
        new_rec = Database().assign("notes",record)                
        new_rec["username"] = f'{usr_rec["lastname"]}, {usr_rec["firstname"]}'        
        new_rec["companyname"] = typ_rec["companyname"]
        new_rec["emailgeneral"] = typ_rec["emailgeneral"]
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date_time")            
        new_rec["updated"] = format_date_time(local_date_time(record["updated"],res_rec["timezone"]),"human_date_time")                                            
        new_rec["note"] = new_rec["note"].decode('utf-8')        
        return new_rec
    

    def __reseller_notes(self,user):
        self.params = [self.payload["parentid"]]
        sql = "SELECT * FROM notes WHERE notetype='resellers' AND notetypeid=%s ORDER BY added DESC"
        res_set,res_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in res_set]        
        return build_response(status=200,data=data,count=res_count)
    
    def __consultants_notes(self,user):
        self.params = [self.payload["parentid"]]
        sql = "SELECT * FROM notes WHERE notetype='consultants' AND notetypeid=%s ORDER BY added DESC"
        res_set,res_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in res_set]        
        return build_response(status=200,data=data,count=res_count)

    def __accounts_notes(self,user):
        self.params = [self.payload["parentid"]]
        sql = "SELECT * FROM notes WHERE notetype='accounts' AND notetypeid=%s ORDER BY added DESC"
        res_set,res_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in res_set]        
        return build_response(status=200,data=data,count=res_count)

    def get(self,user):
        if request.endpoint=="resellers-notes": return self.__reseller_notes(user)
        if request.endpoint=="consultants-notes": return self.__consultants_notes(user)
        if request.endpoint=="accounts-notes": return self.__accounts_notes(user)
        sql = f"SELECT * FROM notes a WHERE 1=1 {self.__set_sql_where()}"
        res_set,res_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in res_set]        
        return build_response(status=200,data=data,count=res_count)
    
    def post(self,user):               
        rec = copy.deepcopy(self.payload)
        rec["userid"] = user["recordid"]            
        new_rec = Database().insert("notes",rec)                               
        if new_rec:                
            typ_rec = Database().fetch(self.payload["notetype"],self.payload["notetypeid"])            
            return build_response(status=200,message=f"The Note Was Added Successfully.")
        return build_response(status=400,message="The Note Was Not Added. Contact Support")            
        
    def put(self,user):
        rec = copy.deepcopy(self.payload)        
        rec["deleted"] = None        
        usr_rec = Database().update("notes",rec)
        if usr_rec:                       
            typ_rec = Database().fetch(self.payload["notetype"],self.payload["notetypeid"])                            
            return build_response(status=200,message=f"The Note Was Updated Successfully.")
        return build_response(status=400,message="The Note Was Not Updated. Contact Support")            

    def delete(self,user):
        if Database().delete("notes",self.payload["recordid"]):
            return build_response(status=200,message="The Note Was Deactivated Successfully!")
        return build_response(status=400,message="The Note Was Not Deactivated. Contact Support")            