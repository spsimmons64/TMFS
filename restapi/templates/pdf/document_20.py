
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
from staticdata import states,countries

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
        self.set_xy(.5,9.8)        
        self.set_font("Helvetica",size=10)
        self.cell(w=7.5,h=.2,text=f"This Document Pertains To Driver {driver_info}",align="C",fill=1,ln=1)
        self.set_font("Helvetica",size=8)
        self.cell(w=3.75,h=.65,text=f"{chr(169)}2024 {self.reseller['siteroute']}.{self.reseller['sitedomain']} Powered By {self.reseller['companyname']}.")                
        self.set_xy(4.25,10.15)
        self.multi_cell(w=3.75,text=f"{self.reseller['companyname']} and associated affiliates do not guarantee the accuracy or "\
                                        "validity of the information on this document and assumes no responsibility for the use" \
                                        "or misuse of this document and/or any information contained therein.")

def print_image(pdf,image,y,maxwidth,maxheight):
    image_data=  BytesIO(image.read())    
    image_stream = get_image(image_data,maxwidth,maxheight,encode=False)
    pdf.image(name=image_stream,x=Align.C,y=y)

def print_signature(pdf,document):
    esig_rec = Database().fetch("esignatures",document["accountsignatureid"])
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

def app_style_cell(pdf,width,title,text,ln=0):
    height = .35
    hold_x = pdf.get_x()
    hold_y = pdf.get_y()
    pdf.cell(w=width,h=height,border="LRB")
    pdf.set_xy(hold_x+.025,hold_y+.025)
    pdf.set_font(size=7)
    pdf.cell(w=width,text=title)
    pdf.set_xy(hold_x+.025,hold_y+.18)
    pdf.set_font(size=11)
    pdf.cell(w=width,text=text)
    pdf.set_xy(hold_x+width,hold_y)
    if ln: pdf.ln(height)

def app_style_multi_cell(pdf,width,title,text,ln=0):    
    hold_x = pdf.get_x()
    hold_y = pdf.get_y()
    lines = pdf.multi_cell(w=width,text=text,split_only=True)
    pdf.set_xy(hold_x+.025,hold_y+.025)
    pdf.set_font(size=7)
    pdf.cell(w=width,text=title,ln=1)
    pdf.set_xy(hold_x+.025,hold_y+.18)
    pdf.set_font(size=11)
    pdf.multi_cell(w=width-.035,text=text)
    height = len(lines)*(pdf.font_size_pt / pdf.k)+.25    
    pdf.set_xy(hold_x,hold_y)
    pdf.cell(w=width,text="",h=height,border="LRB")
    pdf.set_xy(hold_x+width,hold_y)
    if ln: pdf.ln(height)

def app_section_hdr(pdf,title):
    pdf.set_fill_color(204,204,204)
    pdf.set_draw_color(204,204,204)
    pdf.cell(w=7.5,h=.25,text=title,border=True,fill=True,ln=1)  
    
def generate_report(licenseid,documentid):    
    doc_rec = Database().fetch("driverdocuments",documentid)
    if not doc_rec: return False    
    met_set,met_cnt = Database().query("SELECT * FROM documentmeta WHERE driverdocumentid=%s",documentid)
    if not met_cnt: return False
    met_rec = met_set[0]
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
    pdf.set_font(size=14,style="B")
    big_text = """WRITTEN RECORD OF GOOD FAITH EFFORT INQUIRY INTO DRIVING RECORD"""    
    pdf.multi_cell(w=7.5,h=.35,text=big_text,align="C",ln=1)    
    pdf.set_font(size=12)
    pdf.cell(w=7.5,align="C",text="In Accordance With 49 CFR Part 391.23 The Following Record Is Submitted")
    pdf.ln(.5)    
    app_section_hdr(pdf,"APPLICANT INFORMATION")
    app_style_cell(pdf,4,"Applicant Name",f'{drv_rec["firstname"]} {drv_rec["lastname"]}')
    app_style_cell(pdf,1.75,"Social Security",Citadel().decrypt(drv_rec["socialsecurity"]))
    app_style_cell(pdf,1.75,"Birth Date",format_date_time(drv_rec["birthdate"],"human_date"),1)    
    found_state = next((state["text"] for state in states if state["value"] == lic_rec["state"]), None)            
    found_country = next((country["text"] for country in countries if country["value"] == lic_rec["country"]), None)            
    app_style_cell(pdf,2.5,"Driver's License Number",lic_rec["licensenumber"])
    app_style_cell(pdf,2.5,"Driver's License State",found_state)
    app_style_cell(pdf,2.5,"Driver's License Country",found_country,1)

    app_section_hdr(pdf,"STATE AGENCY CONTACTED")
    app_style_cell(pdf,4,"Agency Name",met_rec["agencyname"])
    app_style_cell(pdf,1.75,"Telephone",format_telephone(met_rec["agencytelephone"]))    
    app_style_cell(pdf,1.75,"Fax",format_telephone(met_rec["agencyfax"]),1)
    app_style_cell(pdf,7.5,"Address",met_rec["agencyaddress"],1)
    found_state = next((state["text"] for state in states if state["value"] == met_rec["agencystate"]), None)            
    app_style_cell(pdf,3,"City",met_rec["agencycity"])
    app_style_cell(pdf,2.75,"State",found_state)
    app_style_cell(pdf,1.75,"Zip Code",met_rec["agencyzipcode"],1)

    found_country = next((country["text"] for country in countries if country["value"] == met_rec["agencycountry"]), None)            
    app_style_cell(pdf,7.5,"Country",found_country,1)    
    app_section_hdr(pdf,"REASON DRIVER'S RECORD INQUIRY NOT CONDUCTED")
    app_style_cell(pdf,7.5,"Date",format_date_time(met_rec["agencydate"],"human_date"),1)    
    app_style_multi_cell(pdf,7.5,"Reason Not Conducted",met_rec["agencyreason"],1)
    pdf.ln(.25)
    print_signature(pdf,doc_rec)   
    pdf.ln()
    output_path = os.path.join(app.config["TEMP_PATH"],f"{drv_rec['recordid']}.pdf")
    pdf.output(output_path)            
    return(output_path)
