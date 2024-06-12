from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from combos import Combos
from login import Login
from users import Users
from resellers import Resellers
from accounts import Accounts
from drivers import Drivers
from faqarticles import FAQs
from kbarticles import KBArticles
from peiemployers import PEIEmployers
from affiliates import Affiliates
from consultants import Consultants
from pricing import Pricing
from notes import Notes
from smtpprofiles import SMTPProfiles
from apiprofiles import APIProfiles
from settinigs import Settings
from appprofile import AppProfile
from userlogs import UserLogs
from accountflags import AccountFlags
from transactions import Transactions
from fetchnocors import FetchNoCors
from thirdpartyads import ThirdPartyAds
from docreviews import DocReviews
from driverflags import DriverFlags
from esignatures import ESignatures
from driverdocuments import DriverDocuments

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile("config.py")

api = Api(app)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

api.add_resource(AppProfile, "/profile")

api.add_resource(FetchNoCors, "/fetchobj/login",endpoint="fetch-login")
api.add_resource(FetchNoCors, "/fetchobj/reseller",endpoint="fetch-reseller")
api.add_resource(FetchNoCors, "/fetchobj/account",endpoint="fetch-account")
api.add_resource(FetchNoCors, "/fetchobj/account/validate",endpoint="validate-account")
api.add_resource(FetchNoCors, "/fetchobj/account/calculate",endpoint="calc-account")
api.add_resource(FetchNoCors, "/fetchobj/account/adpolicy",endpoint="fetch-ad-policy")
api.add_resource(FetchNoCors, "/fetchobj/account/gwpolicy",endpoint="fetch-gw-policy")
api.add_resource(FetchNoCors, "/fetchobj/driver/application",endpoint="driver-application")
api.add_resource(ESignatures, "/signatures/lookup",endpoint="signature-lookup")
api.add_resource(ESignatures, "/signatures/create",endpoint="signature-create")
api.add_resource(Combos, "/combos/feetypes", endpoint="combo-feetypes")
api.add_resource(Combos, "/combos/resellers", endpoint="combo-resellers")
api.add_resource(Combos, "/combos/accounts", endpoint="combo-accounts")
api.add_resource(Combos, "/combos/consultants", endpoint="combo-consultants")
api.add_resource(Combos, "/combos/smtpprofiles", endpoint="combo-smtpprofiles")
api.add_resource(Combos, "/combos/pricing", endpoint="combo-pricing")
api.add_resource(Login, "/login", endpoint="login")
api.add_resource(Login, "/login/forgotpwd", endpoint="forgot")
api.add_resource(Login, "/login/checkreset", endpoint="check")
api.add_resource(Login, "/login/resetpwd", endpoint="reset")
api.add_resource(Login, "/login/profile", endpoint="profile")
api.add_resource(Resellers, "/resellers")
api.add_resource(Resellers, "/resellers/profile", endpoint="reseller-profile")
api.add_resource(Resellers, "/resellers/policies", endpoint="reseller-policies")
api.add_resource(Resellers, "/resellers/logo", endpoint="reseller-logo")
api.add_resource(Resellers, "/resellers/invite", endpoint="reseller-invite")
api.add_resource(Accounts, "/accounts")
api.add_resource(Accounts, "/accounts/consultants", endpoint="account-consultant")
api.add_resource(Accounts, "/accounts/resellers", endpoint="account-reseller")
api.add_resource(Accounts, "/accounts/affiliates", endpoint="account-affiliate")
api.add_resource(Accounts, "/accounts/policies", endpoint="account-policies")
api.add_resource(Accounts, "/accounts/logo", endpoint="account-logo")
api.add_resource(Accounts, "/accounts/consultants/count", endpoint="account-consultant-count")
api.add_resource(Drivers,"/drivers")
api.add_resource(DocReviews,"/docreviews")
api.add_resource(DriverFlags,"/driverflags")
api.add_resource(DriverDocuments,'/driverdocs')
api.add_resource(DriverDocuments,'/driverdocs/fetch',endpoint="driverdocs_fetch")
api.add_resource(Transactions, "/transactions")
api.add_resource(Transactions, "/transactions/resellers", endpoint="transactions-reseller")
api.add_resource(Transactions, "/transactions/accounts", endpoint="transactions-account")
api.add_resource(AccountFlags, "/accountflags")
api.add_resource(Users, "/users")
api.add_resource(Pricing, "/pricing")
api.add_resource(FAQs, "/faqs")
api.add_resource(FAQs, "/faqs/move", endpoint="faq-move")
api.add_resource(KBArticles, "/kbarticles")
api.add_resource(KBArticles, "/kbarticles/move", endpoint="kb-move")
api.add_resource(PEIEmployers, "/peiemployers")
api.add_resource(Affiliates, "/affiliates")
api.add_resource(Consultants, "/consultants")
api.add_resource(Consultants, "/consultants/profile", endpoint="consultant-profile")
api.add_resource(Notes, "/notes")
api.add_resource(Notes, "/notes/resellers", endpoint="resellers-notes")
api.add_resource(Notes, "/notes/accounts", endpoint="accounts-notes")
api.add_resource(Notes, "/notes/consultants", endpoint="consultants-notes")
api.add_resource(SMTPProfiles, "/smtpprofiles")
api.add_resource(APIProfiles, "/apiprofiles")
api.add_resource(APIProfiles, "/apiprofiles/fetch/price",endpoint="fetch_price")
api.add_resource(Settings, "/settings")
api.add_resource(UserLogs, "/userlogs")
api.add_resource(ThirdPartyAds,"/thirdpartyads")

if __name__ == "__main__":
    if app.config["DEBUG"]==True:
        app.run(
            host="0.0.0.0",
            ssl_context=(app.config["LOCAL_CERT_FILE"], app.config["LOCAL_KEY_FILE"]),
            debug=True,
        )
    else:
        app.run(host="0.0.0.0")