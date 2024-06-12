import string, secrets, json, pyperclip, copy
from uuid import uuid4
from pprint import pprint
from database import Database
from toolbox import *
from flask import send_file
from flask_restful import request
from api_response import build_response


def get_master_reseller():
    sql = """SELECT * FROM resellers WHERE ismaster=1 and deleted IS NULL"""
    mas_rec, count = Database().query(sql, ())
    return mas_rec[0] if count else False


def get_reseller_from_account(id):
    sql = """SELECT b.* FROM accounts a JOIN resellers b ON b.recordid=a.resellerid WHERE a.recordid=%s"""
    res_rec, count = Database().query(sql, (id))
    return res_rec[0] if count else False


def get_reseller_from_consultant(id):
    sql = """SELECT b.* FROM consultants a JOIN resellers b ON b.recordid=a.resellerid WHERE a.recordid=%s"""
    res_rec, count = Database().query(sql, (id))
    return res_rec[0] if count else False

def get_reseller_from_driver(id):
    drv_rec = Database().fetch("drivers",id)
    return get_reseller_from_account(drv_rec["accountid"]) if drv_rec else False
        
def get_reseller_from_user(id):
    usr_rec = Database().fetch("users", id)
    res_rec = {}
    if usr_rec:        
        if usr_rec["entity"] == "resellers":
            res_rec = Database().fetch("resellers", usr_rec["resourceid"])
            return res_rec
        if usr_rec["entity"] == "accounts":            
            acc_rec = Database().fetch("accounts",usr_rec["resourceid"])            
            if acc_rec: res_rec = Database().fetch("resellers", acc_rec["resellerid"])
            return res_rec
        if usr_rec["entity"] == "consultants":
            sql = """SELECT b.recordid from consultants a JOIN resellers b ON b.recordid=a.resellerid WHERE a.recordid=%s"""
            rec_set, count = Database().query(sql, usr_rec["resourceid"])
            if count:
                res_rec = Database().fetch("resellers", rec_set[0]["recordid"])
                return res_rec
            return False
    return False

#============================================================================================================================================
def create_entity_user(record,emailaddress,entity,silent=False,gen_password=False):
    usr_rec = {
        "recordid": "",
        "resourceid": record["recordid"],    
        "entity": entity,        
        "lastname": record["contactlastname"],
        "firstname": record["contactfirstname"],
        "emailaddress": emailaddress,
        "securitylevel": "admin",        
        "lastlogin": None,
        "telephone": record["telephone"],
        "position": "Administrator",
        "language": "en",
        "setupuser": 1,
        "passwordreset": str(uuid4()),
    }
    new_rec = Database().insert("users", usr_rec)
    if new_rec:
        alphabet = string.ascii_letters + string.digits + string.punctuation
        pwd = ''.join(secrets.choice(alphabet) for _ in range(16))
        if gen_password:
            pwd_rec = {
                "recordid": "",
                "userid": new_rec["recordid"],
                "password": create_password(pwd)
            }
            Database().insert("passwords",pwd_rec)
            Database().query("UPDATE setups SET temppassword=%s WHERE resourceid=%s and deleted is NULL",(pwd,record["recordid"]))
    return new_rec


def check_entity_policies(id, ptype):
    uploadtype = "workpolicy" if ptype=="w" else "drugpolicy"    
    fil_rec, count = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype=%s AND deleted is NULL",(id,uploadtype))
    return True if count else False

def get_entity_email(id,emailtype):        
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype=%s AND deleted is NULL", (id,emailtype))
    return eml_set[0] if eml_cnt else {}

def get_entity_emails(id):
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND deleted is NULL", (id))
    return eml_set if eml_cnt else []

