from sendemail import SendEmail
from flask import current_app as app
from toolbox import *
from queries import *
from queries_account import *
from queries_resellers import *
from drivers import Drivers

def get_email(rec,emailtype):
    eml_rec = get_entity_email(rec["recordid"],emailtype)    
    if eml_rec:
        new_list = []
        email_list = eml_rec["emailaddress"].split(',')
        for email in email_list:new_list.append(f"{rec['companyname']}<{email}>")
        return ";".join(new_list)
    return ""

def send_message(driverid,route):
    images = []    
    drv_rec = Drivers().get_driver(driverid)    
    acc_rec = get_account(drv_rec["accountid"])    
    res_rec = get_reseller_from_account(acc_rec["recordid"])    
    mas_rec = get_master_reseller()    
    to_list = get_email(acc_rec,'support')      
    from_list = get_email(res_rec,'support')
    bcc_list = get_email(mas_rec,'support')    
    logo_path = get_reseller_logo_file(res_rec["recordid"])    
    smtp_rec = get_reseller_smtp(res_rec["smtpprofileid"])
    if drv_rec and acc_rec and res_rec and mas_rec and to_list and from_list and bcc_list and logo_path and smtp_rec:                
        smtp = {"api":smtp_rec["apikey"],"domain":smtp_rec["domainname"],"endpoint":smtp_rec["endpoint"]}
        images.append({"tag":"logo","path":logo_path})    
        new_route = "Copy Of Medical Certificate" if route=="medcard" else "Copy Of Driver's License"
        hdr = f"""{new_route} Uploaded By {drv_rec['firstname']} {drv_rec["lastname"]}"""
        msg = f"""        
            <tr><td><hr/></td></tr>
            <tr><td>
            <p>Hello {acc_rec["companyname"]}:</p>
            <p>This message is to notify you a new file was manually uploaded by a driver. Please review the information below for details:</p>
            <p></p>
            <b>Driver:</b> {drv_rec["firstname"]} {drv_rec["lastname"]}<br/>
            <b>Category:</b> {new_route}<br/>
            <p></p>
            <p>To view this file, please login through the portal and navigate to the driver's File Browser.</p>
            <p>Please do not respond to this email.</p>
            <p>Sincerely</p>            
            </td></tr>
            <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
            <tr><td><hr/></td></tr>
        """
        email= SendEmail(smtp,from_list,to_list,bcc_list,hdr,hdr,msg,images)        
        return(email.send())
    return False