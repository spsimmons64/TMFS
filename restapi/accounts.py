import os, copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response, check_token
from toolbox import *
from queries import *
from validate_reseller import validate_reseller
from templates.new_reseller import send_message 
from datetime import date


from drivers import Drivers
from emailqueue import EmailQueue
from transactions import Transactions
from driverdocuments import DriverDocuments

class Accounts(Resource):
    method_decorators = [check_token]

    def __init__(self):
        self.payload = (request.args.to_dict() if request.method == "GET" else request.form.to_dict())
        self.params = []
    #=============================================================================================================================================
    # Account Getter Methods
    #=============================================================================================================================================
    def get_account(self,accountid):
        return Database().fetch("accounts",accountid)

    def get_account_tallies(self,accountid):
        tal_set,tal_cnt = Database().query("SELECT * FROM accounttallies WHERE accountid=%s AND deleted IS NULL",accountid)
        return tal_set[0] if tal_cnt else False
    
    def get_account_pay_profile(self,accountid):
        pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(accountid))
        return pay_set[0] if pay_cnt else {}
    
    def get_account_policies(self,id, ptype,pathonly=False):    
        uploadtype = "workpolicy" if ptype=="w" else "drugpolicy"    
        fil_rec, count = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype=%s AND deleted is NULL",(id,uploadtype))    
        if not count:        
            file_name = "noworkpolicy.pdf" if ptype == "w" else "nodrugpolicy.pdf"
            file_path = os.path.join(app.config["TEMPLATE_PATH"], "pdf", file_name)
        else:        
            file_name = fil_rec[0]["filename"]
            file_path = os.path.join(app.config["PROFILE_PATH"], id,"policies","drug" if uploadtype == "drugpolicy" else "work",fil_rec[0]["filename"])            
        if os.path.exists(file_path):  
            if not pathonly:      
                response = send_file(file_path, download_name=file_name)
                response.headers["x-filename"] = file_name
                response.headers["Access-Control-Expose-Headers"] = "x-filename"
                return response
            else:
                return file_path
        return {}

    #=============================================================================================================================================
    # Account Action Methods
    #=============================================================================================================================================
    def __set_driver_status(self):
        complete = False
        status = self.payload["status"]        
        drv_rec = Drivers().get_driver(self.payload["driverid"])
        dat_rec = Drivers().get_driver_dates(self.payload["driverid"])
        if status and drv_rec and dat_rec:                        
            drv_rec["status"] = status
            dat_rec[status] = get_sql_date_time()  

            if status == "pending":
                if (Drivers().put_driver(drv_rec) and 
                    Drivers().put_driver_date(drv_rec["recordid"],"pending",get_sql_date_time())):complete = True

            if status == "review":
                drv_rec["applicationstep"] = 0
                dat_rec["new"] = None                
                if (Drivers().put_driver(drv_rec) and 
                    Drivers().new_driver_correction(drv_rec["recordid"],{"reason":self.payload["rejectreason"]}) and
                    Drivers.put_driver_date(drv_rec["recordid"],"review",get_sql_date_time()) and
                    EmailQueue().addQueue("review_application",drv_rec["recordid"])): complete=True                                
                
            if status == "nothired":
                dat_rec[status] = self.payload["recorddate"]
                drv_rec["nothiredreason"] = self.payload["nohirereason"]
                drv_rec["nothiredinfo"] = self.payload["additionalinfo"]    
                if(Drivers().put_driver(drv_rec) and 
                   Drivers().put_driver_date(drv_rec["recordid"],"nothired",get_sql_date_time()) and
                   EmailQueue().addQueue("discard_application",drv_rec["recordid"])): complete=True            
                
        if complete: return Drivers().fetch_formatted_driver(driverid=self.payload["driverid"],msg="The Driver Status Has Been Updated!")                            
        return build_response(status=400,message = 'Unable To Update The Driver Status. Contact Support!')
    
    def __set_driver_flag(self):
        flg_rec = Database().prime("driverflags")
        if flg_rec:
            flg_rec["driverid"] = self.payload["driverid"]
            flg_rec["flagreason"] = self.payload["flagreason"]
            if Database().insert("driverflags",flg_rec):
                return Drivers().fetch_formatted_driver(driverid=self.payload["driverid"])                
        return build_response(status=400,message = 'Unable To Flag This Driver. Contact Support!')

    def __send_policies(self):
        attachments = []
        drv_rec = Drivers().get_driver(self.payload["driverid"])
        acc_rec = self.get_account(drv_rec["accountid"])
        if drv_rec and acc_rec:
            if self.payload["general"] =="1": attachments.append(self.get_account_policies(acc_rec["recordid"],"w",pathonly=True))
            if self.payload["substance"] =="1": attachments.append(self.get_account_policies(acc_rec["recordid"],"d",pathonly=True))            
            if EmailQueue().addQueue("policies",drv_rec["recordid"],attachments=attachments):
                return Drivers().fetch_formatted_driver(driverid=drv_rec["recordid"],msg="The Selected Policies Have Been Sent To The Driver")                
        return build_response(status=400,message="Unable To Process The Request.  Contact Support")

    def __clear_driver_flag(self,user):
        flg_rec = Database().fetch("driverflags",self.payload["flagid"])
        if flg_rec:
            flg_rec["cleardate"] = get_sql_date_time()
            flg_rec["clearreason"] = self.payload["clearreason"]
            flg_rec["clearedbyid"] = user["recordid"]
            if Database().update("driverflags",flg_rec):
                return Drivers().fetch_formatted_driver(driverid=flg_rec["driverid"])                                
        return build_response(status=400,message = 'Unable To Clear This Driver Flag. Contact Support!')

    def __reject_driver_app(self):
        drv_rec = Drivers().get_driver(self.payload["driverid"])
        if drv_rec:
            drv_rec["status"] = "review"
            drv_rec["applicationstep"] = 0
            cor_rec = Database().prime("drivercorrections")
            if cor_rec:
                cor_rec["driverid"] = self.payload["driverid"]
                cor_rec["reason"] = self.payload["rejectreason"]
                if (Drivers().put_driver(drv_rec) and 
                    Database().insert("drivercorrections",cor_rec) and
                    EmailQueue().addQueue("review_application",drv_rec["recordid"])                    
                   ):return Drivers().fetch_formatted_driver(driverid=self.payload["driverid"],msg="The Application Has Been Returned For Corrections")
        return build_response(status=400,message="Unable To update The Driver.  Please Call Support!")
                                   
    def __request_driver_upload(self,user):
        complete = False
        drv_rec = Drivers().get_driver(self.payload["driverid"])
        if self.payload["action"]=="request_license":                        
            if EmailQueue("request_license",drv_rec["recordid"]): complete = True                
        if self.payload["action"]=="request_license":            
            if EmailQueue("request_medcard",drv_rec["recordid"]): complete = True
        if self.payload["action"]=="request_employment":            
            if EmailQueue("request_medcard",drv_rec["recordid"]): complete = True
        if complete: return build_response(status=200,message=f"The Your Request Has Been Sent To The Driver!")        
        return build_response(status=400,message = 'Unable To Process Your Request. Contact Support!')

    def __update_driver_clearinghouse(self,user):           
        complete = True
        drv_rec = Drivers().get_driver(self.payload["driverid"])
        dat_rec = Drivers().get_driver_dates(self.payload["driverid"])            
        if drv_rec and dat_rec:
            drv_rec["chexempt"] = self.payload["chexempt"]    
            drv_rec["chremovesafety"] = self.payload["chremovesafety"]                  
            if not dat_rec["chpreemployment"]: Drivers().put_driver_date(drv_rec["recordid"],"chpreemployment",self.payload["completedate"])
            if len(request.files.getlist("files[]")):                   
                complete = DriverDocuments().upload_driver_document()
            if(complete and
               Drivers().put_driver(drv_rec) and
               Drivers().put_driver_date(drv_rec["recordid"],"clearinghouse",self.payload["completedate"])):
                    return Drivers().fetch_formatted_driver(driverid=drv_rec["recordid"],msg="Clearinghouse Completed")
        return build_response(status=400,message="Unable Update Driver Clearinghouse. Contact Support")

    def __order_pspreport(self,user):            
        drv_rec = Drivers().get_driver(self.payload["driverid"])    
        if drv_rec:                        
            psp_rec = Database().prime("driverpsp")
            psp_rec["driverid"] = self.payload["driverid"]
            psp_rec["requestdate"] = get_sql_date_time()
            psp_rec["status"] = "pending"
            description = f'Pre-Employment Screening Program (PSP) Report For {drv_rec["firstname"]} {drv_rec["lastname"]}'
            if (Database().insert("driverpsp",psp_rec) and 
                Drivers().put_driver_date(drv_rec["recordid"],"pspreport",get_sql_date_time()) and
                Transactions().put_api_transaction(drv_rec["accountid"],"PSP",description=description)):
                    return Drivers().fetch_formatted_driver(driverid=drv_rec["recordid"],msg="PSP Report Has Been Ordered")
        return build_response(status=400,message="Unable To Place Order For Driver PSP. Contact Support")

    def __order_mvrreport(self,user):            
        drv_rec = Drivers().get_driver(self.payload["driverid"])    
        lic_set = json.loads(self.payload["licenses"])
        if drv_rec and len(lic_set):        
            for lic in lic_set:  
                lic_rec = Database().fetch("driverlicenses",lic)                             
                lic_rec["mvrdate"] = get_sql_date_time()
                mvr_rec = Database().prime("drivermvr")
                mvr_rec["driverlicensesid"] = lic_rec["recordid"]
                mvr_rec["requestdate"] = get_sql_date_time()
                mvr_rec["status"] = "pending"                
                description = f'Motor Vehicle Report (MVR) For {drv_rec["firstname"]} {drv_rec["lastname"]}'
                if (Database().insert("drivermvr",mvr_rec) and    
                    Database().update("driverlicenses",lic_rec) and                 
                    Transactions().put_api_transaction(drv_rec["accountid"],"MVR",state=lic_rec["state"],description=description)):
                        return Drivers().fetch_formatted_driver(driverid=drv_rec["recordid"],msg="MVR Report Has Been Ordered")
        return build_response(status=400,message="Unable To Place Order For Driver MVR. Contact Support")
       
    def __order_cdlisreport(self,user):            
        drv_rec = Drivers().get_driver(self.payload["driverid"])    
        if drv_rec:                        
            cdl_rec = Database().prime("drivercdlis")
            cdl_rec["driverid"] = self.payload["driverid"]
            cdl_rec["requestdate"] = get_sql_date_time()
            cdl_rec["status"] = "pending"
            description = f'Commercial Driver\'s License Information (CDLIS) Report For {drv_rec["firstname"]} {drv_rec["lastname"]}'        
            if (Database().insert("drivercdlis",cdl_rec) and 
                Drivers().put_driver_date(drv_rec["recordid"],"cdlisreport",get_sql_date_time()) and
                Transactions().put_api_transaction(drv_rec["accountid"],"CDLIS",description=description)):
                    return Drivers().fetch_formatted_driver(driverid=drv_rec["recordid"],msg="CDLIS Report Has Been Ordered")        
        return build_response(status=400,message="Unable To Place Order For Driver CDLIS. Contact Support")            
    #=============================================================================================================================================
    # Account Setter Methods
    #=============================================================================================================================================
    def update_account_tallies(self,accountid):   
        tallies = {
            "newapps": 0,
            "expiringlicense": 0,
            "expiringmedcard": 0,
            "expiringclearinghouse": 0,
            "expiringannual": 0,
            "activedrivers": 0,
            "pendingdrivers": 0,
            "nothireddrivers": 0,
            "nologeremployed": 0,
            "accountbalance": 0
        }     
        tal_set,tal_cnt = Database().query("SELECT * FROM accounttallies WHERE accountid=%s AND deleted IS NULL",accountid)
        if tal_cnt:
            sql = "SELECT a.*,b.status FROM driverdates a LEFT JOIN drivers b ON b.recordid=a.driverid AND b.accountid=%s AND "\
                  "b.deleted IS NULL WHERE a.deleted IS NULL"
            dat_set,dat_cnt = Database().query(sql,(accountid))            
            for dat_rec in dat_set:
                today = date.today()                              
                match dat_rec["status"]:
                    case "new": tallies["newapps"] += 1
                    case "pending": tallies["pendingdrivers"] += 1
                    case "purged": tallies["purgeddrivers"] += 1
                    case "active": tallies["activedrivers"] += 1
                    case "not hired": tallies["nothireddrivers"]
                    case "no longer employed": tallies["nologeremployed"]
                if dat_rec["status"] == "active":
                    delta = today-dat_rec["medcard"]
                    if delta.days in range(0,31): tallies["expiringmedcard"] +=1
                    delta - today-dat_rec["annualreview"]
                    if delta.days in range(0,31): tallies["expiringannual"] +=1
                    delta - today-dat_rec["clearinghouse"]
                    if delta.days in range(0,31): tallies["expiringclearinghouse"] +=1
                    lic_set,lic_cnt = Database().query("SELECT * FROM driverslicenses WHERE driverid=%s AND deleted IS NULL ORDER BY issued DESC",dat_rec["driverid"])                
                    if lic_cnt:
                        delta = today-lic_set[0]["expires"]
                        if delta.days >= -0: tallies["expiringlicense"]
            sql = "SELECT SUM(CASE WHEN transmethod=0 THEN transamount*-1 ELSE transamount END) as balance FROM transactions WHERE resourceid=%s AND deleted IS NULL"
            trx_set,trx_cnt = Database().query(sql,(accountid))
            if trx_cnt: tallies["accountbalance"] = trx_set[0]["balance"]
            tal_rec = tal_set[0]
            tal_rec.update(tallies)            
            Database().update("accounttallies",tal_rec)
            return True
        return False

    def __update_account_tables(self,record,isnew=False):
        put_entity_emails(record["recordid"],self.payload)
        if isnew:             
            put_entity_setup(record["recordid"])
            generate_entity_logo(record)        
            create_entity_user(record,self.payload["eml_emailcontact"],"accounts",True,True)            
        put_entity_billing(record["recordid"],self.payload)
        put_entity_payprofile(record["recordid"],self.payload,record["tokenid"],record["tokenkey"])

    def __send_invitation(self,id,user):        
        res_rec = get_reseller_from_user(user["recordid"])
        if send_message(id):
            new_date = get_sql_date_time()
            if Database().query("UPDATE setups SET invitationsent=%s,temppassword='' WHERE resourceid=%s AND deleted IS NULL",(new_date,id)):
                return build_response(status=200,data={"invitationsent":format_date_time(local_date_time(new_date, res_rec["timezone"]), "human_date_time")},message="The User Invitation Has Been Sent")
        return build_response(status=400,message="There Was A Problem Sending The Invitation. Contact Support!")
    
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
        new_rec = Database().assign("accounts", record)
        new_rec.pop("tokenid")
        new_rec.pop("tokenkey")
        new_rec["logo"] = get_entity_logo(new_rec["recordid"], 590, 410,stream=True)
        new_rec["dateadded"] = format_date_time(local_date_time(record["added"], usr_res["timezone"]), "human_date")        
        new_rec["telephone"] = format_telephone(record["telephone"])
        new_rec["hasworkpolicy"] = check_entity_policies(new_rec["recordid"],"w")
        new_rec["hasdrugpolicy"] = check_entity_policies(new_rec["recordid"],"d")        
        new_rec = set_record_prefix("acc",new_rec)
        new_rec.update(get_entity_record(new_rec["acc_recordid"], record["tokenid"], record["tokenkey"]))                
        # attach tallies here
        return new_rec

    def get(self, user):
        if request.endpoint == "account-policies": return get_entity_policies(self.payload["id"],self.payload["ptype"])
        if request.endpoint == "account-logo": return get_entity_logo(self.payload["id"],590,410)        
        sql = (f"""SELECT a.* FROM accounts a WHERE ismaster=0{self.__set_sql_where()}""")        
        rec_set, rec_count = Database().query(sql, tuple(self.params))
        data = [self.__serialize(r, user) for r in rec_set]
        return build_response(status=200, data=data, count=rec_count)

    def post(self, user):        
        match self.payload["action"]:
            case "reject": return self.__reject_driver_app()            
            case "status": return self.__set_driver_status()
            case "flag": return self.__set_driver_flag()
            case "policies": return self.__send_policies()

            case "request_license": return self.__request_driver_upload()
            case "request_medcard": return self.__request_driver_upload()
            case "request_employment": return self.__request_driver_upload()

            case "clearflag" : return self.__clear_driver_flag(user)
            case "clearinghouse": return self.__update_driver_clearinghouse(user)
            case "pspreport": return self.__order_pspreport(user)
            case "mvrreport": return self.__order_mvrreport(user)
            case "cdlisreport": return self.__order_cdlisreport(user)                            
            
    def put(self, user):                
        err_response = validate_reseller(self.payload)        
        if err_response: return err_response        
        rec = copy.deepcopy(strip_record_prefix("res",self.payload))
        rec["deleted"] = None        
        upd_rec = Database().update("resellers", rec)
        if upd_rec:                         
            self.__update_account_tables(upd_rec,False)            
            return build_response(status=200, message=f"The Account Was Updated Successfully.")
        return build_response(status=400, message="The Account Was Not Updated. Contact Support")

    def delete(self, user):
        if request.endpoint == "account-policies": return delete_entity_policies("accounts",self.payload["id"],"drugpolicy" if self.payload["ptype"]=="d" else "workpolicy")
        if Database().delete("resellers", self.payload["recordid"]):
            return build_response(status=200, message="The Reseller Was Deactivated Successfully!")
        return build_response(status=400, message="The Reseller Was Not Deactivated. Contact Support")