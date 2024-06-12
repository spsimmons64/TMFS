import { useContext, useEffect, useState } from "react";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm} from "../../../global/globals";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { initFormState } from "../../../global/staticdata";

import { FormCheck } from "../../../components/administration/inputs/checkbox";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";

export const SMTPProfilesForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("users-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const [sslFlag, setSslFlag] = useState(false)
    const {reportUserAction} = useUserAction()
    

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("smtpprofiles_recordid", record.smtpprofiles_recordid || "")
        const verb = !record.smtpprofiles_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "smtpprofiles", data: data, reset: !formState.reset }))
    }

    const handleUseSSLChange = (val) => setSslFlag(val)

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.smtpprofiles_deleted ? "Reactivate" : "Deactivate"} This Profile?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.smtpprofiles_deleted);
    }

    useEffect(() => {
        if(formData.status === 200){
            let action = record.consultants_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} SMTP Profile ${document.getElementById("smtpprofiles_domainname").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => {       
        record.smtpprofiles_recordid &&  reportUserAction(`Viewed SMTP Profile ${record.smtpprofiles_domainname}`) 
        record.recordid && setSslFlag(record.smptprofiles_usesssl)
        return ()=> {setErrorState([])}
    }, [])

    return (<>
        <CardModal width="500px">
            <CardHeader label="SMTP Profile Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="smtpprofiles_domainname" label="Domain Name" mask="text" value={record.smtpprofiles_domainname || ""} required autoFocus />
                    </div>
                    <div style={{ marginLeft: "4px" }}>
                        <FormCheck id="smtpprofiles_usessl" label="Uses SSL" value={record.smtpprofiles_usessl} />
                    </div>
                </CardRow>
                <FormInput id="smtpprofiles_endpoint" label="Domain End-Point" mask="text" value={record.smtpprofiles_endpoint || ""} required />
                <FormInput id="smtpprofiles_apikey" label="API Key" mask="text" value={record.smtpprofiles_apikey || ""} required />
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="smtpprofiles_username" label="Username" mask="text" value={record.smtpprofiles_username || ""} />
                    </div>
                    <div style={{ flex: 1, margin: " 0px 4px" }}>
                        <FormInput id="smtpprofiles_password" label="Password" mask="text" value={record.smtpprofiles_password || ""} />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="smtpprofiles_sslport" label="SMTP Port" mask="number" value={record.smtpprofiles_sslport || "587"} />
                    </div>

                </CardRow>
                <CardRow>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <FormCheck
                            width="200px"
                            id="smtpprofiles_isdefault"
                            label="Set As Default Domain"
                            value={record.smtpprofiles_isdefault}
                        />
                    </div>
                </CardRow>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.smtpprofiles_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.smtpprofiles_deleted ? "Reactivate" : "Deactivate"}
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