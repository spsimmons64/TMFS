from sendemail import SendEmail
from flask import current_app as app
from sendemail import SendEmail
from flask import current_app as app
from toolbox import *
from queries import *

def send_message(usr_rec):
    res_rec = get_reseller_from_user(usr_rec["recordid"])    
    ent_rec= Database().fetch(usr_rec["usertype"],usr_rec["usertypeid"])    
    entity = "admin" if (res_rec["ismaster"] and usr_rec["usertype"]=="resellers") else usr_rec["usertype"]    
    reset_link = f"""{app.config["BASE_URL"]}/{entity}/login/resetpwd/{usr_rec["passwordreset"]}"""
    forgot_link = f"""{app.config["BASE_URL"]}/{entity}/login/forgotpwd"""      
    account_link = f"""{app.config["BASE_URL"]}/login"""

    message = f"""
               <tr><td><hr/></td></tr>
               <tr><td>
               <tr><td style="font-size:18px;text-align:center;border-bottom:1px solid #5B7C99;">Hello, {usr_rec["firstname"]} {usr_rec["lastname"]}!</td></tr>
               <tr><td>
                <p>This is to confirm that the password for your account has been successfully changed. Your account is now 
                secured with the new password that you have set.</p>
                <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.<p/>
                <p>If you have any issues or concerns regarding your account, please do not hesitate to contact our customer support 
                team for further assistance.</p>
                <p>Thank you for using our service.</p>            
               </td></tr>
               <tr><td style="text-align:center;"><b><a href="{account_link}" target="_blank">Go To My Account</a></b></td></tr>
               <p>Sincerely</p>            
               </td></tr>
               <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
               <tr><td><hr/></td></tr>               
    """
    

    mail = SendEmail("users",usr_rec["recordid"],"Welcome","general",message,False)
    mail.send()