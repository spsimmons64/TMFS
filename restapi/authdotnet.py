import logging,requests
from authorizenet import apicontractsv1
from authorizenet import apicontractsv1
from authorizenet.apicontrollers import *
from flask_restful import Resource, request, current_app as app
from pprint import pprint
from database import Database
from toolbox import *
from queries import *

class AuthDotNet(Resource):         
    def log_api_error(self,resourceid,errorcode,description):
        api_set,api_cnt = Database().query("SELECT * FROM apiprofiles WHERE apitype='AUTH' AND deleted IS NULL")
        if api_cnt:
            err_rec = {
                "recordid":"",
                "resourceid":resourceid,
                "apiprofileid":api_set[0]["recordid"],
                "errorcode":errorcode,
                "description":description
            }
            Database().insert('apierrors',err_rec)

    def convert_to_authnet_phone(self,phone):        
        numeric_string = ''.join(filter(str.isdigit, phone))    
        telephone = '-'.join([numeric_string[:3],numeric_string[3:6],numeric_string[6:]])         
        return telephone if len(telephone)==12 else "000-000-0000"

    def create_customer_profile(self, entity ,recordid, emailaddress):                
        merchant_auth = apicontractsv1.merchantAuthenticationType()
        merchant_auth.name = app.config["AUTH_API_LOGIN"]
        merchant_auth.transactionKey = app.config["AUTH_TRX_KEY"]        
        customer = apicontractsv1.customerProfileType()
        customer.merchantCustomerId = recordid
        customer.email = emailaddress[0:255]
        customer.description = f"TMFS Corporation {entity} Customer Profile"              
        createCustomerProfile = apicontractsv1.createCustomerProfileRequest()
        createCustomerProfile.merchantAuthentication = merchant_auth
        createCustomerProfile.profile = customer
        controller = createCustomerProfileController(createCustomerProfile)
        controller.execute()
        response = controller.getresponse()
        return response        
    
    def create_payment_profile(self,pay_rec,cvv,tokenid,tokenkey):
        merchant_auth = apicontractsv1.merchantAuthenticationType()
        merchant_auth.name = app.config["AUTH_API_LOGIN"]
        merchant_auth.transactionKey = app.config["AUTH_TRX_KEY"]        
        payment = apicontractsv1.paymentType()        
        if pay_rec["paymenttype"]=="cc":            
            creditCard = apicontractsv1.creditCardType()
            creditCard.cardNumber = decrypt_with_salt(pay_rec["ccnumber"],tokenid,tokenkey)            
            creditCard.expirationDate = f"{decrypt_with_salt(pay_rec['ccyear'],tokenid,tokenkey)}-{decrypt_with_salt(pay_rec['ccmonth'],tokenid,tokenkey)}"            
            creditCard.cardCode = cvv
            payment.creditCard = creditCard
            billTo = apicontractsv1.customerAddressType()
            billTo.firstName = decrypt_with_salt(pay_rec["firstname"],tokenid,tokenkey)[0:50]
            billTo.lastName = decrypt_with_salt(pay_rec["lastname"],tokenid,tokenkey)[0:50]
            billTo.address = decrypt_with_salt(pay_rec["address"],tokenid,tokenkey)[0:60]
            billTo.city = decrypt_with_salt(pay_rec["city"],tokenid,tokenkey)[0:40]
            billTo.state = decrypt_with_salt(pay_rec["state"],tokenid,tokenkey)
            billTo.zip = decrypt_with_salt(pay_rec["zipcode"],tokenid,tokenkey).replace("-","")[0:9]
            billTo.country = decrypt_with_salt(pay_rec["country"],tokenid,tokenkey)        
        else:
            bankAccount = apicontractsv1.bankAccountType()
            accountType = apicontractsv1.bankAccountTypeEnum
            match decrypt_with_salt(pay_rec["accounttype"],tokenid,tokenkey):
                case "bc": bankAccount.accountType = accountType.businessChecking
                case "pc": bankAccount.accountType = accountType.checking
                case "ps": bankAccount.accountType = accountType.savings
            bankAccount.routingNumber = decrypt_with_salt(pay_rec["bankrouting"],tokenid,tokenkey)[0:9]
            bankAccount.accountNumber = decrypt_with_salt(pay_rec["bankaccount"],tokenid,tokenkey)[0:17]
            bankAccount.nameOnAccount = decrypt_with_salt(pay_rec["nameonacct"],tokenid,tokenkey)[0:22]
            bankAccount.bankName = decrypt_with_salt(pay_rec["bankname"],tokenid,tokenkey)[0:50]            
            payment.bankAccount = bankAccount
        profile = apicontractsv1.customerPaymentProfileType()
        if pay_rec["paymenttype"]=="cc": profile.billTo = billTo
        profile.payment = payment
        createCustomerPaymentProfile = apicontractsv1.createCustomerPaymentProfileRequest()
        createCustomerPaymentProfile.merchantAuthentication = merchant_auth
        createCustomerPaymentProfile.paymentProfile = profile                        
        createCustomerPaymentProfile.customerProfileId = decrypt_with_salt(pay_rec["authcustprofileid"],tokenid,tokenkey)         
        controller = createCustomerPaymentProfileController(createCustomerPaymentProfile)
        controller.execute()
        response = controller.getresponse()
        return response
    
    def update_payment_profile(self,pay_rec,cvv,tokenid,tokenkey):
        merchant_auth = apicontractsv1.merchantAuthenticationType()
        merchant_auth.name = app.config["AUTH_API_LOGIN"]
        merchant_auth.transactionKey = app.config["AUTH_TRX_KEY"]       
        payment = apicontractsv1.paymentType()
        if pay_rec["paymenttype"]=="cc":            
            creditCard = apicontractsv1.creditCardType()
            creditCard.cardNumber = decrypt_with_salt(pay_rec["ccnumber"],tokenid,tokenkey)
            creditCard.expirationDate = f"{decrypt_with_salt(pay_rec['ccyear'],tokenid,tokenkey)}-{decrypt_with_salt(pay_rec['ccmonth'],tokenid,tokenkey)}"            
            creditCard.cardCode = cvv
            payment.creditCard = creditCard
            billTo = apicontractsv1.customerAddressType()
            billTo.firstName = decrypt_with_salt(pay_rec["firstname"],tokenid,tokenkey)[0:50]
            billTo.lastName = decrypt_with_salt(pay_rec["lastname"],tokenid,tokenkey)[0:50]
            billTo.address = decrypt_with_salt(pay_rec["address"],tokenid,tokenkey)[0:60]
            billTo.city = decrypt_with_salt(pay_rec["city"],tokenid,tokenkey)[0:40]
            billTo.state = decrypt_with_salt(pay_rec["state"],tokenid,tokenkey)
            billTo.zip = decrypt_with_salt(pay_rec["zipcode"],tokenid,tokenkey).replace("-","")[0:9]
            billTo.country = decrypt_with_salt(pay_rec["country"],tokenid,tokenkey)        
        else:
            bankAccount = apicontractsv1.bankAccountType()
            accountType = apicontractsv1.bankAccountTypeEnum
            match decrypt_with_salt(pay_rec["accounttype"],tokenid,tokenkey):
                case "bc": bankAccount.accountType = accountType.businessChecking
                case "pc": bankAccount.accountType = accountType.checking
                case "ps": bankAccount.accountType = accountType.savings
            bankAccount.routingNumber = decrypt_with_salt(pay_rec["bankrouting"],tokenid,tokenkey)[0:9]
            bankAccount.accountNumber = decrypt_with_salt(pay_rec["bankaccount"],tokenid,tokenkey)[0:17]
            bankAccount.nameOnAccount = decrypt_with_salt(pay_rec["nameonacct"],tokenid,tokenkey)[0:22]
            bankAccount.bankName = decrypt_with_salt(pay_rec["bankname"],tokenid,tokenkey)[0:50]            
            payment.bankAccount = bankAccount
        profile = apicontractsv1.customerPaymentProfileExType()        
        profile.customerPaymentProfileId = decrypt_with_salt(pay_rec["authpayprofileid"],tokenid,tokenkey)
        if pay_rec["paymenttype"]=="cc": profile.billTo = billTo
        profile.payment = payment
        updateCustomerPaymentProfile = apicontractsv1.updateCustomerPaymentProfileRequest()
        updateCustomerPaymentProfile.merchantAuthentication = merchant_auth
        updateCustomerPaymentProfile.paymentProfile = profile        
        updateCustomerPaymentProfile.customerProfileId = decrypt_with_salt(pay_rec["authcustprofileid"],tokenid,tokenkey) 
        updateCustomerPaymentProfile.validationMode = apicontractsv1.validationModeEnum.liveMode
        controller = updateCustomerPaymentProfileController(updateCustomerPaymentProfile)        
        controller.execute()
        response = controller.getresponse()
        return response
                
    def create_payment_transaction(self,customerid,paymentid,amount):        
        merchant_auth = apicontractsv1.merchantAuthenticationType()
        merchant_auth.name = app.config["AUTH_API_LOGIN"]
        merchant_auth.transactionKey = app.config["AUTH_TRX_KEY"]        
        profileToCharge = apicontractsv1.customerProfilePaymentType()
        profileToCharge.customerProfileId = customerid
        profileToCharge.paymentProfile = apicontractsv1.paymentProfile()        
        profileToCharge.paymentProfile.paymentProfileId = paymentid
        transactionrequest = apicontractsv1.transactionRequestType()
        transactionrequest.transactionType = "authCaptureTransaction"
        transactionrequest.amount = amount
        transactionrequest.profile = profileToCharge
        createtransactionrequest = apicontractsv1.createTransactionRequest()
        createtransactionrequest.merchantAuthentication = merchant_auth
        createtransactionrequest.refId = "MerchantID-0001"
        createtransactionrequest.transactionRequest = transactionrequest
        createtransactioncontroller = createTransactionController(createtransactionrequest)
        createtransactioncontroller.execute()
        response = createtransactioncontroller.getresponse()
        return response