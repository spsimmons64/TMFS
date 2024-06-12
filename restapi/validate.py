import copy
from decimal import Decimal
from api_response import build_response
from database import Database
from toolbox import *
from queries import *
from templates.new_account import send_message as new_account
from authdotnet import AuthDotNet

def check_missing(record,req_list):
    errors = []
    for err in req_list:
        if err["id"] not in record:
            errors.append({"id": f"{err['id']}", "text": err["text"]})
        else:
            if record[err["id"]] == "" or record[err["id"]]=="$0.00" or record[err["id"]]=="0.00" or record[err["id"]] == "0":            
                errors.append({"id": f"{err['id']}", "text": err["text"]})
    return errors
#======================================================================================================================================================
def validate_login(record):
    req_list = [
        {"id":"emailaddress","text":"Email Address Is Required For Log In."},
        {"id":"password","text":"The Password Is Required For Log In"},
    ]
    errors = check_missing(record,req_list)
    return errors if len(errors) else None
#======================================================================================================================================================
def validate_login_reset(record):
    req_list = [
        {"id":"emailaddress","text":"Email Address Is Required For Password Reset."},        
    ]
    errors = check_missing(record,req_list)
    return errors if len(errors) else None
#======================================================================================================================================================
def validate_login_forgot(record):
    errors = []
    req_list = [
        {"id":"npassword","text":"The New Password Is Required"},        
        {"id":"cpassword","text":"The Confirmation Password Is Required"},        
    ]
    errors = check_missing(record,req_list)
    if len(errors): return errors
    if record["cpassword"] != record["npassword"]:
        errors.append({
            {"id":"npassword","text":"The New Password And Confirmation Do Not Match"},        
            {"id":"cpassword","text":"The New Password And Confirmation Do Not Match"},        
        })
#======================================================================================================================================================        