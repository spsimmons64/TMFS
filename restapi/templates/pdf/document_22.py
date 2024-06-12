
import os
from io import BytesIO
from fpdf import FPDF,Align,HTMLMixin
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app
from drivers import Drivers
from users import Users
from citadel import Citadel

class PDF(FPDF,HTMLMixin):
    def __init__(self,reseller,account,driver,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_auto_page_break(auto=True,margin=1)
        self.set_font("Helvetica",size=12)
        self.set_margin(.5)
        self.reseller = reseller
        self.account = account
        self.driver = driver
        self.p_line_height = 10

    def header(self):
        self.set_font("Helvetica",style="B",size=12)
        logo =get_entity_logo(self.account["recordid"],maxWidth=250,maxHeight=None,stream=True,encode=False)        
        self.image(logo,.50,.45)
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

    def footer(self):
        driver_ssn = Citadel().decrypt(self.driver["socialsecurity"])
        driver_info = f"{self.driver['firstname']} {self.driver['lastname']} Whose Social Security Number is *****{driver_ssn[-4:]}"
        self.set_text_color(51,51,51)
        self.line(.5,9.75,8.25,9.75)
        self.set_xy(.5,9.8)
        self.set_fill_color(221,221,221)   
        self.set_font("Helvetica",size=10)
        self.cell(w=7.75,h=.2,text=f"This Document Pertains To Driver {driver_info}",align="C",fill=1,ln=1)
        self.set_xy(.5,10.1)
        self.set_font("Helvetica",size=8)
        self.cell(w=4.125,h=.25,text=f"{chr(169)}2024 {self.reseller['siteroute']}.{self.reseller['sitedomain']} Powered By {self.reseller['companyname']}.",ln=1)
        self.set_x(.5)
        self.cell(w=4,text="Page 1 Of 1")
        self.set_xy(4.0,10.15)
        self.multi_cell(w=4.125,text=f"{self.reseller['companyname']} and associated affiliates do not guarantee the accuracy or "\
                                        "validity of the information on this document and assumes no responsibility for the use" \
                                        "or misuse of this document and/or any information contained therein.")

def print_image(pdf,image,y,maxwidth,maxheight):
    image_data=  BytesIO(image.read())    
    image_stream = get_image(image_data,maxwidth,maxheight,encode=False)
    pdf.image(name=image_stream,x=Align.C,y=y)

def print_signature(pdf,document):
    esig_rec = Users().get_user_esignature(document["userid"])                
    usr_rec = Database().fetch("users",document["userid"])    
    img = Image.open(BytesIO(base64.b64decode(esig_rec["esignature"])))
    image_array = BytesIO()
    img.save(image_array,format="PNG")           
    new_image = get_image(image_array,250,None,False)         
    pdf.image(name=new_image,x=.55)    
    pdf.set_xy(6,pdf.get_y()-.15)    
    pdf.cell(w=1,text=format_date_time(document["accountsignaturedate"],"human_date"))    
    pdf.ln(.2)        
    pdf.set_font(size=8)                    
    pdf.cell(w=5.25,h=.2,text="Signature Of Individual Making The Inquiry",border="T")        
    pdf.cell(w=.25)
    pdf.cell(w=2,h=.2,text="Date Signed",border="T")    
    pdf.set_font(size=12)                    
    pdf.ln(.5)    
    pdf.cell(w=5.25,text=esig_rec["signaturename"])
    pdf.cell(w=.25)
    pdf.cell(w=2,text=usr_rec["position"])
    pdf.ln(.2)    
    pdf.set_font(size=8)                    
    pdf.cell(w=5.25,h=.2,text="Printed Name Of Individual Making The Inquiry",border="T")        
    pdf.cell(w=.25)
    pdf.cell(w=2,h=.2,text="Position",border="T")    
    pdf.set_font(size=12)                    
    
def generate_report(licenseid,documentid):    
    doc_rec = Database().fetch("driverdocuments",documentid)
    if not doc_rec: return False
    lic_rec = Database().fetch("driverlicenses",licenseid)
    if not lic_rec: return False        
    drv_rec = Database().fetch("drivers",lic_rec["driverid"])    
    if not drv_rec: return False    
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False    
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False    
    pdf  = PDF(res_rec,acc_rec,drv_rec)        
    pdf.add_page()       
    big_text = """DEPARTMENT OF TRANSPORTATION MOTOR CARRIER SAFETY PROGRAM INQUIRY TO STATE AGENCY FOR DRIVER'S RECORD"""
    pdf.multi_cell(w=7.5,h=.2,text=big_text,align="C",ln=1)
    pdf.ln(.25)
    pdf.cell(w=1.28,h=.15,text="Driver Name:",align="R")
    pdf.cell(w=3.75,h=.15,text=f'{drv_rec["firstname"]} {drv_rec["lastname"]}',border="B")    
    pdf.cell(w=.15)
    pdf.cell(w=.85,h=.15,text="Birth Date:",align="R")
    pdf.cell(w=1.47,h=.15,text=format_date_time(drv_rec["birthdate"],"human_date"),border="B")
    pdf.ln(.5)
    pdf.cell(w=1.28,h=.15,text="License Number:",align="R")
    pdf.cell(w=3.75,h=.15,text=f'{lic_rec["licensenumber"]}',border="B")    
    pdf.cell(w=.15)
    pdf.cell(w=.85,h=.15,text="SSN:",align="R")
    pdf.cell(w=1.47,h=.15,text=Citadel().decrypt(drv_rec["socialsecurity"]),border="B")
    pdf.ln(.5)
    pdf.set_font(style="B")
    pdf.cell(w=8,text="To Whom It May Concern:")
    pdf.set_font(style="")
    pdf.ln(.25)
    big_text = ("""The above listed individual has made application with us for employment as a driver. """,
                """The applicant has indicated the above numbered operator's license or permit has been issued by your State """,
                """to the applicant and that it is in good standing.""")
    pdf.multi_cell(w=7.5,text=" ".join([s for s in big_text]))
    pdf.ln(.25)        
    big_text = ("""In accordance with Section 391.23(a)(1) and (b) of the Federal Motor Carrier Safety Regulations, """,
                """we are required to make an inquiry into the driving record during the preceding 3 years, to every State, """,
                """in which an applicant has held a motor vehicle operator's license or permit.""")
    pdf.multi_cell(w=7.5,text=" ".join([s for s in big_text]))
    pdf.ln(.25)
    big_text = ("""Therefore, could you please provide to us, a copy of the driving record for the above listed individual """, 
                """for the preceding 3 years, or certify that no record exists if that be the case.""")
    pdf.multi_cell(w=7.5,text=" ".join([s for s in big_text]))
    pdf.ln(.25)
    big_text = ("""In the event this inquiry does not satisfy your requirements for making such inquiries, please send us """,
                """such forms as are necessary for us to complete our inquiry into the driving record of this individual.""")
    pdf.multi_cell(w=7.5,text=" ".join([s for s in big_text]))
    pdf.ln(.25)
    pdf.cell(w=3,text="Respectfully,")
    pdf.ln(.5)
    
    print_signature(pdf,doc_rec)   

    pdf.ln(.25)
    pdf.cell(w=5,text=acc_rec["companyname"],ln=1)
    pdf.cell(w=5,text=acc_rec["address1"],ln=1)
    if acc_rec["address2"]: pdf.cell(w=5,text=acc_rec["address2"],ln=1)
    pdf.cell(w=5,text=f'{acc_rec["city"]}, {acc_rec["state"]} {acc_rec["zipcode"]}',ln=1)
    pdf.cell(w=5,text=acc_rec["telephone"],ln=1)
    pdf.cell(w=5,text=acc_rec["fax"],ln=1)




    output_path = os.path.join(app.config["TEMP_PATH"],f"{drv_rec['recordid']}.pdf")
    pdf.output(output_path)            
    return(output_path)
