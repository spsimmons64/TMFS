import pprint,base64,json,copy
from io import BytesIO
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *
from drivers import Drivers
from citadel import Citadel

class ESignatures(Resource): 
    
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.tokenid = app.config["GLOBAL_TOKEN_ID"]
        self.tokenkey = bytes.fromhex(app.config["GLOBAL_TOKEN_KEY"])
        self.params = []


    def __lookup_signature(self):        
        sql = "SELECT * FROM esignatures WHERE birthdate=%s AND deleted IS NULL"
        sig_set,sig_cnt = Database().query(sql,(self.payload["birthdate"]))
        for sig_rec in sig_set:            
            if self.payload["socialsecurity"]==Citadel().decrypt(sig_rec["socialsecurity"]):
                sig_rec["esignature"] = base64.b64encode(sig_rec["esignature"]).decode("utf-8")
                return build_response(status=200,data=sig_set[0])
        return build_response(status=400)

    def post(self):                              
        if self.payload["action"] == "lookup": return self.__lookup_signature()
        esig_rec = Database().prime("esignatures")                        
        esig_rec["socialsecurity"] = Citadel().encrypt_store(self.payload["socialsecurity"],"esignature_ssn")
        esig_rec["birthdate"] = self.payload["birthdate"]
        esig_rec["ipaddress"] = request.remote_addr            
        esig_rec["resourceid"] = self.payload["resourceid"]        
        esig_rec["signaturename"] = self.payload["entityname"]
        esig_new = Database().insert("esignatures",esig_rec)            
        if esig_new:            
            new_date = esig_new["added"].strftime("%m/%d/%Y %-I:%M %p UTC")
            esig_new["esignature"] = generate_signature(self.payload["entityname"],esig_new["recordid"],new_date,request.remote_addr)                                
            esig_rec = Database().update("esignatures",esig_new)                                    
            if esig_new:                       
                esig_rec.pop("socialsecurity")
                esig_rec["signaturedate"] = format_date_time(esig_rec["added"],"sql_date")
                esig_rec["esignature"] = base64.b64encode(esig_rec["esignature"]).decode("utf-8")                        
                return build_response(status=200,data=esig_rec)
        return build_response(status=400,message="Unable To Create Your E-Signature. Contact Support")