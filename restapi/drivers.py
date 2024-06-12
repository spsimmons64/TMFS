import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *
from staticdata import states
from citadel import Citadel
from emailqueue import EmailQueue
from transactions import Transactions

class Drivers(Resource): 
    method_decorators = [check_token]   
    #=============================================================================================================================================
    # Driver Class Initiation
    #=============================================================================================================================================
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []
        self.driverStatus = [
            {"value": "new", "status": "New"},
            {"value": "review", "status": "Rejected"},
            {"value": "pending", "status": "Pending"},
            {"value": "hired", "status": "Hired"},
            {"value": "active", "status": "Active"},
            {"value": "inactive", "status": "Inactive"},
            {"value": "nothired", "status": "Not Hired"},
            {"value": "disqualified", "status": "Disqualified"},
            {"value": "purged", "status": "Purged"},
            {"value": "nlemployed", "status": "No Longer Employed"},
        ]
    #=============================================================================================================================================
    # Driver Application Methods
    #=============================================================================================================================================
    def put_driver_app_addresses(self,driverid,record):
        completed = True                  
        if Database().query("DELETE FROM driveraddresses WHERE driverid=%s",(driverid)):
            for add in record:
                if "added" in add: add.pop("added") 
                if "upadated" in add: add.pop("updated") 
                add_rec = Database().prime("driveraddresses")
                add_rec.update(add)
                add_rec["driverid"] = driverid
                if not Database().insert("driveraddresses",add_rec): completed = False
        return completed
    
    def put_driver_app_email(self,driverid,emailaddress):
        completed = False
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s and emailtype='driver'",(driverid))    
        eml_rec = eml_set[0] if eml_cnt else Database().prime("emails")        
        if not eml_rec["recordid"]:             
            eml_rec["resourceid"] = driverid
            eml_rec["emailtype"] = "driver"
            eml_rec["emailaddress"] = emailaddress            
            if Database().insert("emails",eml_rec): completed = True
        else:
            eml_rec["emailaddress"] = emailaddress
            if Database().update("emails",eml_rec): completed = True
        return completed

    def put_driver_app_licenses(self,driverid,record):   
        completed = True                        
        if Database().query("DELETE FROM driverlicenses WHERE driverid=%s",(driverid)):        
            for lic in record:
                if "added" in lic: lic.pop("added") 
                if "upadated" in lic: lic.pop("updated") 
                lic_rec = Database().prime("driverlicenses")
                lic_rec.update(lic)
                lic_rec["driverid"] = driverid
                if not Database().insert("driverlicenses",lic_rec): completed = False
        return completed       

    def put_driver_app_crashes(self,driverid,record):   
        completed = True                        
        if Database().query("DELETE FROM driveraccidents WHERE driverid=%s",(driverid)):        
            for cra in record:
                if "added" in cra: cra.pop("added") 
                if "upadated" in cra: cra.pop("updated") 
                cra_rec = Database().prime("driveraccidents")
                cra_rec.update(cra)
                cra_rec["driverid"] = driverid
                if not Database().insert("driveraccidents",cra_rec): completed = False
        return completed       

    def put_driver_app_violations(self,driverid,record):   
        completed = True                        
        if Database().query("DELETE FROM driverviolations WHERE driverid=%s",(driverid)):        
            for vio in record:
                if "added" in vio: vio.pop("added") 
                if "upadated" in vio: vio.pop("updated") 
                vio_rec = Database().prime("driverviolations")
                vio_rec.update(vio)
                vio_rec["driverid"] = driverid
                if not Database().insert("driverviolations",vio_rec): completed = False
        return completed       
    
    def put_driver_app_employers(self,driverid,record):   
        completed = True                        
        if Database().query("DELETE FROM driveremployment WHERE driverid=%s",(driverid)):        
            for emp in record:
                if "added" in emp: emp.pop("added") 
                if "upadated" in emp: emp.pop("updated") 
                emp_rec = Database().prime("driveremployment")
                emp_rec.update(emp)
                emp_rec["driverid"] = driverid
                if not Database().insert("driveremployment",emp_rec): completed = False
        return completed       
    
    def put_driver_app_experience(self,driverid,record):   
        completed = False                        
        if "added" in record: record.pop("added") 
        if "upadated" in record: record.pop("updated") 
        if Database().query("DELETE FROM driverexperience WHERE driverid=%s",(driverid)):        
            exp_rec = Database().prime("driverexperience")
            if exp_rec:
                exp_rec.update(record)
                if Database().insert("driverexperience",exp_rec): completed = True
        return completed       

    def put_driver_app_signatures(self,driverid,record):
        completed = True           
        for sig in record:
            typ_set,typ_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode=%s AND deleted IS NULL",(sig["typecode"]))
            if typ_cnt:                
                if Database().query("DELETE FROM driverdocuments WHERE driverid=%s AND documenttypeid=%s",(driverid,typ_set[0]["recordid"])):                    
                    doc_rec = Database().prime("driverdocuments")            
                    if doc_rec:
                        file_ext = f'_{format_date_time(get_sql_date_time(),"human_date","_")}.pdf'            
                        doc_rec["driverid"] = driverid
                        doc_rec["driversignatureid"] = sig["esignatureid"]
                        doc_rec["driversignaturedate"] = get_sql_date_time()
                        doc_rec["documenttypeid"] = typ_set[0]["recordid"]            
                        doc_rec["filename"] = f'{typ_set[0]["category"]}{file_ext}'
                        doc_rec["filedate"] = get_sql_date_time()
                        doc_rec["uploaded"] = False                        
                        if not Database().insert("driverdocuments",doc_rec):completed = False
        return completed              
                  
    def get_driver_application (self,driverid):
        drv_rec = self.get_driver_app(driverid)            
        if drv_rec:        
            acc_rec = Database().fetch("accounts",drv_rec["accountid"])
            if acc_rec:      
                new_rec =  {}            
                new_rec.update(set_record_prefix("acc",acc_rec))
                new_rec.update(set_record_prefix("drv",drv_rec))                                
                new_rec.update(set_record_prefix("dat",self.get_driver_dates(drv_rec["recordid"])))                
                new_rec.update(set_record_prefix("exp",self.get_driver_experience(drv_rec["recordid"])))                               
                new_rec.update({"drv_licenses":set_record_prefix("lic",self.get_driver_licenses(drv_rec["recordid"]))})
                new_rec.update({"drv_documents":set_record_prefix("doc",self.get_driver_documents(drv_rec["recordid"]))})
                new_rec.update({"drv_crashes":set_record_prefix("cra",self.get_driver_crashes(drv_rec["recordid"]))})
                new_rec.update({"drv_violations":set_record_prefix("vio",self.get_driver_violations(drv_rec["recordid"]))})
                new_rec.update({"drv_addresses":set_record_prefix("add",self.get_driver_app_addresses(drv_rec["recordid"]))})  
                new_rec.update({"drv_forfeitures":set_record_prefix("for",self.get_driver_forfeitures(drv_rec["recordid"]))})  
                new_rec.update({"drv_signatures":set_record_prefix("sig",self.get_driver_signatures(drv_rec["recordid"]))})
                new_rec.update({"drv_employers":set_record_prefix("emp",self.get_driver_employment(drv_rec["recordid"]))})            
                new_rec.update({"drv_emailaddress":self.get_driver_email(drv_rec["recordid"])})                                
                new_rec.update({"drv_esignature":self.get_driver_esignature(drv_rec["recordid"])})
                img_set = {}
                lic_image = self.get_license_image(drv_rec["recordid"])
                med_image = self.get_medcard_image(drv_rec["recordid"])
                if lic_image:
                    img_set["license_id"] = lic_image["recordid"]
                    img_set["license_name"] = lic_image["filename"]
                if med_image:
                    img_set["medcard_id"] = med_image["recordid"]
                    img_set["medcard_name"] = med_image["filename"]
                new_rec.update({"app_images":set_record_prefix("sig",img_set)})
            return new_rec        
        return False

    def update_driver_app_step(self, record,step):
        drv_rec = self.get_driver(record["recordid"])
        app_step = int(drv_rec["applicationstep"])
        app_page = int(step)-3                
        if app_page > app_step: drv_rec["applicationstep"] = app_page
        return Drivers().put_driver(drv_rec)
    
    def remove_app_document(self,record):
        if Database().delete("driverdocuments",record["doc_recordid"]):
            return build_response(status=200)
        return build_response(status=400,message="Unable To Remove Your Document At This Time. Contact Support.")
    #=============================================================================================================================================
    # Driver New Methods
    #=============================================================================================================================================
    def new_driver(self,accountid,socialsecurity):
        drv_rec = Database().prime("drivers")
        if drv_rec:                
            drv_rec["accountid"] = accountid
            drv_rec["status"] = "application"    
            drv_rec["socialsecurity"] = Citadel().encrypt_store(socialsecurity,"socialsecurity")
            drv_rec["medcardna"] = "N"
            drv_rec["haulhazmat"] = "N"
            drv_rec["chremovesafety"] = "N"
            drv_rec["chexempt"] = "N"
            drv_rec["araccepted"] = "N"
            drv_rec["requirelcv"] = "N"    
            drv_rec["hadaccidents"] = "N"
            drv_rec["hadviolations"] = "N"
            drv_rec["beendenied"] = "N"
            drv_rec["beenrevoked"] = "N"
            drv_rec["hastwic"] = "N"
            drv_rec["haspassport"] = "N"
            drv_rec["adtestedpositive"] = "N"
            drv_rec["adcanprovidedocs"] = "N"    
            drv_rec["applicationstep"] = 0       
            new_rec = Database().insert("drivers",drv_rec)
            if new_rec and self.new_driver_experience(new_rec["recordid"]) and self.new_driver_date(new_rec["recordid"]): return new_rec
        return False

    def new_driver_date(self,driverid):
        dat_rec = Database().prime("driverdates")            
        dat_rec["driverid"] = driverid
        return Database().insert("driverdates",dat_rec)

    def new_driver_flag(self,driverid,record):    
        flg_rec = Database.prime("driverflags")
        flg_rec.update(record)
        flg_rec["driverid"] = driverid
        return Database().insert("driverflags",flg_rec)

    def new_driver_email(self,driverid,record={}):
        eml_rec = Database().prime("emails")    
        eml_rec["resourceid"] = driverid
        eml_rec["emailtype"] = "driver"
        return Database().insert("emails",eml_rec)

    def new_driver_document(self,driverid,doctype,record={}):
        typ_set,typ_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode=%s AND deleted IS NULL",(doctype))    
        if typ_cnt:        
            doc_rec = Database().prime("driverdocuments")                
            doc_rec.update(record)        
            doc_rec["driverid"] = driverid
            doc_rec["documenttypeid"] = typ_set[0]["recordid"]        
            new_rec = Database().insert("driverdocuments",doc_rec)        
            return new_rec
        return False

    def new_driver_flag(self,driverid,record={}):
        flg_rec = Database().prime("driverflags")
        flg_rec.update(record)
        flg_rec["driverid"] = driverid
        return Database().insert("driverflags",flg_rec)

    def new_driver_signature(self,record):        
        typ_set,typ_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode=%s AND deleted IS NULL",(record["typecode"]))
        if typ_cnt:                      
            if Database().query("DELETE FROM driverdocuments WHERE driverid=%s AND documenttypeid=%s",(record["driverid"],typ_set[0]["recordid"])):
                doc_rec = Database().prime("driverdocuments")            
                file_ext = f'_{format_date_time(get_sql_date_time(),"human_date","_")}.pdf'            
                doc_rec["driverid"] = record["driverid"]    
                doc_rec["driversignatureid"] = record["driversignatureid"]
                doc_rec["driversignaturedate"] = get_sql_date_time()
                doc_rec["documenttypeid"] = typ_set[0]["recordid"]            
                doc_rec["filename"] = f'{typ_set[0]["category"]}{file_ext}'
                doc_rec["filedate"] = get_sql_date_time()
                doc_rec["uploaded"] = False
                return Database().insert("driverdocuments",doc_rec)        
        return False

    def new_driver_experience(self,driverid,record={}):
        exp_rec = Database().prime("driverexperience")        
        exp_rec["driverid"] = driverid
        exp_rec["bus"] = "N"
        exp_rec["dbltrp"] = "N"
        exp_rec["flatbed"] = "N"
        exp_rec["other"] = "N"
        exp_rec["semtrl"] = "N"
        exp_rec["strtrk"] = "N"
        exp_rec["trktrc"] = "N"
        return Database().insert("driverexperience",exp_rec)

    def new_driver_crash(self,driverid,record={}):
        cra_rec = Database().prime("driveraccidents")
        cra_rec.update(record)
        cra_rec["driverid"] = driverid
        return Database().insert("driveraccidents",cra_rec)
        
    def new_driver_violation(self,driverid,record={}):
        vio_rec = Database().prime("driverviolations")
        vio_rec.update(record)
        vio_rec["driverid"] = driverid
        return Database().insert("driverviolations",vio_rec)
            
    def new_driver_employer(self,driverid,record={}):
        emp_rec = Database().prime("driveremployment")
        emp_rec.update(record)
        emp_rec["driverid"] = driverid
        return Database().insert("driveremployment",emp_rec)

    def new_driver_correction(self,driverid,record={}):
        cor_rec = Database().prime("drivercorrections")
        cor_rec.update(record)
        cor_rec["driverid"] = driverid
        return Database().insert("drivercorrections",cor_rec)

    def new_driver_notification(self,driverid,record={}):    
        not_rec = Database().prime("notifications")
        not_rec.update(record)
        not_rec["driverid"]= driverid
        return Database().insert("notifications",not_rec)
    #=============================================================================================================================================
    # Driver Getter Methods
    #=============================================================================================================================================
    def get_driver(self,driverid):        
        drv_rec = Database().fetch("drivers",driverid)    
        if drv_rec:
            drv_rec["socialsecurity"] = Citadel().decrypt(drv_rec["socialsecurity"])            
            return(drv_rec)
        return False  
    
    def get_driver_app(self,driverid):
        drv_rec = self.get_driver(driverid)
        if drv_rec:        
            drv_rec["birthdate"] = format_date_time(drv_rec["birthdate"],"sql_date")
            drv_rec["telephone1"] = format_telephone(drv_rec["telephone1"])
            drv_rec["telephone2"] = format_telephone(drv_rec["telephone2"])
            status = next((d for d in self.driverStatus if d.get("value") == drv_rec["status"]),None)                
            if status: drv_rec["driverstatus"] = status["status"]
            return(drv_rec)
        return False

    def get_driver_dates(self,driverid,iso=True):    
        dat_set,dat_cnt = Database().query("SELECT * FROM driverdates WHERE driverid=%s AND deleted IS NULL",(driverid))
        if dat_cnt:        
            dat_rec = dat_set[0]
            if iso:
                for key in dat_rec.keys():
                    if key not in ("recordid","driverid","added","updated","deleted"):
                        dat_rec[key] = format_date_time(dat_rec[key],"sql_date") if dat_rec[key] else ""
            return(dat_rec)
        return {}    

    def get_driver_licenses(self,driverid,iso=True):
        license_list = []    
        lic_set,lic_cnt = Database().query("SELECT * FROM driverlicenses WHERE driverid=%s AND deleted IS NULL ORDER BY issued DESC",(driverid))
        for lic_rec in lic_set:
            if iso:        
                if lic_rec["issued"]: lic_rec["issued"] = lic_rec["issued"].isoformat()
                if lic_rec["expires"]: lic_rec["expires"] = lic_rec["expires"].isoformat()
            lic_rec["clicensenumber"] =  lic_rec["licensenumber"]                
            license_list.append(lic_rec)
        return license_list

    def get_driver_current_license(self,driverid):
        lic_set,lic_cnt = Database().query("SELECT * FROM driverlicenses WHERE driverid=%s AND deleted IS NULL ORDER BY issued DESC",(driverid))
        return lic_set[0] if lic_cnt else {}

    def get_driver_flags(self,driverid,iso=True):
        flags_list = []        
        sql = "SELECT * FROM driverflags WHERE driverid=%s AND cleardate IS NULL AND deleted IS NULL ORDER BY added DESC"
        flg_set,flg_cnt = Database().query(sql,(driverid))
        for flg_rec in flg_set:
            if iso:
                flg_rec["cleardate"] = flg_rec["cleardate"].isoformat() if flg_rec["cleardate"] else ""
                flg_rec["flagdate"] = flg_rec["added"].isoformat()            
            flags_list.append(flg_rec)
        return flags_list

    def get_driver_email(self,driverid):
        print(driverid)
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s and emailtype='driver'",(driverid))    
        return eml_set[0]["emailaddress"] if eml_cnt else ""

    def get_driver_esignature(self,driverid):            
        sig_set,sig_cnt = Database().query("SELECT * FROM esignatures WHERE resourceid=%s AND deleted IS NULL",(driverid))    
        sig_rec = sig_set[0] if sig_cnt else False                        
        if sig_rec:
            sig_rec["esignature"] = base64.b64encode(sig_set[0]["esignature"]).decode("utf-8")
        return sig_rec    
    
    def get_driver_signatures(self,driverid):
        sig_list = []
        sql = ("SELECT a.*,b.typecode FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid=a.documenttypeid "
            "WHERE driverid=%s AND driversignatureid != '' AND a.deleted IS NULL")
        sig_set,sig_cnt = Database().query(sql,(driverid)) 
        for sig_rec in sig_set:        
            new_rec = {
                "typecode": sig_rec["typecode"],
                "esignatureid": sig_rec["driversignatureid"],
                "esignaturedate":format_date_time(sig_rec["driversignaturedate"],"sql_date") if sig_rec["driversignaturedate"] else ""            
            }        
            sig_list.append(new_rec)
        return sig_list

    def get_driver_documents(self,driverid):
        sql = ("SELECT a.*,b.typecode FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid=a.documenttypeid "
            "WHERE driverid=%s AND a.deleted IS NULL")
        fil_set,fil_cnt = Database().query(sql,(driverid))            
        return fil_set if fil_cnt else []

    def get_driver_document_needs_review(self,driverid,entity):    
        sql = "SELECT a.*,b.typecode FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid = a.documenttypeid AND b.deleted IS NULL WHERE driverid=%s"
        if entity=="account": sql = f'{sql} AND accountreviewdate is NULL'
        if entity=="reseller": sql = f'{sql} AND resellerreviewdate is NULL'
        sql = f'{sql} AND a.deleted IS NULL'
        doc_set,doc_cnt = Database().query(sql,(driverid))    
        return doc_set if doc_cnt else []

    def get_driver_crashes(self,driverid):
        crash_list = []    
        cra_set,cra_cnt = Database().query("SELECT * FROM driveraccidents WHERE driverid=%s AND deleted IS NULL",(driverid))
        for cra_rec in cra_set: 
            cra_rec["accidentdate"] = cra_rec["accidentdate"].isoformat() if cra_rec["accidentdate"] else ""
            crash_list.append(cra_rec)
        return crash_list

    def get_driver_violations(self,driverid):    
        violation_list = []    
        vio_set,vio_cnt = Database().query("SELECT * FROM driverviolations WHERE driverid=%s AND deleted IS NULL",(driverid))
        for vio_rec in vio_set:   
            vio_rec["violationdate"] = vio_rec["violationdate"].isoformat() if vio_rec["violationdate"] else ""
            violation_list.append(vio_rec)
        return violation_list

    def get_driver_app_addresses(self,driverid):    
        add_set,add_cnt = Database().query("SELECT * FROM driveraddresses WHERE driverid=%s AND deleted IS NULL",(driverid))
        return add_set if add_cnt else []

    def get_driver_employment(self,driverid,iso=True):
        employment_list = []
        emp_set,emp_cnt = Database().query("SELECT * FROM driveremployment WHERE driverid=%s AND deleted IS NULL ORDER BY datefrom",(driverid))    
        for emp_rec in emp_set:
            if iso:
                emp_rec["telehone"] = format_telephone(emp_rec["telephone"]) if emp_rec["telephone"] else ""
                emp_rec["fax"] = format_telephone(emp_rec["telephone"]) if emp_rec["telephone"] else ""
                emp_rec["datefrom"] = emp_rec["datefrom"].isoformat() if emp_rec["datefrom"] else ""
                emp_rec["dateto"] = emp_rec["dateto"].isoformat() if emp_rec["dateto"] else ""
            employment_list.append(emp_rec)
        return employment_list   

    def get_driver_forfeitures(self,driverid):
        sql = ("SELECT a.* FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid=a.documenttypeid AND b.typecode = 18 " 
            "AND b.deleted IS NULL WHERE driverid=%s AND a.deleted IS NULL")     
        for_set,for_cnt = Database().query(sql,(driverid))
        return for_set if for_cnt else []

    def get_driver_experience(self,driverid,iso=True):
        exp_set,exp_cnt = Database().query("SELECT * FROM driverexperience WHERE driverid=%s AND deleted IS NULL",(driverid))        
        if exp_cnt:
            exp_rec = exp_set[0]
            if iso:            
                exp_rec["busfrom"] = exp_rec["busfrom"].isoformat() if exp_rec["busfrom"] else ""
                exp_rec["busto"] = exp_rec["busto"].isoformat() if exp_rec["busto"] else ""
                exp_rec["dbltrpfrom"] = exp_rec["dbltrpfrom"].isoformat() if exp_rec["dbltrpfrom"] else ""
                exp_rec["dbltrpto"] = exp_rec["dbltrpto"].isoformat() if exp_rec["dbltrpto"] else ""
                exp_rec["flatbedfrom"] = exp_rec["flatbedfrom"].isoformat() if exp_rec["flatbedfrom"] else ""
                exp_rec["flatbedto"] = exp_rec["flatbedto"].isoformat() if exp_rec["flatbedto"] else ""
                exp_rec["otherfrom"] = exp_rec["otherfrom"].isoformat() if exp_rec["otherfrom"] else ""
                exp_rec["otherto"] = exp_rec["otherto"].isoformat() if exp_rec["otherto"] else ""
                exp_rec["semtrlfrom"] = exp_rec["semtrlfrom"].isoformat() if exp_rec["semtrlfrom"] else ""
                exp_rec["semtrlto"] = exp_rec["semtrlto"].isoformat() if exp_rec["semtrlto"] else ""
                exp_rec["strtrkfrom"] = exp_rec["strtrkfrom"].isoformat() if exp_rec["strtrkfrom"] else ""
                exp_rec["strtrkto"] = exp_rec["strtrkto"].isoformat() if exp_rec["strtrkto"] else ""
                exp_rec["trktrcfrom"] = exp_rec["trktrcfrom"].isoformat() if exp_rec["trktrcfrom"] else ""
                exp_rec["trktrcto"] = exp_rec["trktrcto"].isoformat() if exp_rec["trktrcto"] else ""
            exp_rec.pop("added")
            exp_rec.pop("updated")
            return(exp_rec)
        return {}

    def get_license_image(self,driverid):
        sql = ("SELECT a.* FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid=a.documenttypeid AND b.typecode = 16 AND b.deleted IS NULL "
            "WHERE driverid=%s AND a.deleted IS NULL")
        lic_image_set,lic_image_cnt = Database().query(sql,(driverid))
        return lic_image_set[0] if lic_image_cnt else {}

    def get_medcard_image(self,driverid):
        sql = ("SELECT a.* FROM driverdocuments a LEFT JOIN documenttypes b ON b.recordid=a.documenttypeid AND b.typecode = 17 AND b.deleted IS NULL "
            "WHERE driverid=%s AND a.deleted IS NULL")
        med_image_set,med_image_cnt = Database().query(sql,(driverid))
        return med_image_set[0] if med_image_cnt else {}

    def get_driver_corrections(self,driverid):    
        cor_set,cor_cnt = Database().query("SELECT * FROM drivercorrections WHERE driverid=%s AND deleted IS NULL ORDER BY added DESC",(driverid))
        return cor_set if cor_cnt else []

    def get_driver_statuses(self,driverid):
        today = format_raw_date(datetime.today())
        dat_rec = self.get_driver_dates(driverid,False)
        rec = {}
        if dat_rec:
            #Application
            application_status = 1 if dat_rec["new"] else 0
            rec["application"] = {
                "text":f'Completed on {format_date_time(dat_rec["new"],"human_date")}' if application_status else "No Application On File",            
                "status": application_status
            }

            #Pre Employment Clearinghouse
            chpreemployment_status = 1 if dat_rec["chpreemployment"] else 0            
            rec["chpreemployment"] = {            
                "text": f'Completed On {format_date_time(dat_rec["chpreemployment"],"human_date")}' if chpreemployment_status else "Not In Compliance",            
                "status": chpreemployment_status
            }
            #Clearinghouse
            clearinghouse_status = 1 if dat_rec["clearinghouse"] else 0     
            if dat_rec["clearinghouse"]:
                datediff = (today - format_raw_date(dat_rec["clearinghouse"])).days
                if 0 < datediff < 30: status = 2
                if datediff > 365: status = 3            
            rec["clearinghouse"] = {            
                "text": f'Completed On {format_date_time(dat_rec["clearinghouse"],"human_date")}' if clearinghouse_status else "Not In Compliance",            
                "status": clearinghouse_status
            }
            #PSP Report        
            psp_status = 0
            sql = "SELECT * FROM driverpsp WHERE driverid=%s AND deleted IS NULL ORDER BY requestdate DESC"        
            psp_set,psp_cnt = Database().query(sql,(driverid))
            if psp_cnt:
                psp_rec = psp_set[0]
                psp_status = 1
                if psp_rec["returndate"]:                
                    datediff = (today - format_raw_date(psp_rec["returndate"])).days            
                    if 0 < datediff < 30: psp_status = 2
                    if datediff > 365: psp_status = 3
                else: psp_status=4  
            psp_text =  f'Completed On {format_date_time(psp_rec["returndate"],"human_date")}' if psp_status else "No PSP Reports On File",      
            if psp_status==4: psp_text = f'Pending As Of {format_date_time(psp_rec["requestdate"],"human_date")}'
           
            rec["pspreport"]={
                "text": psp_text,
                "status": psp_status
            }


            #MVR Report
            lic_set = self.get_driver_licenses(driverid,False)
            rec["mvrreport"] = []
            for lic_rec in lic_set:
                mvr_status = -1
                if not lic_rec["mvrdate"]:
                    mvr_status = 0
                    mvr_text = "No MVR On File For This License"
                else:
                    datediff = (today - format_raw_date(lic_rec["mvrdate"])).days
                    mvr_status = 1
                    mvr_text = f'MVR Report Completed {format_date_time(lic_rec["mvrdate"],"human_date")}'                    
                    if 0 < datediff < 30:mvr_status = 2                        
                    if datediff > 365:
                        mvr_status = 3
                        mvr_text = f'MVR Report Out Of Compliance'                                            
                if mvr_status == -1:                    
                    sql = "SELECT * FROM drivermvr WHERE driverlicensesid=%s AND deleted IS NULL ORDER BY added DESC"                    
                    mvr_set,mvr_cnt = Database().query(sql,(lic_rec["recordid"]))                                        
                    if mvr_cnt:
                        mvr_rec = mvr_set[0]
                        mvr_status=1
                        mvr_text = f'MVR Report Completed {format_date_time(mvr_rec["returndate"],"human_date")}'                    
                        if  mvr_rec["status"] == "pending":                                        
                            mvr_status=4
                            mvr_text = "MVR Report Is Currently Pending"                                                     
                rec["mvrreport"].append({
                    "licenseid": lic_rec["recordid"],                
                    "text": mvr_text,
                    "status": mvr_status
                })





            # #CDLIS Report                
            cdlis_status = 0
            sql = "SELECT * FROM drivercdlis WHERE driverid=%s AND deleted IS NULL ORDER BY requestdate DESC"        
            cdlis_set,cdlis_cnt = Database().query(sql,(driverid))
            if cdlis_cnt:
                cdlis_rec = cdlis_set[0]
                cdlis_status = 1            
                if cdlis_rec["returndate"]:
                    datediff = (today - format_raw_date(cdlis_rec["returndate"])).days            
                    if 0 < datediff < 30: cdlis_status = 2
                    if datediff > 365: cdlis_status = 3
                else: cdlis_status=4          
            cdlis_text =  f'Completed On {format_date_time(cdlis_rec["returndate"],"human_date")}' if cdlis_status else "Not Required But Highly Recommended",      
            if cdlis_status==4: cdlis_text = f'Pending As Of {format_date_time(cdlis_rec["requestdate"],"human_date")}'
            rec["cdlisreport"]={
                "text": cdlis_text,
                "status": cdlis_status
            }
            #Drivers License        
            lic_status = 0
            if dat_rec["licenseexpires"]: lic_status=1
            if dat_rec["licenseexpires"]:
                datediff = (dat_rec["licenseexpires"]-today).days            
                if 0 < datediff < 30: lic_status = 2
                if datediff < 0 : lic_status = 3        
            rec["license"] = {
                "text": f'Expires On {format_date_time(dat_rec["licenseexpires"],"human_date")}' if lic_status else "N/A",                
                "status": lic_status
            }        
            #Medical Certificate
            med_status = 0
            if dat_rec["medcardexpires"]: med_status=1
            if dat_rec["medcardexpires"]:
                datediff = (dat_rec["medcardexpires"]-today).days            
                if 0 < datediff < 30: med_status = 2
                if datediff < 0 : med_status = 3        
            rec["medcard"] = {
                "text": f'Expires On {format_date_time(dat_rec["medcardexpires"],"human_date")}' if lic_status else "N/A",                
                "status": med_status
            }   
            #Inquiry Into Driving Record
            rec["drivinginquiry"] = []
            lic_set = self.get_driver_licenses(driverid,False)            
            typ_set,typ_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode=22 AND deleted IS NULL")
            if typ_cnt:                                
                for lic_rec in lic_set:                                    
                    sql = "SELECT * FROM driverdocuments WHERE documenttypeid=%s AND driverslicenseid=%s AND deleted IS NULL"
                    doc_set,doc_cnt = Database().query(sql,(typ_set[0]["recordid"],lic_rec["recordid"]))
                    if doc_cnt:
                        rec["drivinginquiry"].append({
                            "text": f"Inquiry Completed on {format_date_time(doc_set[0]['added'],'human_date')}",
                            "status": 1
                        })
                    else:
                        rec["drivinginquiry"].append({
                            "text":  "Incomplete",
                            "status": 0
                        })
            #Qualifications List
            rec["qualificationlist"] = {
                "text": "Incomplete",
                "status": 0
            }
            return(rec)

    def get_driver_by_ssn(self,ssn):
        ref_rec = Citadel().fetch_citadel(ssn,"socialsecurity")      
        if ref_rec:
            encrypted_ssn = Citadel().encrypt(ssn,ref_rec["referencekey"])[2]        
            if encrypted_ssn:
                sql = ("SELECT a.* FROM drivers a LEFT JOIN driverdates b on b.driverid=a.recordid WHERE "
                    "a.socialsecurity = %s and a.deleted IS NULL ORDER BY b.hired DESC")
                drv_set,drv_cnt= Database().query(sql,(encrypted_ssn))
                return drv_set[0] if drv_cnt else False
        return False    