def put_entity_emails(id,record):    
    chk_rec = strip_record_prefix("eml",record)    
    for key in chk_rec.keys():        
        match = False
        eml_type = key[5:]
        old_rec,cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s and emailtype=%s",(id,eml_type))                        
        if cnt:
            if chk_rec[key] == old_rec[0]["emailaddress"]: match = True
            if not match: Database().delete("emails",old_rec[0]["recordid"])            
        if not match:
            new_rec = {
                "recordid": "",
                "resourceid": id,
                "emailtype": eml_type,
                "emailaddress": chk_rec[key],
            }
            Database().insert("emails",new_rec)

def get_entity_billing(id):
    res_set, count = Database().query("SELECT * FROM billingprofiles WHERE resourceid=%s and deleted is NULL", (id))
    if count: return set_record_prefix("bil",res_set[0])
    return {}

def put_entity_billing(id,record):    
    old_rec = strip_record_prefix("bil",get_entity_billing(id))
    chk_rec = strip_record_prefix("bil",record)           
    matches = False        
    if old_rec:                
        for key in old_rec.keys(): 
            if key not in ("added","updated","deleted"):
                if old_rec[key] == chk_rec[key]: matches = True
        if not matches:                        
            Database().delete("billingprofiles",old_rec)            
    if not matches:
        new_rec = {
            "recordid": "",
            "resourceid": id,
            "pricingid": chk_rec["pricingid"],
            "allowecheck": chk_rec["allowecheck"] if "allowecheck" in chk_rec else 1,
            "accounttype": chk_rec["accounttype"] if "accounttype" in chk_rec else None,
            "billingdom": chk_rec["billingdom"],
            "lastbilldate": None,
            "reloadlevel": chk_rec["reloadlevel"] if "reloadlevel" in chk_rec else 0,
            "autodeposit": chk_rec["autodeposit"] if "autodeposit" in chk_rec else 0,
            "setupfee": chk_rec["setupfee"] if "setupfee" in chk_rec else 0,
            "setuppayments": chk_rec["setuppayments"] if "setuppayments" in chk_rec else 0,            
            "pspdiscount": chk_rec["pspdiscount"] if "pspdiscount" in chk_rec else 0,            
            "mvrdiscount": chk_rec["mvrdiscount"] if "mvrdiscount" in chk_rec else 0,            
            "cdlisdiscount": chk_rec["cdlisdiscount"] if "cdlisdiscount" in chk_rec else 0,            
        }        
        Database().insert("billingprofiles",new_rec)


def get_entity_setup(id):
    res_set, count = Database().query("SELECT * FROM setups WHERE resourceid=%s and deleted is NULL", (id))
    if count: return set_record_prefix("set",res_set[0])
    return {}

def put_entity_setup(id):    
    if strip_record_prefix("set",get_entity_setup(id)): return        
    new_rec = {
        "recordid" : "",
        "resourceid": id,
        "setupcomplete": 0,
        "setupstep": 1,
        "estimateddrivers": 0,
        "initialdeposit":0,
        "agreementdate": None,
        "agreementip": None,
    }
    Database().insert('setups',new_rec)

def get_entity_payprofile(id, tokenid, tokenkey):
    payprofiles_dct = {}
    res_set, count = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s and deleted is NULL", (id))
    if count:        
        for field_name in res_set[0].keys():
            if field_name in ("recordid","resourceid","paymenttype","ccverified","accounttype","added","updated","deleted","internalid","merchauthorization"):
                payprofiles_dct[field_name] = res_set[0][field_name]
            else:                         
                payprofiles_dct[field_name] = decrypt_with_salt(res_set[0][field_name], tokenid, tokenkey)
                if field_name == "ccnumber": 
                    if payprofiles_dct[field_name]:
                        payprofiles_dct[field_name] = f'**** {payprofiles_dct[field_name][:4]}' 
                    else:
                        payprofiles_dct[field_name] = ""
        return set_record_prefix("pay",payprofiles_dct)
    return {}

