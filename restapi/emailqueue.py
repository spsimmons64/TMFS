import copy
from flask_restful import Resource, request, current_app as app
from flask import send_file,after_this_request
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class EmailQueue(Resource):     
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()        
        self.params = []

    def __format_email_address(self,resource,resourceid,emailtype):
        sql = "SELECT * FROM emails WHERE resourceid=%s AND emailtype=%s AND deleted IS NULL"
        eml_set,eml_cnt = Database().query(sql,(resourceid,emailtype))
        if eml_cnt:
            email_list = eml_set[0]["emailaddress"].split(",")
            if len(email_list)==1: 
                return(f'{resource}<{email_list[0]}>')
            else:
                new_list = []
                for address in email_list: new_list.append(address["emailaddress"])
                return ";".join(new_list)
        return False
    
    def addQueue(self,emailtype,resourceid,emailto="",emailsubject="",attachments=[]):
        sender = ""
        recipient = "" if not emailto else emailto
        cc = ""
        bcc = ""
        subject = "" if not emailsubject else emailsubject
        entity = ""
        queue_record = {}        
        mas_set,mas_cnt = Database().query("SELECT * FROM resellers WHERE ismaster=1 AND deleted IS NULL")
        if mas_cnt:
            mas_rec = mas_set[0]            
            match emailtype:
                case "drivers_license":                     
                    drv_rec = Database().fetch("drivers",resourceid)                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                                                
                        sender = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],'support')      
                        cc = sender   
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")    
                        subject = f'License Forfeiture Documents Uploaded By {drv_rec["firstname"]} {drv_rec["lastname"]}'  
                        entity = "driver"    

                case "medical_certificate":                                         
                    drv_rec = Database().fetch("drivers",resourceid)                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                                                
                        sender = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")      
                        cc = sender                          
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")    
                        subject = f'Copy Of Driver\'s License Uploaded By {drv_rec["firstname"]} {drv_rec["lastname"]}'  
                        entity = "driver"  

                case "forfeiture_documents":                     
                    drv_rec = Database().fetch("drivers",resourceid)                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                                                
                        sender = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")      
                        cc = sender      
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")    
                        subject = f'Copy Of Driver\'s Medical Certificate Uploaded By {drv_rec["firstname"]} {drv_rec["lastname"]}'  
                        entity = "driver"        

                case "account_application":                                         
                    drv_rec = Database().fetch("drivers",resourceid)                           
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                                                
                        sender = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")      
                        cc = sender
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                            
                        recipient = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")    
                        subject = f'Copy Of Driver\'s License Uploaded By {drv_rec["firstname"]} {drv_rec["lastname"]}'  
                        entity = "driver"  

                case "driver_application":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                                                           
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} Has Requested Corrections To Your Application'  
                        entity = "driver"     

                case "review_application":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                                                           
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} Has Requested Corrections To Your Application'  
                        entity = "driver"        

                case "discard_application":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                                                            
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'Your Employment Application With {acc_rec["companyname"]}'  
                        entity = "driver"        

                case "policies":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                                                            
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} General/Alcohol & Drug Worplace Policies'  
                        entity = "driver"     

                case "request_license":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                              
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} Requests A Copy Of Your Driver\'s License'                          
                        entity = "driver"     

                case "request_medcard":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                              
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} Requests A Copy Of Your Medical Certificate'                          
                        entity = "driver"   

                case "request_employment":                    
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                              
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                              
                        if mas_rec["recordid"] != res_rec["recordid"]:                        
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        recipient = self.__format_email_address(f'{drv_rec["firstname"]} {drv_rec["lastname"]}',drv_rec["recordid"],"driver")                        
                        subject = f'{acc_rec["companyname"]} Requests Corrections To Your Employment History'                          
                        entity = "driver"     

                case "road_test":                         
                    drv_rec = Database().fetch("drivers",resourceid)                                   
                    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
                    res_rec = Database().fetch("resellers",acc_rec["resellerid"])                                    
                    if drv_rec and acc_rec and res_rec:                           
                        sender = self.__format_email_address(acc_rec["companyname"],acc_rec["recordid"],"support")                                                      
                        cc = self.__format_email_address(res_rec["companyname"],res_rec["recordid"],"support")                                                      
                        if mas_rec["recordid"] != res_rec["recordid"]:                                                    
                            bcc = self.__format_email_address(mas_rec["companyname"],mas_rec["recordid"])                              
                        entity = "driver"     

        queue_record["reciptienttype"] = entity
        queue_record["resourceid"] = resourceid
        queue_record["emailtype"] = emailtype
        queue_record["sender"] = sender
        queue_record["recipient"] = recipient
        queue_record["cc"] = cc
        queue_record["bcc"] = bcc
        queue_record["subject"] = subject
        queue_record["attachments"] = ",".join(attachments)        
        emq_rec = Database().prime("emailqueue")
        if emq_rec:
            emq_rec.update(queue_record)
            return Database().insert("emailqueue",emq_rec)
        return False
    
    def post(self):
        emailtype = ""
        formatted_email = f'{self.payload["recipname"]}<{self.payload["emailaddress"]}>'
        match self.payload["typecode"]:            
            case "33": emailtype = "road_test"
        if self.addQueue(emailtype=emailtype,resourceid=self.payload["driverid"],emailto=formatted_email,emailsubject=self.payload["subject"]):
            return build_response(status=200,message="The Email Request Has Been Sent.")
        else:
            return build_response(status=400,message="Your Email Request Could Not Be Sent. Contact Support.")