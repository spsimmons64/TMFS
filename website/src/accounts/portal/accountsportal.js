import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { YesNo, initYesNoState } from "../../components/portals/yesno"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LocationWarningStyle, PortalContentStyle, PortalFooterStyle, PortalHeaderLableStyle, PortalHeaderStyle, PortalLayoutStyle, PortalNavigationStyle, PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundStyle } from "../../components/portals/newpanelstyles"
import { faUser, faGauge, faFileLines, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { LogoContainer } from "../../classes/logocontainer"
import { useBreadCrumb } from "../../global/contexts/breadcrumbcontext"
import { Dashboard } from "./dashboard/dashboard"
import { Drivers } from "./dashboard/drivers/drivers"
import { NavMenu, useMenuContext } from "./menucontext"
import { DriverContextProvider } from "./dashboard/drivers/contexts/drivercontext"
import { QualificationsContextProvider } from "./dashboard/drivers/classes/qualifications"
import styled from "styled-components"
import { DriverFlagContextProvider } from "./dashboard/drivers/classes/driverflags"

const HelpBadgeStyle = styled.div`
display: inline-block;
padding: 3px 10px;
background-color: #757575;
border: 1px solid #E2E2E2;
border-radius: 3px;
float:right;
`


export const AccountsPortal = ({ entityid, userid }) => {
    const nav = useNavigate();
    const { menuSelected, setTheMenu } = useMenuContext()
    const { breadCrumb } = useBreadCrumb()
    const { globalState, fetchProfile } = useGlobalContext();
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const navMenu = [
        { text: "Dashboard", icon: faGauge, rank: [0, 1, 2], page: "dashboard" },
        {
            text: "Drivers", icon: faFileLines, rank: [0, 1, 2], page: "drivers", default: "alldrivers", submenu: [
                { text: "Add Driver", icon: faGauge, rank: [0, 1, 2], page: "adddriver" },
                { text: "All Drivers", icon: faGauge, rank: [0, 1, 2], page: "alldrivers" },
                { text: "Active Drivers", icon: faGauge, rank: [0, 1, 2], page: "activedrivers" },
                { text: "Pending Employment", icon: faGauge, rank: [0, 1, 2], page: "pendingdrivers" },
                { text: "New Applications", icon: faGauge, rank: [0, 1, 2], page: "newdrivers" },
                { text: "Applications Out For Correction", icon: faGauge, rank: [0, 1, 2], page: "rejecteddrivers" },
                { text: "Inactive Drivers", icon: faGauge, rank: [0, 1, 2], page: "inactivedrivers" },
                { text: "Disqualified Drivers", icon: faGauge, rank: [0, 1, 2], page: "dqdrivers" },
                { text: "Incomplete Applications", icon: faGauge, rank: [0, 1, 2], page: "incompletedrivers" },
            ]
        },
        { text: "Law Enforcement", icon: faGauge, rank: [0, 1, 2], page: "lawenforcement" },
        {
            text: "Account", icon: faGauge, rank: [0, 1, 2], page: "account", default: "companyprofile", submenu: [
                { text: "Company Profile", icon: faGauge, rank: [0, 1, 2], page: "companyprofile" },
                { text: "Billing Profile", icon: faGauge, rank: [0, 1, 2], page: "billingprofile" },
                { text: "Billing History", icon: faGauge, rank: [0, 1, 2], page: "billinghistory" },
                { text: "Custom Apply Description", icon: faGauge, rank: [0, 1, 2], page: "customdescription" },
                { text: "Custom Driver Reminders", icon: faGauge, rank: [0, 1, 2], page: "driverreminders" },
                { text: "Driver Memos", icon: faGauge, rank: [0, 1, 2], page: "drivermemos" },
                { text: "Send Clearinghouse Consents", icon: faGauge, rank: [0, 1, 2], page: "sendchconsents" },
                { text: "Deposit Funds", icon: faGauge, rank: [0, 1, 2], page: "depositfunds" },
                { text: "Users & Consultants", icon: faGauge, rank: [0, 1, 2], page: "users" },
                { text: "Settings & Preferences", icon: faGauge, rank: [0, 1, 2], page: "settings" },
                { text: "Close Account", icon: faGauge, rank: [0, 1, 2], page: "closeaccount" },
            ]
        },
        { text: "Notificiations", icon: faGauge, rank: [0, 1, 2], page: "notifications" },
        {
            text: "Reports", icon: faGauge, rank: [0, 1, 2], page: "reports", default: "driverreport", submenu: [
                { text: "Driver Report", icon: faGauge, rank: [0, 1, 2], page: "driverreport" },
                { text: "Driver D&A Report", icon: faGauge, rank: [0, 1, 2], page: "dareport" },
                { text: "D&A Clearinghouse Bulk", icon: faGauge, rank: [0, 1, 2], page: "dachbulk" },
            ]
        },
        { text: "Knowledge Base", icon: faGauge, rank: [0, 1, 2], page: "knowledgebase" },
        { text: "Logout", icon: faGauge, rank: [0, 1, 2], page: "logout" },

    ]

    const logoutCallBack = (resp) => {
        setYnRequest({ ...initYesNoState });
        let url = "logout";
        if (globalState.reseller.recordid) url = `logout?logout_type=reseller`;
    };

    useEffect(() => {        
        setTheMenu("dashboard")
        fetchProfile("accounts", entityid, userid)
    }, [])

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
                    <LogoContainer logo={globalState.account.logomini} />
                    <NavMenu menudata={navMenu} />
                </PortalNavigationStyle>
                <PortalPlayGroundStyle>
                    <PortalPlayGroundHeaderStyle>
                        <PortalPlayGroundBreadCrumbStyle>{breadCrumb}</PortalPlayGroundBreadCrumbStyle>
                        {globalState.master.accountid == globalState.account.recordid &&
                            <LocationWarningStyle>
                                <div style={{ padding: "0px 10px", color: "#164398", fontSize: "20px" }}><FontAwesomeIcon icon={faCircleInfo} /></div>
                                You are currently launched into the&nbsp;<b>{globalState.account.companyname}</b>&nbsp;account.
                            </LocationWarningStyle>
                        }
                    </PortalPlayGroundHeaderStyle>
                    <DriverContextProvider>
                        <QualificationsContextProvider>
                            <DriverFlagContextProvider>
                                {menuSelected == "dashboard" && <Dashboard />}
                                {menuSelected == "newdrivers" && <Drivers drivertype="newdrivers" />}
                                {menuSelected == "alldrivers" && <Drivers drivertype="alldrivers" />}
                                {menuSelected == "pendingdrivers" && <Drivers drivertype="pendingdrivers" />}
                                {menuSelected == "activedrivers" && <Drivers drivertype="activedrivers" />}
                                {menuSelected == "rejecteddrivers" && <Drivers drivertype="rejecteddrivers" />}
                                {menuSelected == "inactivedrivers" && <Drivers drivertype="inactivedrivers" />}
                                {menuSelected == "dqdrivers" && <Drivers drivertype="dqdrivers" />}
                                {menuSelected == "incompletedrivers" && <Drivers drivertype="incompletedrivers" />}
                            </DriverFlagContextProvider>
                        </QualificationsContextProvider>
                    </DriverContextProvider>
                </PortalPlayGroundStyle>
            </PortalContentStyle>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>© 2024 {globalState.reseller.companyname}</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </PortalLayoutStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={logoutCallBack} />}
    </>)
}