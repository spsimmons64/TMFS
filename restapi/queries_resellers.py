from database import Database
from queries import *
from templates.pdf import outputpdf


def get_reseller(id,iso=False):
    return Database().fetch("reseller",id)
    
def get_reseller_email(id,emailtype):
    eml_set,eml_cnt = Database().query("SELECT * FROM emails WHERE resourceid=%s AND emailtype=%s AND deleted IS NULL",(id,emailtype))
    return eml_set[0] if eml_cnt else {}

def get_reseller_logo_file(rec):
    fil_rec,fil_cnt = Database().query("SELECT * FROM profilefiles WHERE resourceid=%s AND uploadtype='logo' AND deleted is NULL",(rec))
    if fil_cnt:
        logo_path = os.path.join(app.config["PROFILE_PATH"], rec, "logo", fil_rec[0]["filename"])
        if os.path.exists(logo_path): return logo_path
    return ""

def get_reseller_smtp(id):
    return Database().fetch("smtpprofiles",id)    
    

