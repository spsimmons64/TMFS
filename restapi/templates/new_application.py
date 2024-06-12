import os
from sendemail import SendEmail
from flask import current_app as app
from database import Database
from toolbox import *
from queries import *
from drivers import Drivers

def get_from_list(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' and deleted is NULL",(rec["recordid"]))
    if eml_cnt: return eml_rec[0]["emailaddress"],f'{rec["companyname"]}<{eml_rec[0]["emailaddress"]}>'
    return "","" 

def get_to_list(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='contact' and deleted is NULL",(rec["recordid"]))
    if eml_cnt:        
        eml_list = eml_rec[0]["emailaddress"].split(",")        
        return ";".join(eml_list)
    return ""

def get_bcc(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' and deleted is NULL",(rec["recordid"]))
    if eml_cnt:        
        eml_list = eml_rec[0]["emailaddress"].split(",")        
        return ";".join(eml_list)
    return ""

def get_smtp(rec):
    smtp_rec = Database().fetch("smtpprofiles",rec["smtpprofileid"])
    if smtp_rec: return {"api":smtp_rec["apikey"],"domain":smtp_rec["domainname"],"endpoint":smtp_rec["endpoint"]}
    return {}

def get_logo_file(rec):
    fil_rec,fil_cnt = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype='logo' AND deleted is NULL",(rec))
    if fil_cnt:
        logo_path = os.path.join(app.config["PROFILE_PATH"], rec, "logo", fil_rec[0]["filename"])
        if os.path.exists(logo_path): return logo_path
    return ""

def send_message(id):    
    images = []        
    drv_rec = Database().fetch("drivers",id)
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])        
    mas_rec = get_master_reseller()
    res_rec = get_reseller_from_account(acc_rec["recordid"])        
    driver_dates = Drivers().get_driver_dates(drv_rec["recordid"],iso=False)    
    emailaddress,from_list = get_from_list(res_rec)    
    to_list = get_to_list(acc_rec)    
    bcc_list = get_bcc(mas_rec)    
    smtp = get_smtp(res_rec)          
    if not from_list or not to_list or not smtp: return False
    app_date = format_date_time(local_date_time(driver_dates["new"],acc_rec["timezone"]),"full_date")    
    base_url = f"https://{res_rec['siteroute']}.{res_rec['sitedomain']}"        
    application_link = f"{base_url}/{acc_rec['siteroute']}/applications/?id={id}"
    logo_path = get_logo_file(mas_rec["recordid"])            
    images.append({"tag":"logo","path":logo_path})    
    hdr = f"""New Application"""
    msg = f"""
            <tr><td><hr/></td></tr>
            <tr><td>
            <p>Hello {acc_rec["companyname"]}:</p>
            <p>A new application for employment was submitted by {drv_rec["firstname"]} {drv_rec["lastname"]} on {app_date}.</p>            
            <p>To Review This Application Visit <a href="{application_link}" target="_blank">Driver Application For
            {drv_rec["firstname"]} {drv_rec["lastname"]}</a></p>
            <p>Please Do Not Respond To This Email.</p>
            <p>Sincerely</p>            
            </td></tr>
            <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
            <tr><td><hr/></td></tr>
    """
    email= SendEmail(smtp,from_list,to_list,bcc_list,"New Driver Application",hdr,msg,images)
    return(email.send())