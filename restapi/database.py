from pprint import pprint
from toolbox import *
import pymysql
import pymysql.cursors
from uuid import uuid4
from datetime import datetime
from flask import current_app as app

MYSQL_NUMERIC = ("INT", 'TINYINT', 'SMALLINT', 'MEDIUMINT','BIGINT', 'DECIMAL', 'FLOAT', 'DOUBLE', "NUMERIC")
MYSQL_DATE = ("DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR")
MYSQL_STRING = ("CHAR", "VARCHAR", "TEXT")
MYSQL_SPACIAL = ("GEOMETRY", "POINT", "LINESTRING", "POLYGON","MULTIPOINT", "MULTILINESTRING", "GEOMETRYCOLLECTION")
MYSQL_BINARY = ("BINARY", "VARBINARY", "BLOB", "ENUM", "SET", "BIT")
MYSQL_JSON = ("JSON")

class Database():
    def __init__(self):
        self.server = app.config["DATABASE_URL"]
        self.catalog = app.config["DATABASE_CAT"]
        self.user = app.config["DATABASE_UID"]
        self.pwd = app.config["DATABASE_PWD"]
        self.port = app.config["DATABASE_PRT"]
        self.deactivate_field = "deactivated"

    def __write_log_error(self, errnum, errmsg, sql=""):
        log_file = app.config["DATABASE_LOG"]
        with open(log_file, "a") as file:
            file.write(f"""[{format_date_time(datetime.now(),"sql_date_time")}]\n""")
            file.write(f"""[Error Number] {errnum}\n""")
            file.write(f"""[Error Msg] {errmsg}\n""")
            file.write(f"""[SQL] {sql}\n""")
            file.write(f"""{"-"*120}\n""")

    def __connect(self):
        conn = pymysql.connect(host=self.server, port=self.port, user=self.user,
                               password=self.pwd, db=self.catalog, cursorclass=pymysql.cursors.DictCursor)
        if not conn:
            raise AssertionError("Unable To Connect To The Database")
        else:
            return (conn)

    def __get_columns(self, table):
        columns = []
        sql = """SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s ORDER BY ORDINAL_POSITION"""
        cols, count = self.query(sql, [self.catalog, table])
        if not len(cols):
            raise AssertionError(
                f"""Unable To Locate Columns For Table {table}.""")
        else:
            for col in cols:
                columns.append({
                    "name": col["COLUMN_NAME"],
                    "type": col["DATA_TYPE"],
                    "length": col["CHARACTER_MAXIMUM_LENGTH"],
                    "allow_null": col["IS_NULLABLE"],
                })
        return columns

    def __get_pk(self, table):
        pk = ""
        sql = """SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s AND COLUMN_KEY=%s"""
        cols, count = self.query(sql, [self.catalog, table, "PRI"])
        if not cols:
            raise AssertionError(
                f"""Unable To Locate Primary  Key For Table {table}.""")
        else:
            pk = cols[0]["COLUMN_NAME"]
        return pk

    def search_list(self, table, alias=""):
        key_list = []
        try:
            cols = self.__get_columns(table)
            key_list = [
                f"""{alias if alias else ""}{'.' if alias else ""}{item["name"]}""" for item in cols]
        except AssertionError as e:
            print(e)
        finally:
            return key_list

    def fetch(self, table, id):
        record = {}
        try:
            pk = self.__get_pk(table)
            sql = f"""SELECT * FROM {table} WHERE {pk}=%s"""
            rec_set, count = self.query(sql, [id])
            if rec_set:
                record = rec_set[0]
        except AssertionError as e:
            print(e)
        finally:            
            return record

    def query(self, sql, params=None):        
        conn = self.__connect()             
        if sql[:6] == "SELECT" : sql = f"""SELECT SQL_CALC_FOUND_ROWS {sql[7:]}"""        
        if conn:
            try:
                cur = conn.cursor()
                conn.begin()                
                cur.execute(sql, params)                
                if "SELECT" in sql:                    
                    data = cur.fetchall()
                    data = data if data else []                                         
                    cur.execute("""SELECT FOUND_ROWS() as count""")
                    count = cur.fetchone()                                      
                    return  data,count["count"]
                else:                    
                    return True
            except pymysql.Error as e:                
                self.__write_log_error(e.args[0], e.args[1], sql)
                return [],0 if "SELECT" in sql else False
            finally:
                conn.commit()
                cur.close()
                conn.close()

    def assign(self, table, payload):
        record = {}        
        cols = self.__get_columns(table)
        for key in payload.keys():
            col = next((d for d in cols if d.get("name") == key), None)            
            if col: record[key] = payload[key]            
        return record

    def prime(self, table):
        record = {}
        cols = self.__get_columns(table)            
        for col in cols:                
            d_type = col["type"].upper()                        
            if d_type in MYSQL_STRING: record[col["name"]] = None if col["allow_null"]=="YES" else ""
            if d_type in MYSQL_DATE: record[col["name"]] = None if col["allow_null"]=="YES" else ""
            if d_type in MYSQL_JSON: record[col["name"]] = None if col["allow_null"]=="YES" else ""
            if d_type in MYSQL_SPACIAL: record[col["name"]] = None if col["allow_null"]=="YES" else ""
            if d_type in MYSQL_BINARY: record[col["name"]] = None if col["allow_null"]=="YES" else ""
            if d_type in MYSQL_NUMERIC: record[col["name"]] = None if col["allow_null"]=="YES" else 0            
        return record
    
    def sanitize(self,table,record):
        new_rec = {}
        columns = self.__get_columns(table)                                
        for col in columns:                                    
            if col["name"] in record:                
                d_type = col["type"].upper()                
                if d_type in MYSQL_STRING:   
                    new_rec[col["name"]] = record[col["name"]][:col["length"]] if record[col["name"]] else ""                                        
                if d_type in MYSQL_DATE:
                    new_rec[col["name"]] = record[col["name"]] if record[col["name"]] else None
                if d_type in MYSQL_JSON:
                    new_rec[col["name"]] = record[col["name"]]
                if d_type in MYSQL_SPACIAL:
                    new_rec[col["name"]] = record[col["name"]]
                if d_type in MYSQL_BINARY:
                    new_rec[col["name"]] = record[col["name"]]
                if d_type in MYSQL_NUMERIC:      
                    if record[col["name"]]==None or record[col["name"]]=="": record[col["name"]]=0
                    if col["type"].upper() =="TINYINT":                        
                        if record[col["name"]]==1 or record[col["name"]]==0 or record[col["name"]]==True or record[col["name"]]==False:
                            new_rec[col["name"]]=record[col["name"]]
                        elif record[col["name"]]=="true" or record[col["name"]]=="false":                                                
                            if record[col["name"]]=="true": new_rec[col["name"]] = 1                    
                            if record[col["name"]]=="false": new_rec[col["name"]] = 0        
                    else:                                            
                        cvt_number = "".join(char for char in str(record[col["name"]]) if char.isdigit() or char in ('-', '.'))                            
                        new_rec[col["name"]] = cvt_number
        return(new_rec)

    def insert(self, table, record): 
        pk = self.__get_pk(table)        
        san_rec = self.sanitize(table,record)            
        new_rec = Database().prime(table)
        new_rec.update(san_rec) 
        new_rec[pk] = str(uuid4())      
        keys_list = new_rec.keys()
        values_list = tuple(new_rec.values())            
        sql = f"""INSERT INTO {table}({",".join(keys_list)}) VALUES (%s{",%s"*(len(keys_list)-1)})"""                
        if self.query(sql,values_list): return self.fetch(table, new_rec[pk])

    def update(self, table, record):        
        pk = self.__get_pk(table)                
        san_rec = self.sanitize(table,record)             
        
        new_rec = Database().fetch(table,record[pk])
        new_rec.update(san_rec)                        
        update_list = []
        values_list = []
        for key in new_rec.keys():
            if key == pk:continue        
            update_list.append(f"""{key}=%s""")
            values_list.append(new_rec[key])        
        values_list.append(new_rec[pk])        
        sql = f"""UPDATE {table} SET {",".join(update_list)} WHERE {pk}=%s"""
        if self.query(sql, values_list):return self.fetch(table, new_rec[pk])
        
    def delete(self, table, recordid):        
        pk = self.__get_pk(table)
        sql = f"""UPDATE {table} SET deleted=%s WHERE {pk}=%s"""
        if self.query(sql, (get_sql_date_time(), recordid)): return self.fetch(table, recordid)
