import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { kbArticleTypes } from "../../../global/staticdata";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, FormSelect, InputErrorContainerStyle, } from "../../../components/portals/inputstyles";
import { HTMLEditor } from "../../../components/administration/htmleditor/htmleditor";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useFormHook } from "../../../global/hooks/formhook";

export const KBArticlesForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [editorData, setEditorData] = useState("")
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("kbarticles-form", "kbarticles")

    const closePage = () => setPage(ps => ({ ...ps, page: 803, subpage: -1, record: {} }));

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${getValue("deleted") ? "Reactivate" : "Deactivate"} This KB Article?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "left",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, getValue("deleted") ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        data.append("articletext", editorData !== undefined ? editorData : "")
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }
    useEffect(() => {
        buildFormControls(assets.record)        
        setEditorData(assets.record.articletext)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Knowledge Base Article Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Knowledge Base Article Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!getValue("recordid")
                                ? <span>New Knowledge Base Article</span>
                                : <span>{`Editing Knowledge Base Article ${getValue("title")}`}</span>
                            }
                        </div>
                        <FormInput
                            id="title"
                            mask="text"
                            value={getValue("title")}
                            error={getError("title")}
                            label="Article Title *"
                            labelwidth="115px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="articletype"
                            value={getValue("articletype")}
                            error={getError("articletype")}
                            options={kbArticleTypes}
                            label="Article Class *"
                            labelwidth="115px"
                            onChange={handleChange}
                        />
                        <div style={{ flex: 1, display: "flex", marginTop:"4px"}}>
                            <div style={{ width: "115px", textAlign: "right", paddingRight:"10px"}}>Article Text *</div>
                            <div style={{ flex: 1 }}>
                                <HTMLEditor
                                    id="notes"
                                    value={editorData}
                                    height="100%"
                                    callback={(val) => setEditorData(val)}
                                />
                            </div>
                        </div>
                        <InputErrorContainerStyle data-ignore id="answer" style={{ flex: "none", height: "20px", padding: "0px 0px 10px 117px" }}>
                            {getError("articletext")}
                        </InputErrorContainerStyle>                        
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1}}>
                    {getValue("recordid") &&
                        <FormButton
                            style={{ width: "100px" }}
                            color={getValue("deleted") ? "purple" : "red"}
                            onClick={handleDeactivate}>
                            {getValue("deleted") ? "Reactivate" : "Deactivate"}
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