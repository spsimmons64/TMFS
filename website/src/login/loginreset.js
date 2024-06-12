import { useEffect } from "react"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { LoginFormInput } from "../components/portals/inputstyles"
import styled from "styled-components"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"

const AccountFormSetupWrapper = styled.div`
width:500px;
margin: 10px auto;
`

export const LoginReset = () => {    
    const {id} = useParams()
    const nav = useNavigate()
    const {entityData} = useOutletContext();
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("login-form", 'login/resetpwd')
    const urlString = window.location.pathname.split("/")
    urlString.pop()    
    urlString.pop()
    const loginUrl = urlString.join("/")

    const handleSubmit = async () => {
        let url = ""
        let data = serializeFormData()
        data.append("entity", entityData.entitytype)
        data.append("entityid", entityData.entityid)
        data.append("token",id)
        const resp = await sendFormData("POST", data)
        resp.status === 200 && nav(loginUrl,{reloadDocument:true})
    }

    useEffect(() => { buildFormControls({}) }, [])    

    return (
        <AccountFormSetupWrapper id={formState.id}>
            <div style={{ marginBottom: "10px", fontSize: "22px", fontWeight: 700 }}>Reset Your {entityData.entity} User Password</div>
            <div style={{ marginBottom: "10px" }}>Please enter the informaton below to reset your user password.</div>
            <LoginFormInput
                id="npassword"
                mask="text"
                type="password"
                value={getValue("npassword")}
                error={getError("npassword")}
                onChange={handleChange}
                placeholder="Enter Your New Password"
                autoFocus
            />
            <LoginFormInput
                id="cpassword"
                mask="text"
                type="password"
                value={getValue("cpassword")}
                error={getError("cpassword")}
                onChange={handleChange}
                placeholder="Confirm Your New Password"
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