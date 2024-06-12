import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../components/portals/formstyles";
import { YesNo, initYesNoState } from "../../components/portals/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { TabContainer } from "../../components/portals/tabcontainer";
import { Demographics } from "./demographics";
import { BillingSetup } from "./billingsetup";
import { Policies } from "./policies";
import { AccountSetup } from "./accountsetup";
import { billingMethodTypes, domains } from "../../global/staticdata";
import { Emails } from "./emails";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";

export const ResellerForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [tabSelected, setTabSelected] = useState(0)
    const tabMenu = [
        { text: `Account Setup`, key: 0 },
        { text: `Demographics`, key: 1, hidden: assets.record.res_recordid ? false : true },
        { text: `Contact Emails`, key: 2, hidden: assets.record.res_recordid ? false : true },
        { text: `Billing And Fees`, key: 3, hidden: assets.record.res_recordid ? false : true },
        { text: `Workplace Policies`, key: 4, hidden: assets.record.res_recordid ? false : true },
    ]
    const {
        formState,
        setFormControls,        
        serializeFormData,
        sendFormData,
        getValue,
        buildControlsFromRecord
    } = useMultiFormContext()    

    const handleChange = (e) => setFormControls(ps => ({ ...ps, [e.target.id]: e.target.value }))

    const closePage = () => setPage(ps => ({ ...ps, page: 3, subpage: -1, record: {} }));

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${assets.record.res_deleted ? "Reactivate" : "Deactivate"} This Reseller?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, assets.record.deleted ? false : true);
    }

    const handleSubmit = async(e, delflag = false) => {                
        let data = serializeFormData()
        let verb = getValue("res_recordid") ? (delflag ? "DELETE" : "PUT") : "POST"  
        const resp = await sendFormData(verb, data)
        resp.status ===200 && closePage();        
    }

    useEffect(() => {        
        let defaults = {}
        if (!assets.record.res_recordid) {
            const dom_res = domains.find(r => r.default == 1)
            const pay_res = billingMethodTypes.find(r => r.default === 1)
            defaults = {
                res_siteroute: "",
                res_sitedomain: dom_res ? dom_res.value : "",
                res_manualpsp: 1,
                res_manualmvr: 1,
                pay_paymenttype: pay_res ? pay_res.value : "",
                bil_billingdom: 1,
                bil_allowecheck: 1,
                bil_setupfee: "$0.00",
                bil_mvrdiscount: "$0.00",
                bil_pspdiscount: "$0.00",
                bil_cdlisdiscount: "$0.00",
                eml_emailcontact: "",
                eml_emailsupport: "",
                eml_emailbilling: "",
                eml_emailgeneral: "",
            }
        }
        const new_rec = Object.assign(assets.record, defaults)
        buildControlsFromRecord(new_rec)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Reseller Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Reseller Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <TabContainer options={tabMenu} selected={tabSelected} callback={setTabSelected} />
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ marginBottom: "10px", fontSize: "22px", fontWeight: 600 }}>
                            {assets.record.res_recordid
                                ? <span>{`Editing Reseller ${assets.record.res_companyname}`}</span>
                                : <span>New Reseller</span>
                            }
                        </div>
                        {(tabSelected == 0) && <AccountSetup callback={handleChange} />}
                        {(tabSelected == 1) && <Demographics callback={handleChange} />}
                        {(tabSelected == 2) && <Emails callback={handleChange} />}
                        {(tabSelected == 3) && <BillingSetup callback={handleChange} />}
                        {(tabSelected == 4) && <Policies />}
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}>
                    {assets.record.res_recordid &&
                        <FormButton
                            style={{ width: "100px" }}
                            color={assets.record.res_deleted ? "purple" : "red"}
                            onClick={handleDeactivate}>
                            {assets.record.deleted ? "Reactivate" : "Deactivate"}
                        </FormButton>
                    }
                </div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green" onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
                <div>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={handleDeactivateResponse} />}
    </>)
}