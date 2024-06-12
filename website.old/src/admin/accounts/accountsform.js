import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../components/portals/formstyles";
import { YesNo, initYesNoState } from "../../components/portals/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { TabContainer } from "../../components/portals/tabcontainer";
import { Demographics } from "./demographics";
import { AccountSetup } from "./accountsetup";
import { BillingSetup } from "./billingsetup";
import { Policies } from "./policies";
import { useFormHook } from "../../global/hooks/formhook";
import { Insurance } from "./insurance";



export const AccountsForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const {
        formState,
        formControls,
        setFormControls,
        handleChange,
        buildControlsFromRecord,
        serializeFormData,
        getValue,
        sendFormData
    } = useFormHook("accounts_form", "accounts")

    const [tabSelected, setTabSelected] = useState(0)
    const tabMenu = [
        { text: `Demographics`, key: 0 },
        { text: `Account Setup`, key: 1 },
        { text: `Insurance`, key: 2 },
        { text: `Billing And Fees`, key: 3 },
        { text: `Workplace Policies`, key: 4 },
    ]

    const closePage = () => setPage(ps => ({ ...ps, page: 2, subpage: -1, record: {} }));

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${getValue("deleted") ? "Reactivate" : "Deactivate"} This Account?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, getValue("deleted") ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()        
        let verb = assets.record.recordid ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => buildControlsFromRecord(assets.record), [])
    

    return (<>        
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Account Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Account Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <TabContainer options={tabMenu} selected={tabSelected} callback={setTabSelected} />
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />                        
                        <div style={{ marginBottom: "10px", fontSize: "22px", fontWeight: 600 }}>
                            {!getValue("recordid")
                                ? <span>New Account</span>
                                : <span>{`Editing Account ${assets.record.companyname}`}</span>
                            }
                        </div>
                        {(tabSelected == 0 && formControls.recordid) && <Demographics record={formControls} callback={handleChange} />}
                        {(tabSelected == 1 && formControls.recordid) && <AccountSetup record={formControls} callback={handleChange} setData={setFormControls}/>}
                        {(tabSelected == 2 && formControls.recordid) && <Insurance record={formControls} callback={handleChange} setData={setFormControls}/>}
                        {(tabSelected == 3 && formControls.recordid) && <BillingSetup record={formControls} callback={handleChange} setData={setFormControls} />}
                        {(tabSelected == 4 && formControls.recordid) && <Policies record={formControls}/>}
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}>
                    {assets.record.recordid &&
                        <FormButton
                            style={{ width: "100px" }}
                            color={assets.record.deleted ? "purple" : "red"}
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