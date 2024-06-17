import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "./topnav";
import { BottomNav } from "./bottomnav";
import { SideNav } from "./sidenav";

import { FaqsGrid } from "../settings/faqs/faqsgrid";
import { PEIEmployersGrid } from "../settings/peiemployers/peiemployersgrid";
import { AffiliatesGrid } from "../settings/affiliates/affiliatesgrid";
import { KBArticlesGrid } from "../settings/kbarticles/kbarticlesgrid";
import { ConsultantsGrid } from "../consultants/consultantsgrid";
import { NotesGrid } from "../notes/notesgrid";
import { UsersGrid } from "../settings/users/usersgrid";
import { SMTPProfilesGrid } from "../settings/smtpprofiles/smtpprofilesgrid";
import { APIProfilesGrid } from "../settings/apiprofiles/apiprofilesgrid";
import { ResellersGrid } from "../resellers/resellersgrid";

import { Settings } from "../settings/settings";
import { useGlobalContext } from "../../global/contexts/globalcontext";
import styled from "styled-components";
import "../../assets/css/administration.css";

const AppWrapper = styled.div`
font-family: "Roboto";
font-size: 16px;
font-weight: 400;
display: flex;
flex-flow: column;
position: absolute;
top:0;
left:0;
width:100%;
height:100%;
background-color: var(--app-background);
`
const AppContainer = styled.div`
flex:1;
`

const AppContent = styled.div`
display: grid;
grid-template-columns: 250px 1fr;
grid-template-rows: 120px 1fr;
grid-column-gap: 10px;
grid-row-gap: 10px;
width: 1200px;
height: 100%;
margin: 0 auto;
padding: 8px 0px;
& > div{
    border: 2px solid var(--panel-border);
    background-color: var(--panel-background);    
}    
`
const LogoContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
grid-area: 1 / 1 / 2 / 2;
`
const SideNavContainer = styled.div`
grid-area: 2 / 1 / 3 / 2;
`
const AppPlayGround = styled.div`
grid-area: 1 / 2 / 3 / 3;
`
export const Administration = () => {
    const nav = useNavigate()
    const [page, setPage] = useState(0)
    const { globalState, clearState, fetchGlobalData } = useGlobalContext();
    const [componentState, setComponentState] = useState({ username: "", logo: "", company: "" })

    useEffect(() => {    
        if (globalState.apiData) {
            if (globalState.apiData.status === 200) {
                setComponentState(ps => ({
                    username: `${globalState.user.firstname} ${globalState.user.lastname}`,
                    company: globalState.master.companyname,
                    logo: globalState.master.logo
                }));
            }
            if (globalState.apiData.status === 400) {
                clearState()
                nav("/admin/login", { replace: true })
            }
        }
    }, [globalState.apiData])


    useEffect(() => {fetchGlobalData("all")}, [])    

    return (
        <AppWrapper>
            <TopNav company={componentState.company} username={componentState.username} />
            <AppContainer>
                <AppContent>
                    <LogoContainer><img src={`data:image/png;base64,${componentState.logo || ""}`} style={{ width: "240px" }} alt=" " /></LogoContainer>
                    <SideNavContainer><SideNav callback={setPage} selected={page} /></SideNavContainer>
                    <AppPlayGround >
                        {page === 0 && <div><h1>Dashboard</h1></div>}
                        {page === 100 && <div><h1>Report1</h1></div>}
                        {page === 101 && <div><h1>Report2</h1></div>}
                        {page === 102 && <div><h1>Report3</h1></div>}
                        {page === 102 && <div><h1>Report4</h1></div>}
                        {page === 104 && <div><h1>Report5</h1></div>}
                        {page === 2 && <div><h1>Accounts</h1></div>}
                        {page === 3 && <ResellersGrid />}
                        {page === 4 && <ConsultantsGrid />}
                        {page === 7 && <NotesGrid />}
                        {page === 800 && <Settings record={globalState.reseller} />}
                        {page === 801 && <AffiliatesGrid />}
                        {page === 802 && <PEIEmployersGrid />}
                        {page === 803 && <KBArticlesGrid />}
                        {page === 804 && <FaqsGrid />}
                        
                        {page === 806 && <UsersGrid />}
                        {page === 807 && <SMTPProfilesGrid />}
                        {page === 808 && <APIProfilesGrid />}
                    </AppPlayGround>
                </AppContent>
            </AppContainer>
            <BottomNav company={componentState.company} />
        </AppWrapper>
    )
}