import copy
from api_response import build_response
from database import Database
from toolbox import *
from queries import *
from validate import check_missing
from templates.new_account import send_message as new_account
from authdotnet import AuthDotNet

def validate_account_application(record):
    errors = []            
    if record["set_setupstep"]=="0":            
        req_list = [
            {"id":"acc_dot","text":"The DOT# Is Required"},
            {"id":"acc_companyname","text":"The Account Company Name Is Required"},
            {"id":"acc_address1","text":"The Account Address Is Required"},
            {"id":"acc_city","text":"The Account City Is Required"},
            {"id":"acc_state","text":"The Account State Is Required"},
            {"id":"acc_zipcode","text":"The Account Zip Code Is Required"},        
            {"id":"acc_telephone","text":"The Account Telephone Is Required"},                            
        ]  
        errors = check_missing(record,req_list)       
        if len(errors): return errors        
        rec_set,rec_cnt = Database().query("SELECT * FROM accounts WHERE recordid <> %s AND deleted IS NULL",record["acc_recordid"])
        for rec in rec_set:
            complete = True            
            if record["acc_dot"].replace(" ","").upper() == rec["dot"].replace(" ","").upper():
                errors.append({"id":"acc_dot","text":"Account DOT Number Is Already In Use."})
                complete = False
            if record["acc_companyname"].replace(" ","").upper() == rec["companyname"].replace(" ","").upper():
                errors.append({"id":"acc_companyname","text":"Account Company Name Is Already In Use."})
                complete = False
            if not complete: break
        if len(errors): return errors
                              
    if record["set_setupstep"]=="1":  
        req_list = [
            {"id":"acc_contactlastname","text":"The Contact Last Name Is Required"},
            {"id":"acc_contactfirstname","text":"The Contact First Name Is Required"},
            {"id":"eml_emailcontact","text":"The Email Address Is Required"},
            {"id":"acc_siteroute","text":"The Friendly URL Is Required"},
            {"id":"pwd_password","text":"An Account Password Is Required"},
            {"id":"usr_position","text":"An User Position Is Required"}
        ]           
        errors = check_missing(record,req_list)               
        acc_rec,acc_cnt = Database().query("SELECT * FROM accounts WHERE siteroute=%s AND deleted IS NULL",(record["acc_siteroute"]))
        if acc_cnt and acc_rec[0]["recordid"] != record["acc_recordid"]:
            errors.append({"id":"acc_siteroute","text":"This Site Route Is Already In Use!"})
        if record["pwd_password"] != record["pwd_pwconfirm"]:
            errors.append({"id":"pwd_password","text": "Password And Confirmation Do Not Match"})
            errors.append({"id":"pwd_pwconfirm","text": "Password And Confirmation Do Not Match"})
        if len(errors): return errors

    if record["set_setupstep"]=="2":
        req_list = [
            {"id":"set_estimateddrivers","text":"The Estimated Number Of Drivers Is Required"},
        ]   
        errors = check_missing(record,req_list)       
        if len(errors): return errors
        prc_rec = Database().fetch("pricing",record["acc_recordid"])
        if prc_rec:
            fee_set,fee_cnt = Database().query("SELECT * FROM pricingfees where pricingid=%s AND deleted IS NULL",(prc_rec["recordid"]))
            init_deposit = 0                
            for fee in fee_set:                
                if int(record["set_estimateddrivers"]) in range(fee["driverstart"],fee["driverend"]+1):                    
                    init_deposit = fee["price"] if fee["flatfee"] else fee["price"] * int(record["set_estimateddrivers"])
                    if init_deposit:   
                        int_init_deposit = int(init_deposit * 100)
                        int_set_initialdeposit = int(convert_to_number(record["set_initialdeposit"]).replace(".",""))
                        int_bil_reloadlevel = int(convert_to_number(record["bil_reloadlevel"]).replace(".",""))
                        int_bil_autodeposit = int(convert_to_number(record["bil_autodeposit"]).replace(".",""))
                        if int_set_initialdeposit < int_init_deposit:
                            errors.append({"id":"set_initialdeposit","text":f"The Initial Deposit Must Be Equal To Or More Than {format_currency(init_deposit)}."} )
                        if int_bil_reloadlevel < int(int_init_deposit/2):
                            errors.append({"id":"bil_reloadevel","text":f"The Minimum Balance Must Be Equal To Or More Than {format_currency(init_deposit/2)}."} )
                        if int_bil_autodeposit < int_init_deposit:
                            errors.append({"id":"bil_autodeposit","text":f"The Auto Deposit Amount Must Be Equal To Or More Than {format_currency(init_deposit)}."} )
        if len(errors): return errors
        
    if record["set_setupstep"]=="3":
        if record["pay_paymenttype"] == "cc":
            req_list = [   
                {"id":"pay_lastname","text":"The Card Holder Last Name Is Required"},
                {"id":"pay_firstname","text":"The Card Holder First Name Is Required"},
                {"id":"pay_address","text":"The Street Address Is Required"},
                {"id":"pay_city","text":"The City Is Required"},
                {"id":"pay_state","text":"The State Is Required"},
                {"id":"pay_zipcode","text":"The Zip Code Last Name Is Required"},
                {"id":"pay_ccnumber","text":"The Credit Card Number Is Required"},
                {"id":"pay_ccmonth","text":"The Credit Card Number Is Required"},
                {"id":"pay_ccyear","text":"The Credit Card Number Is Required"}
            ]
        else:
            req_list = [   
                {"id":"pay_bankname","text":"The Bank Name Is Required"},
                {"id":"pay_bankaccount","text":"The Bank Account Is Required"},
                {"id":"pay_bankrouting","text":"The Bank Routing Required"},
                {"id":"pay_nameonacct","text":"The Name On Account Is Required"},                                
            ]
        errors = check_missing(record,req_list)           
        if record["pay_paymenttype"] == "cc":
            if len(record["pay_ccnumber"]) not in range(13,17):
                errors.append({"id":"pay_ccnumber","text":"The Credit Card Number Is Incorrect!"})        
            if len(record["pay_cvv"]) not in range(3,5):
                errors.append({"id":"pay_cvv","text":"The Code Is Incorrect!"})
    return errors

