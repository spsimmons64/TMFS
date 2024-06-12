import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class DriverFlags(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []


    def __set_sql_where(self):        
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(employername,contactlastname,contactfirstname,emailaddress,notes,updatedby) like %s"""
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "employername": sort =f"""a.employername {order}"""
                case "contactname": sort = f"""a.contactlastname {order}, a.contactfirstname {order}"""
                case "emailaddress": sort = f"""a.emailaddress {order}"""
                case "updatedby": sort = f"""a.updatedby {order}"""
                case "added": sort = f"""a.added {order}"""
                case "updated": sort = f"""a.updated {order}"""
                case __: sort= "a.employername"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql        
        

    def __serialize(self,record,user):        
        new_rec = Database().assign("docreviews",record)        
        return new_rec
                          
    def get(self,user):
        data = [
            {"id":1,"added":"04/18/2023","drivername":"Karlan Teaz","reason":"4 - Masonry"},
            {"id":2,"added":"03/27/2024","drivername":"Tera Rounsivall","reason":"14 - Conveying Systems"},
            {"id":3,"added":"07/03/2023","drivername":"Bald Keitch","reason":"2-320 - Excavation and Fill"},
            {"id":4,"added":"11/06/2023","drivername":"Luce Dougary","reason":"15-050 - Basic Mechanical Materials and Methods"},
            {"id":5,"added":"04/20/2023","drivername":"Mara Cottrill","reason":"3-000 - General"},
            {"id":6,"added":"03/04/2024","drivername":"Jeane MacLleese","reason":"5-400 - Cold-Formed Metal Framing"},
            {"id":7,"added":"09/25/2023","drivername":"Ambrose Fabler","reason":"11-680 - Office Equipment"},
            {"id":8,"added":"10/15/2023","drivername":"Maxi Ovenell","reason":"3-310 - Expansion Joints"},
            {"id":9,"added":"09/16/2023","drivername":"Kile Waddell","reason":"13-550 - Transportation Control Instrumentation"},
            {"id":10,"added":"01/24/2024","drivername":"Audrey Ridde","reason":"3-300 - Footings"}        
        ]
        return build_response(status=200,data=data,count=10)
        # sql = f"""SELECT a.*FROM peiemployers a WHERE 1=1 {self.__set_sql_where()}"""        
        # rec_set,rec_count = Database().query(sql,tuple(self.params))
        # data = [ self.__serialize(r,user) for r in rec_set]        
        # return build_response(status=200,data=data,count=rec_count)
    
    def post(self,user):               
        err_list = self.__validate(user)    
        if err_list != False: return err_list           
        return build_response(status=400,message="The PEI Employer Was Not Added. Contact Support")            
        
    def put(self,user):
        err_list = self.__validate(user)    
        if err_list != False: return err_list                   
        return build_response(status=400,message="The PEI Employer Was Not Updated. Contact Support")            

    def delete(self,user):
        return build_response(status=400,message="The PEI Employer Was Not Deactivated. Contact Support")            