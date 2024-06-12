def validate_new_reseller(record):
    req_list = [
        {"id":"res_companyname","text":"The Reseller Company Name Is Required"},
        {"id":"res_contactlastname","text":"The Contact Last Name Is Required"},
        {"id":"res_contactfirstname","text":"The Contact First Name Is Required"},
        {"id":"res_contactfirstname","text":"The Contact First Name Is Required"},
        {"id":"res_telephone","text":"The Reseller Telephone Is Required"},
        {"id":"res_siteroute","text":"The Reseller Service URL Is Required"},
        {"id":"eml_emailcontact","text":"The Contact Email Is Required"},
        {"id":"bil_setupfee","text":"The Setup Fee Is Required"}        
    ]  
    errors = check_missing(record,req_list)   
    if errors: return build_response(status=400,message="Please Address The Errors On Your Submission",errors=errors)
    return False
    
def validate_reseller(record):
    req_list = [
        {"id":"res_companyname","text":"The Reseller Company Name Is Required"},
        {"id":"res_contactlastname","text":"The Contact Last Name Is Required"},
        {"id":"res_contactfirstname","text":"The Contact First Name Is Required"},
        {"id":"res_address1","text":"The Street Address Is Required"},
        {"id":"res_city","text":"The Reseller City Is Required"},
        {"id":"res_state","text":"The Reseller State Is Required"},
        {"id":"res_zipcode","text":"The Reseller Zip Code Is Required"},
        {"id":"res_telephone","text":"The Reseller Telephone Is Required"},
        {"id":"res_siteroute","text":"The Reseller Service URL Is Required"},
        {"id":"eml_emailcontact","text":"The Contact Email Is Required"},
        {"id":"eml_emailgeneral","text":"The General Email Is Required"},
        {"id":"eml_emailbilling","text":"The Billing Email Is Required"},
        {"id":"eml_emailsupport","text":"The Support Email Is Required"},
    ]
    if record["pay_paymenttype"] == "cc":
        req_list.append({"id":"pay_lastname","text":"The Card Holder Last Name Is Required"})
        req_list.append({"id":"pay_firstname","text":"The Card Holder First Name Is Required"})
        req_list.append({"id":"pay_address","text":"The Street Address Is Required"})
        req_list.append({"id":"pay_city","text":"The City Is Required"})
        req_list.append({"id":"pay_state","text":"The State Is Required"})
        req_list.append({"id":"pay_zipcode","text":"The Zip Code Last Name Is Required"})
        req_list.append({"id":"pay_ccnumber","text":"The Credit Card Number Is Required"})
        req_list.append({"id":"pay_ccmonth","text":"The Credit Card Number Is Required"})
        req_list.append({"id":"pay_ccyear","text":"The Credit Card Number Is Required"})
    else:
        req_list.append({"id":"pay_bankname","text":"The Card Holder Last Name Is Required"})
        req_list.append({"id":"pay_bankaccount","text":"The Card Holder First Name Is Required"})
        req_list.append({"id":"pay_nameonacct","text":"The Street Address Is Required"})
        req_list.append({"id":"pay_bankrouting","text":"The City Is Required"})
        req_list.append({"id":"pay_accounttype","text":"The State Is Required"})
        req_list.append({"id":"pay_checknumber","text":"The Zip Code Last Name Is Required"})
    errors = check_missing(record,req_list)   
    if errors: return build_response(status=400,message="Please Address The Errors On Your Submission",errors=errors)
    return []

