import jwt
from uuid import uuid4
from flask import make_response
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response
from toolbox import check_password,create_password,get_sql_date_time
from queries import *
from validate_account import validate_account
from driver_application import driver_application

from templates import forgot_password,reset_password

class FetchNoCors(Resource):    
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()        

    def __fetch_login(self):
        ent_rec = {}               
        res_set,res_count = Database().query("SELECT * FROM resellers WHERE siteroute=%s AND deleted IS NULL",(self.payload["siteroute"]))        
        res_rec  = get_master_reseller() if not res_count else res_set[0] 
        if self.payload["id"]:            
            if self.payload["id"]=="consultants":                            
                ent_rec["entity"] = "consultants"                
                ent_rec["entitytype"] = "Consultant"                
                ent_rec["entityid"] = ""
                ent_rec["logo"]= get_entity_logo(res_rec["recordid"],300,90,True,True)                                          

            elif self.payload["id"]=="law-enforcement":                
                ent_rec["entity"] = "law-enforcement"
                ent_rec["entitytype"] = "Law Enforcement"                
                ent_rec["entityid"] = ""                
                ent_rec["logo"]= get_entity_logo(res_rec["recordid"],300,90,True,True)      

            elif self.payload["id"]=="admin":                
                ent_rec["entity"] = "resellers"
                ent_rec["entityid"] = res_rec["recordid"]                
                ent_rec["entitytype"] = "Administrative" if res_rec["ismaster"] else "Reseller"
                ent_rec["logo"]= get_entity_logo(res_rec["recordid"],400,90,True,True)
            else:                              
                acc_rec,acc_count = Database().query("SELECT * FROM accounts WHERE siteroute=%s AND deleted IS NULL",(self.payload["id"]))                                
                print(acc_rec)
                if not acc_count: return build_response(status=400)
                ent_rec["entity"] = "accounts"
                ent_rec["entityid"] = acc_rec[0]["recordid"]                
                ent_rec["entitytype"] = "Account"                
                ent_rec["logo"]= get_entity_logo(acc_rec[0]["recordid"],400,90,True,True)

        
        eml_set,eml_count = Database().query("SELECT * FROM emails WHERE resourceid=%s and emailtype='support' AND deleted IS NULL",(res_rec["recordid"]))    
        if eml_count: ent_rec["emailaddress"] = eml_set[0]["emailaddress"]        
        ent_rec["company"] = res_rec["companyname"]
        ent_rec["telephone"] = res_rec["telephone"]                
        return build_response(status=200,data=ent_rec)

    def __fetch_reseller(self):        
        res_rec,res_count = Database().query("SELECT * FROM resellers WHERE siteroute=%s AND deleted IS NULL",(self.payload["siteroute"]))
        res_rec  = get_master_reseller() if not res_count else res_rec[0]                
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",(res_rec["recordid"]))
        if eml_cnt:
            email = f"or email us at {eml_set[0]['emailaddress']}"
        else:
            email = ""
        return build_response(status=200,data={
            "id":res_rec["recordid"],
            "ismaster": res_rec["ismaster"],
            "companyname": res_rec["companyname"],
            "logo":get_entity_logo(res_rec["recordid"],300,90,True,True),
            "siteroute": f"https://{res_rec['siteroute']}.{res_rec['sitedomain']}",
            "email": email,
            "telephone":res_rec["telephone"]
        })
    
    def __fetch_account(self):           
        acc_set,acc_count = Database().query("SELECT * FROM accounts WHERE siteroute=%s AND deleted IS NULL",(self.payload["siteroute"]))               
        if acc_count:            
            acc_rec = acc_set[0]            
            res_rec = Database().fetch("resellers",acc_rec["resellerid"])                        
            if res_rec:            
                eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",(acc_rec["recordid"]))
                email = eml_set[0]['emailaddress'] if eml_cnt else ""
                return build_response(status=200,data={
                    "id":acc_rec["recordid"],                    
                    "companyname": acc_rec["companyname"],
                    "logo":get_entity_logo(acc_rec["recordid"],400,100,True,True),                    
                    "email": email,
                    "phone":acc_rec["telephone"],
                    "resellerroute": f"{res_rec['siteroute']}.{res_rec['sitedomain']}",
                    "resellername": res_rec["companyname"]
                })              
        return build_response(status=400)

    def __calc_account(self):
        new_rec = {}        
        prc_set,prc_cnt =Database().query("SELECT * FROM pricing WHERE packagetype='accounts'AND frequency='monthly' AND isdefault=1 AND deleted IS NULL",())
        if prc_cnt:
            fee_set,fee_cnt = Database().query("SELECT * FROM pricingfees where pricingid=%s AND deleted IS NULL",(prc_set[0]["recordid"]))
            for fee in fee_set:
                init_deposit = 0                
                if int(self.payload["set_estimateddrivers"]) in range(fee["driverstart"],fee["driverend"]+1):                    
                    if fee["flatfee"]:
                        init_deposit = fee["price"]
                    else:
                        driver_fees = fee["price"] * int(self.payload["set_estimateddrivers"])                                                                                      
                        init_deposit = 50 if driver_fees < 50 else driver_fees                        
                        init_deposit = float(init_deposit) + (float(driver_fees) * float(.25))
                    new_rec["initialdeposit"] = format_currency(init_deposit)
                    new_rec["autodeposit"] = format_currency(init_deposit)
                    new_rec["reloadlevel"] = format_currency(driver_fees)                    
        return build_response(status=200,data=new_rec)
    
    def __fetch_account_ad_policy(self):                
        return get_entity_policies(self.payload["id"],"d")
    
    def __fetch_account_gw_policy(self):
        return get_entity_policies(self.payload["id"],"w")
        
    def get(self):                
        if request.endpoint=="fetch-reseller": return self.__fetch_reseller()
        if request.endpoint=="fetch-account": return self.__fetch_account()
        if request.endpoint=="fetch-login": return self.__fetch_login()    
        if request.endpoint=="fetch-ad-policy": return self.__fetch_account_ad_policy()
        if request.endpoint=="fetch-gw-policy": return self.__fetch_account_gw_policy()
        


    def post(self):
        if request.endpoint=="calc-account": return self.__calc_account()
        if request.endpoint=="validate-account" : return validate_account(self.payload)
        if request.endpoint=="driver-application" : return driver_application(self.payload)
