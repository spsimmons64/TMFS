from pprint import pprint
import requests,os,mimetypes,base64
from toolbox import *
from flask import current_app as app

class SendEmail():
    def __init__(self,smtp_profile,from_list,to_list,bcc_list,subject,header,message,image_list=[],attachments = []):
        super().__init__()         
        self.smtp_profile = smtp_profile       
        self.from_list = from_list       
        self.to_list = to_list       
        self.bcc_list = bcc_list       
        self.subject = subject               
        self.image_list = image_list        
        self.images = []
        self.header = header
        self.message = message  
        self.attachments = attachments             
        
    def __build_message(self):
        return f"""
            <body style="background-color:#EBEBEB;padding:40px;">
            <table style="width:800px;padding:10px 20px 20px 20px;border:1px solid #BFBFBF;background-color:#FFFFFF;border-radius:8px;margin:0 auto;border-top:5px solid #76B66A;border-bottom:5px solid #164398;">
            <tr style="text-align:center;"><td style="font-size:18px;color:#76B66A;"><strong>{self.header}</strong></td></tr>
            {self.message}
            <tr><td style="font-size:10px;color:#808080;text-align:center;">
            Confidential information may be contained in this message and may be subject to legal privilege. 
            Access to this e-mail by anyone other than the intended is unauthorized. If you are not the intended 
            recipient (or responsible for delivery of the message to such person), you may not use, copy, 
            distribute or deliver to anyone this message (or any part of its contents) 
            or take any action in reliance on it. In such case, you should destroy this message, and notify us 
            immediately. If you have received this email in error, please notify us immediately by e-mail or 
            telephone and delete the e-mail from any computer. If you or your employer does not consent to 
            internet e-mail messages of this kind, please notify us immediately. All reasonable precautions have 
            been taken to ensure no viruses are present in this e-mail. As our company cannot accept responsibility 
            for any loss or damage arising from the use of this e-mail or attachments we recommend that you subject 
            these to your virus checking procedures prior to use. The views, opinions, conclusions and other informations 
            expressed in this electronic mail are not given or endorsed by the company unless otherwise indicated by an authorized 
            representative independent of this message.</td></tr></table></body>                        
        """                
    
    def message_images(self):           
        image_list = []                             
        for image in self.image_list:                          
            new_image = get_image(image["path"],400,None,False)
            if new_image:
                new_image.seek(0)
                image_list.append(("inline",(image["tag"],new_image.read(),'image/png')))
                new_image.close()
        return(image_list)
        

    def send(self):                        
        fileList = self.message_images()
        for att in self.attachments: fileList.append(("attachment",open(att,'rb')))
        data = {
            "from": self.from_list,
            "to": self.to_list,
            "cc": self.bcc_list,            
            "subject":self.subject,
            "html": self.__build_message(),
            "text": "",            
        }                                  
        response = requests.post(self.smtp_profile["endpoint"], auth=("api", self.smtp_profile["api"]), data=data, files=fileList)                                
        return True if response.status_code == 200 else False
