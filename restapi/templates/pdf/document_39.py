
import os
from io import BytesIO
from fpdf import FPDF,Align,HTMLMixin
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app
from drivers import Drivers

class PDF(FPDF,HTMLMixin):
    def __init__(self,reseller,account,driver,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_auto_page_break(auto=True,margin=1)
        self.set_font("Helvetica",size=12)
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

def print_image(pdf,image,y,maxwidth,maxheight):
    image_data=  BytesIO(image.read())    
    image_stream = get_image(image_data,maxwidth,maxheight,encode=False)
    pdf.image(name=image_stream,x=Align.C,y=y)

def print_signature(pdf,document):
    esig_rec = Database().fetch("esignatures",document["accountsignatureid"])
    img = Image.open(BytesIO(base64.b64decode(esig_rec["esignature"])))
    image_array = BytesIO()
    img.save(image_array,format="PNG")           
    new_image = get_image(image_array,250,None,False)     
    pdf.set_xy(.45,pdf.get_y()+.2)        
    pdf.image(name=new_image,x=.35)
    pdf.set_xy(6.2,pdf.get_y()-.1)        
    pdf.cell(w=1,text=format_date_time(document["driversignaturedate"],"human_date"))        
    pdf.set_xy(.35,pdf.get_y())                
    pdf.line(.35,pdf.get_y()+.15,6,pdf.get_y()+.15)
    pdf.line(6.25,pdf.get_y()+.15,8.15,pdf.get_y()+.15)        
    pdf.set_xy(.35,pdf.get_y()+.2)                        
    pdf.cell(w=5.86,text="Applicant Signature")        
    pdf.cell(w=1.25,text="Date Signed")

def generate_report(docid):    
    doc_rec = Database().fetch("driverdocuments",docid)
    if not doc_rec: return False
    pprint (doc_rec)
    drv_rec = Database().fetch("drivers",doc_rec["driverid"])    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False    
    pdf  = PDF(res_rec,acc_rec,drv_rec)        
    pdf.add_page()       
    big_text = """GENERAL CONSENT FOR LIMITED QUERIES OF THE FEDERAL MOTOR CARRIER SAFETY ADMINISTRATION (FMCSA) DRUG AND ALCOHOL CLEARINGHOUSE"""
    pdf.multi_cell(w=7.5,h=.2,text=big_text,align="C",ln=1)
    pdf.ln(.25)
    html = f"""<section><p>I, <b><u>{drv_rec['firstname']} {drv_rec['lastname']}</u></b>, hereby provide consent 
               to <b><u>{acc_rec["companyname"]}</u></b> to conduct a limited query of the FMCSA Commercial Driver's License Drug and Alcohol
               Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse.</p></section>"""
    pdf.write_html(html)
    pdf.ln(.25)
    pdf.multi_cell(0,h=.155,text=f"""I am consenting to multiple unlimited queries and for the duration of employment with {acc_rec['companyname']}.""",ln=1)
    paragraph = (f"I understand that if the limited query conducted by {acc_rec['companyname']} indicates that drug or alcohol",
                 f"violation information about me exists in the Clearinghouse, FMCSA will not disclose that information",
                 f"to {acc_rec['companyname']} without first obtaining additional specific consent from me.")                 
    pdf.ln(.25)
    paragraph = (f"I further understand that if I refuse to provide consent for {acc_rec['companyname']} to conduct a limited query of the", 
                 f"Clearinghouse, {acc_rec['companyname']} must prohibit me from performing safety-sensitive functions, including driving a",
                 f"commercial motor vehicle, as required by FMCSA's drug and alcohol program regulations.")
    pdf.multi_cell(0,h=.155,text=" ".join([s for s in paragraph]))
    pdf.ln(.5)
    print_signature(pdf,doc_rec)    
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
    output_path = os.path.join(app.config["TEMP_PATH"],f"{pdf.driver['recordid']}.pdf")
    pdf.output(output_path)            
    return(output_path)
