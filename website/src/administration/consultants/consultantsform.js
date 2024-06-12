import { useContext, useEffect, useState } from "react";
import { initFormState, languageTypes, timeZonesTypes } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../components/administration/card";
import { FormInput } from "../../components/administration/inputs/forminput";
import { CardButton } from "../../components/administration/button";
import { serializeForm } from "../../global/globals";
import { YesNo, initYesNoState } from "../../components/administration/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { FormText } from "../../components/administration/inputs/formtext";
import { ErrorContext } from "../../global/contexts/errorcontext";
import { FormStaticSelect } from "../../components/administration/inputs/formstaticselect";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const ConsultantsForm = ({ record, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("consultants-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("consultants_recordid", record.consultants_recordid || "")
        const verb = !record.consultants_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "consultants", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.consultants_deleted ? "Reactivate" : "Deactivate"} This Consultant?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.consultants_deleted);
    }

    useEffect(() => {
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} Consultant ${document.getElementById("consultants_companyname").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => {         
        record.consultants_recordid &&  reportUserAction(`Viewed Consultant ${record.consultants_companyname}`)
        return() => setErrorState([])
    }, [])

    return (<>
        <CardModal width="700px">
            <CardHeader label="Consultants Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <CardRow>
                    <div style={{ width: "180px", marginRight: "4px" }}>
                        <FormInput id="consultants_lookupcode" label="Lookup Code *" mask="text" value={record.consultants_lookupcode} required autoFocus />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="consultants_companyname" label="Company Name *" mask="text" value={record.consultants_companyname} required />
                    </div>
                </CardRow>
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="consultants_contactfirstname" label="Contact First Name *" mask="text" value={record.consultants_contactfirstname || ""} required />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="consultants_contactlastname" label="Contact Last Name *" mask="text" value={record.consultants_contactlastname || ""} required />
                    </div>
                </CardRow>
                <FormInput id="consultants_emailgeneral" mask="text" height="200px" label="Email Address *" value={record.consultants_emailgeneral || ""} />
                <FormText height="100px" id="consultants_address" label="Address" value={record.consultants_address || ""} required />
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="consultants_telephone" label="Telephone *" mask="telephone" value={record.consultants_telephone || ""} required />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormStaticSelect id="consultants_timezone" label="Time Zone *" options={timeZonesTypes} value={record.consultants_timezone} required />
                    </div>
                </CardRow>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.consultants_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.consultants_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}