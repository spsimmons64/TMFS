import os,io
from io import BytesIO
from fpdf import FPDF,Align
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app
from staticdata import states,countries,yes_no_na,classtypes

class PDF(FPDF):
    def __init__(self,reseller,account,driver,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_font("Helvetica",size=12)
        self.reseller = reseller
        self.account = account        
        self.driver = driver        

def print_image(pdf,image,maxwidth,maxheight,filetype):    
    img_width = image.width
    img_height = image.height
    page_width = maxwidth
    page_height= maxheight    
    scale_x = page_width/img_width
    scaly_y = page_height/img_height    
    scale = min(scale_x,scaly_y)        
    new_width = img_width * scale
    new_height = img_height* scale
    if filetype==".pdf":
        new_y = 0 
        orientation = 0
    else:
        new_y = (11-new_height)/2
        exif = image._getexif()                
        orientation = exif.get(274,1) if exif else 0
    img_file = io.BytesIO()
    image.save(img_file,format="PNG")
    image_stream = get_image(img_file,img_width,img_height,encode=False,exif=orientation)
    img_file.seek(0)
    pdf.image(name=image_stream,x=Align.C,y=new_y,w=new_width,h=new_height)


def generate_pdf_file(image_list,driverid,filename,title):                
    drv_rec = Database().fetch("drivers",driverid)    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False    
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False
    pdf  = PDF(res_rec,acc_rec,drv_rec)    
    pdf.set_draw_color(51,51,51)    
    pdf.add_page()            

#=============Header    
    pdf.set_text_color(51,51,51)
    pdf.set_font("Helvetica",style="B",size=12)
    logo =get_entity_logo(pdf.account["recordid"],maxWidth=None,maxHeight=30,stream=True,encode=False)        
    pdf.image(logo,.25,.45)
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype='support' AND deleted IS NULL",(pdf.account["recordid"]))        
    pdf.set_xy(.25,.5)
    pdf.cell(w=8,h=.2,text=pdf.account["companyname"].strip(),align="R",ln=1)
    pdf.set_font("Helvetica",size=12)        
    if eml_cnt:
        pdf.set_x(.25)
        pdf.cell(w=8,h=.2,text=eml_set[0]["emailaddress"].strip(),align="R",ln=1)
    pdf.set_x(.25)
    pdf.cell(w=8,h=.2,text=pdf.account["telephone"].strip(),align="R",ln=1)
    pdf.set_xy(.25,1.3)
    pdf.line(.25,1.25,8.25,1.25)

#=============Title    
    pdf.set_font("Helvetica",style="B",size=24)
    pdf.multi_cell(w=8,h=8.25,text=title,align="C",ln=1)

#=============Footer
    driver_ssn = decrypt_with_salt(pdf.driver["socialsecurity"],pdf.reseller["tokenid"],pdf.reseller["tokenkey"])    
    driver_info = f"{pdf.driver['firstname']} {pdf.driver['lastname']} Whose Social Security Number is *****{driver_ssn[-4:]}"
    new_y = pdf.get_y()
    pdf.set_text_color(51,51,51)
    pdf.line(.25,new_y,8.25,new_y)
    pdf.set_xy(.25,new_y)
    pdf.set_fill_color(221,221,221)   
    pdf.set_font("Helvetica",size=10)
    pdf.cell(w=8,h=.2,text=f"This Document Pertains To Driver {driver_info}",align="C",fill=1,ln=1)
    pdf.set_font("Helvetica",size=8)
    pdf.set_y(pdf.get_y()+.05)
    pdf.cell(w=4.125,text=f"{chr(169)}2024 {pdf.reseller['siteroute']}.{pdf.reseller['sitedomain']} Powered By {pdf.reseller['companyname']}.")            
    pdf.set_x(4)
    pdf.multi_cell(w=4,text=f"{pdf.reseller['companyname']} and associated affiliates do not guarantee the accuracy or "\
                                    "validity of the information on this document and assumes no responsibility for the use" \
                                    "or misuse of this document and/or any information contained therein.",ln=1)
    pdf.set_y(pdf.get_y()-.15)
    pdf.cell(w=4,text="Page 1 Of 1")      
              
#=============Pages            
    for img in image_list:         
        pdf.add_page()                
        if img["type"]== ".pdf":                    
            pdf.set_xy(0,0)
            print_image(pdf,img["image"],8.5,11,img["type"])                                            
        else:                                
            print_image(pdf,img["image"],6,8,img["type"])    
    output_path = os.path.join(app.config["PROFILE_PATH"],pdf.driver['recordid'])
    if not os.path.exists(output_path):os.makedirs(output_path)
    output_path = os.path.join(output_path,filename)
    pdf.output(output_path)        
    return