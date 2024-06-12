import pprint,base64,json,copy
from io import BytesIO
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Settings(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = convert_incoming_payload(request.args.to_dict() if request.method == "GET" else request.form.to_dict())
        self.params = []

    def put(self,user):
        print(self.payload)
        rec = copy.deepcopy(self.payload)                
        rec["deleted"] = None        
        upd_rec = Database().update("resellers",rec)
        if upd_rec:return build_response(status=200,message=f"The Profile Was Updated Successfully.")
        return build_response(status=400,message="The Profile Was Not Updated. Contact Support")            