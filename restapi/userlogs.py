from flask import make_response
from flask_restful import Resource, request, current_app as app
from api_response import build_response,check_token
from database import Database
from queries import *

class UserLogs(Resource):    
    method_decorators = [check_token]   
    def __init__(self):        
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()          

    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND a.action like %s"""            
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "added": sort =f"""a.added {order}"""
                case "ipaddress": sort = f"""a.ipaddress {order}"""
                case "action": sort = f"""a.action {order}"""
                case __: sort= "a.added {order}"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __serialize(self,record,user):
        res_rec = get_reseller_from_user(user["recordid"])        
        new_rec = Database().assign("userlogs",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date_time")          
        return convert_outgoing_payload("userlogs",new_rec)

    def get(self,user):
        self.params = [self.payload["parentid"]]
        sql = f"SELECT * FROM userlogs a WHERE a.userid=%s AND deleted is NULL {self.__set_sql_where()}"
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)

    def post(self,user):        
        if request.headers.getlist("X-Forwarded-For"):
            ip = request.headers.getlist("X-Forwarded-For")[0]
        else:
            ip = request.remote_addr        
        log_rec = self.payload
        log_rec["userid"] = user["recordid"]        
        log_rec["ipaddress"] = ip
        new_rec = Database().insert("userlogs",log_rec)        