def put_entity_payprofile(id,record,tokenid,tokenkey):
    new_rec = {}
    old_rec = strip_record_prefix("pay",get_entity_payprofile(id,tokenid,tokenkey))
    chk_rec = strip_record_prefix("pay",record)   
    new_rec["resourceid"] = id
    new_rec["paymenttype"] = chk_rec["paymenttype"] if "paymenttype" in chk_rec else None
    new_rec["lastname"] = encrypt_with_salt(chk_rec["lastname"] if "lastname" in chk_rec else "",tokenid,tokenkey)
    new_rec["firstname"] = encrypt_with_salt(chk_rec["firstname"] if "firstname" in chk_rec else "",tokenid,tokenkey)
    new_rec["address"] = encrypt_with_salt(chk_rec["address"] if "address" in chk_rec else "",tokenid,tokenkey)
    new_rec["city"] = encrypt_with_salt(chk_rec["city"] if "city" in chk_rec else "",tokenid,tokenkey) 
    new_rec["state"] = encrypt_with_salt(chk_rec["state"] if "state" in chk_rec else "",tokenid,tokenkey) 
    new_rec["zipcode"] = encrypt_with_salt(chk_rec["zipcode"] if "zipcode" in chk_rec else "",tokenid,tokenkey) 
    new_rec["country"] = encrypt_with_salt(chk_rec["country"] if "country" in chk_rec else "",tokenid,tokenkey) 
    new_rec["ccnumber"] = encrypt_with_salt(chk_rec["ccnumber"] if "ccnumber" in chk_rec else "",tokenid,tokenkey) 
    new_rec["ccmonth"] = encrypt_with_salt(chk_rec["ccmonth"] if "ccmonth" in chk_rec else "",tokenid,tokenkey) 
    new_rec["ccyear"] = encrypt_with_salt(chk_rec["ccyear"] if "ccyear" in chk_rec else "",tokenid,tokenkey) 
    new_rec["ccverified"] = chk_rec["ccverified"]  if "ccverified" in chk_rec else 0
    new_rec["bankname"] = encrypt_with_salt(chk_rec["bankname"] if "bankname" in chk_rec else "",tokenid,tokenkey) 
    new_rec["bankaccount"] = encrypt_with_salt(chk_rec["bankaccount"] if "bankaccount" in chk_rec else "",tokenid,tokenkey) 
    new_rec["nameonacct"] = encrypt_with_salt(chk_rec["nameonacct"] if "nameonacct" in chk_rec else "",tokenid,tokenkey) 
    new_rec["bankrouting"] = encrypt_with_salt(chk_rec["bankrouting"] if "bankrouting" in chk_rec else "",tokenid,tokenkey) 
    new_rec["checknumber"] = encrypt_with_salt(chk_rec["checknumber"] if "checknumber" in chk_rec else "",tokenid,tokenkey)
    matches = False
    if old_rec:                
        for key in old_rec.keys(): 
            if key not in ("added","updated","deleted"):
                if old_rec[key] == chk_rec[key]: matches = True
        if not matches:                        
            Database().delete("payprofiles",old_rec["recordid"])            
    if not matches:
        Database().insert("payprofiles",new_rec)    

def get_entity_logo(id, maxWidth, maxHeight,stream=False,encode=False):
    fil_rec, count = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype='logo' AND deleted is NULL",(id))
    if count:        
        logo_path = os.path.join(app.config["PROFILE_PATH"], id, "logo", fil_rec[0]["filename"])        
        if os.path.exists(logo_path):            
            if stream:                 
                return get_image(logo_path, maxWidth, maxHeight,encode)
            else:
                return build_response(status=200,data=get_image(logo_path, maxWidth, maxHeight,encode))
    if stream:
        return ""
    else:
        return build_response(status=400,message="Unable To Retrieve Your Logo At This Time.  Call Support!")
    
def get_ad_logo(id, maxWidth, maxHeight,stream=False):
    tpa_rec = Database().fetch("thirdpartyads",id)
    if tpa_rec:
        fil_rec, count = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype='ad-logo' AND deleted is NULL",(tpa_rec["recordid"]))
        if count:        
            logo_path = os.path.join(app.config["PROFILE_PATH"], tpa_rec["resellerid"], "adlogos", fil_rec[0]["filename"])            
            if os.path.exists(logo_path):
                if stream: 
                    return get_image(logo_path, maxWidth, maxHeight)
                else:
                    return build_response(status=200,data=get_image(logo_path, maxWidth, maxHeight))                
    if stream:
        return ""
    else:
        return build_response(status=400,message="Unable To Retrieve Your Ad Logo At This Time.  Call Support!")    

