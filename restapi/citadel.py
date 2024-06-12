
from io import BytesIO
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

from cryptography.hazmat.primitives.kdf.pbkdf2 import  PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes

class Citadel (Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []
        self.referencetypes = {            
            "socialsecurity": 0,            
            "esignature_ssn": 1,
            "password": 2      
        }
    def get_hash(self,raw_string):
        return hashlib.sha256(raw_string.encode()).hexdigest()

    def derive_encryption_key(password,salt):
        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(),length= 32,salt=salt,iterations=100000,backend=default_backend())
        return kdf.derive(password)
    
    def encrypt(self,raw_string,salt):            
        iv = app.config["GLOBAL_TOKEN_ID"].encode("utf-8")
        password = app.config["GLOBAL_TOKEN_KEY"].encode('utf-8')                
        key = derive_key(password, salt)        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        hash_str = self.get_hash(raw_string)    
        padded_string = raw_string.ljust(32)      
        encrypted_string = encryptor.update(padded_string.encode()) + encryptor.finalize()
        return hash_str,salt,base64.b64encode(salt + iv + encrypted_string).decode()

    def decrypt(self,encrypted_string):
        iv = app.config["GLOBAL_TOKEN_ID"].encode("utf-8")
        password = app.config["GLOBAL_TOKEN_KEY"].encode('utf-8')                
        encrypted_strign_bytes = base64.b64decode(encrypted_string)
        salt = encrypted_strign_bytes[:16]        
        encrypted_data = encrypted_strign_bytes[32:]
        key = derive_key(password, salt)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_string = decryptor.update(encrypted_data) + decryptor.finalize()
        return padded_string.decode().strip()    
    
    def encrypt_store(self,raw_string,referencetype):
        salt = os.urandom(16)
        encrypted = self.encrypt(raw_string,salt)
        if self.new_citadel(encrypted[0],referencetype,encrypted[1]): return encrypted[2] if encrypted[2] else ""

    def new_citadel(self,referenceid,referencetype,referencekey):        
        ref_rec = Database().prime("citadel")
        ref_rec["referenceid"] = referenceid
        ref_rec["referencetype"] =  self.referencetypes[referencetype]
        ref_rec["referencekey"] = referencekey
        return Database().insert("citadel",ref_rec)
    
    def fetch_citadel(self,referenceid,referencetype):        
        hash_str = self.get_hash(referenceid)
        sql = "SELECT * FROM citadel WHERE referenceid=%s and referencetype=%s AND deleted IS NULL"
        ref_set,ref_cnt = Database().query(sql,(hash_str,self.referencetypes[referencetype]))
        return ref_set[0] if ref_cnt else False