#=============================================================================================================================================
# Driver Setter Methods
#=============================================================================================================================================
    def put_driver(self,record):    
        record.pop("socialsecurity")    
        record.pop("added")
        record.pop("updated")        
        drv_rec = Database().fetch("drivers",record["recordid"])                
        if drv_rec:
            drv_rec.update(record)                                 
            return Database().update("drivers",drv_rec)
        return False

    def put_driver_date(self,driverid,key,date):        
        dat_set,dat_cnt = Database().query("SELECT * FROM driverdates WHERE driverid=%s AND DELETED IS NULL",(driverid))
        dat_rec = dat_set[0] if dat_cnt else Database().prime("driverdates")
        dat_rec[key] = date
        return Database().update("driverdates",dat_rec)
       
    def put_driver_documents(self,record):
        doc_rec = Database().fetch("driverdocuemnts",record["recordid"])    
        doc_rec.update(record)    
        return Database().update("driverdocuemnts",doc_rec)

    def put_driver_email(self,record):
        eml_rec = Database().fetch("emails",record["recordid"])
        eml_rec.update(record)
        return Database().update("emails",eml_rec)

    def put_driver_signature(self,record):
        sig_rec = Database().fetch("driversignatures",record["recordid"])
        sig_rec.update(record)
        return Database().update("driversignatures",sig_rec)

    def put_driver_flag(self,record):
        flg_rec = Database().fetch("driverflags",record["recordid"])    
        flg_rec.update(record)    
        return Database().update("driverflags",flg_rec)

    def put_driver_correction(self,record):
        cor_rec = Database().fetch("drivercorrections",record["recordid"])    
        cor_rec.update(record)    
        return Database().update("drivercorrections",cor_rec)

    def update_driver_experience(self,driverid,record):        
        exp_rec = Database().prime("driverexperience")                
        exp_rec.update(record)    
        exp_rec["driverid"] = driverid
        return Database().insert("driverexperience",exp_rec)