def put_entity_logo(table,id):
    file = request.files["file"]
    res_rec = Database().fetch(table,id)
    if res_rec:
        file_path = os.path.join(app.config["PROFILE_PATH"], id, "logo")
        if not os.path.exists(file_path): os.mkdir(file_path)
        file_path = os.path.join(file_path, file.filename)
        file.save(file_path)
        Database().query("UPDATE profilefiles SET deleted=%s WHERE resourceid=%s and uploadtype='logo' and deleted is NULL",(get_sql_date_time(),id))
        new_rec = {
            "recordid": "",
            "resourceid": id,
            "uploadtype": "logo",
            "filename": file.filename,
        }
        if Database().insert("profilefiles",new_rec): return build_response(status=200,message="You Logo Was Successfully Uploaded")
    return build_response(status=400,message="Unable To Upload Your Logo At This Time.  Call Support!")

def generate_entity_logo(record):
    generate_logo(record["recordid"],record["companyname"])
    new_rec = {
        "recordid": "",
        "resourceid": record["recordid"],
        "uploadtype": "logo",
        "filename": "logo.png",
    }
    Database().insert("profilefiles",new_rec)

def get_entity_policies(id, ptype,pathonly=False):    
    uploadtype = "workpolicy" if ptype=="w" else "drugpolicy"    
    fil_rec, count = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype=%s AND deleted is NULL",(id,uploadtype))    
    if not count:        
        file_name = "noworkpolicy.pdf" if ptype == "w" else "nodrugpolicy.pdf"
        file_path = os.path.join(app.config["TEMPLATE_PATH"], "pdf", file_name)
    else:        
        file_name = fil_rec[0]["filename"]
        file_path = os.path.join(app.config["PROFILE_PATH"], id,"policies","drug" if uploadtype == "drugpolicy" else "work",fil_rec[0]["filename"])            
    if os.path.exists(file_path):  
        if not pathonly:      
            response = send_file(file_path, download_name=file_name)
            response.headers["x-filename"] = file_name
            response.headers["Access-Control-Expose-Headers"] = "x-filename"
            return response
        else:
            return file_path
    return {}

def put_entity_policies(table,id, ptype):    
    file = request.files["file"]
    res_rec = Database().fetch(table, id)
    if res_rec:
        file_path = os.path.join(app.config["PROFILE_PATH"],res_rec["recordid"],"policies","drug" if ptype == "drugpolicy" else "work")
        if not os.path.exists(file_path): os.makedirs(file_path, exist_ok=True)
        file_path = os.path.join(file_path, file.filename)
        file.save(file_path)
        Database().query("UPDATE profilefiles SET deleted=%s WHERE resourceid=%s and uploadtype=%s and deleted is NULL",(get_sql_date_time(),id,ptype))
        new_rec = {
            "recordid": "",
            "resourceid": id,
            "uploadtype": ptype,
            "filename": file.filename,
        }
        if Database().insert("profilefiles",new_rec): return build_response(status=200,message="You Policy Was Successfully Uploaded")
    return build_response(status=400,message="Unable To Upload Your Policy At This Time.  Call Support!")

def delete_entity_policies(table, id, ptype):
    res_rec = Database().fetch(table, (id))    
    if res_rec:
        if Database().query("UPDATE profilefiles SET deleted=%s WHERE resourceid=%s and uploadtype=%s and deleted is NULL",(get_sql_date_time(),id,ptype)):
            return build_response(status=200,message="You Policy Was Successfully Removed")
    return build_response(status=400,message="Unable To Remove Your Policy At This Time.  Call Support!")

