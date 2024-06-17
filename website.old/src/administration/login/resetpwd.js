import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { initFormState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardHeader, CardContent, CardForm, CardFooter, CardModal, CardNoModal } from "../../components/administration/card";
import { FormInput } from "../../components/administration/inputs/forminput";
import { CardButton, LinkButton } from "../../components/administration/button";
import { serializeForm} from "../../global/globals";
import { LoginContainerWrapper, LoginWrapperBottomStyle, LoginWrapperStyle, LoginWrapperTopStyle } from "./login";
import { ErrorContext } from "../../global/contexts/errorcontext";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const AdminResetPasword = () => {
    const { id } = useParams()
    const nav = useNavigate();
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [resetStatus, setResetStatus] = useState(0)
    const [formState, setFormState] = useState(initFormState("forgot-password-form"))
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset);
    const checkData = useRestApi(`login/checkreset?token=${id}`, "GET", true)
    const {reportUserAction} = useUserAction()


    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("token", id)
        setFormState(ps => ({ ...ps, busy: true, url: "login/resetpwd", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if(formData.status === 200){
            reportUserAction("Updated Password")
            nav(`/${process.env.REACT_APP_PROD_BASE_URL}/admin/login`, { replace: true });
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { checkData.status === 200 ? setResetStatus(2) : setResetStatus(1) }, [checkData])

    useEffect(() => { return () => setErrorState([]) }, [])

    return (<>
        <LoginWrapperStyle><LoginWrapperTopStyle /><LoginWrapperBottomStyle /></LoginWrapperStyle>
        <LoginContainerWrapper>
            <CardNoModal width="450px">
                {resetStatus == 2 &&
                    <>
                        <CardHeader label="Password Reset" busy={formState.busy}></CardHeader>
                        <CardContent>
                            <CardForm id={formState.id} busy={formState.busy}>
                                <FormInput id="npassword" label="New Password" mask="text" type="password" required autoFocus></FormInput>
                                <FormInput id="cpassword" label="Confirm Password" mask="text" type="password" required></FormInput>
                            </CardForm>
                        </CardContent>
                        <CardFooter>
                            <div style={{ flex: 1 }}><LinkButton onClick={() => nav("/admin/login", { replace: true })}>Back To Login</LinkButton></div>
                            <div><CardButton onClick={submitForm}>Submit Request</CardButton></div>
                        </CardFooter>
                    </>
                }
                {resetStatus == 1 &&
                    <>
                        <CardHeader label="Password Reset Status" busy={0}></CardHeader>
                        <CardContent>
                            <div style={{ padding: "20px 10px", textAlign: "center" }}>
                                This password reset request is currently not available because the request was not made or a previous request
                                has timed out.  If you feel this is incorrect, please contact support!
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div style={{ flex: 1, textAlign: "center" }}><CardButton onClick={() => nav("/admin/login")}>Back To Login</CardButton></div>
                        </CardFooter>
                    </>
                }
            </CardNoModal>
        </LoginContainerWrapper>
    </>)
}