import { useEffect } from "react"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { LoginFormInput } from "../components/portals/inputstyles"
import { Link, useNavigate, useSearchParams} from "react-router-dom"
import styled from "styled-components"
import { PortalHeaderStyle, PortalFooterStyle } from "../components/portals/newpanelstyles"
import { useRestApi } from "../global/hooks/apihook"

const AccountSetupWrapper = styled.div`
display:flex;
flex-flow:column;
width:100%;
height: 100%;
color: #3A3A3A;
`
const AccountHeader = styled.div`
display: flex;
align-items: center;
padding: 10px 0px;
width: 1400px;
margin: 0 auto;
`
const AccountFooter = styled.div`
display: flex;
align-items: center;
padding: 20px 0px;
width: 1400px;
margin: 0 auto;
`
const AccountHR = styled.hr`
width: 1400px;
margin: 0px auto;
`
const AccountSetupContainer = styled.div`
flex:1;
width: 1400px;
margin: 0 auto;
`
const AccountFormSetupWrapper = styled.div`
width:500px;
margin: 10px auto;
`

export const LoginPage = () => {
    const navigate = useNavigate()    
    const forgotUrl = `/forgotpwd`
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("login-form", 'login')    
    const entityData = JSON.parse(localStorage.getItem("entity"))

    const handleSubmit = async () => {
        let url = ""
        let data = serializeFormData()
        data.append("entity", entityData.entity)
        data.append("entityid", entityData.entityid)
        const resp = await sendFormData("POST", data)
        if (resp.status === 200) {
            if (entityData.entity == "resellers") url = `/portal`
            if (entityData.entity == "accounts") url = `/${resp.data.siteroute}/portal`
            if (entityData.entity == "consultants") url = `/consultants/portal`
            if (entityData.entity == "law") url = `/lawenforcement/portal`
            let href = url
            if (process.env.REACT_APP_PUBLIC_URL) {
                href = `/${process.env.REACT_APP_PUBLIC_URL}${url}`
            }
            localStorage.setItem("assets", JSON.stringify({ ...entityData, userid: resp.data.userid, href: href }))
            navigate(url)
        }
    }

    useEffect(() => {buildFormControls({})}, [])

    return (
        <AccountSetupWrapper>
            <PortalHeaderStyle><div style={{ flex: 1 }}>{entityData.company}</div></PortalHeaderStyle>
            <AccountHeader style={{ minHeight: "100px" }}>
                {entityData.logo !== "" &&
                    <div style={{ flex: 1, marginTop: "12px" }}><img src={`data:image/png;base64,${entityData.logo}`} alt="Logo" /></div>
                }
                <div style={{ flex: 1, fontSize: "36px", fontWeight: 700, textAlign: "right" }}>{entityData.entitytype} User Login</div>
            </AccountHeader>
            <AccountHR />
            <AccountSetupContainer>
                <AccountFormSetupWrapper id={formState.id}>
                    <div style={{ marginBottom: "10px", fontSize: "22px", fontWeight: 700 }}>Please Log Into Your Portal:</div>
                    <div style={{ marginBottom: "10px" }}>Please enter your email address and password below to log in.</div>
                    <LoginFormInput
                        id="emailaddress"
                        mask="text"
                        value={getValue("emailaddress")}
                        error={getError("emailaddress")}
                        onChange={handleChange}
                        placeholder="Enter Your Email Address"
                        autoFocus
                    />
                    <LoginFormInput
                        id="password"
                        mask="text"
                        type="password"
                        value={getValue("password")}
                        error={getError("password")}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                    />
                    <FormButton
                        style={{ width: "100px", height: "40px" }}
                        onClick={handleSubmit}
                    >Log In
                    </FormButton>
                    <div style={{ marginTop: "20px", color: "#164398", cursor: "pointer", userSelect: "none" }}>
                        <Link reloadDocument to={forgotUrl}>I Can't Remember My Password</Link>
                    </div>
                </AccountFormSetupWrapper>
            </AccountSetupContainer>
            <AccountHR />
            <AccountFooter>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <b>Need Help:</b> Call {entityData.telephone} or email us at {entityData.emailaddress}
                </div>
            </AccountFooter>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>©2024 {entityData.siteroute}, Powered by {entityData.company}</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </AccountSetupWrapper>
    )
}