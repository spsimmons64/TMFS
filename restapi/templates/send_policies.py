import os
from sendemail import SendEmail
from flask import current_app as app
from database import Database
from toolbox import *
from queries import *

def get_from_list(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' and deleted is NULL",(rec["recordid"]))
    if eml_cnt: return eml_rec[0]["emailaddress"],f'{rec["companyname"]}<{eml_rec[0]["emailaddress"]}>'
    return "","" 

def get_to_list(rec,email):
    if not email:
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='driver' and deleted is NULL",(rec["recordid"]))
        email = eml_set[0] if eml_cnt else False
    if email:
        new_list = []
        email_list = email.split(',')
        for email in email_list:
            new_list.append(email)
        return ";".join(new_list)
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

def send_message(id,email="",work=True, drug=True):    
    images = []    
    app_rec = Database().fetch("applications",id)
    drv_rec = Database().fetch("drivers",app_rec["driverid"])
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])            
    res_rec = get_reseller_from_account(acc_rec["recordid"])        
    attachments = []
    if work: attachments.append(get_entity_policies(acc_rec["recordid"],"w",pathonly=True))
    if drug: attachments.append(get_entity_policies(acc_rec["recordid"],"d",pathonly=True))
    emailaddress,from_list = get_from_list(acc_rec)    
    to_list = get_to_list(drv_rec,email)
    bcc_list = ""
    smtp = get_smtp(res_rec)          
    if not from_list or not to_list or not smtp: return False    
    logo_path = get_logo_file(acc_rec["recordid"])            
    images.append({"tag":"logo","path":logo_path})    
    hdr = f"""General Work And Drug & Alcohol Testing Policies"""
    msg = f"""
            <tr><td><hr/></td></tr>
            <tr><td>
            <p>Hello {drv_rec["firstname"]} {drv_rec["lastname"]}:</p>
            <p>For your convenience and later reference, the company alcohol and drug testing policy and / or the company general work policy you agreed
            to have been attached to this email.</p>
            <tr><td>
            <p>If you have any questions regarding your application, please contact {acc_rec["companyname"]} directly at
              {format_telephone(acc_rec["telephone"])}.
            <p>Please do not respond to this email.</p>
            <p>Sincerely</p>            
            </td></tr>
            <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
            <tr><td><hr/></td></tr>
    """
    email= SendEmail(smtp,from_list,to_list,bcc_list,"General Work And Drug & Alcohol Testing Policies",hdr,msg,images,attachments)
    return(email.send())