#=============================================================================================================================================
# Driver Output Formatting Methods
#=============================================================================================================================================
    def fetch_formatted_driver(self,msg="",driverid=""):
        if not driverid: driverid = self.payload["driverid"]        
        drv_rec = self.get_driver(driverid)          
        eml_rec = self.get_driver_email(driverid)               
        drv_rec["emailaddress"] = eml_rec
        drv_rec["telephone"] = format_telephone(drv_rec["telephone1"])                                
        drv_rec["birthdate"] = format_date_time(drv_rec["birthdate"],"sql_date")
        drv_rec["flags"] = []
        drv_rec["documents"] = self.get_driver_documents(drv_rec["recordid"])
        flg_set = self.get_driver_flags(drv_rec["recordid"],iso=False)              
        for flg_rec in flg_set:        
            flg_rec["cleardate"] = format_date_time(flg_rec["cleardate"],"human_date") if flg_rec["cleardate"] else ""
            flg_rec["flagdate"] = format_date_time(flg_rec["added"],"human_date") if flg_rec["added"] else ""            
            drv_rec["flags"].append(flg_rec)
        drv_rec["corrections"] = []
        cor_set = self.get_driver_corrections(drv_rec["recordid"])
        for cor_rec in cor_set:            
            cor_rec["sentdate"] = format_date_time(cor_rec["added"],"human_date_time")
            drv_rec["corrections"].append(cor_rec)
        status = next((d for d in self.driverStatus if d.get("value") == drv_rec["status"]),None)                        
        if status: drv_rec["driverstatus"] = status["status"]
        dat_rec = self.get_driver_dates(drv_rec["recordid"],iso=False)        
        for key in dat_rec.keys():
            if key not in ("recordid","driverid","added","updated","deleted","") and "status" not in key:
                dat_rec[key] = format_date_time(dat_rec[key],"human_date") if dat_rec[key] else "N/A"    
        drv_rec["dates"] = dat_rec            
        licenses = []
        lic_set = self.get_driver_licenses(drv_rec["recordid"],False)                
        for lic_rec in lic_set:            
            found_state = next((state["text"] for state in states if state["value"] == lic_rec["state"]), None)            
            lic_rec["state"] = found_state
            lic_rec["issued"] = format_date_time(lic_rec["issued"],"human_date")
            lic_rec["expires"] = format_date_time(lic_rec["expires"],"human_date")
            licenses.append(lic_rec)
        drv_rec["license"] = licenses
        drv_rec["qualifications"] = self.get_driver_statuses(drv_rec["recordid"])  
        if drv_rec: return build_response(status=200,data=drv_rec,message=msg)            
        return build_response(status=400,message="Unable To Fetch The Driver Profile")

    def serialize_driver_grid(self,record,entity):
            new_rec = {}
            flg_set = self.get_driver_flags(record["recordid"])        
            doc_set = self.get_driver_document_needs_review(record["recordid"],entity)          
            dat_rec = self.get_driver_dates(record["recordid"])    
            status = next((d for d in self.driverStatus if d.get("value") == record["status"]),None)                
            if status: new_rec["driverstatus"] = status["status"]
            new_rec["recordid"] = record["recordid"]
            new_rec["drivername"] = f'{record["lastname"]}, {record["firstname"]}'
            new_rec["emailaddress"] = self.get_driver_email(record["recordid"])
            new_rec["telephone"] = format_telephone(record["telephone1"])
            new_rec["drivername"] = f'{record["lastname"]}, {record["firstname"]}'            
            new_rec["appstarted"] = format_date_time(dat_rec["appstarted"],"human_date") if dat_rec["appstarted"] else "N/A"
            new_rec["annualreview"] = format_date_time(dat_rec["annualreview"],"human_date") if dat_rec["annualreview"] else "N/A"
            new_rec["clearinghouse"] = format_date_time(dat_rec["clearinghouse"],"human_date") if dat_rec["clearinghouse"] else "N/A"
            new_rec["hired"] = format_date_time(dat_rec["hired"],"human_date") if  dat_rec["hired"] else "N/A"
            new_rec["pending"] = format_date_time(dat_rec["pending"],"human_date") if dat_rec["pending"] else "N/A"
            new_rec["review"] = format_date_time(dat_rec["review"],"human_date") if dat_rec["review"] else "N/A"
            new_rec["inactive"] = format_date_time(dat_rec["inactive"],"human_date") if dat_rec["inactive"] else "N/A"
            new_rec["purged"] = format_date_time(dat_rec["purged"],"human_date") if dat_rec["purged"] else "N/A"   
            new_rec["medcardexpires"] =  format_date_time(dat_rec["medcardexpires"],"human_date") if dat_rec["medcardexpires"] else "N/A"            
            new_rec["licenseexpires"] = format_date_time(dat_rec["licenseexpires"],"human_date") if dat_rec["licenseexpires"] else "N/A"    
            new_rec["flags"] = True if len(flg_set) else False
            new_rec["docreview"] = True if len(doc_set) else False
            #NEED DISQUALIFICATION REASONS
            return new_rec
