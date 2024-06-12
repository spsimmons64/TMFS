import os, copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response, check_token
from toolbox import *
from queries import *
from validate_reseller import validate_new_reseller,validate_reseller
from templates.new_reseller import send_message 

class Resellers(Resource):
    method_decorators = [check_token]

    def __init__(self):
        self.payload = (request.args.to_dict() if request.method == "GET" else request.form.to_dict())
        self.params = []

    def __update_reseller_tables(self,record,isnew=False):
        put_entity_emails(record["recordid"],self.payload)
        if isnew:             
            put_entity_setup(record["recordid"])
            generate_entity_logo(record)        
            create_entity_user(record,self.payload["eml_emailcontact"],"resellers",True,True)            
        put_entity_billing(record["recordid"],self.payload)
        put_entity_payprofile(record["recordid"],self.payload,record["tokenid"],record["tokenkey"])


    def __send_invitation(self,user):        
        res_rec = get_reseller_from_user(user["recordid"])
        if send_message(self.payload["id"]):
            new_date = get_sql_date_time()
            if Database().query("UPDATE setups SET invitationsent=%s,temppassword='' WHERE resourceid=%s AND deleted IS NULL",(new_date,id)):
                return build_response(status=200,data={"invitationsent":format_date_time(local_date_time(new_date, res_rec["timezone"]), "human_date_time")},message="The User Invitation Has Been Sent")
        return build_response(status=400,message="There Was A Problem Sending The Invitation. Contact Support!")
    
    def __send_reseller_profile(self):        
        res_rec,res_count = Database().query("SELECT * FROM resellers WHERE siteroute=%s AND deleted IS NULL",(self.payload["siteroute"]))
        res_rec  = get_master_reseller() if not res_count else res_rec[0]  
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",res_rec["recordid"])              
        email= eml_set[0]["emailaddress"] if eml_cnt else ""
        return build_response(status=200,data={
            "id":res_rec["recordid"],
            "logo":get_entity_logo(res_rec["recordid"],230,90,True),
            "siteroute": f"https://{res_rec['siteroute']}.{res_rec['sitedomain']}",
        })
    
    def __set_sql_where(self):
        sql = ""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND MATCH(internalid,companyname,contactlastname,contactfirstname,address1,address2,city,state,zipcode,telephone,
                      emailaddress,ein,siteroute,emailgeneral,emaildrivers,emailbilling) AGAINST ('+{self.payload["search"]}*' IN BOOLEAN MODE)"""
        if "sortcol" in self.payload and self.payload["sortcol"] != "":
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "internalid": sort = f"""a.internalid {order}"""
                case "companyname": sort = f"""a.companyname {order}"""
                case "telephone": sort = f"""a.telephone {order}"""
                case "added": sort = f"""a.added {order}"""
            if sort != "":
                sql = f"""{sql} ORDER BY {sort}"""
        if "page" in self.payload and "limit" in self.payload:
            sql = (
                f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
            )
        return sql

    def __serialize(self, record, user):
        usr_res = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("resellers", record)
        new_rec.pop("tokenid")
        new_rec.pop("tokenkey")
        new_rec["logo"] = get_entity_logo(new_rec["recordid"], 590, 410,stream=True)
        new_rec["dateadded"] = format_date_time(local_date_time(record["added"], usr_res["timezone"]), "human_date")        
        new_rec["telephone"] = format_telephone(record["telephone"])
        new_rec["hasworkpolicy"] = check_entity_policies(new_rec["recordid"],"w")
        new_rec["hasdrugpolicy"] = check_entity_policies(new_rec["recordid"],"d")        
        new_rec = set_record_prefix("res",new_rec)
        new_rec.update(get_entity_record(new_rec["res_recordid"], record["tokenid"], record["tokenkey"]))                
        new_rec["set_setupcomplete"] = "Yes" if new_rec["set_setupcomplete"] else "No"        
        if new_rec["set_invitationsent"]:
            new_rec["set_invitationsent"] = f'Last Sent: {format_date_time(local_date_time(new_rec["set_invitationsent"], usr_res["timezone"]), "human_date_time")}'
        else:
            new_rec["set_invitationsent"] = "Invitation Has Not Been Sent"            
        set_user = Database().fetch("users",new_rec["set_agreementuserid"])
        new_rec["set_agreementuser"] = f'{set_user["firstname"]} {set_user["lastname"]}' if set_user else ""
        # attach tallies here
        return new_rec

    def get(self, user):
        if request.endpoint == "reseller-policies": return get_entity_policies(self.payload["id"],self.payload["ptype"])
        if request.endpoint == "reseller-logo": return get_entity_logo(self.payload["id"],590,410)
        if request.endpoint == "reseller-invite": return self.__send_invitation(user)        
        if request.endpoint == "reseller-profile": return self.__send_reseller_profile()
        sql = (f"""SELECT a.* FROM resellers a WHERE ismaster=0{self.__set_sql_where()}""")        
        rec_set, rec_count = Database().query(sql, tuple(self.params))
        data = [self.__serialize(r, user) for r in rec_set]
        return build_response(status=200, data=data, count=rec_count)

    def post(self, user):
        if request.endpoint == "reseller-policies": return put_entity_policies("resellers",self.payload["id"],"drugpolicy" if self.payload["ptype"]=="d" else "workpolicy")
        if request.endpoint == "reseller-logo": return put_entity_logo("resellers",self.payload["id"])        
        err_response = validate_new_reseller(self.payload)                
        if err_response: return err_response
        salt,password = generate_key_pair()
        rec = copy.deepcopy(strip_record_prefix("res",self.payload))        
        rec["logofile"] = "logo.png"
        rec["tokenid"] = salt
        rec["tokenkey"] = password        
        new_rec = Database().insert("resellers", rec)
        if new_rec: 
            self.__update_reseller_tables(new_rec,True)
            return build_response(status=200, message=f"The Reseller Was Added Successfully.")
        return build_response(status=400, message="The Reseller Was Not Added. Contact Support")

    def put(self, user):                
        err_response = validate_reseller(self.payload)        
        if err_response: return err_response        
        rec = copy.deepcopy(strip_record_prefix("res",self.payload))
        rec["deleted"] = None        
        upd_rec = Database().update("resellers", rec)
        if upd_rec:                         
            self.__update_reseller_tables(upd_rec,False)            
            return build_response(status=200, message=f"The Reseller Was Updated Successfully.")
        return build_response(status=400, message="The Reseller Was Not Updated. Contact Support")

    def delete(self, user):
        if request.endpoint == "reseller-policies": return delete_entity_policies("resellers",self.payload["id"],"drugpolicy" if self.payload["ptype"]=="d" else "workpolicy")
        if Database().delete("resellers", self.payload["recordid"]):
            return build_response(status=200, message="The Reseller Was Deactivated Successfully!")
        return build_response(status=400, message="The Reseller Was Not Deactivated. Contact Support")