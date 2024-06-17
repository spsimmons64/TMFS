import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { yesNoTypes } from "../../../global/staticdata";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, FormSelect, } from "../../../components/portals/inputstyles";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useFormHook } from "../../../global/hooks/formhook";


export const SMTPProfilesForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const {
        formState,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("smtpprofiles-form", "smtpprofiles")

    const closePage = () => setPage(ps => ({ ...ps, page: 807, subpage: -1, record: {} }))

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${assets.record.deleted ? "Reactivate" : "Deactivate"} This Profile?`,
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

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => buildFormControls(assets.record), [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Mail Profile Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Mail Profile Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden"></input>
                        <input id="deleted" type="hidden"></input>
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!assets.record.recordid
                                ? <span>New Mail Profile</span>
                                : <span>{`Editing Mail Profile ${assets.record.domainname}`}</span>
                            }
                        </div>
                        <FormInput
                            id="domainname"
                            mask="text"
                            value={getValue("domainname")}
                            error={getError("domainname")}
                            label="Domain Name *"
                            labelwidth="134px"
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormInput
                            id="endpoint"
                            mask="text"
                            value={getValue("endpoint")}
                            error={getError("endpoint")}
                            label="End-Point *"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="apikey"
                            mask="text"
                            value={getValue("apikey")}
                            error={getError("apikey")}
                            label="API Key &nbsp;&nbsp;"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="username"
                            mask="text"
                            value={getValue("username")}
                            error={getError("username")}
                            label="User Name &nbsp;&nbsp;"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="password"
                            mask="text"
                            value={getValue("password")}
                            error={getError("password")}
                            label="Passsword &nbsp;&nbsp;"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="sslport"
                            mask="number"
                            value={getValue("sslport")}
                            error={getError("sslport")}
                            label="Port *"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="isdefault"
                            value={getValue("isdefault")}
                            error={getError("isdefault")}
                            options={yesNoTypes}
                            label="Set As Default *"
                            labelwidth="134px"
                            onChange={handleChange}
                        />
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1}}>
                    {assets.record.recordid &&
                        <FormButton
                            style={{ width: "100px" }}
                            color={assets.record.deleted ? "purple" : "red"}
                            onClick={handleDeactivate}
                        >{assets.record.deleted ? "Reactivate" : "Deactivate"}
                        </FormButton>
                    }
                </div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
                <div>
                    <FormButton
                        style={{ width: "100px"}}
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