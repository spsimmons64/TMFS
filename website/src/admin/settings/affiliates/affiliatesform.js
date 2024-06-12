import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, } from "../../../components/portals/inputstyles";
import { HTMLEditor } from "../../../components/administration/htmleditor/htmleditor";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useFormHook } from "../../../global/hooks/formhook";

export const AffiliatesForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [editorData, setEditorData] = useState("")
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const {
        formState,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("affiliates_form", "affiliates")

    const closePage = () => setPage(ps => ({ ...ps, page: 801, subpage: -1, record: {} }))

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${getValue("deleted") ? "Reactivate" : "Deactivate"} This Affiliate?`,
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
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        data.append("notes", editorData)
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {
        buildFormControls(assets.record)
        setEditorData(assets.record.notes)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Affiliate Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Affiliate Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden"></input>
                        <input id="deleted" type="hidden"></input>
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!assets.record.recordid
                                ? <span>New Affiliate</span>
                                : <span>{`Editing Affiliate ${assets.record.affiliatename}`}</span>
                            }
                        </div>
                        <FormInput
                            id="lookupcode"
                            mask="text"
                            value={getValue("lookupcode")}
                            error={getError("lookupcode")}
                            label="Affiliate Code *"
                            labelwidth="130px"
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormInput
                            id="affiliatename"
                            mask="text"
                            value={getValue("affiliatename")}
                            error={getError("affiliatename")}
                            label="Affiliate Name *"
                            labelwidth="130px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="telephone"
                            mask="telephone"
                            value={getValue("telephone")}
                            error={getError("telephone")}
                            label="Telephone *"
                            labelwidth="130px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="ein"
                            mask="ein"
                            value={getValue("ein")}
                            error={getError("ein")}
                            label="EIN / SSN *"
                            labelwidth="130px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="emailaddress"
                            mask="text"
                            value={getValue("emailaddress")}
                            error={getError("emailaddress")}
                            label="Email Address *"
                            labelwidth="130px"
                            onChange={handleChange}
                        />
                        <div style={{ paddingBottom: "10px", flex: 1, display:"flex"}}>
                            <div style={{ width: "130px", textAlign: "right", paddingRight: "24px" }}>Notes</div>
                            <div style={{ flex: 1 }}>
                                <HTMLEditor
                                    id="notes"
                                    value={editorData}
                                    height="100%"
                                    callback={(val) => setEditorData(val)}
                                />
                            </div>
                        </div>
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1}}>
                    {getValue("recordid") &&
                        <FormButton
                            tabIndex={-1}
                            style={{ width: "100px" }}
                            color={getValue("deleted") ? "purple" : "red"}
                            onClick={handleDeactivate}
                        >{getValue("deleted") ? "Reactivate" : "Deactivate"}
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
                    > Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={handleDeactivateResponse} />}
    </>)
}