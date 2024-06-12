from api_response import build_response
from database import Database
from toolbox import *
from queries import *
from drivers import Drivers
from accounts import Accounts
from emailqueue import EmailQueue

def driver_application(record):    

    #==========[New Application]==========#
    if record["app_page"]=="2":
        ssn = record["drv_socialsecurity"]        
        drv_rec = Drivers().get_driver_by_ssn(ssn)
        if drv_rec and drv_rec["accountid"] == record["acc_recordid"] and drv_rec["status"] in ("application","review"):
            response = "There is already an application for that social security number.  Please <b>Go Back</b> and select <b>Return To Application</b>"                                                           
            return build_response(status=400,data=response)
        if drv_rec and drv_rec["accountid"] != record["acc_recordid"]:
            return build_response(status=200,data=drv_rec)
        if not drv_rec:
            drv_rec = Drivers().new_driver(record["acc_recordid"],record["drv_socialsecurity"])            
            if drv_rec:
                if Drivers().put_driver_date(drv_rec["recordid"],"appstarted",get_sql_date_time()):
                    return build_response(status=200,data=Drivers().get_driver_application(drv_rec["recordid"]))
        return build_response(status=400,message="Unable To Create The Driver Application. Contact Support")       
    
    #==========[Return Application]==========#            
    if record["app_page"]=="3":
        ssn = record["drv_socialsecurity"]        
        drv_rec = Drivers().get_driver_by_ssn(ssn)
        if drv_rec:
            if drv_rec["accountid"] == record["acc_recordid"] and drv_rec["status"] in ("application","review"):
                return build_response(status=200,data=Drivers().get_driver_application(drv_rec["recordid"]))
            else:            
                response = ("This application has already bee submitted to the Employer.  If you feel this "
                            "to be an error, please contact support at the number below.")
                return build_response(status=400,data=response)
        response = ("We could not find any applications with that information. Please check that the "
                    "information is correct and try again.")
        return build_response(status=400,data=response)
        
    #==========[Upload Document]=============#
    if record["app_page"]=="98":
        if Drivers().remove_app_document(record): return build_response(status=200)
        return build_response(status=400,message="Unable To Remove This Document! Call Support.")

    #==========[Process Application]==========#    
    message = ""                        
    addresses = strip_record_prefix("add",json.loads(record["addresses"]))
    licenses = strip_record_prefix("lic",json.loads(record["licenses"]))
    crashes = strip_record_prefix("cra",json.loads(record["crashes"]))
    violations = strip_record_prefix("vio",json.loads(record["violations"]))
    employers = strip_record_prefix("emp",json.loads(record["employers"]))
    signatures = strip_record_prefix("sig",json.loads(record["signatures"]))    
    experience = json.loads(record["experience"])
    dates = json.loads(record["dates"])
    drivers = json.loads(record["driver"])    
    if "applicationstep" in drivers: drivers.pop("applicationstep")    
    drv_rec = Drivers().put_driver(drivers)        
    if drv_rec:
        #==========[Application Page 1]==========#                
        if record["app_page"]=="4":                     
            if not Drivers().put_driver_app_addresses(drv_rec["recordid"],addresses):
                message = "Unable To Update Driver Residences. Contact Support"        
            if not message and not Drivers().put_driver_app_licenses(drv_rec["recordid"],licenses):
                message = "Unable To Update Driver Licenses. Contact Support"
            if not message and not Drivers().put_driver_app_crashes(drv_rec["recordid"],crashes):
                message = "Unable To Update Driver Accidents. Contact Support"
            if not message and not Drivers().put_driver_app_violations(drv_rec["recordid"],violations):
                message = "Unable To Update Driver Violations. Contact Support"
            if not message and not Drivers().put_driver_app_employers(drv_rec["recordid"],employers):
                message = "Unable To Update Driver Employers. Contact Support"
            if not message and not Drivers().put_driver_app_experience(drv_rec["recordid"],experience):
                message = "Unable To Update Driver Experience. Contact Support"
            if not message and not Drivers().put_driver_app_signatures(drv_rec["recordid"],signatures):
                message = "Unable To Update Driver Signature. Contact Support"
            if not message and not Drivers().put_driver_app_email(drv_rec["recordid"],drivers["emailaddress"]):
                message = "Unable To Update Driver Email Address. Contact Support"
            if message or not Drivers().update_driver_app_step(drivers,record["app_page"]):             
                return build_response(status=400,message=message if message else "Unable To Update The Application. Contact Support")        
            if Drivers().put_driver_date(drv_rec["recordid"],"medcardexpires",dates["medcardexpires"]):
                return build_response(status=200,data = Drivers().get_driver_application(drv_rec["recordid"]))
            return build_response(status=400,message=message if message else "Unable To Update The Application. Contact Support")        
    
        #==========[Application Pages 2-4]==========#                
        if int(record["app_page"]) in range(5,8):           
            if not Drivers().update_driver_app_step(drivers,record["app_page"]):
                return build_response(status=400,message="Unable To Update The Application. Call Support")        
            return build_response(status=200,data = Drivers().get_driver_application(drivers["recordid"]))

        #==========[Application Pages 5-11]            
        if int(record["app_page"]) in range(8,14):           
            if not Drivers().put_driver_app_signatures(drivers["recordid"],signatures):
                message = "Unable To Update Driver Sigantures. Contact Support"        
            if message or not Drivers().update_driver_app_step(drivers,record["app_page"]):             
                return build_response(status=400,message=message if message else "Unable To Update The Application. Contact Support")        
            return build_response(status=200,data = Drivers().get_driver_application(drivers["recordid"]))
        
        #==========[Application Page 12]    
        if record["app_page"]=="14":                             
            if not Drivers().put_driver_app_signatures(drivers["recordid"],signatures):
                message = "Unable To Update Driver Sigantures. Contact Support"     
            if not message:
                drv_rec["status"] = "new"
                appdates = json.loads(record["dates"])        
                if (Drivers().put_driver(drv_rec) and                     
                    Drivers().put_driver_date(drv_rec["recordid"],"medcardexpires",appdates["medcardexpires"]) and
                    Drivers().get_driver_current_license(drv_rec["recordid"]) and                        
                    Drivers().put_driver_date(drv_rec["recordid"],"licenseexpires",appdates["licenseexpires"]) and
                    Drivers().put_driver_date(drv_rec["recordid"],"new",get_sql_date_time()) and
                    EmailQueue().addQueue("driver_application",drv_rec["recordid"]) and 
                    EmailQueue().addQueue("account_application",drv_rec["recordid"])): return build_response(status=200)
        return build_response(status=400,message="Unable To Submit Your Application.  Call Support!")