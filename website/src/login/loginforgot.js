import { useEffect } from "react"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { LoginFormInput } from "../components/portals/inputstyles"
import styled from "styled-components"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

const AccountFormSetupWrapper = styled.div`
width:500px;
margin: 10px auto;
`
export const LoginForgot = () => {    
    const nav = useNavigate()
    const {entityData} = useOutletContext();
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("login-form", 'login/forgotpwd')
    const urlString = window.location.pathname.split("/")
    urlString.pop()    
    const loginUrl = urlString.join("/")
    const handleSubmit = async () => {
        let url = ""
        let data = serializeFormData()
        data.append("entity", entityData.entitytype)
        data.append("entityid", entityData.entityid)
        const resp = await sendFormData("POST", data)
        resp.status === 200 && nav(`${loginUrl}`,{replace:true,reloadDocument:true})
    }

    useEffect(() => { buildFormControls({}) }, [])

    return (
        <AccountFormSetupWrapper id={formState.id}>
            <div style={{ marginBottom: "10px", fontSize: "22px", fontWeight: 700 }}>Recover Your {entityData.entity} User Password</div>
            <div style={{ marginBottom: "10px" }}>Please enter the email address associated with your account user and you will
                receive an email with a link to reset your password.</div>
            <LoginFormInput
                id="emailaddress"
                mask="text"
                value={getValue("emailaddress")}
                error={getError("emailaddress")}
                onChange={handleChange}
                placeholder="Enter Your Email Address"
                autoFocus
            />
            <FormButton
                style={{ height: "40px" }}
                onClick={handleSubmit}
            >Send Request
            </FormButton>
            <div style={{ marginTop: "20px", color: "#164398", cursor: "pointer", userSelect: "none" }}>
                <Link reloadDocument to={loginUrl}>Back To Login</Link>
            </div>
        </AccountFormSetupWrapper>
    )
}