def get_entity_record(id, tokenid, tokenkey):
    build_dct = get_entity_emails(id)
    build_dct.update(get_entity_setup(id))
    build_dct.update(get_entity_billing(id))
    build_dct.update(get_entity_payprofile(id, tokenid, tokenkey))
    return build_dct
#============================================================================================================================================

def get_timezone_from_user(id):
    default_tz = "America/New_York"
    usr_rec = Database().fetch("users", id)
    if usr_rec:
        if usr_rec["entity"] == "resellers":
            res_rec = Database().fetch("resellers", usr_rec["resourceid"])
            return res_rec["timezone"] if res_rec else default_tz
        if usr_rec["entity"] == "accounts":
            acc_rec = Database().fetch("accounts", usr_rec["resourceid"])
            return acc_rec["timezone"] if acc_rec else default_tz            
        if usr_rec["entity"] == "consultants":
            res_rec = get_reseller_from_consultant(usr_rec["resourceid"])
            return res_rec["timezone"] if res_rec else default_tz            
    return ""


def check_for_duplications(user, table, record, duplist):
    errors = []
    if table != "users":
        if user["usertype"] == "resellers":
            rec_key = "resellerid"
        if user["usertype"] == "accounts":
            rec_key = "accountid"
        if user["usertype"] == "consultants":
            rec_key = "consultantid"
    else:
        rec_key = "usertypeid"
    sql = f"SELECT * FROM {table} WHERE {rec_key}=%s AND deleted IS NULL"
    rec_set, rec_count = Database().query(sql, (user["usertypeid"]))
    for rec in rec_set:
        for field in duplist:
            field_to_compare = "".join(
                [char for char in record[field["id"]] if char.isalnum()]
            ).upper()
            record_field = "".join(
                [char for char in rec[field["id"]] if char.isalnum()]
            ).upper()
            if (field_to_compare == record_field) and (
                record["recordid"] != rec["recordid"]
            ):
                field_id = f'{table}_{field["id"]}'
                errors.append({"id": field_id, "text": field["text"]})
    return errors


def update_default_field(table, record, fieldlist):
    where_str = ""
    params = [record["recordid"]]
    for ndx, field in enumerate(fieldlist):
        where_str = (
            f"""{where_str} {field}=%s"""
            if ndx == 0
            else f"""{where_str} AND {field}=%s"""
        )
        params.append(record[field])
    if record["isdefault"] == "true":
        sql = (
            f"UPDATE {table} SET isdefault=0 WHERE recordid<>%s AND isdefault=1 AND deleted IS NULL"
            ""
        )
        if where_str:
            sql = f"{sql} AND {where_str}"
        res = Database().query(sql, tuple(params))
        return 1
    else:
        sql = (
            f"SELECT count(*) AS count FROM {table} WHERE recordid<>%s AND isdefault=1 AND deleted IS NULL"
            ""
        )
        if where_str:
            sql = f"{sql} AND {where_str}"
        res, count = Database().query(sql, tuple(params))
        return 1 if res and res[0]["count"] == 0 else 0


def generate_key(table, id):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = "".join(secrets.choice(alphabet) for _ in range(16))
    salt = get_random_bytes(16)
    rec = {
        "recordid": str(uuid4()),
        "tableid": id,
        "tablename": table,
        "tokenid": password.encode(),
        "tokenkey": salt,
    }
    Database().insert("tokens", rec)

def get_api_price(apitype,state=""):      
    api_set,api_cnt = Database().query("SELECT * FROM apiprofiles WHERE apitype=%s AND deleted is NULL",(apitype))        
    if api_cnt:        
        params = [api_set[0]["recordid"]]        
        sql = "SELECT * FROM apipricing WHERE apiprofileid=%s AND deleted IS NULL"        
        if state: 
            sql=f"{sql} AND state=%s"
            params.append(state)
            print(params)
        prc_set,prc_cnt = Database().query(sql,tuple(params))      
        pprint(prc_set[0])          
        if prc_cnt: return(prc_set[0])
    return False