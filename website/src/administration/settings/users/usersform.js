import { useContext, useEffect, useState } from "react";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { languageTypes, userRankTypes, initFormState } from "../../../global/staticdata";
import { FormStaticSelect } from "../../../components/administration/inputs/formstaticselect";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useGlobalContext } from "../../../global/contexts/globalcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";


export const UsersForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const {globalState} = useGlobalContext();
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("users-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction()


    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("users_recordid", record.users_recordid || "")
        data.append("users_usertype","resellers")
        data.append("users_usertypeid",globalState.reseller.recordid)
        data.append("users_username",`${data.get("lastname")}, ${data.get("firstname")}`);
        const verb = !record.users_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "users", data: data, reset: !formState.reset }))
    }

    
    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.users_deleted ? "Reactivate" : "Deactivate"} This User?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.users_deleted);
    }

    useEffect(() => {
        if(formData.status === 200){
            let action = record.users_recordid ? "Updated" : "Created" 
            let username = `${document.getElementById("users_firstname").value} ${document.getElementById("users_lastname").value}`
            reportUserAction(`${action} User ${username}`)
            callBack(true)
        }

        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }));
    }, [formData])

    useEffect(() => {        
        if(record.users_recordid){
            let username = `${record.users_firstname} ${record.users_lastname}`
            reportUserAction(`Viewed User ${username}`)
        } 
        return()=> setErrorState([]) 
    }, [])

    return (<>
        <CardModal width="400px">
            <CardHeader label="User Editor" busy={formState.busy}>
            </CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormInput id="users_firstname" label="User First Name" mask="text" value={record.users_firstname || ""} required autoFocus />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormInput id="users_lastname" label="User Last Name" mask="text" value={record.users_lastname || ""} required />
                    </div>
                </CardRow>
                <FormInput id="users_emailaddress" mask="text" height="200px" label="Email Address" value={record.users_emailaddress || ""} required />
                <CardRow>
                    <div style={{ flex: 1, marginRight: "4px" }}>
                        <FormStaticSelect
                            id="users_securitylevel"
                            label="Rank"
                            options={userRankTypes}
                            value={record.users_securitylevel}
                        />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormStaticSelect
                            id="users_language"
                            label="Language"
                            options={languageTypes}
                            value={record.users_language}
                        />
                    </div>
                </CardRow>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.users_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.users_deleted ? "Reactivate" : "Deactivate"}
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