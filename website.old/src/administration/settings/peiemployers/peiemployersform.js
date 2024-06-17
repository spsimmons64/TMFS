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

export const PEIEmployersForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("faqs-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const { reportUserAction } = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("peiemployers_recordid", record.peiemployers_recordid || "")
        const verb = !record.peiemployers_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "peiemployers", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.peiemployers_deleted ? "Reactivate" : "Deactivate"} This PEI Employer?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" });
        resp && submitForm(null, !record.peiemployers_deleted);
    }

    useEffect(() => {
        setFormState(ps => ({ ...ps, busy: false }))
        if (formData.status === 200) {
            let action = record.consultants_recordid ? "Updated" : "Created"
            reportUserAction(`${action} PEI Employer ${document.getElementById("peiemployers_employername").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
    }, [formData])

    useEffect(() => {
        record.consultants_recordid && reportUserAction(`Viewed PEI Employer ${record.peiemployers_employername}`)
        return () => setErrorState([])
    }, [])

    return (<>
        <CardModal width="500px">
            <CardHeader label="PEI Employer Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <FormInput id="peiemployers_employername" label="Employer Name" mask="text" value={record.peiemployers_employername || ""} required autoFocus />
                <FormText height="200px" id="peiemployers_notes" label="Information" value={record.peiemployers_notes || ""} required />
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.peiemployers_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.peiemployers_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton id="pricing-form-save" style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}