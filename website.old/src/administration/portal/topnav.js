import { useState } from "react"
import { CardButton } from "../../components/administration/button"
import { useMousePosition } from "../../global/hooks/usemousepos"
import { YesNo, initYesNoState } from "../../components/administration/yesno"
import { useNavigate } from "react-router-dom"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { useUserAction } from "../../global/contexts/useractioncontext"
import styled from "styled-components"

const NavWrapper = styled.div`
background-image: var(--top-nav-background);
height: 70px;
width: 100%;
`
const NavContainer = styled.div`
display: flex;
align-items: center;
width: 1200px;
height: 100%;
margin: 0 auto;
color: var(--top-nav-text);
font-size:24px;
font-weight:500;
text-shadow: 2px 4px 3px rgba(0,0,0,0.3);
`

export const TopNav = ({ company, username }) => {
    const nav = useNavigate();
    const mousePos = useMousePosition()    
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });    
    const {reportUserAction} = useUserAction();
    const { clearState } = useGlobalContext();

    const logoutCallBack = (resp) => {
        setYnRequest({ ...initYesNoState });
        if(resp){
            reportUserAction("Logged Out Of The TMFS Administrative Portal")
            clearState();
            nav("/admin/login", { replace: true });
        }
    };

    const requestLogout = () => {
        setYnRequest({
            message: "Logout Requested. Are You Sure?",
            left: mousePos.x,
            top: mousePos.y,
            halign: "left"
        })
    }

    return (<>
        <NavWrapper>
            <NavContainer>
                <div style={{ flex: 1 }}>{company} Administrative Portal</div>
                <div style={{ flex: 1, textAlign: "right" }}>{username}</div>
                <div style={{ position: "relative", textAlign: "right", width: "110px" }}>
                    <CardButton onClick={requestLogout}>Sign Out</CardButton>
                </div>
            </NavContainer>
        </NavWrapper>
        {ynRequest.message && <YesNo {...ynRequest} callback={logoutCallBack} />}
    </>)
}