def update_account_payment_auth(record):
    if record["set_setupstep"]!="3": return True
    complete = True
    acc_rec = Database().fetch("accounts",record["acc_recordid"])
    res_rec = get_reseller_from_account(record["acc_recordid"])
    if acc_rec and res_rec:
        tokenid = res_rec["tokenid"]
        tokenkey = res_rec["tokenkey"]        
        adn = AuthDotNet() 
        pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(record["acc_recordid"]))
        pay_rec = {} if not pay_cnt else pay_set[0]
        if pay_cnt:            
            if not pay_rec["authcustprofileid"]:
                resp = adn.create_customer_profile("Account",str(acc_rec["internalid"]),record["eml_emailcontact"])                                
                if resp is not None:
                    if resp.messages.resultCode == "Ok":                                            
                        pay_rec["authcustprofileid"] = encrypt_with_salt(str(resp.customerProfileId),tokenid,tokenkey)            
                        pay_rec["ccverified"] = 1                        
                        Database().update("payprofiles",pay_rec)
                    else:
                        error_code = resp.messages.message[0]['code'].text
                        if error_code != "E00039":
                            adn.log_api_error(acc_rec["recordid"],error_code.text,resp.messages.message[0]['text'].text)
                            complete = False
                else:                        
                    adn.log_api_error(acc_rec["recordid"],"NONE","No Repsonse From The API")
                    complete = False
        if complete:                            
            pay_cvv = record["pay_cvv"] if "pay_cvv" in record else ""
            if not pay_rec["authpayprofileid"]:                        
                resp = adn.create_payment_profile(pay_rec,pay_cvv,tokenid,tokenkey)
            else:                
                resp = adn.update_payment_profile(pay_rec,pay_cvv,tokenid,tokenkey)            
            if resp is not None:
                if resp.messages.resultCode == "Ok":                                            
                    if not pay_rec["authpayprofileid"]:
                        pay_rec["authpayprofileid"] = encrypt_with_salt(str(resp.customerPaymentProfileId),tokenid,tokenkey)                                            
                        Database().update("payprofiles",pay_rec)
                else:                               
                    adn.log_api_error(acc_rec["recordid"],resp.messages.message[0]['code'].text,resp.messages.message[0]['text'].text)
                    complete = False                            
            else:
                adn.log_api_error(acc_rec["recordid"],"NONE","No Repsonse From The API")
                complete=False
    return complete

