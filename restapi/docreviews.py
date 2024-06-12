import copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class DocReviews(Resource): 
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
            {"id":1,"docdate":"09/14/2023","type":"I83014","url":"http://dummyimage.com/149x100.png/ff4444/ffffff","description":"Black Magic Rites & the Secret Orgies of the 14th Century (Riti, magie nere e segrete orge nel trecento...)"},
            {"id":2,"docdate":"07/21/2023","type":"S52201K","url":"http://dummyimage.com/136x100.png/ff4444/ffffff","description":"Bangkok Dangerous"},
            {"id":3,"docdate":"02/24/2024","type":"S29012","url":"http://dummyimage.com/247x100.png/cc0000/ffffff","description":"One-Eyed Monster"},
            {"id":4,"docdate":"07/10/2023","type":"F181","url":"http://dummyimage.com/245x100.png/5fa2dd/ffffff","description":"Disclosure"},
            {"id":5,"docdate":"12/25/2023","type":"S82251F","url":"http://dummyimage.com/129x100.png/ff4444/ffffff","description":"Thanksgiving Family Reunion (National Lampoon's Holiday Reunion)"},
            {"id":6,"docdate":"11/21/2023","type":"S95201S","url":"http://dummyimage.com/184x100.png/dddddd/000000","description":"Under the Bridges (Unter den Brücken)"},
            {"id":7,"docdate":"03/25/2024","type":"T337","url":"http://dummyimage.com/165x100.png/dddddd/000000","description":"Bride of Frankenstein, The (Bride of Frankenstein)"},
            {"id":8,"docdate":"12/04/2023","type":"S66319","url":"http://dummyimage.com/144x100.png/ff4444/ffffff","description":"Fun with Dick and Jane"},
            {"id":9,"docdate":"10/30/2023","type":"O24819","url":"http://dummyimage.com/208x100.png/dddddd/000000","description":"Ruby Gentry"},
            {"id":10,"docdate":"12/30/2023","type":"M60119","url":"http://dummyimage.com/199x100.png/dddddd/000000","description":"Must Have Been Love"}
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