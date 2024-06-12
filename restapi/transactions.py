import pprint,copy
from flask_restful import Resource, request, current_app as app
from database import Database
from api_response import build_response,check_token
from toolbox import *
from queries import *

class Transactions(Resource): 
    method_decorators = [check_token]   
    def __init__(self):
        self.payload = request.args.to_dict() if request.method == "GET" else request.form.to_dict()
        self.params = []

    #=============================================================================================================================================
    # Tranaction Setter Methods
    #=============================================================================================================================================
    def put_api_transaction(self,accountid,api_code,description="",state=""):
        complete = False
        api_set,api_cnt = Database().query("SELECT * FROM apiprofiles WHERE apitype=%s AND deleted IS NULL",(api_code))        
        pay_set,pay_cnt = Database().query("SELECT * FROM payprofiles WHERE resourceid=%s AND deleted IS NULL",(accountid))        
        if api_cnt and pay_cnt:            
            pay_rec = pay_set[0]
            params = [api_set[0]["recordid"]]
            sql = "SELECT * FROM apipricing WHERE apiprofileid=%s AND deleted IS NULL"
            if state: 
                sql = f"{sql} AND state=%s"
                params.append(state)
            pri_set,pri_cnt = Database().query(sql,params)
            if pri_cnt:
                tra_rec = Database().prime("transactions")
                if tra_rec:
                    tra_rec["accountid"] = accountid
                    tra_rec["apipricingid"] = pri_set[0]["recordid"] 
                    tra_rec["payprofileid"] = pay_rec["recordid"]
                    tra_rec["transmethod"] = -1
                    tra_rec["quantity"] = 1
                    tra_rec["transamount"] = pri_set[0]["price"]
                    tra_rec["description"] = description
                    if Database().insert("transactions",tra_rec): complete = True
        return complete














    def __set_sql_where(self):
        sql=""
        if "inactive" in self.payload and self.payload["inactive"] == "false":
            sql = f"""{sql} AND a.deleted IS NULL"""       
        if "search" in self.payload and self.payload["search"] != "":
            sql = f"""{sql} AND CONCAT(a.description,a.username) like %s"""            
            self.params.append(f"""%{self.payload["search"]}%""")            
        if "sortcol" in self.payload and self.payload["sortcol"] != "":            
            sort = ""
            order = self.payload["sortdir"]
            match (self.payload["sortcol"]):
                case "added": sort =f"""a.added {order}"""
                case "status": sort = f"""a.status"""
                case "description": sort = f"""a.description {order}"""
                case "type": sort = f"""a.transmethod {order}"""
                case "amount": sort = f"""transamount {order}"""
                case "username": sort = f"""a.username {order}"""                
                case __: sort= "a.added desc"
            if sort != "": sql=f"""{sql} ORDER BY {sort}"""    
        if "page" in self.payload and "limit" in self.payload:
            sql = f"""{sql}{calc_sql_page(self.payload["page"],self.payload["limit"])}"""
        return sql

    def __account_serialize(self,record,user):        
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("accounts",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")                  
        new_rec["telephone"] = format_telephone(new_rec["telephone"])
        sql = "SELECT * FROM accountflags WHERE accountid=%s and consultantcleared IS NULL and resellercleared IS NULL and deleted IS NULL ORDER BY added DESC"
        rec_set,count = Database().query(sql,(record["recordid"]))
        flag_data = []
        for rec in rec_set:             
            flag_data.append({"date":format_date_time(local_date_time(rec["added"],res_rec["timezone"]),"human_date_time"),"text":rec["flagreason"]})
        new_rec["accountflags"] = {"count":count,"data":flag_data}
        new_rec["documents"] = {"count":1}
        return new_rec
    
    def __reseller_serialize(self,record,user):                
        res_rec = get_reseller_from_user(user["recordid"])
        new_rec = Database().assign("transactions",record)        
        new_rec["added"] = format_date_time(local_date_time(record["added"],res_rec["timezone"]),"human_date")                  
        new_rec["transamount"] = format_currency(new_rec["transamount"]*new_rec["transmethod"])
        new_rec["companyname"] = record["companyname"]        
        new_rec["username"] = record["username"]        
        return new_rec

    def __account_transactions(self,user):        
        self.params = [self.payload["parentid"]]      
        sql = f"""SELECT a.*,IFNULL(b.companyname,"N/A") as companyname,IFNULL(CONCAT(c.firstname," ",c.lastname),'System') as username 
                  FROM transactions a 
                  LEFT JOIN accounts b on b.recordid=a.accountid 
                  LEFT JOIN users c on c.recordid =a.userid
                  WHERE a.accountid=%s AND a.deleted is NULL {self.__set_sql_where()}"""                  
        rec_set,rec_count = Database().query(sql,tuple(self.params))
        data = [ self.__reseller_serialize(r,user) for r in rec_set]        
        return build_response(status=200,data=data,count=rec_count)
    
    def get(self,user):   
        if request.endpoint=="transactions-account": return self.__account_transactions(user)
        if request.endpoint=="transactions-reseller": return self.__reseller_transactions(user)
     
    def post(self,user):                
        errors = self.__validate(user)          
        if errors: return errors        
        rec = copy.deepcopy(self.payload)                        
        rec["userid"] = user["recordid"]
        new_rec = Database().insert("transactions",rec)                           
        if new_rec:                     
            return build_response(status=200,message=f"The Transaction Was Posted Successfully.")
        return build_response(status=400,message="The Transaction Was Not Posted. Contact Support!")            