def update_account_emails(id,record):    
    complete=True    
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='contact' AND deleted IS NULL",(id))
    eml_rec = eml_set[0] if eml_cnt else Database().prime("emails")    
    eml_rec.update(strip_record_prefix("eml",record))
    eml_rec["emailaddress"] = record["eml_emailcontact"] if "eml_emailcontact" in record else ""
    eml_rec["resourceid"] = id
    eml_rec["emailtype"] = "contact"       
    if eml_cnt:
        if not Database().update("emails",eml_rec):complete=False
    else:        
        if not Database().insert("emails",eml_rec): complete = False    
    return complete

def update_account_user(id,record):
    if int(record["set_setupstep"]) < 1: return True
    complete = True
    usr_set,usr_cnt = Database().query("SELECT * FROM users WHERE resourceid=%s AND setupuser=1 AND deleted IS NULL",(id))
    usr_rec = usr_set[0] if usr_cnt else Database().prime("users")
    usr_rec["resourceid"] = id
    usr_rec["entity"] = "accounts"
    usr_rec["setupuser"] = 1
    usr_rec["lastname"] = record["acc_contactlastname"]
    usr_rec["firstname"] = record["acc_contactfirstname"]
    usr_rec["emailaddress"] = record["eml_emailcontact"]
    usr_rec["securitylevel"] = "admin"
    usr_rec["language"] = record["usr_language"]                
    usr_rec["telephone"] = record["acc_telephone"]
    if usr_cnt:
        usr_new = Database().update("users",usr_rec) 
    else:
        usr_new = Database().insert("users",usr_rec)
    if usr_new:
        pwd_set,pwd_cnt = Database().query("SELECT * FROM passwords WHERE userid=%s AND deleted IS NULL",(usr_new["recordid"]))
        pwd_rec = pwd_set[0] if pwd_cnt else Database().prime("passwords")
        pwd_rec.update(strip_record_prefix("pwd",record))
        pwd_rec["userid"] = usr_new["recordid"]          
        pwd_rec["password"] = create_password(pwd_rec["password"])
        if pwd_cnt:
            if not Database().update("passwords",pwd_rec): complete=False
        else:
            if not Database().insert("passwords",pwd_rec): complete=False
    return complete
    
def update_account_setup(id, record):    
    complete = True
    set_set,set_cnt = Database().query("SELECT * FROM setups WHERE resourceid=%s AND deleted IS NULL",(id))
    set_rec = set_set[0] if set_cnt else Database().prime("setups")  
    old_step = set_rec["setupstep"]
    new_step = int(record["set_setupstep"])+1    
    set_rec.update(strip_record_prefix("set",record))    
    if new_step > old_step: set_rec["setupstep"] = new_step
    set_rec["resourceid"] = id
    if record["set_setupstep"] == "4":        
        usr_set,usr_cnt = Database().query("SELECT * FROM users WHERE resourceid=%s AND setupuser=1",record["acc_recordid"])        
        set_rec["agreementdate"] = get_sql_date_time()
        set_rec["agreementuserid"] = usr_set[0]["recordid"] if usr_cnt else ""
        set_rec["agreementip"] = request.remote_addr
    if set_cnt:
        if not Database().update("setups",set_rec): complete=False
    else:
        if not Database().insert("setups",set_rec): complete=False    
    return(complete)

