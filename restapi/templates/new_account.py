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
    acc_rec = Database().fetch("accounts",id)    
    mas_rec = get_master_reseller()
    res_rec = get_reseller_from_account(acc_rec["recordid"])    
    emailaddress,from_list = get_from_list(res_rec)
    to_list = get_to_list(acc_rec)
    bcc_list = get_bcc(mas_rec)
    smtp = get_smtp(res_rec)          
    if not from_list or not to_list or not smtp: return False
    pro_tip = f"Tip: Watch our video on getting started here, https://www.youtube.com/watch?v=gSh0tUXMHDE" if res_rec["ismaster"] else ""    
    base_url = f"https://{res_rec['siteroute']}.{res_rec['sitedomain']}"
    simple_url = f"{res_rec['siteroute']}.{res_rec['sitedomain']}"
    email_link = emailaddress
    setup_link = f"{base_url}/accounts/setup?id={acc_rec['recordid']}"
    login_link = f"{base_url}/{acc_rec['siteroute']}"
    driver_link = f"{base_url}/{acc_rec['siteroute']}/apply"
    law_link = f"{base_url}/{acc_rec['siteroute']}/law-enforcement"
    logo_path = get_logo_file(mas_rec["recordid"])            
    images.append({"tag":"logo","path":logo_path})    
    hdr = f"""Welcome {res_rec['companyname']}"""
    msg = f"""
            <tr><td><hr/></td></tr>
            <tr><td>
            <p>Dear {acc_rec['contactfirstname']} {acc_rec['contactlastname']}:</p>
            <p>Welcome to {res_rec["companyname"]}.We are very pleased you chose us to manage your driver qualification files. We look forward to 
               serving your company and believe you will be very happy with our services. Please find some important information below.</p>
            <p><b>Account Setup Url</b><br />If you were unable to complete the setup process at the time you signed up, don't worry! We 
               have saved everything for you and you may return at any time to complete. If you need to complete your setup process, 
               please follow the link below:</p>
            <p>{setup_link}</p>
            <p><b>Account Login Url:</b><br />{login_link}</p>
            <p><b>Driver Application Url:</b><br />{driver_link}</p>
            <p><b>Law Enforcement Url:</b><br />{law_link}</p>
            <p><b>Support Information</b><br />If you require any assistance using {simple_url}, we're here for you! Simply 
               contact us using your preferred method below:</p>
            <p><b>Support Telephone:</b>&nbsp;{res_rec['telephone']}</p>
            <p><b>Support Email:</b>&nbsp;{email_link}</p>
            {pro_tip}
            <p>Again, welcome to {res_rec["companyname"]} and may this be the beginning of a successful business relationship!</p>
            <p>Sincerely</p>            
            </td></tr>
            <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
            <tr><td><hr/></td></tr>
    """
    email= SendEmail(smtp,from_list,to_list,bcc_list,f"Welcome To {res_rec['companyname']}",hdr,msg,images)
    return(email.send())