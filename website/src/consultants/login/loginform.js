import styled from "styled-components"
import { PanelContainerStyle, PortalStyle, PortalTopNavStyle } from "../../components/portals/panelstyles"

import Logo from "../../assets/images/logo.jpg"
import { FormButton } from "../../components/portals/buttonstyle"
import { LoginFormInput, LoginLinkStyle } from "../../components/portals/inputstyles"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ErrorContext } from "../../global/contexts/errorcontext"
import { FormBoxRowStyle } from "../../components/portals/formstyles"
import { initFormState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { serializeForm } from "../../global/globals"

const LoginWrapperStyle = styled.div`
width: 1200px;
margin: 0 auto;
height: 200px;
font-color: #1A1A1A;
`
const LoginHeaderStyle = styled.div`
display: flex;
align-items: center;
min-height: 132px;
padding: 20px 0px;
border-bottom: 1px solid #DDDDDD;
`
const LoginCardStyle = styled.div`
width: 500px;
margin:10px auto 0px auto;
`
export const ConsultantLogin = () => {
    const nav = useNavigate()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [formState, setFormState] = useState(initFormState("login-form"))
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset);
    const { reportUserAction } = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("usertype", "consultants")
        setFormState(ps => ({ ...ps, busy: true, url: "login", data: data, reset: !formState.reset }))
    }

    const handleForgotPassword = () => nav("/consultants/login/forgotpwd")

    useEffect(() => {
        if (formData.status === 200) {
            reportUserAction(`Logged Ino The Consultant Portal ${formData.data.name}`);
            nav(`/consultants/portal/${formData.data.id}`, { replace: true })
        };
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { return () => setErrorState([]) }, [])

    return (
        <PortalStyle>
            <PortalTopNavStyle>
                <div style={{ flex: 1 }}>TMFS Corporation</div>
                <div style={{ opacity: "50%" }}> &copy;2024 DriversFilesOnline.com, Powered by TMFS Corporation</div>
            </PortalTopNavStyle>
            <PanelContainerStyle style={{ padding: 0 }}>
                <LoginWrapperStyle>
                    <LoginHeaderStyle>
                        <div style={{ flex: 1 }}><img src={Logo} alt="TMFS Logo" style={{ width: "177px" }} /></div>
                        <div style={{ fontSize: "36px", fontWeight: 700 }}>Consultant Login</div>
                    </LoginHeaderStyle>
                    <FormBoxRowStyle id={formState.id}>
                        <LoginCardStyle>
                            <div style={{ fontSize: "21px", fontWeight: "700", paddingBottom: "14px" }}>Login to your consultant account.</div>
                            <div style={{ fontSize: "14px", marginBottom: "14px" }}>Please enter your email address and password below to login.</div>
                            <LoginFormInput id="loginid" placeholder="Enter Your Email Address" autoFocus />
                            <LoginFormInput type="password" id="password" placeholder="Enter Your Password" />
                            <FormButton onClick={submitForm} style={{ height: "40px", width: "80px", marginBottom: "14px" }}>Login</FormButton>
                            <div><LoginLinkStyle onClick={handleForgotPassword}>I can't remember my password.</LoginLinkStyle></div>
                        </LoginCardStyle>
                    </FormBoxRowStyle>
                </LoginWrapperStyle>
            </PanelContainerStyle>
        </PortalStyle>
    )
}