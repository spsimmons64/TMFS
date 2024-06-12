import pytz,base64,locale,os,string,secrets,shutil,io,hashlib
from io import BytesIO
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

from argon2 import PasswordHasher

from Crypto.Protocol.KDF import PBKDF2
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from pdf2image import convert_from_path
from uuid import uuid4
from flask import  current_app as app

from cryptography.hazmat.primitives.kdf.pbkdf2 import  PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes



 









def create_password(Password):
    ph = PasswordHasher()        
    new_password = ph.hash(Password)
    return new_password
    
def check_password(hash,password):
        ph = PasswordHasher()        
        try:
            return ph.verify(hash,password)
        except Exception as e:
            print(e)                
            return(False)







def get_sql_date_time():
    return datetime.now(pytz.UTC)

def format_raw_date(date):
    if not isinstance(date,datetime): return datetime.combine(date, datetime.min.time())        
    return date.replace(hour=0, minute=0, second=0, microsecond=0)

def format_short_date(date):
    print(type(date))

def format_date_time(date,format,separator="/"):        
    if not date: return ""            
    new_date = date
    if type(new_date) == str:
        if "T" in date: 
            new_date= datetime.strptime(date, "%Y-%m-%dT%H:%M:%S")
        else:
            new_date= datetime.strptime(date, "%Y-%m-%d")    
    if new_date:
        match(format):
            case "human_date":
                format = f"""%m{separator}%d{separator}%Y"""            
            case "human_date_time":
                format = f"""%m{separator}%d{separator}%Y %I:%M%p"""
            case "sql_date": 
                format = f"""%Y-%m-%d"""
            case "sql_date_time": 
                format = f"""%Y-%m-%d %H:%M:%s"""
            case "full_date":
                format = f"""%m/%d/%Y at %I:%M%p"""
        return(new_date.strftime(format))
    return ""

def get_sql_where_and(sql):
    query_list = sql.split()
    last_conjuct = ""
    for word in query_list:         
        if word.lower() == "where" or word.lower() == "and": last_conjuct = word.upper()    
    return f"""{sql} {"WHERE" if last_conjuct=="" else "AND"}"""


def resize_image(imagefile,max_width=None,max_height=None):
    width,height = imagefile.size
    new_width = width if max_width is None else max_width
    new_height = height if max_height is None else max_height
    aspect = width / height          
    if width > new_width or height > new_height:
        if width/new_width > height/new_height:
            width = new_width
            height = int(new_width / aspect)
        else:
            height = new_height
            width = int(new_height * aspect)
    return imagefile.resize((width,height))        

def get_image(imagefile,max_width=None,max_height=None,encode=True,exif=0):        
    try:
        input_image = Image.open(imagefile)
        if exif:            
            rotated_image =  input_image
            match(exif):
                case 3: rotated_image = input_image.rotate(-180,expand=True)
                case 6: rotated_image = input_image.rotate(-90,expand=True)
                # case 6: rotated_image = input_image.rotate(90,expand=True)
        else:
            rotated_image =  input_image
        new_image = resize_image(rotated_image,max_width,max_height)
        byte_stream = BytesIO()
        new_image.save(byte_stream,format="PNG")
        new_image.close()                
        if encode:
            byte_stream.seek(0)
            return base64.b64encode(byte_stream.read()).decode("utf-8")
        else:                        
            return byte_stream
        
    except Exception as e:        
        print(e)
        return None
    
def generate_logo(recordid,text):
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    logo_path = os.path.join(app.config["PROFILE_PATH"],recordid,"logo")
    font_path = os.path.join(app.config["FONT_PATH"],"Roboto","Roboto-Bold.ttf")
    if not os.path.exists(logo_path): os.makedirs(logo_path)
    logo_file = "logo.png"
    font_size= 80
    font = ImageFont.truetype(font_path,font_size)        
    text_width, text_height = int(font.getlength(text)),50
    image_width = text_width
    image_height = 110
    image = Image.new('RGBA', (image_width, image_height), (0, 0, 0,0))
    draw = ImageDraw.Draw(image)
    x = 0
    y = 0
    draw.text((x+2,y+2),text,fill=(191,191,191),font=font)
    draw.text((x, y), text, fill=(22, 67, 152), font=font)    
    try:        
        image.save(os.path.join(logo_path,logo_file))
    except Exception as e:
        print(e)

def generate_signature(name,recordid,date,ipaddress):
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')            
    name_font_size = 60    
    name_font_path = os.path.join(app.config["FONT_PATH"],"Great_Vibes","GreatVibes-Regular.ttf")
    name_font = ImageFont.truetype(name_font_path,name_font_size)        
    font_size = 16
    font_path = os.path.join(app.config["FONT_PATH"],"Roboto","Roboto-Bold.ttf")
    font = ImageFont.truetype(font_path,font_size)        
    assent,descent = name_font.getmetrics()
    image_height = (assent+descent)    
    name_width = int(name_font.getlength(name))
    image_width = name_width + 340
    image_height = (assent+descent)-12
    image = Image.new('RGBA', (image_width, image_height), (0,0,0,0))
    draw = ImageDraw.Draw(image)
    draw.text((3,3), name, fill=(0, 0, 0), font=name_font)    
    draw.text((name_width+20,20),recordid,fill=(0,0,0),font=font) 
    new_text = f"{date} / {ipaddress}"
    draw.text((name_width+20,36),new_text,fill=(0,0,0),font=font) 
    byte_stream = BytesIO()
    image.save(byte_stream,format="PNG")
    image.close()            
    byte_stream.seek(0)
    return byte_stream.read()

