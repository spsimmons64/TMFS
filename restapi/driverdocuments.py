import copy,os
from flask_restful import Resource, request, current_app as app
from flask import send_file,after_this_request
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *
from drivers import Drivers
from emailqueue import EmailQueue

from templates.pdf import outputpdf
from templates.pdf import driverslicense
from templates.pdf import medicalcard
from templates.pdf import driverapplication
from templates.pdf import document_20
from templates.pdf import document_22
from templates.pdf import document_39
from templates.pdf import document_33
from templates.pdf import document_41


class DriverDocuments(Resource):     
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()        
        self.params = []

    def __update_driver_dates(self,driverid,typecode,licenseid="",filedate=None):                
        dat_rec = Drivers().get_driver_dates(driverid,False)        
        if dat_rec:
            new_date = filedate if filedate else get_sql_date_time()
            match typecode:                
                case "11": return Drivers().put_driver_date(driverid,"new",new_date)            
                case "22":                     
                    lic_rec = Database().fetch("driverlicenses",licenseid)
                    if lic_rec:                        
                        lic_rec["inquirydate"] = filedate
                        if Database().update("driverlicenses",lic_rec): return True                            
                    return(False)      
                case "25":                     
                    lic_rec = Database().fetch("driverlicenses",licenseid)
                    if lic_rec:                        
                        lic_rec["mvrdate"] = filedate
                        if Database().update("driverlicenses",lic_rec): return True                            
                    return(False)      
                case _: return True
        return False
    
    def __update_document_metadata(self,docid):                
        met_rec = Database().prime("documentmeta")                
        if met_rec:
            met_rec["driverdocumentid"] = docid
            met_rec.update(self.payload)
            if self.payload["typecode"]  in ("20","33"):                
                return Database().insert("documentmeta",met_rec)
            else: 
                return True
        return False

    def __get_document_type(self,typecode):
        typ_set,typ_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode=%s AND deleted IS NULL",(typecode))
        return typ_set[0] if typ_cnt else False
    
    def __process_files(self,record,filelist):
        typ_rec = self.__get_document_type(record["typecode"])
        complete=False      
        file_ext = f'_{format_date_time(get_sql_date_time(),"human_date","_")}.pdf'  
        doc_rec = {
            "filename": f'{record["description"]}{file_ext}',            
            "filedate": record["filedate"],
            "driverslicenseid": record["licenseid"],
            "uploaded": "Y"
        }
        new_rec = Drivers().new_driver_document(record["driverid"],record["typecode"],doc_rec)
        if new_rec:                    
            if record["typecode"] == "16":                     
                images = []
                images.extend(file_to_image(filelist[0]))
                images.extend(file_to_image(filelist[1]))
            elif record["typecode"] == "1":  
                images = []
                for file in filelist: images.extend(file_to_image(file))
            else:
                images = file_to_image(filelist[0])                              
            outputpdf.generate_pdf_file(images,record["driverid"],f'{new_rec["recordid"]}.pdf',typ_rec["category"])             
            complete = new_rec            
        return complete
    
    def upload_driver_document(self):
        file_list = request.files.getlist("files[]")          
        typ_rec = self.__get_document_type(self.payload["typecode"])                
        file_rec = {
            "driverid": self.payload["driverid"],
            "licenseid": self.payload["licenseid"] if "licenseid" in self.payload else "",
            "typecode": typ_rec["typecode"],
            "filedate": self.payload["filedate"]  if "filedate" in self.payload else get_sql_date_time(),
            "description": self.payload["description"] if "description" in self.payload else typ_rec["category"]
        }   
        doc_rec = self.__process_files(file_rec,file_list)  
        if self.payload["typecode"] == "16":
            lic_rec = Drivers().upload_license(self.payload["driverid"],self.payload)
            if lic_rec:
                doc_rec["driverlicenseid"] = lic_rec["recordid"]
                if(doc_rec and
                   self.__update_driver_dates(self.payload["driverid"],typ_rec["typecode"],licenseid=file_rec["licenseid"],filedate=file_rec["filedate"]) and                 
                   self.__update_document_metadata(doc_rec["recordid"])):
                    return Drivers().fetch_formatted_driver(driverid=self.payload["driverid"],msg="Document Has Been Uploaded")
        return build_response(status=400,message="Unable To Create Document! Contact Support!")
    
    def upload_application_document(self):                
        file_list = request.files.getlist("files[]")  
        typ_rec = self.__get_document_type(self.payload["typecode"])                
        sql = "DELETE FROM driverdocuments WHERE driverid=%s AND documenttypeid=%s"        
        if Database().query(sql,(self.payload["driverid"],typ_rec["recordid"])):
            file_rec = {
                "driverid": self.payload["driverid"],
                "licenseid": self.payload["licenseid"] if "licenseid" in self.payload else "",
                "typecode": typ_rec["typecode"],                
                "filedate": self.payload["filedate"]  if "filedate" in self.payload else get_sql_date_time(),
                "description": typ_rec["category"]
            }                
            if(self.__process_files(file_rec,file_list) and
               self.__update_driver_dates(self.payload["driverid"],typ_rec["typecode"])):                                        
                    return build_response(status=200,data=set_record_prefix("doc",Drivers().get_driver_documents(self.payload["driverid"])))
        return build_response(status=400,message="Unable To Upload Your Document At This Time. Contact Support.")

    def create_driver_document(self):
        doc_rec = Database().prime("driverdocuments")
        typ_rec = self.__get_document_type(self.payload["typecode"])        
        if doc_rec and typ_rec:
            file_ext = f'_{format_date_time(get_sql_date_time(),"human_date","_")}.pdf'  
            doc_rec["driverid"] = self.payload["driverid"]
            doc_rec["documenttypeid"] = typ_rec["recordid"]
            doc_rec["userid"] = self.payload["userid"]
            doc_rec["filename"] = f'{typ_rec["category"]}{file_ext}'
            doc_rec["filedate"] = get_sql_date_time()                        
            if "licenseid" in self.payload:
                doc_rec["driverslicenseid"] = self.payload["licenseid"]
            if "position" in self.payload:
                doc_rec["accountposition"] = self.payload["position"]
            if "accountsignatureid" in self.payload:
                doc_rec["accountsignatureid"] = self.payload["esignatureid"]
            if "accountsignaturedate" in self.payload:                    
                doc_rec["accountsignaturedate"] = self.payload["completedate"]
            new_rec = Database().insert("driverdocuments",doc_rec) 
            if new_rec and self.__update_document_metadata(new_rec["recordid"]):
                return Drivers().fetch_formatted_driver(driverid=self.payload["driverid"],msg="Document Has Been Created")
        return build_response(status=400,message="Unable To Create Document! Contact Support!")

    def fetch_document(self):                      
        file = ""
        doc_rec = Database().fetch("driverdocuments",self.payload["id"])                
        typ_rec = Database().fetch("documenttypes",doc_rec["documenttypeid"])                
        if doc_rec and typ_rec:                        
            if doc_rec["uploaded"] == "Y":                
                file = os.path.join(app.config["PROFILE_PATH"],doc_rec["driverid"],f'{doc_rec["recordid"]}.pdf')
            else:                                          
                if typ_rec["typecode"] == "11": file = driverapplication.generate_application_pdf(self.payload["id"])
                if typ_rec["typecode"] == "20": file = document_20.generate_report(doc_rec["driverslicenseid"],doc_rec["recordid"])                
                if typ_rec["typecode"] == "22": file = document_22.generate_report(doc_rec["driverslicenseid"],doc_rec["recordid"])                
                if typ_rec["typecode"] == "33": file = document_33.generate_report(doc_rec["recordid"])                    
                if typ_rec["typecode"] == "39": file = document_39.generate_report(doc_rec["recordid"])                    
                if typ_rec["typecode"] == "41": file = document_41.generate_report(self.payload["id"])                                                        
            if file:                
                @after_this_request
                def delete_file(resp): 
                    if doc_rec["uploaded"] != "Y": os.unlink(file)
                    return(resp)
                return send_file(file,mimetype='application/pdf')            
        return build_response(status=400,message="Unable To Retreive This Document At This Time. Call Support.")
            
    def get(self):        
        return(self.fetch_document())
            
    def post(self):                  
        if "application" in self.payload:            
            return self.upload_application_document()
        else:
            if self.payload["action"] == "upload": return self.upload_driver_document()
            if self.payload["action"] == "create": return self.create_driver_document()