
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
        self.set_auto_page_break(auto=True,margin=.5)
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
    
def generate_report(documentid):    
    questionList = [
        "The pre-trip inspection (As required by Sec. 392.7).",
        "Coupling and uncoupling of combination units, if applicable.",
        "Familiar with vehicle's controls",
        "Placing the vehicle in operation",
        "Use of vehicle's controls",
        "Use of vehicle's emergency equipment",
        "Operating the vehicle in traffic",
        "Operating the vehicle while passing other vehicles",
        "Turning the vehicle",
        "Operating the vehicle while passing other vehicles",
        "Braking, and slowing the vehicle by means other than braking.",
        "Backing the vehicle",
        "Parking the vehicle",
    ]
    doc_rec = Database().fetch("driverdocuments",documentid)
    if not doc_rec: return False    
    met_set,met_cnt = Database().query("SELECT * FROM documentmeta WHERE driverdocumentid=%s",documentid)
    if not met_cnt: return False
    met_rec = met_set[0]
    drv_rec = Database().fetch("drivers",doc_rec["driverid"])    
    if not drv_rec: return False    
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False    
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False    
    pdf  = PDF(res_rec,acc_rec,drv_rec)        
    pdf.add_page()       
    pdf.set_font(size=14,style="B")
    big_text = """DRIVER ROAD TEST EXAMINATION"""    
    pdf.multi_cell(w=7.5,h=.35,text=big_text,align="C",ln=1)    
    pdf.set_font(size=12)    
    html_text = f"""<b>The road test shall be given by the motor carrier or a person designated by
                    the motor carrier. <font color = "#FF6666">However, a driver who is a motor carrier must be given the
                    test by another person.</font></b> The test shall be given by a person who is competent to evaluate and determine
                    whether the person who takes the test has demonstrated that he/she is capable of operating the vehicle and
                    associated equipment that the motor carrier intends to assign."""
    pdf.write_html(html_text)
    pdf.ln(.15)
    app_section_hdr(pdf,"DRIVER INFORMATION")
    app_style_cell(pdf,5.75,"Driver Name",f'{drv_rec["firstname"]} {drv_rec["lastname"]}')    
    app_style_cell(pdf,1.75,"Telephone",format_telephone(drv_rec["telephone1"]),1)    
    app_style_cell(pdf,7.5,"Address",f'{drv_rec["address"]}',1)    
    found_state = next((state["text"] for state in states if state["value"] == drv_rec["state"]), None)            
    found_country = next((country["text"] for country in countries if country["value"] == drv_rec["country"]), None)            
    app_style_cell(pdf,2.5,"City",drv_rec["city"])
    app_style_cell(pdf,2.5,"State",found_state)
    app_style_cell(pdf,2.5,"Zip Code",drv_rec["zipcode"],1)
    app_style_cell(pdf,7.5,"Country",found_country,1)    
    app_style_cell(pdf,7.5,"Road Test Date",format_date_time(met_rec["roadtestdate"],"human_date"),1)
    app_section_hdr(pdf,"RATING OF PERFORMANCE")
    hold_y = pdf.get_y()
    for i in range(1,len(questionList)+1):
        border = "LR" if i < len(questionList) else "LRB"
        pdf.cell(w=7.5,h=.25,text="",border=border,ln=1)
    pdf.set_y(hold_y)
    for ndx,question in enumerate(questionList):        
        result = ""
        match met_rec["roadtest"][ndx]:
            case "P": result = "PASS"
            case "F": result = "FAIL"
            case "A": result = "N/A"
            case _: result="NONE"
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.55,h=.25,text=result,border="R")
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=6,h=.25,text=question,ln=1)
    text = met_rec["roadtestother"] if met_rec["roadtestother"] else "No Additonal Information"
    app_style_multi_cell(pdf,7.5,"Other",text,1)            
    pdf.add_page()    
    app_section_hdr(pdf,"TYPE OF EQUIPMENT USED IN GIVING TEST")                
    hold_y = pdf.get_y()        
    for i in range(0,7):                
        pdf.cell(w=1.5,h=.35,text="",border="LRB")
        pdf.cell(w=4.0,h=.35,text="",border="RB")
        pdf.cell(w=1,h=.35,text="",border="RB")
        pdf.cell(w=1,h=.35,text="",border="RB",ln=1)
    pdf.set_y(hold_y)
    pdf.set_font(style="B")            
    pdf.cell(w=1.5,h=.35,text="Equipment Class",align="C")
    pdf.cell(w=4.0,h=.35,text="Equipment Type (Van, Flatbed, Tanker, Dump)",align="C")
    pdf.cell(w=1,h=.35,text="Hazmat Y/N",align="C")
    pdf.cell(w=1,h=.35,text="Miles",ln=1,align="C")    
    pdf.set_font(style="")     
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Straight Truck")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["stclasstype"])            
    if met_rec["stclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["stclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["stclassmiles"]))
    pdf.ln()
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Truck-Trailer")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["ttclasstype"])            
    if met_rec["ttclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["ttclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["ttclassmiles"]))
    pdf.ln()
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Semi-Trailer")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["smclasstype"])            
    if met_rec["smclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["smclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["smclassmiles"]))
    pdf.ln()
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Doubles / Triples")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["dtclasstype"])            
    if met_rec["dtclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["dtclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["dtclassmiles"]))
    pdf.ln()
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Bus")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["busclasstype"])            
    if met_rec["busclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["busclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["busclassmiles"]))
    pdf.ln()
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=1.5,h=.35,text="Other")
    pdf.set_x(pdf.get_x()+.025)
    pdf.cell(w=4.0,h=.35,text=met_rec["otclasstype"])            
    if met_rec["otclasstype"]:        
        pdf.cell(w=1,h=.35,text=f'{"Yes" if met_rec["otclasshazmat"]==1 else "No"}')
        pdf.set_x(pdf.get_x()+.025)
        pdf.cell(w=.925,h=.35,text= str(met_rec["otclassmiles"]))
    pdf.ln()
    text = met_rec["roadtestremarks"] if met_rec["roadtestremarks"] else "No Additonal Remarks"
    app_style_multi_cell(pdf,7.5,"Additional Remarks",text,1)            
    pdf.ln(.5)
    print_signature(pdf,doc_rec)       
    output_path = os.path.join(app.config["TEMP_PATH"],f"{drv_rec['recordid']}.pdf")
    pdf.output(output_path)            
    return(output_path)
