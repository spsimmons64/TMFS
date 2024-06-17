import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, } from "../../../components/portals/inputstyles";
import { HTMLEditor } from "../../../components/administration/htmleditor/htmleditor";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useFormHook } from "../../../global/hooks/formhook";
import { InputErrorContainerStyle } from "../../../components/portals/inputstyles";


export const PEIEmployersForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [editorData, setEditorData] = useState("")
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("peiemployers-form", "peiemployers")

    const closePage = () => setPage(ps => ({ ...ps, page: 802, subpage: -1, record: {} }));

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${assets.record.deleted ? "Reactivate" : "Deactivate"} This Employer?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "left",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, assets.record.deleted ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        data.append("notes", editorData !== undefined ? editorData : "")
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {
        buildFormControls(assets.record)
        setEditorData(assets.record.notes)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; PEI Employer Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>PEI Employer Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!assets.record.recordid
                                ? <span>New Employer</span>
                                : <span>{`Editing PEI Employer ${assets.record.employername}`}</span>
                            }
                        </div>
                        <FormInput
                            id="employername"
                            mask="text"
                            value={getValue("employername")}
                            error={getError("employername")}
                            label="Employer Name *"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="contactlastname"
                            mask="text"
                            value={getValue("contactlastname")}
                            error={getError("contactlastname")}
                            label="Contact Last Name &nbsp;&nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="contactfirstname"
                            mask="text"
                            value={getValue("contactfirstname")}
                            error={getError("contactfirstname")}
                            label="Contact First Name &nbsp;&nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="emailaddress"
                            mask="text"
                            value={getValue("emailaddress")}
                            error={getError("emailaddress")}
                            label="Email Address &nbsp;&nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <div style={{ flex: 1, display: "flex", marginTop: "4px" }}>
                            <div style={{ width: "168px", textAlign: "right", paddingRight: "10px" }}>Article Text *</div>
                            <div style={{ flex: 1 }}>
                                <HTMLEditor
                                    id="notes"
                                    value={editorData}
                                    height="100%"
                                    callback={(val) => setEditorData(val)}
                                />
                            </div>
                        </div>
                        <InputErrorContainerStyle data-ignore id="notes" style={{ flex: "none", height: "20px", padding: "0px 0px 10px 170px" }}>
                            {getError("notes")}
                        </InputErrorContainerStyle>
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
                        color="green"
                        onClick={handleSubmit}
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