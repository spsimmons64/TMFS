from flask_restful import Resource, request
from database import Database
from api_response import build_response, check_token
from toolbox import *
from queries import *


class AppProfile(Resource):
    method_decorators = [check_token]

    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()        
        self.params = []

    def get(self, user):
        usr_rec = user
        acc_rec = {}
        con_rec = {}
        res_rec = {}
        mas_rec = get_master_reseller()
        if mas_rec:                        
            mas_rec["logo"] = get_entity_logo(mas_rec["recordid"],590,410,True)            
            mas_rec["logomini"] = get_entity_logo(mas_rec["recordid"],230,90,True)
            mas_rec.pop("tokenid")
            mas_rec.pop("tokenkey")            
        if "resellers" in self.payload:
            res_rec = Database().fetch("resellers", self.payload["resellers"])
            mas_rec["tokenid"] = ""
            res_rec["tokenkey"] = ""
            res_rec["logo"] = get_entity_logo(res_rec["recordid"],590,410,True)            
            res_rec["logomini"] = get_entity_logo(res_rec["recordid"],230,90,True)            
            res_rec["new_applications"] = 22
            res_rec["expiring_licenses"] = 8
            res_rec["expiring_medical"] = 33
            res_rec["expiring_clearinghouse"] = 0
            res_rec["annual_reviews"] = 7
            
            #get_tallies
        if "account" in self.payload:
            acc_rec = Database().fetch("accounts", self.payload["account"])
            acc_rec["logo"] = get_entity_logo(acc_rec["recordid"],590,410,True)            
            acc_rec["logomini"] = get_entity_logo(acc_rec["recordid"],230,90,True)            
            #get tallies
            res_rec = get_reseller_from_account(acc_rec["recordid"])
            res_rec.pop("tokenid")
            res_rec.pop("tokenkey")    
        if "consultant" in self.payload:
            con_rec = Database().fetch("consultants", self.payload["consultant"])
            con_rec["telephone"] = format_telephone(con_rec["telephone"])
            res_rec = Database().fetch("resellers", con_rec["resellerid"])
            res_rec = get_reseller_from_consultant(con_rec["recordid"])
            res_rec.pop("tokenid")
            res_rec.pop("tokenkey")            
            res_rec["logo"] = get_entity_logo(res_rec["recordid"],590,410,True)            
        return build_response(status=200,data={"user": usr_rec,"master": mas_rec,"reseller": res_rec,"account": acc_rec,"consultant": con_rec,})
