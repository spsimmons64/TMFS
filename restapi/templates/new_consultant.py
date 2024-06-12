from sendemail import SendEmail
from flask import current_app as app
from sendemail import SendEmail
from flask import current_app as app
from toolbox import *
from queries import *

def send_message(usr_rec):
    res_rec = get_reseller_from_user(usr_rec["recordid"])    
    ent_rec= Database().fetch(usr_rec["usertype"],usr_rec["usertypeid"])        
    reset_link = f"""{app.config["BASE_URL"]}/consultants/login/resetpwd/{usr_rec["passwordreset"]}"""    
    message = f"""
               <tr><td style="font-size:18px;text-align:center;border-bottom:1px solid #5B7C99;padding:5px 0px;">{ent_rec["companyname"]}</td></tr>
               <tr><td>
                <p style="font-size:16px;font-weight:bold;text-align:center;">Welcome To The #1 Driver Qualification Program<p>
                <p>Hello {usr_rec["firstname"]}:</p>
                <p/>
                <p>As an independent consultant or firm that works with trucking companies, you will ensure driver compliance by
                utilizing our software to handle all qualification tasks for all your clients.  So let's get started!<p>
                <p/>
                <p>Your user name is your email address: {usr_rec["emailaddress"]}.  Click on the link below to set your password:</p>
               </td></tr>
               <tr><td style="text-align:center">
                   <a href="{reset_link}" target="_blank"><b>Set My Password</b></a>
               </td></tr>
               <tr><td>                
                <p>If you have any issues or concerns regarding your account, please do not hesitate to contact our customer support 
                team for further assistance.</p>
                <p>Thank you for using our service.</p>            
               </td></tr>               
               """
    mail = SendEmail("users",usr_rec["recordid"],f"Welcome To {res_rec['companyname']}","general",message,True)
    mail.send()