def image_to_base64(imagefile):    
    with open(imagefile, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string

def file_to_image(file):
    image_list = []    
    ext = os.path.splitext(file.filename)[1]
    if ext==".pdf":
        tmp_path = os.path.join(app.config["TEMP_PATH"],str(uuid4()))
        os.makedirs(tmp_path)    
        pdf_file = os.path.join(tmp_path,file.filename)        
        try:
            file.save(pdf_file)        
        except Exception as e:
            print(e)        
        pages = convert_from_path(pdf_file)
        for page in pages: image_list.append({"image":page,"type":ext})    
        shutil.rmtree(tmp_path)        
    else:
        img_data = file.read()
        image = Image.open(io.BytesIO(img_data))
        image_list.append({"image":image,"type":ext})
    return image_list

    
def format_reseller_email(res_rec):
    if res_rec["ismaster"]:
        return f'{res_rec["companyname"]} <noreply@{res_rec["sitedomain"]}>'
    else:
        return f'{res_rec["companyname"]} <noreply@{res_rec["siteroute"]}.{res_rec["sitedomain"]}'
        
def format_reseller_link(res_rec):
    return f'https://{res_rec["siteroute"]}.{res_rec["sitedomain"]}'

def local_date_time(datestr,timezone="America/New_York"):  
    target_timezone = pytz.timezone(timezone)        
    return datestr.replace(tzinfo=pytz.utc).astimezone(target_timezone)

def calc_sql_page(page,limit):
    new_page = int(page)
    new_limit = int(limit)
    offset = (new_page-1) * new_limit    
    return f""" LIMIT {new_limit} OFFSET {offset}"""

def convert_outgoing_payload(table,payload):
    converted_payload = {}
    for key in payload.keys():converted_payload[f'{table}_{key}'] = payload[key]
    return(converted_payload)

def convert_incoming_payload(payload):
    converted_payload = {}
    for key in payload.keys():        
        new_key = key
        pos = new_key.find("_")
        converted_payload[new_key[pos+1:]] = payload[key] if pos > -1 else payload[key]
    return(converted_payload)

def convert_to_number(data):
    cvt_data = ("".join(char for char in str(data) if char.isdigit() or char in ('-', '.')))
    return cvt_data if cvt_data else 0
                                
def format_telephone (payload): 
    if payload:
        digits_only = ''.join(filter(str.isdigit, payload))    
        if len(digits_only) == 10:        
            formatted_number = f'({digits_only[:3]}) {digits_only[3:6]}-{digits_only[6:]}'
            return formatted_number    
    return ""

def format_currency(payload):
    if not payload: return "$0.00"
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    return locale.currency(payload, grouping=True)

def generate_key_pair():
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for _ in range(16))
    salt = get_random_bytes(16)
    return salt,password

def derive_key(password, salt):
    return PBKDF2(password, salt, dkLen=32)  # 32 bytes (256 bits) key

def encrypt_with_salt(message,salt,password):        
    key = derive_key(password, salt)
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())
    return base64.b64encode(cipher.nonce + tag + ciphertext)

def decrypt_with_salt(encrypted_message, salt, password):
    key = derive_key(password, salt)
    encrypted_message = base64.b64decode(encrypted_message)
    nonce = encrypted_message[:16]
    tag = encrypted_message[16:32]
    ciphertext = encrypted_message[32:]
    try:
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        decrypted_message = cipher.decrypt_and_verify(ciphertext, tag)
        return decrypted_message.decode().replace("\n","")
    except:
        return ""
    
def set_record_prefix(prefix,rec):            
    if not rec: return rec
    if type(rec)==list: 
        new_rec_list = []
        for r in rec:
            new_rec = {}            
            for key in r.keys():                
                new_rec[f"{prefix}_{key}"] = r[key]
            new_rec_list.append(new_rec)
        return new_rec_list
    else:        
        new_rec = {}
        for key in rec.keys():new_rec[f"{prefix}_{key}"] = rec[key]
        return new_rec

def strip_record_prefix(prefix,rec):    
    if isinstance(rec,list):        
        new_list = []        
        for obj in rec:
            new_rec = {}
            for key in obj.keys():                                
                if key[0:3] == prefix:new_rec[key[4:]] = obj[key] 
            new_list.append(new_rec)
        return new_list
    else:        
        new_rec = {}
        for key in rec.keys():
            if key[0:3] == prefix:new_rec[key[4:]] = rec[key]
        return new_rec
    
    