def update_account_billing(id,record):
    complete = False    
    bil_set,bil_cnt = Database().query("SELECT * FROM billingprofiles WHERE resourceid=%s AND deleted IS NULL",(id))
    bil_rec = bil_set[0] if bil_cnt else Database().prime("billingprofiles")
    bil_rec.update(strip_record_prefix("bil",record))
    bil_rec["resourceid"] = id
    prc_set,prc_cnt =Database().query("SELECT * FROM pricing WHERE packagetype='accounts'AND frequency='monthly' AND isdefault=1 AND deleted IS NULL",())
    if prc_cnt:
        bil_rec["pricingid"] = prc_set[0]["recordid"]
        if bil_cnt:
            if Database().update("billingprofiles",bil_rec): complete=True
        else:
            if Database().insert("billingprofiles",bil_rec): complete=True        
    return(complete)
    
def update_account_payprofile(id,record):    
    complete = False    
    no_encrypt_list = ["recordid","resourceid","internalid","paymenttype","ccverified","added","updated","deleted","authcustprofileid","authpayprofileid"]    
    res_rec = Database().fetch("resellers",record["acc_resellerid"])        
    if res_rec:                    
        tokenid = res_rec["tokenid"]
        tokenkey = res_rec["tokenkey"]                
        pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(id))
        pay_rec = pay_set[0] if pay_cnt else Database().prime("payprofiles")        
        pay_rec.update(strip_record_prefix("pay",record))
        pay_rec["resourceid"] = id        
        for key in pay_rec.keys():
            if key not in no_encrypt_list:
                if pay_rec[key]:
                    pay_rec[key] = encrypt_with_salt(pay_rec[key],tokenid,tokenkey)
        if pay_cnt:
            if Database().update("payprofiles",pay_rec): complete = True
        else:
            if Database().insert("payprofiles",pay_rec): complete = True
    return complete

def update_account_tallies(id):
    complete = True
    tal_rec = Database().prime("accounttallies")
    tal_new = {
        "accountid" : id,
        "accountbalance": 0
    }             
    tal_rec.update(tal_new)                   
    if not Database().insert("accounttallies",tal_rec): complete=False
    return complete

def process_account_deposit(record):            
    complete = False
    acc_rec = Database().fetch("accounts",record["acc_recordid"])
    res_rec = get_reseller_from_account(record["acc_recordid"])
    pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(record["acc_recordid"]))
    bil_set,bil_cnt = Database().query("SELECT * FROM billingprofiles WHERE resourceid=%s AND deleted IS NULL",(record["acc_recordid"]))        
    prc_rec = Database().fetch("pricing",bil_set[0]["pricingid"]) if bil_cnt else False    
    if acc_rec and res_rec and pay_cnt and bil_cnt and prc_rec:                    
        tokenid = res_rec["tokenid"]
        tokenkey = res_rec["tokenkey"]        
        adn = AuthDotNet()         
        usr_set,usr_cnt = Database().query("SELECT * FROM users WHERE resourceid=%s AND setupuser=1 AND deleted IS NULL",(acc_rec["recordid"]))
        if usr_cnt:                       
            usr_rec = usr_set[0]
            trx_rec,trx_cnt = Database().query("SELECT * FROM transactions WHERE resourceid=%s",(record["acc_recordid"]))                
            if not trx_cnt:         
                err_code = ""
                err_text = ""                                       
                resp = adn.create_payment_transaction(
                    decrypt_with_salt(pay_set[0]["authcustprofileid"],tokenid,tokenkey),
                    decrypt_with_salt(pay_set[0]["authpayprofileid"],tokenid,tokenkey),
                    convert_to_number(record["set_initialdeposit"])
                )    
                if resp is not None:                    
                    if resp.messages.resultCode == "Ok" and hasattr(resp.transactionResponse, 'messages') == True:                                
                        trx_rec = {
                            "recordid": "",
                            "pricingid": prc_rec["recordid"],
                            "payprofileid": pay_set[0]["recordid"],
                            "userid": usr_rec["recordid"],
                            "accountid": acc_rec["recordid"],                            
                            "transmethod": 1,
                            "transquantity": 1,
                            "transamount": record["set_initialdeposit"],
                            "description": "Initial Deposit",
                            "packageprice": record["set_initialdeposit"],
                            "packagecost": 0,
                            "errorstatus": 0,
                            "errordescription": "",
                            "authorizationcode": resp.transactionResponse.transId
                        }
                        if Database().insert("transactions",trx_rec):complete = True     
                    else:
                        if hasattr(resp.transactionResponse, 'errors') == True:
                            err_code = str(resp.transactionResponse.errors.error[0].errorCode)
                            err_text = str(resp.transactionResponse.errors.error[0].errorText)
                        else:
                            err_code = str(resp.messages.message[0]['code'].text)
                            err_text = str(resp.messages.message[0]['text'].text)
                        adn.log_api_error(acc_rec["recordid"],err_code,err_text)                            
                else:
                    err_code = "NONE"
                    err_text = "Unknown Error Processing Credit Card"
                    adn.log_api_error(acc_rec["recordid"],"NONE","No Repsonse From The API")                
                if not complete:
                    return build_response(status=400,data={"code":err_code,"text":err_text})
    if complete:         
        sql = "UPDATE accounttallies set accountbalance=%s WHERE accountid=%s and deleted IS NULL"        
        Database().query(sql,(convert_to_number(record["set_initialdeposit"]),acc_rec["recordid"]))
        update_account_setup(acc_rec["recordid"],record)
        generate_account_logo(record)
        return build_response(status=200)
    return build_response(status=400,message="Unable To Process Your Payment. Contact Support!")

