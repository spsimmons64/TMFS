from database import Database
from queries import *
from authdotnet import AuthDotNet
from templates.pdf import outputpdf



def get_account(id,iso=False):
    return Database().fetch("accounts",id)
    
def get_account_email(id,emailtype):
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype=%s AND deleted IS NULL",(id,emailtype))
    return eml_set[0] if eml_cnt else {}

def get_account_balance(id):
    sql = ("SELECT SUM(CASE WHEN transmethod=-1 THEN -transamount WHEN transmethod=1 THEN transamount ELSE 0 END) "
           "AS balance FROM transactions WHERE accountid=%s AND deleted IS NULL")    
    bal_set,bal_cnt = Database().query(sql,(id))
    if bal_cnt: return bal_set[0]["balance"]
#================================
def replinish_account_balance(id,userid):
    complete = False
    res_rec = get_reseller_from_account(id)
    pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",id)    
    pay_rec = pay_set[0] if pay_cnt else False
    bil_set,bil_cnt = Database().query("SELECT * FROM billingprofiles WHERE resourceid=%s AND deleted IS NULL",id)
    bil_rec = bil_set[0] if bil_cnt else False
    if pay_set and bil_rec and res_rec:
        adn = AuthDotNet()
        tokenid= res_rec["tokenid"]
        tokenkey= res_rec["tokenkey"]
        resp = adn.create_payment_transaction(
            decrypt_with_salt(pay_set[0]["authcustprofileid"],tokenid,tokenkey),
            decrypt_with_salt(pay_set[0]["authpayprofileid"],tokenid,tokenkey),
            bil_rec["reloadlevel"]
        )        
        if resp is not None and resp.messages.resultCode == "Ok" and hasattr(resp.transactionResponse, 'messages') == True:     
            trx_rec = Database().prime("transactions")
            trx_rec["accountid"] = id
            trx_rec["pricingid"] = bil_rec["pricingid"]
            trx_rec["payprofileid"] = pay_rec["recordid"]
            trx_rec["userid"] = userid
            trx_rec["transmethod"] = 1
            trx_rec["transquantity"] = 1
            trx_rec["transamount"] = bil_rec["autodeposit"]
            trx_rec["description"] = f'Account Auto-Replinish'
            trx_rec["packageprice"] = bil_rec["autodeposit"]
            trx_rec["packagecost"] = 0
            trx_rec["errorstatus"] = 0
            trx_rec["errordescription"] = ""
            trx_rec["authorizationcode"] = resp.transactionResponse.transId
            if Database().insert("transactions",trx_rec): complete = True
        else:
            if hasattr(resp.transactionResponse, 'errors') == True:
                err_code = str(resp.transactionResponse.errors.error[0].errorCode)
                err_text = str(resp.transactionResponse.errors.error[0].errorText)
            else:
                err_code = str(resp.messages.message[0]['code'].text)
                err_text = str(resp.messages.message[0]['text'].text)
            adn.log_api_error(id,err_code,err_text)                            
    return complete

#================================

def new_account_transaction(userid,driverid,apitype,state=""):          
    drv_rec = Database().fetch("drivers",driverid)    
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    prc_rec = get_api_price(apitype.upper(),state)
    api_set,api_cnt = Database().query("SELECT * FROM apiprofiles WHERE apitype=%s AND deleted IS NULL",(apitype))            
    api_rec = api_set[0] if api_cnt else False
    pri_rec = Database().fetch("pricing",api_rec["pricingid"])               
    pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(acc_rec["recordid"]))            
    pay_rec = pay_set[0] if pay_cnt else False
    if drv_rec and prc_rec and api_rec and acc_rec and pri_rec and pay_rec:                            
        process_transaction = True
        bal = get_account_balance(acc_rec["recordid"])
        if prc_rec["price"] > bal and not replinish_account_balance(acc_rec["recordid"],userid): process_transaction = False
        if process_transaction:
            trx_rec = Database().prime("transactions")
            trx_rec["accountid"] = acc_rec["recordid"]
            trx_rec["pricingid"] = pri_rec["recordid"]
            trx_rec["payprofileid"] = pay_rec["recordid"]
            trx_rec["userid"] = userid
            trx_rec["transmethod"] = -1
            trx_rec["transquantity"] = 1
            trx_rec["transamount"] = prc_rec["price"]
            trx_rec["description"] = f'{pri_rec["packagename"]} For {drv_rec["firstname"]} {drv_rec["lastname"]}'
            trx_rec["packageprice"] = prc_rec["price"]
            trx_rec["packagecost"] = prc_rec["cost"]
            trx_rec["errorstatus"] = 0
            trx_rec["errordescription"] = ""
            trx_rec["authorizationcode"] = ""
            if Database().insert("transactions",trx_rec): return True
    return False