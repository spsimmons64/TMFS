import { useContext, useEffect, useState } from "react";
import { initFormState } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { PSPForm } from "./pspform";
import { MVRForm } from "./mvrform";
import { useUserAction } from "../../../global/contexts/useractioncontext";

export const APIProfilesForm = ({ record, parent, callBack }) => {
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [formState, setFormState] = useState(initFormState("consultants-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("apiprofiles_recordid", record.apiprofiles_recordid || "")
        const verb = !record.apiprofiles_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "apiprofiles", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} API Profile ${document.getElementById("apiprofiles_companyname").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { 
        record.apiprofiles_recordid &&  reportUserAction(`Viewed API Profile ${record.apiprofiles_companyname}`)
        return () => setErrorState([]) 
    }, [])

    return (<>
        <CardModal width="500px">
            <CardHeader label="API Profile Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                {record.apiprofiles_apitype == "PSP" && <PSPForm record={record} />}
                {record.apiprofiles_apitype == "MVR" && <MVRForm record={record} />}
                <FormInput id="apiprofiles_companyname" label="API Vendor Name" value={record.apiprofiles_companyname} required />
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}><FormInput id="apiprofiles_supportemail" value={record.apiprofiles_supportemail} label="Support Email Address" required /></div>
                    <div style={{ width: "180px", marginLeft: "4px" }}><FormInput id="apiprofiles_supportphone" value={record.apiprofiles_supportphone} label="Support Telephone Number" required /></div>
                </CardRow>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}></div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
    </>)
}