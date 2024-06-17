import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SideNav } from "../../components/portals/sidenav"
import { YesNo, initYesNoState } from "../../components/portals/yesno"
import { useMousePosition } from "../../global/hooks/usemousepos"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { PortalContentStyle, PortalFooterStyle, PortalHeaderLableStyle, PortalHeaderStyle, PortalLayoutStyle, PortalNavigationStyle, PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles"
import { faUser, faGauge, faHandshake, faTruckField, faFolder, faFileLines, faHand, faPeopleArrows, faCommentDots, faBook, faCircleQuestion, faTags, faCogs, faUsers, faBriefcase, faEnvelope, faRss, faBuilding } from "@fortawesome/free-solid-svg-icons"
import { LogoDisplay } from "./logo"
import styled from "styled-components"
import { ResellersGrid } from "../resellers/resellersgrid"
import { AltAccountsGrid } from "../accounts/altaccountsgrid"
import { GridContextProvider } from "../../global/contexts/gridcontext"
import { AltTransactionsGrid } from "../transactions/alttransactionsgrid"
import { AltNotesGrid } from "../notes/altnotesgrid"
import { NotesForm } from "../notes/notesform"
import { TransactionsForm } from "../transactions/transactionsform"
import { AffiliatesGrid } from "../settings/affiliates/affiliatesgrid"
import { AffiliatesForm } from "../settings/affiliates/affiliatesform"
import { PEIEmployersGrid } from "../settings/peiemployers/peiemployersgrid"
import { PEIEmployersForm } from "../settings/peiemployers/peiemployersform"
import { UsersGrid } from "../settings/users/usersgrid"
import { UsersForm } from "../settings/users/usersform"
import { SMTPProfilesGrid } from "../settings/smtpprofiles/smtpprofilesgrid"
import { SMTPProfilesForm } from "../settings/smtpprofiles/smtpprofilesform"
import { APIProfilesGrid } from "../settings/apiprofiles/apiprofilesgrid"
import { MVRForm } from "../settings/apiprofiles/mvrform"
import { PSPForm } from "../settings/apiprofiles/pspform"
import { KBArticlesGrid } from "../settings/kbarticles/kbarticlesgrid"
import { KBArticlesForm } from "../settings/kbarticles/kbarticlesform"
import { FAQSGrid } from "../settings/faqs/faqsgrid"
import { FAQSForm } from "../settings/faqs/faqsform"
import { PricingGrid } from "../settings/pricing/pricinggrid"
import { PricingForm } from "../settings/pricing/pricingform"
import { ConsultantsGrid } from "../consultants/consultantsgrid"
import { ConsultantsForm } from "../consultants/consultantsform"
import { AccountsGrid } from "../accounts/accountsgrid"
import { ResellerForm } from "../resellers/resellersform"

import { ProfileForm } from "../settings/profile/profileform"
import { AccountsForm } from "../accounts/accountsform"

import { MultiFormContextProvider } from "../../global/contexts/multiformcontext"

const HelpBadgeStyle = styled.div`
display: inline-block;
padding: 3px 10px;
background-color: #757575;
border: 1px solid #E2E2E2;
border-radius: 3px;
float:right;
`
export const AdminPortal = ({entityid,userid}) => {
    const nav = useNavigate();
    const mousePos = useMousePosition();
    const [menuSelected, setMenuSelected] = useState({ page: -1, subpage: -1, entity: "", entityRecord: {}, record: {} });
    const { globalState, fetchGlobalData, clearState,fetchProfile } = useGlobalContext();
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const { reportUserAction } = useUserAction()

    const navMenu = [
        { text: "Dashboard", icon: faGauge, rank: [0, 1, 2], key: 0 },
        {
            text: "Reports", icon: faFileLines, rank: [0, 1, 2], key: 1, submenu: [
                { text: "Report 1", icon: faFolder, rank: [0, 1, 2], key: 100 },
                { text: "Report 2", icon: faFolder, rank: [0, 1, 2], key: 101 },
                { text: "Report 3", icon: faFolder, rank: [0, 1, 2], key: 102 },
                { text: "User Activity Logs", icon: faFolder, rank: [0, 1, 2], key: 103 },
                { text: "API Error Reports", icon: faFolder, rank: [0, 1, 2], key: 104 },
            ]
        },
        { text: "Accounts", icon: faTruckField, rank: [0, 1, 2], key: 2 },
        { text: "Resellers", icon: faHandshake, rank: [0, 1, 2], key: 3 },
        { text: "Consultants", icon: faHand, rank: [0, 1, 2], key: 4 },
        { text: "Notes", icon: faCommentDots, rank: [0, 1, 2], key: 7 },
        {
            text: "Settings", icon: faCogs, rank: [0], key: 8, submenu: [
                { text: "Company Profile", icon: faBuilding, rank: [0, 1, 2], key: 800 },
                { text: "Affiliates", icon: faPeopleArrows, rank: [0, 1, 2], key: 801 },
                { text: "PEI Employers", icon: faBriefcase, rank: [0, 1, 2], key: 802 },
                { text: "Knowledge Base", icon: faBook, rank: [0, 1, 2], key: 803 },
                { text: "FAQ's", icon: faCircleQuestion, rank: [0, 1, 2], key: 804 },
                { text: "Pricing Packages", icon: faTags, rank: [0, 1, 2], key: 805 },
                { text: "Users", icon: faUsers, rank: [0, 1, 2], key: 806 },
                { text: "Mail Profiles", icon: faEnvelope, rank: [0, 1, 2], key: 807 },
                { text: "API Profiles", icon: faRss, rank: [0, 1, 2], key: 808 }
            ]
        }
    ]

    const handleMenuSelect = (val) => {
        if (val.page === 6) {
            setYnRequest({ message: "Logout Requested. Are You Sure?", left: mousePos.x, top: mousePos.y, halign: "right" });
        } else {
            setMenuSelected(val)
        }
    }

    const logoutCallBack = (resp) => {
        setYnRequest({ ...initYesNoState });
        let url = "logout";
        if (globalState.reseller.recordid) url = `logout?logout_type=reseller`;
        if (resp) {
            reportUserAction(`Logged Out Of The Reseller Portal For ${globalState.reseller.companyname}`)
            let url = ""
            if (globalState.user.usertype !== "resellers") {
                url = globalState.master.recordid !== "" ? "/admin/portal" : `/${globalState.reseller.siteroute}.${globalState.reseller.sitedomain}/portal`;
            } else {
                clearState()
                url = `/resellers/login`
            }
            nav(url, { replace: true });
        }
    };

    useEffect(()=>{fetchProfile("resellers",entityid,userid)},[])   

    return (<>
        <PortalLayoutStyle>
            <PortalHeaderStyle>
                <div style={{ flex: 1 }}>{globalState.reseller ? globalState.master.companyname : ""}</div>
                <PortalHeaderLableStyle>
                    Logged In As {globalState.user ? ` ${globalState.user.firstname} ${globalState.user.lastname}` : ""}
                </PortalHeaderLableStyle>
                <HelpBadgeStyle><FontAwesomeIcon icon={faUser} /></HelpBadgeStyle>
            </PortalHeaderStyle>
            <PortalContentStyle>
                <PortalNavigationStyle>
                    <LogoDisplay />
                    <SideNav menu={navMenu} selected={menuSelected.page} callback={handleMenuSelect} />
                </PortalNavigationStyle>
                {(menuSelected.page === 2 && menuSelected.subpage === -1) &&
                    <GridContextProvider><AccountsGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 2 && menuSelected.subpage === 1) &&
                    <AccountsForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 3 && menuSelected.subpage === -1) &&
                    <GridContextProvider><ResellersGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 1) &&
                    <GridContextProvider><AltAccountsGrid assets={menuSelected} setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 2) &&
                    <GridContextProvider><AltTransactionsGrid assets={menuSelected} setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 3) &&
                    <GridContextProvider><AltNotesGrid assets={menuSelected} setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 4) &&
                    <NotesForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 5) &&
                    <TransactionsForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 3 && menuSelected.subpage === 6) &&
                    <MultiFormContextProvider id = "reseller-form" url = "resellers">
                        <ResellerForm assets={menuSelected} setPage={setMenuSelected} />
                    </MultiFormContextProvider>
                }
                {(menuSelected.page === 4 && menuSelected.subpage === -1) &&
                    <GridContextProvider><ConsultantsGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 4 && menuSelected.subpage === 1) &&
                    <ConsultantsForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 7 && menuSelected.subpage === -1) &&
                    <GridContextProvider><AltNotesGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 800 && menuSelected.subpage === -1) &&
                    <ProfileForm />
                }
                {(menuSelected.page === 801 && menuSelected.subpage === -1) &&
                    <GridContextProvider><AffiliatesGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 801 && menuSelected.subpage === 1) &&
                    <AffiliatesForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 802 && menuSelected.subpage === -1) &&
                    <GridContextProvider><PEIEmployersGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 802 && menuSelected.subpage === 1) &&
                    <PEIEmployersForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 803 && menuSelected.subpage === -1) &&
                    <GridContextProvider><KBArticlesGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 803 && menuSelected.subpage === 1) &&
                    <KBArticlesForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 804 && menuSelected.subpage === -1) &&
                    <GridContextProvider><FAQSGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 804 && menuSelected.subpage === 1) &&
                    <FAQSForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 805 && menuSelected.subpage === -1) &&
                    <GridContextProvider><PricingGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 805 && menuSelected.subpage === 1) &&
                    <PricingForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 806 && menuSelected.subpage === -1) &&
                    <GridContextProvider><UsersGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 806 && menuSelected.subpage === 1) &&
                    <UsersForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 807 && menuSelected.subpage === -1) &&
                    <GridContextProvider><SMTPProfilesGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 807 && menuSelected.subpage === 1) &&
                    <SMTPProfilesForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 808 && menuSelected.subpage === -1) &&
                    <GridContextProvider><APIProfilesGrid setPage={setMenuSelected} /></GridContextProvider>
                }
                {(menuSelected.page === 808 && menuSelected.subpage === 1) &&
                    <MVRForm assets={menuSelected} setPage={setMenuSelected} />
                }
                {(menuSelected.page === 808 && menuSelected.subpage === 2) &&
                    <PSPForm assets={menuSelected} setPage={setMenuSelected} />
                }
            </PortalContentStyle>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>© 2024 MyDriverFiles.com, Powered by TMFS Corporation</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </PortalLayoutStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={logoutCallBack} />}
    </>)
}