import os
from sendemail import SendEmail
from flask import current_app as app
from database import Database
from toolbox import *
from queries import get_master_reseller,get_entity_logo,get_entity_setup,get_entity_emails,get_entity_billing

def get_from_list(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' and deleted is NULL",(rec["recordid"]))
    if eml_cnt: return f'{rec["companyname"]}<{eml_rec[0]["emailaddress"]}>'
    return ""

def get_to_list(rec):
    eml_rec,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='contact' and deleted is NULL",(rec["recordid"]))
    if eml_cnt:        
        eml_list = eml_rec[0]["emailaddress"].split(",")        
        return ";".join(eml_list)
    return ""

def get_user(rec):
    usr_rec,usr_cnt = Database().query("SELECT * FROM users WHERE resourceid=%s AND setupuser=1 AND deleted is null",(rec["recordid"]))
    if usr_cnt: return usr_rec[0]
    return {}

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
    mas_rec = get_master_reseller()
    res_rec = Database().fetch("resellers",id)    
    set_rec = get_entity_setup(res_rec["recordid"])
    bil_rec = get_entity_billing(res_rec["recordid"])
    eml_rec = get_entity_emails(res_rec["recordid"])    
    usr_rec = get_user(res_rec)    
    from_list = get_from_list(mas_rec)
    to_list = get_to_list(res_rec)
    smtp = get_smtp(mas_rec)          
    if not from_list or not to_list or not smtp or not usr_rec: return False
    fee_rec,fee_cnt = Database().query("SELECT * from pricingfees where pricingid=%s order by driverstart limit 1",(bil_rec["bil_pricingid"]))
    fee_price = fee_rec[0]["price"] if fee_cnt else 175    
    init_deposit = bil_rec["bil_setupfee"] + (fee_price*2)
    bcc_list = from_list
    logo_path = get_logo_file(mas_rec["recordid"])        
    images.append({"tag":"logo","path":logo_path})    
    hdr = f"""Welcome {res_rec['companyname']}"""
    msg = f"""
           <tr><td><hr/></td></tr>
           <tr><td>
           <p>Dear {usr_rec['firstname']}:</p>
           <p>Welcome To TMFS Corporation.  The following information will get you logged in to your new reseller accounts with Drivers
           Files Online(DFO) and Vehicle Files Online(VFO):</p>
            <table style="border-collapse: collapse; width: 100%; margin: 0px auto;border-color: #164398;" border="1">
            <tbody>
            <tr style="height: 28px;">
            <td style="width: 596px; height: 18px; background-color: #164398; border-color: #164398; border-style: solid; text-align: center; color: #ffffff; font-size: 18px;" colspan="3"><strong>Drivers Files Online</strong></td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>Friendly URL</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">https://{res_rec["siteroute"]}.{res_rec["sitedomain"]}</td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>User Login</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">{eml_rec["eml_emailcontact"]}</td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>Temporary Password</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">{set_rec["set_temppassword"]}</td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; text-align: right; height: 18px; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>Client Login</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">https://{res_rec["siteroute"]}.{res_rec["sitedomain"]}/[client name]</td>
            </tr>
            </tbody>            
            </table>
            <p/>           
            <table style="border-collapse: collapse; width: 100%; margin: 0px auto;border-color: #76B66A;" border="1">
            <tbody>
            <tr style="height: 28px;">
            <td style="width: 596px; height: 18px; background-color: #76B66A; border-color: #76B66A; border-style: solid; text-align: center; color: #ffffff; font-size: 18px;" colspan="3"><strong>Vehicle Files Online</strong></td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>Friendly URL</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">https://{res_rec["siteroute"]}.ourvf.com/portal</td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>User Login</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">{eml_rec["eml_emailcontact"]}</td>
            </tr>
            <tr style="height: 28px;">
            <td style="width: 161.281px; height: 18px; text-align: right; border-style: none; background-color: #d9d9d9; padding-right: 10px;"><strong>Temporary Password</strong></td>
            <td style="width: 10.0156px; height: 18px; border-style: none;">&nbsp;</td>
            <td style="width: 411.703px; height: 18px; border-style: none;">{set_rec["set_temppassword"]}</td>
            </tr>
            </tbody>
            </table>           
           <p>Each system (DFO and VFO) will require initial sign in, acceptance of TOS and add a credit card. On DFO, once you complete adding a 
           credit card there is a place to manually add funds. Please add {format_currency(init_deposit)} to the Drivers' Files Online program. The program  
           will deduct the set-up fee and leave {format_currency(fee_price*2)} in your account for reports and drivers fees. The initial minimum for this 
           account will be {format_currency(fee_price)} and a replenishment of the same amount will occur when your balance drops below {format_currency(fee_price)}.</p>
           <p>Vehicle Files Online will require the TOS and credit card, but will only be billed on the first of each month.</p>
           <p>Once you are in the portal, take a look around.  Add your {res_rec["companyname"]} Logo if you wish.  You can then start adding your 
           clients and each of their accounts will have some set up also.  I will be sending you a Welcome Letter that will outline 
           setting up the client accounts and fine points of processing an application,tton at the top of the screen that will 
           toggle you back to your portal for ease in going back and forth.</p>
           <p>If you feel you need some training, the best way to do this would be to set up a time once you have a client entered 
           and they have a driver and I'd be happy to walk you through the process.   Also, if you would like to discuss how to 
           get your clients' current drivers into the system please let me know and we can work through that transitional process.     
           There are two ways to do it and we can discuss which way would work best for you.</p> 
           <p>Upon setting up your client as outlined in the Welcome Letter, they will need to have a General Work Policy and D&A Policy. 
           We recommend that you have generic policies added to your portal (Policies Tab) which will carry over to your clients, and 
           then when tuning up their account, overwrite the generic policy with one specific to the client.   Policies are very 
           important as during the application process your drivers will read and sign that they read and received a copy of each 
           policy and a receipt will appear in their file as part of compliance.  Your auditor will be looking for this.</p>
           Thank you for joining us, and if you have any questions, please feel free to email or call me directly on my mobile 
           727-483-2257.  Welcome aboard!</p>
           <p>Sincerely,</p>           
           </td></tr>
           <tr><td><img src="cid:logo" alt='Logo' /></td></tr>
           <p>Peggy Hoskins<br />
           Manager - Sales and Support</p>
           <tr><td><hr/></td></tr>
           """
    
    email= SendEmail(smtp,from_list,to_list,bcc_list,"Welcome To TMFS Corporation",hdr,msg,images)
    return(email.send())