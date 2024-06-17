import { useContext, useEffect, useState } from "react";
import { initFormState } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow, } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { kbArticleTypes } from "../../../global/staticdata";
import { FormStaticSelect } from "../../../components/administration/inputs/formstaticselect";
import { HTMLEditor } from "../../../components/administration/htmleditor/htmleditor";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";


export const KBArticlesForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("kbarticles-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const [editorData, setEditorData] = useState()
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("kbarticles_recordid", record.kbarticles_recordid || "")
        data.append("kbarticles_articletext", editorData)
        const verb = !record.kbarticles_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "kbarticles", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.kbarticles_deleted ? "Reactivate" : "Deactivate"} This Knowledgebase Article?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.kbarticles_deleted);
    }

    useEffect(() => {
        setFormState(ps => ({ ...ps, busy: false }))
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} KB Article ${document.getElementById("kbarticles_title").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
    }, [formData])

    useEffect(() => {       
        record.consultants_recordid &&  reportUserAction(`Viewed Consultant ${record.kbarticles_title}`) 
        record.kbarticles_recordid && setEditorData(record.kbarticles_articletext)
        return() => {setErrorState([])}
    }, [])

    return (<>
        <CardModal width="900px" >
            <CardHeader label="Knowledgebase Article Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="kbarticles_title" label=" Title" mask="text" value={record.kbarticles_title || ""} required autoFocus />
                    </div>
                    <div style={{ width: "170px", marginLeft: "4px" }}>
                        <FormStaticSelect
                            id="kbarticles_articletype"
                            label="Article Type"
                            options={kbArticleTypes}
                            value={record.kbarticles_articletype}
                            required
                        />
                    </div>
                </CardRow>
                <div style={{ width: "100%", height: "600px", paddingLeft: "5px", marginBottom: "26px" }}>
                    <HTMLEditor value={editorData} callback={(val) => setEditorData(val)} height={600} />
                </div>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.kbarticles_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.kbarticles_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}>
                    <CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton>
                </div>
                <div style={{ marginLeft: "4px" }}>
                    <CardButton id="pricing-form-save" style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton>
                </div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}