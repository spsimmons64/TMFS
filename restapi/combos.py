import os,base64
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Combos(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()                
        self.params = []

    def __feetypes(self):
        data = []
        rec_set,rec_count = Database().query("SELECT * FROM feetypes WHERE deleted IS NULL ORDER BY feetype ASC")
        for rec in rec_set:data.append({"value":rec["recordid"],"text":rec["feetype"],"default":rec["isdefault"]})
        return build_response(status=200,data=data)
    
    def __resellers(self):
        data = []
        rec_set,rec_count = Database().query("SELECT * FROM resellers WHERE deleted IS NULL ORDER BY companyname ASC")
        for rec in rec_set:data.append({"value":rec["recordid"],"text":rec["companyname"]})
        return build_response(status=200,data=data)
    
    def __accounts(self):
        data = []
        rec_set,rec_count = Database().query("SELECT * FROM accounts WHERE deleted IS NULL ORDER BY companyname ASC")
        for rec in rec_set:data.append({"value":rec["recordid"],"text":rec["companyname"]})
        return build_response(status=200,data=data)

    def __consultants(self):
        data = []
        rec_set,rec_count = Database().query("SELECT * FROM consultants WHERE deleted IS NULL ORDER BY companyname ASC")
        for rec in rec_set:data.append({"value":rec["recordid"],"text":rec["companyname"]})
        return build_response(status=200,data=data)
    
    def __smtpprofiles(self):
        data = []
        rec_set,rec_count = Database().query("SELECT * FROM smtpprofiles WHERE deleted IS NULL ORDER BY domainname ASC")
        for rec in rec_set:data.append({"value":rec["recordid"],"text":rec["domainname"],"default":rec["isdefault"]})
        return build_response(status=200,data=data)
    
    def __pricing(self,user):            
        sql = """SELECT * FROM pricing WHERE 1=1"""            
        if "packagetype" in self.payload:
            sql=f"{sql} AND packagetype=%s"
            self.params.append(self.payload["packagetype"])
        if "frequency" in self.payload:
            sql=f"{sql} AND frequency=%s"
            self.params.append(self.payload["frequency"])
        if "priceby" in self.payload:
            sql=f"{sql} AND priceby=%s"
            self.params.append(self.payload["priceby"])
        sql = f"{sql} AND deleted IS NULL ORDER BY packagename ASC"        
        data = []                
        rec_set,rec_count = Database().query(sql,tuple(self.params))               
        for rec in rec_set:
            fee_set,fee_cnt = Database().query("SELECT price FROM pricingfees WHERE pricingid=%s and deleted is NULL",(rec["recordid"]))
            new_rec = {
                "value":rec["recordid"],
                "text":rec["packagename"],
                "price": format_currency(fee_set[0]["price"]) if fee_cnt > 0 else 0,
                "default": rec["isdefault"]
            }
            data.append(new_rec)
        return build_response(status=200,data=data)
    
    def get(self,user):
        if request.endpoint=="combo-feetypes": return self.__feetypes()
        if request.endpoint=="combo-resellers": return self.__resellers()
        if request.endpoint=="combo-accounts": return self.__accounts()
        if request.endpoint=="combo-consultants": return self.__consultants()
        if request.endpoint=="combo-smtpprofiles": return self.__smtpprofiles()
        if request.endpoint=="combo-pricing": return self.__pricing(user)
        