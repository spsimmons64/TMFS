import { useContext, useEffect, useState } from "react";
import { initFormState } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { FormText } from "../../../components/administration/inputs/formtext";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";

export const FaqsForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("faqs-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("faqarticles_recordid", record.faqarticles_recordid || "")
        const verb = !record.faqarticles_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "faqs", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.faqarticles_deleted ? "Reactivate" : "Deactivate"} This FAQ Article?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.faqarticles_deleted);
    }

    useEffect(() => {
        setFormState(ps => ({ ...ps, busy: false }))
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} FAQ Article ${document.getElementById("faqarticles_question").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
    }, [formData])

    useEffect(() => { 
        record.faqarticles_recordid &&  reportUserAction(`Viewed FAQ Article ${record.faqarticles_question}`)
        return()=>setErrorState([])
     }, [])

    return (<>
        <CardModal width="500px">
            <CardHeader label="FAQ Article Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <FormInput id="faqarticles_question" label="FAQ Question" mask="text" value={record.faqarticles_question || ""} required autoFocus />
                <FormText id="faqarticles_answer" height="200px" label="FAQ Question" value={record.faqarticles_answer || ""} required />
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.faqarticles_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.faqarticles_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton id="faqarticles-form-save" style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}