import datetime,sys,os
from database import Database

def update_driver_rec(record):
    return Database().update("drivers",record)

def format_date(date):
    return date.replace(hour=0, minute=0, second=0, microsecond=0)

def processDriverDates():
    disqualified = False
    today = format_date(datetime.datetime.today())
    sql = "SELECT a.* FROM driverdates a JOIN drivers b ON b.recordid=a.driverid AND b.status <> 'inactive' AND b.deleted IS NULL WHERE a.deleted IS NULL"
    dat_set,dat_cnt = Database().query(sql)
    for dat_rec in dat_set:        
        drv_rec = Database().fetch("drivers",dat_rec["driverid"])
        #New Status
        if drv_rec and drv_rec["status"] == "new":    
            dat_rec["newstatus"] = 0
            datedif = (today - format_date(dat_rec["new"])).days
            if datedif > 30:
                dat_rec["newstatus"] = 2
                drv_rec["status"] = "inactive"
                update_driver_rec(drv_rec)
            if 0 < datedif < 30:
                dat_rec["newstatus"] = 1
        #Pending Status
        if drv_rec and drv_rec["status"] == "pending":    
            dat_rec["pendingstatus"] = 0
            datedif = (today - format_date(dat_rec["pending"])).days
            if datedif > 45:
                dat_rec["pendingstatus"] = 2
                drv_rec["status"] = "inactive"
                update_driver_rec(drv_rec)
            if 0 < datedif < 45:
                dat_rec["pendingstatus"] = 1
        #Inactive Status
        if drv_rec and drv_rec["status"] == "inactive":                
            datedif = (today - format_date(dat_rec["inactive"])).days
            if datedif > 20:                
                drv_rec["status"] = "purged"
                update_driver_rec(drv_rec)
        #Annual Review
        dat_rec["annualreviewstatus"] = 0
        if dat_rec["annualreview"]:
            datedif = (today - format_date(dat_rec["annualreview"])).days
            if datedif > 365:
                disqualified = True
                dat_rec["annualreviewstatus"] = 2
            if 0 < datedif < 30:
                dat_rec["annualreviewstatus"] = 1   
        #Clearinghouse
        dat_rec["clearinghousestatus"] = 0
        if dat_rec["clearinghouse"]:            
            datedif = (today - format_date(dat_rec["clearinghouse"])).days
            if datedif > 365:
                disqualified = True
                dat_rec["clearinghousestatus"] = 2
            if 0 < datedif < 30:
                dat_rec["clearinghousestatus"] = 1
        #PSP Reports
        dat_rec["pspreportstatus"] = 0
        if dat_rec["pspreport"]:
            datedif = (today - format_date(dat_rec["pspreport"])).days
            if datedif > 365:
                disqualified = True
                dat_rec["pspreportstatus"] = 2
            if 0 < datedif < 30:
                dat_rec["pspreportstatus"] = 1
        #MVR Reports
        dat_rec["mvrreportstatus"] = 0
        if dat_rec["mvrreport"]:
            datedif = (today - format_date(dat_rec["mvrreport"])).days            
            if datedif > 365:
                disqualified = True
                dat_rec["mvrreportstatus"] = 2
            if 0 < datedif < 30:
                dat_rec["mvrreportstatus"] = 1
        #CDLIS Reports
        dat_rec["cdlisreportstatus"] = 0
        if dat_rec["cdlisreport"]:
            datedif = (today - format_date(dat_rec["cdlisreport"])).days
            if datedif > 365:
                disqualified = True
                dat_rec["cdlisreportstatus"] = 2
            if 0 < datedif < 30:
                dat_rec["cdlisreportstatus"] = 1
        #Medical Certificate 
        dat_rec["medcardstatus"] = 0
        if dat_rec["medcard"]:
            datedif = (format_date(dat_rec["medcard"])-today).days            
            if datedif < 0:
                disqualified = True
                dat_rec["medcardstatus"] = 2
            if 0 < datedif < 30:
                dat_rec["medcardstatus"] = 1
        #Driver's License
        dat_rec["licensestatus"] = 0
        if dat_rec["licenseexpire"]:
            datedif = (format_date(dat_rec["licenseexpire"])-today).days
            if datedif < 0:
                disqualified = True
                dat_rec["licensestatus"] = 2
            if 0 < datedif < 30:
                dat_rec["licensestatus"] = 1
        if disqualified:
            drv_rec["status"] = "disqualified"
            update_driver_rec(drv_rec)
        Database().update("driverdates",dat_rec)

if __name__ == "__main__":
    processDriverDates()