def generate_account_logo(record):
    acc_rec = Database().fetch("accounts",record["acc_recordid"])
    if acc_rec: generate_entity_logo(acc_rec)    

def create_account(record):    
    complete = False
    errors = validate_account_application(record)    
    if len(errors): return build_response(status=400,errors=errors,message="Please Address The Error(s) On Your Application")
    acc_rec = Database().prime("accounts")
    new_rec = {
        "resellerid": record["acc_resellerid"],
        "companyname": record["acc_companyname"],
        "address1": record["acc_address1"],
        "address2": record["acc_address2"],
        "city": record["acc_city"],
        "state": record["acc_state"],
        "zipcode": record["acc_zipcode"],
        "country": record["acc_country"],
        "telephone": record["acc_telephone"],        
        "timezone": record["acc_timezone"]
    }
    acc_rec.update(new_rec)
    acc_new = Database().insert("accounts",acc_rec)        
    if acc_new: 
        if (update_account_tallies(acc_new["recordid"]) and
            update_account_setup(acc_new["recordid"],record) and
            update_account_billing(acc_new["recordid"],record) and
            update_account_payprofile(acc_new["recordid"],record) and
            update_account_emails(acc_new["recordid"],record) and
            update_account_user(acc_new["recordid"],record)
        ):complete = True
    if complete:return build_response(status=200,data={"id":acc_new["recordid"]})    
    return build_response(status=400,message="Unable To Create Your Account.  Contact Support.")

def put_account(record):        
    complete = False
    errors = validate_account_application(record)    
    if len(errors): return build_response(status=400,errors=errors,message="Please Address The Error(s) On Your Application")
    acc_rec = Database().fetch("accounts",record["acc_recordid"])
    if acc_rec:        
        acc_rec.update(strip_record_prefix("acc",record))        
        acc_new = Database().update("accounts",acc_rec)
        if acc_new:
            if(update_account_setup(acc_new["recordid"],record) and
               update_account_billing(acc_new["recordid"],record) and
               update_account_payprofile(acc_new["recordid"],record) and
               update_account_emails(acc_new["recordid"],record) and
               update_account_user(acc_new["recordid"],record) and
               update_account_payment_auth(record)               
            ):complete = True    
    if complete: return build_response(status=200,data={"id":acc_rec["recordid"]})
    return build_response(status=400,message="Unable To Update The Account Information. Contact Support!")

def validate_account(record):        
    if record["set_setupstep"] == "0":        
        return create_account(record) if record["acc_recordid"] == "" else put_account(record)
    if int(record["set_setupstep"]) in range(1,4):
        return put_account(record)    
    if record["set_setupstep"] =="4":                
        return process_account_deposit(record)