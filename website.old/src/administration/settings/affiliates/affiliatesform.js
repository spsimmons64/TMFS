import { useContext, useEffect, useState } from "react";
import { initFormState } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { FormText } from "../../../components/administration/inputs/formtext";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";

export const AffilatesForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("affilates-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction();

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("affiliates_recordid", record.affiliates_recordid || "")
        const verb = !record.affiliates_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "affiliates", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.affiliates_deleted ? "Reactivate" : "Deactivate"} This Affilate?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        if (resp) {
            submitForm(null, !record.affiliates_deleted);
        }
    }

    useEffect(() => {
        setFormState(ps => ({ ...ps, busy: false }))
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} Affiliate ${document.getElementById("affiliates_affiliatename").value}`)
            callBack(true)
        }
        
        formData.status === 400 && setErrorState(formData.errors);
    }, [formData])

    useEffect(() => {
        record.consultants_recordid &&  reportUserAction(`Viewed Affiliate ${record.affiliates_affiliatename}`)
        return () => setErrorState([])
    }, [])

    return (<>
        <CardModal width="600px">
            <CardHeader label="Affiliate Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <CardRow>
                    <div style={{ width: "180px", marginRight: "4px" }}>
                        <FormInput id="affiliates_lookupcode" label="Affiliate Code" mask="text" value={record.affiliates_lookupcode || ""} required autoFocus />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="affiliates_affiliatename" label="Affiliate Name" mask="text" value={record.affiliates_affiliatename || ""} required />
                    </div>
                </CardRow>
                <FormInput id="affiliates_emailaddress" mask="text" height="200px" label="Email Address" value={record.affiliates_emailaddress || ""} required />
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="affiliates_telephone" label="Telephone" mask="telephone" value={record.affiliates_telephone || ""} required />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="affiliates_ein" label="EIN / Tax ID" mask="ein" value={record.affiliates_ein || ""} required />
                    </div>
                </CardRow>
                <FormText height="200px" id="affiliates_notes" label="Notes" value={record.affiliates_notes || ""} required />
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.affiliates_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.affiliates_deleted ? "Reactivate" : "Deactivate"}
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