#=============================================================================================================================================
# Driver REST Api
#============================================================================================================================================= 
    def __set_sql_where(self):        
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(employername,contactlastname,contactfirstname,emailaddress,notes,updatedby) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "employername": sort =f"""a.employername {order}"""
                case "contactname": sort = f"""a.contactlastname {order}, a.contactfirstname {order}"""
                case "emailaddress": sort = f"""a.emailaddress {order}"""
                case "updatedby": sort = f"""a.updatedby {order}"""
                case "added": sort = f"""a.added {order}"""
                case "updated": sort = f"""a.updated {order}"""
                case __: sort= "a.employername"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql        
       
    def __get_driver_list(self,user):
        self.params = [self.payload["parentid"]]       
        sql = f"SELECT a.* FROM drivers a WHERE accountid=%s"
        match self.payload["route"]:
            case "all": sql = f'{sql}'
            case "new": sql = f"{sql} AND status='new'"
            case "pending": sql = f"{sql} AND status='pending'"
            case "application": sql = f"{sql} AND status='application'"
            case "disqualified": sql = f"{sql} AND status='disqualified'"
            case "review": sql = f"{sql} AND status='review'"
            case "active": sql = f"{sql} AND status='active'"
            case "inactive": sql = f"{sql} AND status='inactive'"
            case "incomplete": sql = f"{sql} AND status='application'"
        sql = f"{sql} {self.__set_sql_where()}"        
        rec_set,rec_count = Database().query(sql,tuple(self.params))        
        data = []
        for rec in rec_set:
            new_rec = self.serialize_driver_grid(rec,self.payload["entity"])
            if self.payload["route"] == "incomplete" and new_rec["appstep"]==0:continue
            data.append(new_rec)            
        return build_response(status=200,data=data,count=rec_count)

    def get (self,user):
        if self.payload["action"]:
            match self.payload["action"]:
                case "grid": return self.__get_driver_list(user)
                case "fetch": return self.fetch_formatted_driver()        

    def post(self,user):                      
        if self.payload["action"]:
            match self.payload["action"]:
                case "update": return self.put_driver()
                case "reject": return self.__reject_driver_app()
                case "policy": return self.__send_policies()
                case "license": return self.__request_upload()
                case "medcard": return self.__request_upload() 