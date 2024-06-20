import jwt,copy
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response
from toolbox import check_password,create_password,get_sql_date_time
from queries import *
from validate import validate_login,validate_login_forgot,validate_login_reset

from templates.forgot_password import send_message as forgot_send_message
from templates.reset_password import send_message as reset_send_message

from users import Users


class Login(Resource):        
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()        

    def __reset_check(self):               
        sql = "SELECT * FROM users WHERE passwordreset=%s and deleted IS NULL"""
        usr_set,count = Database().query(sql,(self.payload["token"]))        
        if count: return build_response(status=200)        
        return build_response(status=400)
    
    def get_profile(self,usr_rec={}):        
        data = {}
        tallies = {}        
        if not usr_rec: usr_rec = Database().fetch("users",self.payload["userid"])        
        sig_rec = Users().get_user_esignature(usr_rec["recordid"]) 
        usr_rec["esignature"] =  sig_rec if sig_rec else {}        
        ent_rec = Database().fetch(self.payload["entity"],self.payload["entityid"])                    
        if ent_rec and usr_rec:            
            acc_rec = {}
            con_rec = {}
            res_rec = {}
            mas_rec = get_master_reseller()
            if mas_rec:                        
                mas_rec["logo"] = get_entity_logo(mas_rec["recordid"],590,410,True,True)            
                mas_rec["logomini"] = get_entity_logo(mas_rec["recordid"],220,None,True,True)                
                mas_rec.pop("tokenid")
                mas_rec.pop("tokenkey")    
            if self.payload["entity"] == "resellers":
                res_rec = copy.deepcopy(ent_rec)
                res_rec["logo"] = get_entity_logo(res_rec["recordid"],590,410,True,True)            
                res_rec["logomini"] = get_entity_logo(res_rec["recordid"],220,None,True,True)            
                res_rec["emails"] = get_entity_emails(res_rec["recordid"])
                #get_tallies
                res_rec.pop("tokenid")
                res_rec.pop("tokenkey")              
            if self.payload["entity"] == "accounts":
                acc_rec = copy.deepcopy(ent_rec)
                acc_rec["logo"] = get_entity_logo(acc_rec["recordid"],590,410,True,True)            
                acc_rec["logomini"] = get_entity_logo(acc_rec["recordid"],220,None,True,True)            
                res_rec = get_reseller_from_account(acc_rec["recordid"])
                res_rec["emails"] = get_entity_emails(res_rec["recordid"])
                tal_set,tal_cnt = Database().query("SELECT * FROM accounttallies WHERE accountid=%s AND deleted IS NULL",(acc_rec["recordid"]))
                if tal_cnt: tallies = tal_set[0] 
                res_rec.pop("tokenid")
                res_rec.pop("tokenkey")    
            if self.payload["entity"] == "consultants":
                con_rec = copy.deepcopy(ent_rec)
                res_rec = get_reseller_from_consultant(con_rec["recordid"])
                con_rec["telephone"] = format_telephone(con_rec["telephone"])
                res_rec = Database().fetch("resellers", con_rec["resellerid"])                
                res_rec["emails"] = get_entity_emails(res_rec["recordid"])
                res_rec.pop("tokenid")
                res_rec.pop("tokenkey")            
                res_rec["logo"] = get_entity_logo(res_rec["recordid"],590,410,True,True)     
            data = {
                "user": usr_rec,
                "master": mas_rec,
                "reseller": res_rec,
                "account": acc_rec,
                "consultant": con_rec,
                "tallies": tallies
            }   
            return build_response(status=200,data=data)
        return build_response(status=400,message ="Unable To Retrieve Your Profile.  Contact Support!")
        
    def __login(self):        
        errors = validate_login(self.payload)
        if errors: return build_response(status=400,errors=errors)
        usr_set,usr_count = Database().query("SELECT * FROM users WHERE resourceid=%s AND emailaddress=%s AND deleted IS NULL",(self.payload["entityid"],self.payload["emailaddress"]))
        if usr_count:                       
            usr_rec = usr_set[0]
            sql = "SELECT * FROM passwords WHERE userid=%s and deleted IS NULL"
            pwd_set,pwd_cnt = Database().query(sql,(usr_rec["recordid"]))
            if pwd_cnt and check_password(pwd_set[0]["password"],self.payload["password"]):                
                usr_rec["lastlogin"] = get_sql_date_time()                
                if Database().update("users",usr_rec):         
                    ent_rec = Database().fetch(self.payload["entity"],self.payload["entityid"])                      
                    token = jwt.encode({"recordid": usr_rec["recordid"]}, app.config["SECRET_KEY"], algorithm="HS256")                                                                
                    site_route = ent_rec["siteroute"] if "siteroute" in ent_rec else ""
                    resp = make_response({"status":200,"data":{"userid":usr_rec["recordid"],"siteroute":site_route}})
                    resp.set_cookie(key="TMFSCorpToken",value=token,secure=True,httponly=True)                                        
                    return(resp)
        return build_response(status=400,message="Invalid User ID or Password")            

    def __forgot(self):
        sql = "SELECT * FROM users WHERE resourceid=%s AND emailaddress=%s AND deleted IS NULL"
        usr_set,usr_cnt = Database().query(sql,(self.payload["entityid"],self.payload["emailaddress"]))
        if usr_cnt:        
            upd_rec = usr_set[0]            
            upd_rec["passwordreset"] = str(uuid4())                
            new_rec = Database().update("users",upd_rec)
            if new_rec: forgot_send_message(new_rec["recordid"])
        return build_response(status=200,message="The Request Has Been Submitted.  Check Your Email.")
            
    def __reset(self):        
        sql = f"""SELECT * FROM users WHERE passwordreset=%s and deleted IS NULL"""
        usr_set,usr_cnt = Database().query(sql,(self.payload["token"]))        
        if usr_cnt:     
            usr_rec = usr_set[0]       
            Database().query(f"""UPDATE passwords SET deleted=%s WHERE userid=%s""",(get_sql_date_time(),usr_rec["recordid"]))            
            pwd_rec = Database().prime("passwords")            
            pwd_rec["userid"] = usr_rec["recordid"]
            pwd_rec["password"] = create_password(self.payload["npassword"])            
            pwd_rec["added"]  = get_sql_date_time()
            pwd_rec["updated"] = get_sql_date_time()
            pwd_rec["token"] = "TEST"
            if Database().insert("passwords",pwd_rec):                
                usr_rec["passwordreset"] = ""
                new_rec = Database().update("users",usr_rec)
                if new_rec: 
                    reset_send_message(new_rec["recordid"])
                    return build_response(status=200,message="Your Password Has Been Reset.")
        return build_response(status=400,message="Unable To Reset Your Password.  Contact Support.")
    
    def get(self):        
        if request.endpoint=="check": return self.__reset_check()        
        if request.endpoint=="profile": return self.get_profile()        

    def post(self):
        if request.endpoint=="login": return self.__login()        
        if request.endpoint=="forgot": return self.__forgot()        
        if request.endpoint=="reset": return self.__reset()