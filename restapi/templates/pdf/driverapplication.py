import os
import PyPDF2
from io import BytesIO
from fpdf import FPDF,Align
from queries import *
from toolbox import *
from database import Database
from datetime import datetime
from flask_restful import current_app as app
from staticdata import states,countries,yes_no_na,classtypes
from drivers import Drivers
from citadel import Citadel

class PDF(FPDF):
    def __init__(self,reseller,account,driver,orientation="P",unit="in", format="Letter"):
        super().__init__(orientation,unit,format)
        self.set_auto_page_break(auto=True,margin=1.65)
        self.set_font("Helvetica",size=12)
        self.set_left_margin(.25)        
        self.reseller = reseller
        self.account = account        
        self.driver = driver        

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
   
    def setHeaderFill(self):
        self.set_font("Helvetica",size=10,style="B")
        self.set_text_color(255,255,255)
        self.set_fill_color(51,51,51)

    def setShadedFill(self):
        self.set_font("Helvetica",size=10,style="B")
        self.set_text_color(51,51,51)
        self.set_fill_color(230,230,230)

    def setStandardFill(self):
        self.set_font("Helvetica",size=10)
        self.set_text_color(22, 67, 152)
        self.set_fill_color(255,255,255)

    def check_box(self,x,y,text,state):
        self.set_xy(x,y)
        self.cell(w=.1,h=.1,text="",border=1)
        self.cell(w=.25,h=.11,text=text)
        if state:
            self.set_font('ZapfDingbats',"",10)
            self.set_x(x-.03)
            self.cell(w=.1,h=.1,text="4")

    def application_account(self):
        dat_set,set_dat_rec = Database().query("SELECT * FROM driverdates WHERE driverid=%s AND deleted IS NULL",self.driver["recordid"])
        dat_rec = dat_set[0]
        self.set_font("Helvetica",size=14,style="B")
        self.setHeaderFill()
        self.cell(w=8,h=.25,text="DRIVER APPLICATION",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Application Date",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1,h=.35,text=format_date_time(dat_rec["new"],"human_date"),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Company Name",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=4.5,h=.35,text=self.account["companyname"].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Address 1",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=6.75,h=.35,text=self.account['address1'].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()    
        self.cell(w=1.25,h=.35,text="Address 2",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=6.75,h=.35,text=self.account['address2'].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="City",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=self.account['city'].upper(),border=1, fill=1)
        found_state = next((state["text"] for state in states if state["value"] == self.account["state"]), None)
        self.setShadedFill()
        self.cell(w=.75,h=.35,text="State",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1.5,h=.35,text=found_state.upper(),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=.75,h=.35,text="Zip Code",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1,h=.35,text=self.account['zipcode'].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Referred By:",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=6.75,h=.35,text=self.driver['referredby'].upper(),border=1, fill=1,ln=1)    

    def application_driver(self):
        self.setHeaderFill()
        self.cell(w=8,h=.25,text="APPLICANT INFORMATION",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="First Name",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1.083,h=.35,text=self.driver['firstname'].upper(),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1,h=.35,text="Middle Name",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1.083,h=.35,text=self.driver['middlename'].upper(),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1,h=.35,text="Last Name",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1.083,h=.35,text=self.driver['lastname'].upper(),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1,h=.35,text="Suffix",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=.5,h=.35,text=self.driver['suffix'].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Date Of Birth",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=format_date_time(self.driver['birthdate'],"human_date"),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Social Security",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=decrypt_with_salt(self.driver['socialsecurity'],self.reseller["tokenid"],self.reseller["tokenkey"]),border=1, fill=1,ln=1)
        self.setShadedFill()    
        self.cell(w=1.25,h=.35,text="Address",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=6.75,h=.35,text=self.driver['address'].upper(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="City",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=self.driver['city'].upper(),border=1, fill=1)
        found_state = next((state["text"] for state in states if state["value"] == self.driver["state"]), None)
        self.setShadedFill()
        self.cell(w=.75,h=.35,text="State",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1.5,h=.35,text=found_state.upper(),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=.75,h=.35,text="Zip Code",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=1,h=.35,text=self.driver['zipcode'].upper(),border=1, fill=1,ln=1)
        found_country = next((country["text"] for country in countries if country["value"] == self.driver["country"]), None)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Country",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=found_country.upper(),border=1, fill=1)        
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Email Address",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=Drivers().get_driver_email(self.driver["recordid"]).lower(),border=1, fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Telephone",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=format_telephone(self.driver['telephone1']),border=1, fill=1)
        self.setShadedFill()
        self.cell(w=1.25,h=.35,text="Alt Telephone",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2.75,h=.35,text=format_telephone(self.driver['telephone2']),border=1, fill=1,ln=1)
        found_resp = next((yna["text"] for yna in yes_no_na if yna["value"] == self.driver["hastwic"]), None)
        self.setShadedFill()
        self.cell(w=2,h=.35,text="Do You Have A TWIC Card",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2,h=.35,text=found_resp.upper(),border=1, fill=1)
        found_resp = next((yna["text"] for yna in yes_no_na if yna["value"] == self.driver["haspassport"]), None)
        self.setShadedFill()
        self.cell(w=2,h=.35,text="Do You Have A Passport",border=1, fill=1)
        self.setStandardFill()
        self.cell(w=2,h=.35,text=found_resp.upper(),border=1, fill=1,ln=1)

    def application_addresses(self):
        self.setHeaderFill()
        self.cell(w=8,h=.25,text="RESIDENCES PREVIOUS THREE (3) YEARS",border=1,fill=1,ln=1)
        self.setStandardFill()
        self.set_font("Helvetica",size=8)
        self.set_text_color(51,51,51)
        self.cell(w=8,h=.35,border=1,text="List Residences For Previous Three (3) Years If You Lived At The Above Address Less Than Three (3) Years.",ln=1)
        self.set_font("Helvetica",size=10)
        add_set,add_cnt = Database().query("SELECT * FROM driveraddresses WHERE driverid=%s AND deleted IS NULL",(self.driver["recordid"]))
        if not add_cnt:
            self.setStandardFill()
            self.cell(w=8,h=.35,border=1,text="NO PREVIOUS RESIDENCES LISTED",ln=1)
        else:
            for ndx,add_rec in enumerate(add_set):
                self.setShadedFill()    
                self.cell(w=8,h=.25,border=1,text=f'Residence #{ndx+1}',fill=1,ln=1)            
                self.cell(w=1.25,h=.35,text="Address",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=6.75,h=.35,text=add_rec['address'].upper(),border=1, fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="City",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=add_rec['city'].upper(),border=1, fill=1)
                found_state = next((state["text"] for state in states if state["value"] == add_rec["state"]), None)
                self.setShadedFill()
                self.cell(w=.75,h=.35,text="State",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=1.5,h=.35,text=found_state.upper(),border=1, fill=1)
                self.setShadedFill()
                self.cell(w=.75,h=.35,text="Zip Code",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=1,h=.35,text=add_rec['zipcode'].upper(),border=1, fill=1,ln=1)
                found_country = next((country["text"] for country in countries if country["value"] == add_rec["country"]), None)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Country",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=found_country.upper(),border=1, fill=1,ln=1)

    def application_licenses(self):
        self.setHeaderFill()
        self.cell(w=8,h=.25,text="DRIVER'S LICENSE INFORMATION",border=1,fill=1,ln=1)
        self.setStandardFill()
        self.set_font("Helvetica",size=8)
        self.set_text_color(51,51,51)
        self.cell(w=8,h=.35,border=1,text="List Driver's Licenses Held In The Previous Three (3) Years.  Enter Your First And Last Name Exactly As It"\
                                        "Appears On Your License.",ln=1)
        self.set_font("Helvetica",size=10)
        lic_set,lic_cnt = Database().query("SELECT * FROM driverlicenses WHERE driverid=%s AND deleted IS NULL ORDER BY issued DESC",(self.driver["recordid"]))
        for ndx,lic_rec in enumerate(lic_set):
            self.setShadedFill()    
            self.cell(w=8,h=.25,border=1,text=f'License #{ndx+1}',fill=1,ln=1)
            self.cell(w=1.25,h=.35,text="First Name",border=1, fill=1)
            self.setStandardFill()
            self.cell(w=2.75,h=.35,text=lic_rec['firstname'].upper(),border=1, fill=1)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Last Name",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=2.75,h=.35,text=lic_rec['lastname'].upper(),border=1, fill=1,ln=1)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="License Number",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=1.75,h=.35,text=lic_rec['licensenumber'].upper(),border=1, fill=1)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Issue Date",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=1.25,h=.35,text=format_date_time(lic_rec['issued'],"human_date"),border=1, fill=1)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Expire Date",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=1.25,h=.35,text=format_date_time(lic_rec['expires'],"human_date"),border=1, fill=1,ln=1)
            found_state = next((state["text"] for state in states if state["value"] == lic_rec["state"]), None)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Issue State",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=1.75,h=.35,text=found_state.upper(),border=1, fill=1)
            found_country = next((country["text"] for country in countries if country["value"] == lic_rec["country"]), None)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Issue Country",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=3.75,h=.35,text=found_country.upper(),border=1, fill=1,ln=1)
            endorsement_list = ['H','N','P','T','S','X']        
            endorsements = []
            for i in range(6):
                if lic_rec["endorsements"][i]=="1": endorsements.append(endorsement_list[i])
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Endorsements",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=1.75,h=.35,text=", ".join(endorsements),border=1, fill=1)
            found_class = next((dlclass["text"] for dlclass in classtypes if dlclass["value"] == lic_rec["class"]), None)
            self.setShadedFill()
            self.cell(w=1.25,h=.35,text="Classification",border=1, fill=1)
            self.setStandardFill()        
            self.cell(w=3.75,h=.35,text=found_class.upper(),border=1, fill=1,ln=1)

    def application_medical(self):
        self.setHeaderFill()            
        self.cell(w=8,h=.25,text="MEDICAL CERTIFICATE",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=2.5,h=.35,text="Medical Certificate Expiration Date",border=1, fill=1)
        dat_set,dat_cnt = Database().query("SELECT * FROM driverdates WHERE driverid=%s AND deleted IS NULL",(self.driver["recordid"]))        
        medcard_date = format_date_time(dat_set[0]["medcardexpires"],"human_date") if dat_cnt else ""
        self.setStandardFill()            
        self.cell(w=4,h=.35,text=medcard_date,border=1, fill=1)
        self.cell(w=1.5,h=.35,text="",border=1, fill=1,ln=1)
        hold_x = self.get_x()
        hold_y = self.get_y()
        self.check_box(hold_x+6.8,hold_y-.23,"Not Applicable",dat_set[0]["medcardexpires"]==None)
        self.set_xy(hold_x,hold_y)

    def application_experience(self):
        self.setHeaderFill()    
        self.cell(w=8,h=.25,text="EXPERIENCE",border=1,fill=1,ln=1)    
        exp_rec = Drivers().get_driver_experience(self.driver["recordid"],iso=False)        
        exp_list = [
            {"value":"strtrk","text":"STRAIGHT TRUCK"},
            {"value":"trktrc","text":"TRUCK-TRACTOR"},
            {"value":"semtrl","text":"SEMI-TRAILERS"},
            {"value":"dbltrp","text":"DOUBLE / TRIPLES"},
            {"value":"flatbed","text":"FLATBED"},
            {"value":"bus","text":"BUS"},
            {"value":"other","text":"OTHER"}
        ]
        pos_list = []        
        for exp in exp_list:                
            self.setShadedFill()
            self.cell(w=8,h=.25,text=exp["text"],border=1, fill=1,ln=1)
            self.setStandardFill()                
            experience = "NO" if exp_rec[exp["value"]] == "N" else "YES"            
            date_from = format_date_time(exp_rec[f'{exp["value"]}from'],"human_date")
            date_to = format_date_time(exp_rec[f'{exp["value"]}to'],"human_date")
            miles = str(exp_rec[f'{exp["value"]}miles']) if exp_rec[f'{exp["value"]}miles'] else "" 
            pos_list.append(self.get_y())                      
            self.cell(w=2,h=.35,text="",border=1, fill=1,align="C")
            self.cell(w=2,h=.35,text="",border=1, fill=1,align="C")
            self.cell(w=2,h=.35,text="",border=1, fill=1,align="C")
            self.cell(w=2,h=.35,text="",border=1, fill=1,align="C")
            self.set_xy(.25,self.get_y()+.035)        
            self.cell(w=2,h=.315,text=experience,align="C")
            self.cell(w=2,h=.315,text=date_from,align="C")
            self.cell(w=2,h=.315,text=date_to,align="C")
            self.cell(w=2,h=.315,text=miles,align="C")        
            self.set_xy(.25,pos_list[len(pos_list)-1])
            self.ln()
        self.set_font("Helvetica","",8)
        self.set_text_color(51,51,51)
        hold_x = self.get_x()
        hold_y = self.get_y()    
        for pos in pos_list:
            self.set_y(pos)
            self.cell(w=2,h=.15,text="Experience")
            self.cell(w=2,h=.15,text="Date From")        
            self.cell(w=2,h=.15,text="Date To")
            self.cell(w=2,h=.15,text="Approximate Miles")
        self.set_font("Helvetica","",10)
        self.set_xy(hold_x,hold_y)       

    def application_accidents(self):
        acc_set = Drivers().get_driver_crashes(self.driver["recordid"])
        yesno = "YES" if len(acc_set) else "NO"
        self.setHeaderFill()    
        self.cell(w=8,h=.25,text="ACCIDENTS/ CRASHED PREVIOUS THREE (3) YEARS",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=7,h=.35,text="Have You Had Any Accidents / Crashes In The Last Three (3) Years?",border=1, fill=1)
        self.setStandardFill()            
        self.cell(w=1,h=.35,text=yesno,border=1, fill=1,ln=1)
        
    def application_violations(self):
        vio_set = Drivers().get_driver_violations(self.driver["recordid"])        
        yesno = "YES" if len(vio_set) else "NO"
        self.setHeaderFill()    
        self.cell(w=8,h=.25,text="MOVING TRAFFIC VIOLATIONS PREVIOUS THREE (3) YEARS",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=7,h=.35,text="Have You Had Any Traffic Violations In The Last Three (3) Years?",border=1, fill=1)
        self.setStandardFill()            
        self.cell(w=1,h=.35,text=yesno,border=1, fill=1,ln=1)

    def application_forfeitures(self):
        self.setHeaderFill()    
        self.cell(w=8,h=.25,text="FORFEITURES PREVIOUS THREE (3) YEARS",border=1,fill=1,ln=1)
        self.setShadedFill()
        self.cell(w=7,h=.35,text="Have You Ever Been Denied A License, Permit Or Privilege To Operate A Motor Vehicle?",border=1, fill=1)
        self.setStandardFill()            
        yesno = "NO"if self.driver["beendenied"]=="N" else "YES"
        self.cell(w=1,h=.35,text=yesno,border=1, fill=1,ln=1)
        self.setShadedFill()
        yesno = "NO"if self.driver["beenrevoked"]=="N" else "YES"
        self.cell(w=7,h=.35,text="Has Any License, Permit or Privilege Ever Been Suspended Or Revoked?",border=1, fill=1)
        self.setStandardFill()            
        self.cell(w=1,h=.35,text=yesno,border=1, fill=1,ln=1)
        self.setShadedFill()    
        self.cell(w=8,h=.35,text='IF "YES" To Either Question Above, Briefly Descriibe The Circumstances',border=1, fill=1,ln=1)
        self.setStandardFill()            
        self.multi_cell(w=8,h=.5,text=self.driver["forfeituredetails"],border=1, fill=1,ln=1)
        self.set_font("Helvetica",style="B",size=10)
        self.set_text_color(51,51,51)
        self.cell(w=8,h=.25,text="If Applicable, Statements Setting Forth The Facts And Circumstances Will Be Appended To This Application",ln=1)        

    def application_employers(self):
        self.setHeaderFill()
        self.cell(w=8,h=.25,text="EMPLOYMENT RECORD",border=1,fill=1,ln=1)
        self.setStandardFill()
        self.set_font("Helvetica",style="B",size=8)
        self.set_text_color(255, 102, 102)    
        self.cell(w=8,h=.25,border=1,text="List All Employers For The Previous Three (3) Years")
        self.set_font("Helvetica",style="BU",size=8)
        self.set_x(3.05)
        self.cell(w=4,h=.25,text="And An Additional 7 Years If You Were Employed As A Driver.",ln=1)    
        emp_set,emp_cnt = Database().query("SELECT * FROM driveremployment WHERE driverid=%s AND deleted IS NULL ORDER BY datefrom ASC",(self.driver["recordid"]))        
        if not emp_cnt:
            self.setStandardFill()
            self.cell(w=8,h=.35,border=1,text="NO PREVIOUS EMPLOYERS LISTED",ln=1)
        else:            
            for ndx,emp_rec in enumerate(emp_set):
                self.setShadedFill()    
                self.cell(w=8,h=.25,border=1,text=f'Employer #{ndx+1}',fill=1,ln=1)
                self.cell(w=1.25,h=.35,border=1,text="Employer Name",fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,border=1,text=emp_rec["employername"].upper(),fill=1)
                self.setShadedFill()    
                self.cell(w=1.25,h=.35,border=1,text="Position Held",fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,border=1,text=emp_rec["position"].upper(),fill=1,ln=1)
                self.setShadedFill()    
                self.cell(w=1.25,h=.35,border=1,text="Address",fill=1)
                self.setStandardFill()
                self.cell(w=6.75,h=.35,border=1,text=emp_rec["address"].upper(),fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="City",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=self.driver['city'].upper(),border=1, fill=1)
                found_state = next((state["text"] for state in states if state["value"] == self.driver["state"]), None)
                self.setShadedFill()
                self.cell(w=.75,h=.35,text="State",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=1.5,h=.35,text=found_state.upper(),border=1, fill=1)
                self.setShadedFill()
                self.cell(w=.75,h=.35,text="Zip Code",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=1,h=.35,text=self.driver['zipcode'].upper(),border=1, fill=1,ln=1)
                found_country = next((country["text"] for country in countries if country["value"] == self.driver["country"]), None)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Country",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=found_country.upper(),border=1, fill=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Email",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=emp_rec["emailaddress"],border=1, fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Telephone",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=format_telephone(emp_rec["telephone"]),border=1, fill=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Fax",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=format_telephone(emp_rec["fax"]),border=1, fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Date From",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=format_date_time(emp_rec["datefrom"],"human_date"),border=1, fill=1)
                self.setShadedFill()
                self.cell(w=1.25,h=.35,text="Date To",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=2.75,h=.35,text=format_date_time(emp_rec["dateto"],"human_date"),border=1, fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=8,h=.35,text="Reason For Leaving",border=1, fill=1,ln=1)
                self.setStandardFill()
                self.cell(w=8,h=.35,text=emp_rec["reasonleaving"],border=1, fill=1,ln=1)
                self.setShadedFill()
                self.cell(w=7,h=.35,text="Were You Subject To The DOT/FMCSA Regulations While Employed By This Employer?",border=1, fill=1)
                self.setStandardFill()
                self.cell(w=1,h=.35,text="YES" if emp_rec["dotfmcsregs"]=="Y" else "NO",border=1, fill=1,ln=1)
                self.setShadedFill()
                hold_y = self.get_y()                
                self.multi_cell(w=7,h=.2,text="Was Your Job Designated As A Safety Sensitive Function, In Any DOT Regulated Mode, Subject "\
                                              "To The Alcohol And Controlled Substances Testing Requirements required by 49 CFR Part 40?",border=1,fill=1)
                self.set_xy(7.25,hold_y)
                self.setStandardFill()
                found_ynn = next((ynn["text"] for ynn in yes_no_na if ynn["value"] == emp_rec["dotregulated"]), None)
                self.cell(w=1,h=.4,text=found_ynn,border=1, fill=1,ln=1)
                
    def application_creditreport(self):
        self.setHeaderFill()    
        self.cell(w=8,h=.25,text="FAIR CREDIT REPORTING ACT",border=1,fill=1,ln=1)
        self.setStandardFill()
        self.set_text_color(51,51,51)
        self.cell(w=8,h=.1,border="LR",ln=1)
        self.multi_cell(w=8,h=.15,text="Pursuant to the federal Fair Credit Reporting Act, I hereby authorize this company and its designated "\
                                      "agents and representatives to conduct a comprehensive review of my background through any consumer report "\
                                      "for employment. I understand that the scope of the consumer report/investigative consumer report may include, "\
                                      "but is not limited to,the following areas: verification of Social Security number, current and previous "\
                                      "residences, employment history, including all personnel files, education, references, credithistory and "\
                                      "reports, criminal history, including records from any criminal justice agency in any or all federal, state "\
                                      "or county jurisdictions, birth records, motor vehicle records,including traffic citations and registration, "\
                                      "and any other public records",border="LR",ln=1)
        self.cell(w=8,h=.25,border="LR",ln=1)
        self.set_font("Helvetica","B",8)        
        self.multi_cell(w=8,text="This certifies that this application was completed by me, and that all entries on it and information in it "\
                                 "are true and complete to the best of my knowledge.",border="LR",ln=1)
        
    def application_signature(self):
        self.cell(w=8,h=1.5,border="LRB")                
        dco_set,dco_cnt = Database().query("SELECT * FROM documenttypes WHERE typecode='11' AND deleted IS NULL")        
        if dco_cnt:
            sql = "SELECT * FROM driverdocuments WHERE driverid=%s AND documenttypeid=%s AND deleted IS NULL "
            sig_set,sig_cnt = Database().query(sql,(self.driver["recordid"],dco_set[0]["recordid"]))                        
            if sig_cnt:    
                esig_rec = Drivers().get_driver_esignature(self.driver["recordid"])                
                img = Image.open(BytesIO(base64.b64decode(esig_rec["esignature"])))
                image_array = BytesIO()
                img.save(image_array,format="PNG")           
                new_image = get_image(image_array,250,None,False)                     
                self.set_xy(.45,self.get_y()+.2)        
                self.image(name=new_image,x=.35)
                self.set_xy(6.2,self.get_y()-.1)        
                self.cell(w=1,text=format_date_time(sig_set[0]["driversignaturedate"],"human_date"))        
        self.set_xy(.35,self.get_y())                
        self.line(.35,self.get_y()+.15,6,self.get_y()+.15)
        self.line(6.25,self.get_y()+.15,8.15,self.get_y()+.15)        
        self.set_xy(.35,self.get_y()+.2)                        
        self.cell(w=5.86,text="Applicant Signature")        
        self.cell(w=1.25,text="Date Signed")

    def application_merge(self,temp_path,main_path):        
        doc_merge = PyPDF2.PdfMerger()
        doc_merge.append(temp_path)
        sql = ("SELECT a.* FROM driverdocuments a JOIN documenttypes b on b.recordid=a.documenttypeid AND b.typecode "
               "IN ('16','17','1') WHERE a.driverid=%s AND a.deleted IS NULL ORDER BY added")
        doc_set,doc_cnt = Database().query(sql,self.driver["recordid"])
        for doc in doc_set:
            document = os.path.join(app.config["PROFILE_PATH"],self.driver["recordid"],f'{doc["recordid"]}.pdf')
            doc_merge.append(document)
        with open(main_path,'wb') as output_file:
            doc_merge.write(output_file)
            os.unlink(temp_path)

def generate_application_pdf(docid):             
    doc_rec = Database().fetch("driverdocuments",docid)
    drv_rec = Database().fetch("drivers",doc_rec["driverid"])    
    if not drv_rec: return False
    acc_rec = Database().fetch("accounts",drv_rec["accountid"])
    if not acc_rec: return False    
    res_rec = get_reseller_from_account(acc_rec["recordid"])
    if not res_rec: return False    
    pdf  = PDF(res_rec,acc_rec,drv_rec)    
    pdf.set_draw_color(51,51,51)    
    pdf.add_page()
    pdf.application_account()
    pdf.application_driver()
    pdf.application_addresses()
    pdf.application_licenses()
    pdf.application_medical()
    pdf.application_experience()
    pdf.application_accidents()
    pdf.application_violations()
    pdf.application_forfeitures()
    pdf.application_employers()
    pdf.application_creditreport()
    pdf.application_signature()
    temp_path = os.path.join(app.config["TEMP_PATH"],f"{pdf.driver['recordid']}_temp.pdf")
    output_path = os.path.join(app.config["TEMP_PATH"],f"{pdf.driver['recordid']}.pdf")
    pdf.output(temp_path)        
    pdf.application_merge(temp_path,output_path)    
    return(output_path)