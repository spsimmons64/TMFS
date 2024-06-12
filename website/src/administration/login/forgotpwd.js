import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { initFormState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardHeader, CardContent, CardForm, CardFooter, CardNoModal } from "../../components/administration/card";
import { FormInput } from "../../components/administration/inputs/forminput";
import { CardButton, LinkButton } from "../../components/administration/button";
import { serializeForm } from "../../global/globals";
import { LoginContainerWrapper, LoginFormDisclaimerWrapper, LoginWrapperBottomStyle, LoginWrapperStyle, LoginWrapperTopStyle } from "./login";
import { ErrorContext } from "../../global/contexts/errorcontext";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const AdminForgotPassword = () => {
    const nav = useNavigate();
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [formState, setFormState] = useState(initFormState("forgot-password-form"))
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("usertype", "Resellers")
        setFormState(ps => ({ ...ps, busy: true, url: "login/forgotpwd", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if(formData.status === 200){            
            reportUserAction("Requested A Password Change")
            nav(`/${process.env.REACT_APP_PROD_BASE_URL}/admin/login`, { replace: true });
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { return() => setErrorState([]) }, [])

    return (<>
        <LoginWrapperStyle><LoginWrapperTopStyle /><LoginWrapperBottomStyle /></LoginWrapperStyle>
        <LoginContainerWrapper>
            <CardNoModal width="350px">
                <CardContent>
                    <CardHeader label="Forgotten Password" busy={formState.busy}></CardHeader>
                    <CardForm id={formState.id} busy={formState.busy} style={{ marginTop: "20px" }}>
                        <FormInput id="emailaddress" label="Email Address" mask="text" autoFocus autoComplete="on"></FormInput>
                    </CardForm>
                </CardContent>
                <LoginFormDisclaimerWrapper>
                    If your email address is associated with and account at TMFS Corporation, you will be sent instructions on how to
                    reset your password.
                </LoginFormDisclaimerWrapper>
                <CardFooter>
                    <div style={{ flex: 1 }}><LinkButton onClick={() => nav("/admin/login", { replace: true })}>Back To Login</LinkButton></div>
                    <div><CardButton onClick={submitForm}>Submit Request</CardButton></div>
                </CardFooter>
            </CardNoModal>
        </LoginContainerWrapper>
    </>)
}