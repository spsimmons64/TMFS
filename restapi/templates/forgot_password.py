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
    usr_rec = Database().fetch("users",id)
    ent_rec = Database().fetch(usr_rec["entity"],usr_rec["resourceid"])
    res_rec = get_reseller_from_user(id)
    reset_link = f"https://{res_rec['siteroute']}{'.' if res_rec['siteroute'] else ''}{res_rec['sitedomain']}"    
    match usr_rec["entity"]:
        case "resellers":
            reset_link = f"{reset_link}"       
            acc_rec = Database().fetch("accounts",usr_rec["resourceid"])
            logo_path = get_logo_file(res_rec["recordid"])            
        case "accounts":
            reset_link = f"{reset_link}/{ent_rec['siteroute']}"       
            acc_rec = Database().fetch("accounts",usr_rec["resourceid"])
            logo_path = get_logo_file(acc_rec["recordid"])            
        case "consultants":
            reset_link = f"{reset_link}/consultants"
            forgot_link = f"{reset_link}/consultants"
            acc_rec = Database().fetch("accounts",usr_rec["resourceid"])
            logo_path = get_logo_file(acc_rec["recordid"])            
        case "law":
            reset_link = f"{reset_link}/law-enforcement"
            acc_rec = Database().fetch("accounts",usr_rec["resourceid"])
            logo_path = get_logo_file(acc_rec["recordid"])            
    forgot_link = f"{reset_link}/login/forgotpwd"
    reset_link = f"{reset_link}/login/resetpwd/{usr_rec['passwordreset']}"
    to_list = (usr_rec['emailaddress'],f"{usr_rec['firstname']} {usr_rec['lastname']}<{usr_rec['emailaddress']}>")        
    bcc_list = ()
    from_list = get_from_list(ent_rec)
    smtp = get_smtp(res_rec)          
    if not from_list or not to_list or not smtp: return False
    images.append({"tag":"logo","path":logo_path})    
    hdr = f"Password Reset Request"
    msg = f"""
            <tr><td><hr/></td></tr>
            <tr><td>
                <p>Hello {usr_rec["firstname"]} {usr_rec["lastname"]}:</p>
                <p>We recently received a request to reset the password from {ent_rec["companyname"]} for the account associated with the
                    email address {usr_rec["emailaddress"]}.</p>
                <p>You can reset your password by clicking on the link below:</p>
            </td></tr>
            <tr><td style"text-align:center;">
                <a href="{reset_link}" target="_blank"><b>Reset My Password</b></a>
            </td></tr>
            <tr><td>
                <p>If you did not request a new password, disregard this email as no changes have been made to your account yet.<br/><br/>
                    Please note that your password will not change unless you click the link above and create a new one.  This link will expire
                    in one day.  If your link has expired then you can always <a href="{forgot_link}" target="_blank">request
                    a new password.</a></p>
            </td></tr>                              
            <tr><td>
            <p>Please Do Not Respond To This Email.</p>
            <p>Sincerely</p>            
            </td></tr>
            <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
            <tr><td><hr/></td></tr>
    """
    email= SendEmail(smtp,from_list,to_list,bcc_list,"Password Reset Request",hdr,msg,images)
    return(email.send())    






    

    





#    message = f"""
#                <tr><td style="font-size:18px;text-align:center;border-bottom:1px solid #5B7C99;">Hello, {usr_rec["firstname"]} {usr_rec["lastname"]}!</td></tr>
#                <tr><td>
#                    <p>We recently received a request to reset the password from {ent_rec["companyname"]} for the account associated with the
#                    email address {usr_rec["emailaddress"]}.</p>
#                    <p>You can reset your password by clicking on the link below:</p>
#                </td></tr>
#                <tr><td style="text-align:center">
#                    <a href="{reset_link}" target="_blank"><b>Reset My Password</b></a>
#                </td></tr>
#                <tr><td>
#                    <p>If you did not request a new password, disregard this email as no changes have been made to your account yet.<br/><br/>
#                    Please note that your password will not change unless you click the link above and create a new one.  This link will expire
#                    in one day.  If your link has expired then you can always <a href="{forgot_link}" target="_blank">request
#                    a new password.</a></p>
#                </td></tr>                  
#                """