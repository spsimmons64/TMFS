
import { useEffect, useState } from "react"
import { useRestApi } from "../global/hooks/apihook";
import { PortalFooterStyle, PortalHeaderStyle } from "../components/portals/newpanelstyles";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components"
import { getSiteIdRoute } from "../global/globals";
import { useGlobalContext } from "../global/contexts/globalcontext";


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
export const LoginLayout = () => {
    const nav = useNavigate()
    const { globalState } = useGlobalContext();
    const [entityData, setEntityData] = useState({});
    const { fetchData } = useRestApi();
    const { siteroute, siteid, route } = getSiteIdRoute()

    const fetchEntityData = async (siteroute, siteid, route) => {
        let url = `fetchobj/login?siteroute=${siteroute}&id=${siteid || ""}&route=${route}`
        let data = await fetchData(url, "GET")
        if (data.status === 200) {
            console.log(data.data)
            setEntityData(data.data)
        }
        if (data.status === 400) nav("/page404", { replace: true, reloadDocument: true })
    }

    useEffect(() => {        
        if(entityData.entityid){            
            if (Object.keys(globalState.user).length == 0) {            
                localStorage.setItem("entity", JSON.stringify(entityData))
                nav("login")
            } else {
                nav("portal")
            }
        }
    }, [entityData])

    useEffect(() => { fetchEntityData(siteroute, siteid, route) }, [])

    return (<></>)
}