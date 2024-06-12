import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { initFormState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardNoModal, CardHeader, CardContent, CardForm, CardFooter } from "../../components/administration/card";
import { CardButton, LinkButton } from "../../components/administration/button";
import { serializeForm } from "../../global/globals";
import { FormInput } from "../../components/administration/inputs/forminput";
import { ErrorContext } from "../../global/contexts/errorcontext";
import styled from "styled-components";
import Logo from "../../assets/images/logo.jpg"
import BackgroundImg from "../../assets/images/download.jpeg"
import { useUserAction } from "../../global/contexts/useractioncontext";

export const LoginWrapperStyle = styled.div`
display: flex;
flex-flow: column;
position: absolute;
width: 100%;
height: 100%;
`
export const LoginWrapperTopStyle = styled.div`
flex:1;
background-image: url(${BackgroundImg});
background-repeat: no-repeat;
background-position: center;
background-size: cover;
`
export const LoginWrapperBottomStyle = styled.div`
flex:1;
`
export const LoginContainerWrapper = styled.div`
position: absolute;
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
`
const LoginFormWrapper = styled.div`
display: flex;
width: 100%;
`
const LoginFormImageWrapper = styled.div`
align-self: center;
text-align: center;
padding: 0px 10px 10px 10px;
`
const LoginFormEntryWrapper = styled.div`
flex:1;
align-self: center;    
margin-top: 10px;
`
export const LoginFormDisclaimerWrapper = styled.div`
    font-size:12px;
    text-align: center;
    line-height: 1.5em;
    padding: 0px 8px 20px 8px;
    color: var(--login-disclaimer-text);    
`
export const AdminLogin = () => {
    const nav = useNavigate();
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [formState, setFormState] = useState(initFormState("login-form"))
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("entity", "admin")
        setFormState(ps => ({ ...ps, busy: true, url: "login", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if (formData.status === 200){
            reportUserAction("Logged Into The TMFS Administrative Portal");            
            nav(`/${process.env.REACT_APP_PROD_BASE_URL}/admin/portal`, { replace: true })
        };
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { return () => setErrorState([]) }, [])

    return (<>
        <LoginWrapperStyle><LoginWrapperTopStyle /><LoginWrapperBottomStyle /></LoginWrapperStyle>
        <LoginContainerWrapper>
            <CardNoModal width="470px">
                <CardHeader label="Please Sign In" busy={formState.busy}></CardHeader>
                <CardContent>
                    <LoginFormWrapper>
                        <LoginFormImageWrapper><img src={Logo} alt="TMFS Logo"></img></LoginFormImageWrapper>
                        <LoginFormEntryWrapper>
                            <CardForm id={formState.id} busy={formState.busy}>
                                <FormInput id="loginid" label="User ID" mask="text"  autoFocus autoComplete="on"></FormInput>
                                <FormInput id="password" label="Password" mask="text" type="password"  autoComplete="on"></FormInput>
                            </CardForm>
                        </LoginFormEntryWrapper>
                    </LoginFormWrapper>
                </CardContent>
                <LoginFormDisclaimerWrapper>
                    By logging into the TMFS Administrative Portal, you agree to our <a href="/admin/login/terms/" target="_blank">Our Terms Of Use</a>
                    &nbsp;and <a href="/admin/login/global" target="_blank">Our Global Privacy Statement.</a>
                </LoginFormDisclaimerWrapper>
                <CardFooter>
                    <div style={{ flex: 1 }}><LinkButton onClick={() => nav("/admin/login/forgotpwd", { replace: true })}>Forgot My Password</LinkButton></div>
                    <div><CardButton onClick={submitForm}>Sign In</CardButton></div>
                </CardFooter>
            </CardNoModal>
        </LoginContainerWrapper>
    </>)
}