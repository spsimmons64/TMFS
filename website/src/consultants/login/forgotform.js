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
export const ConsultantForgotPassword = () => {
    const nav = useNavigate()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [formState, setFormState] = useState(initFormState("login-form"))
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset);
    const { reportUserAction } = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("usertype", "consultants")
        setFormState(ps => ({ ...ps, busy: true, url: "login/forgotpwd", data: data, reset: !formState.reset }))
    }

    const handleBackToLogin = () => nav("/consultants/login")

    useEffect(() => {
        if (formData.status === 200) {
            reportUserAction(`Requested Password Reset`);
            nav("/consultants/login")
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
                        <div style={{ fontSize: "36px", fontWeight: 700 }}>Consultant Forgot Password</div>
                    </LoginHeaderStyle>
                    <FormBoxRowStyle id={formState.id}>
                        <LoginCardStyle>
                            <div style={{ fontSize: "21px", fontWeight: "700", paddingBottom: "14px" }}>Recover your account user password.</div>
                            <div style={{ fontSize: "14px", marginBottom: "14px" }}>
                                Please enter the <b>email address associated with your account</b> and you will receive an
                                email with a link to reset your password.
                            </div>
                            <LoginFormInput id="emailaddress" placeholder="Enter Your Email Address" autoFocus />
                            <FormButton onClick={submitForm} style={{ height: "40px", marginBottom: "14px" }}>Send Request</FormButton>
                            <div><LoginLinkStyle onClick={handleBackToLogin}>Back To Login</LoginLinkStyle></div>
                        </LoginCardStyle>
                    </FormBoxRowStyle>
                </LoginWrapperStyle>
            </PanelContainerStyle>
        </PortalStyle>
    )
}