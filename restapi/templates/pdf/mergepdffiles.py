import os
import PyPDF2
from io import BytesIO
from fpdf import FPDF,Align
from pdf2image import convert_from_bytes
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app
from staticdata import states,countries,yes_no_na,classtypes

class PDF(FPDF):
    def __init__(self,reseller,account,driver,application,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_auto_page_break(auto=True,margin=1.65)
        self.set_font("Helvetica",size=12)
        self.set_left_margin(.25)        
        self.reseller = reseller
        self.account = account        
        self.driver = driver
        self.application = application
        self.set_title = f"{self.account['companyname']} Driver Application"
        self.set_author = "Arrowleaf Technologies, LLC"
        self.set_subject = f"{self.account['companyname']} Driver Application for {self.driver['firstname']} {self.driver['lastname']}"

    def header(self):   
        self.set_text_color(51,51,51)
        self.set_font("Helvetica",style="B",size=12)
        logo =get_entity_logo(self.account["recordid"],maxWidth=None,maxHeight=30,stream=True,encode=False)        
        self.image(logo,.25,.45)
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",(self.account["recordid"]))        
        self.set_xy(.25,.5)
        self.cell(w=8,h=.2,text=self.account["companyname"].strip(),align="R",ln=1)
        self.set_font("Helvetica",size=12)        
        if eml_cnt:
            self.set_x(.25)
            self.cell(w=8,h=.2,text=eml_set[0]["emailaddress"].strip(),align="R",ln=1)
        self.set_x(.25)
        self.cell(w=8,h=.2,text=self.account["telephone"].strip(),align="R",ln=1)
        self.set_xy(.25,1.3)

    def footer(self):
        driver_ssn = decrypt_with_salt(self.driver["socialsecurity"],self.reseller["tokenid"],self.reseller["tokenkey"])    
        driver_info = f"{self.driver['firstname']} {self.driver['lastname']} Whose Social Security Number is *****{driver_ssn[-4:]}"
        self.set_text_color(51,51,51)
        self.line(.25,9.75,8.25,9.75)
        self.set_xy(.25,9.8)
        self.set_fill_color(221,221,221)   
        self.set_font("Helvetica",size=10)
        self.cell(w=8,h=.2,text=f"This Document Pertains To Driver {driver_info}",align="C",fill=1,ln=1)
        self.set_xy(.25,10.1)
        self.set_font("Helvetica",size=8)
        self.cell(w=4.125,h=.25,text=f"{chr(169)}2024 {self.reseller['siteroute']}.{self.reseller['sitedomain']} Powered By {self.reseller['companyname']}.",ln=1)
        self.set_x(.25)
        self.cell(w=4,text="Page 1 Of 1")
        self.set_xy(4.0,10.15)
        self.multi_cell(w=4.125,text=f"{self.reseller['companyname']} and associated affiliates do not guarantee the accuracy or "\
                                        "validity of the information on this document and assumes no responsibility for the use" \
                                        "or misuse of this document and/or any information contained therein.")
        
def print_image(pdf,image,y,maxwidth,maxheight):
    image_data=  BytesIO(image.read())    
    image_stream = get_image(image_data,maxwidth,maxheight,encode=False)
    pdf.image(name=image_stream,x=Align.C,y=y)

def generate_merged_pdf(driverid,pdffile,filename):         
    drv_rec = Database().fetch("drivers",driverid)    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False    
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False
    app_set,app_cnt = Database().query("SELECT * FROM applications WHERE driverid=%s",drv_rec["recordid"])
    if not app_cnt: return False
    app_rec = app_set[0]
    pdf  = PDF(res_rec,acc_rec,drv_rec,app_rec)    
    pdf.set_draw_color(51,51,51)    
    pdf.add_page()
    page_bytes = pdffile.read()
    pages = convert_from_bytes(page_bytes)
    for page in pages:
        image = Image.open(page)        
        print_image(pdf,image,1.5,8,10)
    output_path = os.path.join(app.config["PROFILE_PATH"],drv_rec["recordid"])
    if not os.path.exists(output_path): os.makedirs(output_path)
    output_path = os.path.join(output_path,f"{filename}.pdf")
    pdf.output(output_path)    
