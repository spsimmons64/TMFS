import os,jwt
from flask import make_response,request,current_app as app
from functools import wraps
from database import Database

def build_response(status=200, data=None, count=None, message=None, total=None, errors=None):
    result = {"status": status}
    result["data"] = data if data is not None else None
    result["message"] = message if message is not None else ""
    result["errors"] = errors if errors is not None else []
    result["count"] = count if count is not None else 0
    result["total"] = total if total is not None else 0
    response = make_response(result, 200)
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = request.headers["Origin"]
    response.headers['Access-Control-Allow-Methods'] = "GET,POST,OPTIONS,HEAD"
    response.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    return response

def check_token(f):    
    @wraps(f)
    def decorator(*args, **kwargs):                
        token = request.cookies.get("TMFSCorpToken")                
        if not token: return build_response(status=400, message="Invalid Token...Contact Support",data="logout")
        try:                    
            data = jwt.decode(token.encode("utf-8"),app.config['SECRET_KEY'], algorithms=['HS256'])                                                               
            usr_rec = Database().fetch("users",data["recordid"])
        except:
            return build_response(status="error", message="Missing or Invalid Token...Contact Support")
        return f(usr_rec, *args, **kwargs)
    return decorator
