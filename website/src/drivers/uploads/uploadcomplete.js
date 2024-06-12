import { useEffect, useState } from "react"
import { PortalFooterStyle, PortalHeaderStyle } from "../../components/portals/newpanelstyles"
import { useRestApi } from "../../global/hooks/apihook"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { useFormHook } from "../../global/hooks/formhook"
import { Disclosure } from "../setup/disclosure"
import { MedCardUpload } from "./medcardupload"


const FrameHeader = styled.div`
display: flex;
align-items: center;
height: 100px;
width: 1400px;
margin: 0 auto;
`
const FrameFooter = styled.div`
display: flex;
align-items: center;
height: 74px;
width: 1400px;
margin: 0 auto;
`
const FrameHR = styled.hr`
width: 1400px;
margin: 0px auto;
`
const SetupWrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-flow: column;
color: #595959;
`
const SetupContent = styled.div`
width: 1400px;
flex:1;
margin: 0 auto;
display: flex;
flex-flow:column;

`
const SetupContentScroller = styled.div`
height:0;
flex: 1 1 auto;
overflow-y: auto;
`
export const UploadComplete = () => {
    const nav = useNavigate()
    const { siteid, route, id } = useParams()    
    const { fetchData } = useRestApi()
    const [accountData, setAccountData] = useState({})
    const [driverData, setDriverData] = useState({})

    const getAccount = async () => {
        const response = await fetchData(`fetchobj/account?siteroute=${siteid}`, 'GET')
        response.status === 200 ? setAccountData(response.data) : nav(`/${process.env.REACT_PUBLIC_URL}/page404`, { replace: true })
    }

    const getDriver = async () => {
        const response = await fetchData(`drivers?action=fetch&id=${id}`, 'GET')
        response.status === 200 ? setDriverData(response.data) : nav(`/${process.env.REACT_PUBLIC_URL}/page404`, { replace: true })
    }

    useEffect(() => {
        getDriver()
        getAccount()
    }, [])

    return (
        <SetupWrapper>
            <PortalHeaderStyle>
                <div style={{ flex: 1 }}>{accountData.companyname}</div>
                <div style={{ flex: 1, textAlign: "right" }}>Cambiar al Español</div>
            </PortalHeaderStyle>
            <FrameHeader>
                {accountData.id && <>
                    <div style={{ flex: 1, marginTop: "12px" }}><img src={`data:image/png;base64,${accountData.logo}`} alt="Logo" /></div>
                </>}
                <div style={{ flex: 1, fontSize: "36px", fontWeight: 700, textAlign: "right" }}>Driver Uploads</div>
            </FrameHeader>
            <FrameHR />
            <SetupContent id="driver-setup">
                <SetupContentScroller>
                <div style={{ fontSize: "32px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>
                    Thank you, {driverData.firstname}.  Your File Upload Is Complete!
                </div>
                <div>We received your file  and it has been sent to the employer.</div>
                <div> You are finished and may now close this window.</div>                
                </SetupContentScroller>
            </SetupContent>
            <FrameHR />
            <FrameFooter>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <b>Need Help:</b> Call {accountData.phone} or email us at <a href={`mailto:${accountData.email}`}>{accountData.email}</a>
                    </div>
                </div>
            </FrameFooter>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>&copy; {accountData.resellerroute} Powered By {accountData.resellername}</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </SetupWrapper>
    )
}