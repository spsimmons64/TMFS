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
    esig_rec = Drivers().get_driver_esignature(document["driverid"])                    
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

def generate_report(doc_id):    
    doc_rec = Database().fetch("driverdocuments",doc_id)
    drv_rec = Database().fetch("drivers",doc_rec["driverid"])    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False
    pdf  = PDF(res_rec,acc_rec,drv_rec)        
    pdf.add_page()       
    big_text = """FAIR CREDIT REPORTING AUTHORIZATION"""
    pdf.multi_cell(w=7.5,h=.2,text=big_text,align="C",ln=1)
    pdf.ln(.25)
    html =  f"""<section> Pursuant to the federal Fair Credit Reporting Act, I hereby authorize <b><u>{acc_rec["companyname"]}</u></b> 
                its designated agents and representatives to conduct a comprehensive review ofmy background through a consumer report 
                and/or an investigative consumer report to be generated for employment, promotion, reassignment or retention as an 
                employee. Iunderstand that the scope of the consumer report/investigative consumer report may include, but is not 
                limited to, the following areas: verification of Social Security number, current and previous residences,employment 
                history, including all personnel files, education, references, credit history and reports, criminal history, 
                including records from anycriminal justice agency in any or all federal, state or county jurisdictions, birth records,
                motor vehicle records, including traffic citations and registration, and any other publicrecords</section>"""
    pdf.write_html(html)
    pdf.ln(.25)
    html = f"""<section><p>I, <b><u>{drv_rec['firstname']} {drv_rec['lastname']}</u></b>,authorize the complete release of these records
               or data pertaining to me that an individual, company, firm, corporation or publicagency may have. I hereby authorize and 
               request any present or former employer, school, police department, financial institution or other persons having personal 
               knowledgeof me to furnishSimmons Truckingor its designated agents with any and all information in their possession 
               regarding me in connection with an application of employment. I amauthorizing that a photocopy of this authorization be 
               accepted with the same authority as the origin</p></section>"""
    pdf.write_html(html)    
    pdf.ln(.25)
    html = f"""<section><p>I understand that, pursuant to the federal Fair Credit Reporting Act, if any adverse action is to be taken 
               based upon the consumer report, a copy of the report and a summary ofthe consumer's rights will be provided to me</p></section>"""
    pdf.write_html(html)    
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
