import os
from io import BytesIO
from fpdf import FPDF,Align
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app

class PDF(FPDF):
    def __init__(self,reseller,account,driver,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_auto_page_break(auto=True,margin=1)
        self.set_font("Helvetica",size=12)
        self.reseller = reseller
        self.account = account
        self.driver = driver

    def header(self):
        self.set_font("Helvetica",style="B",size=12)
        logo =get_entity_logo(self.account["recordid"],maxWidth=250,maxHeight=None,stream=True,encode=False)        
        self.image(logo,.250,.45)
        eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",self.account["recordid"])
        self.set_xy(.5,.5)
        self.cell(w=7.5,h=.2,text=self.account["companyname"].strip(),align="R",ln=1)
        self.set_font("Helvetica",size=12)
        if eml_cnt:
            self.set_x(.5)
            self.cell(w=7.5,h=.2,text=eml_set[0]["emailaddress"].strip(),align="R",ln=1)
        self.set_x(.5)
        self.cell(w=7.5,h=.2,text=self.account["telephone"].strip(),align="R",ln=1)
        self.line(.5,1.25,8,1.25)
        self.set_xy(.5,1.5)
        self.set_font("Helvetica",size=14,style="B")
        self.cell(w=7.5,h=.25,text="COPY OF DRIVER'S LICENSE",align="C")

def print_image(pdf,image,y,maxwidth,maxheight):
    image_data=  BytesIO(image.read())    
    image_stream = get_image(image_data,maxwidth,maxheight,encode=False)
    pdf.image(name=image_stream,x=Align.C,y=y)


def generate_dl_pdf(file_front,file_back,driverid,filename):
    drv_rec = Database().fetch("drivers",driverid)    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False
    pdf  = PDF(res_rec,acc_rec,drv_rec)    
    pdf.add_page()       
    print_image(pdf,file_front,2,None,220)
    print_image(pdf,file_back,5.5,None,220)
    driver_ssn = decrypt_with_salt(drv_rec["socialsecurity"],res_rec["tokenid"],res_rec["tokenkey"])    
    driver_info = f"{drv_rec['firstname']} {drv_rec['lastname']} Whose Social Security Number is *****{driver_ssn[-4:]}"
    pdf.line(.5,9.25,8,9.25)
    pdf.set_xy(.5,9.28)
    pdf.set_fill_color(221,221,221)   
    pdf.set_font("Helvetica",size=10)
    pdf.cell(w=7.5,h=.2,text=f"This Document Pertains To Driver {driver_info}",align="C",fill=1,ln=1)
    pdf.set_xy(.5,9.52)
    pdf.set_font("Helvetica",size=8)
    pdf.cell(w=3.75,h=.25,text=f"{chr(169)}2024 {res_rec['siteroute']}.{res_rec['sitedomain']} Powered By {res_rec['companyname']}.",ln=1)
    pdf.set_x(.5)
    pdf.cell(w=3.75,text="Page 1 Of 1")
    pdf.set_xy(4.0,9.54)
    pdf.multi_cell(w=3.75,text=f"{res_rec['companyname']} and associated affiliates do not guarantee the accuracy or "\
                                     "validity of the information on this document and assumes no responsibility for the use" \
                                     "or misuse of this document and/or any information contained therein.")
    output_path = os.path.join(app.config["PROFILE_PATH"],drv_rec["recordid"])
    if not os.path.exists(output_path): os.makedirs(output_path)
    output_path = os.path.join(output_path,f"{filename}.pdf")
    pdf.output(output_path)    
    return 