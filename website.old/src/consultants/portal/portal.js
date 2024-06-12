import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SideNav } from "./sidenav"
import { NavHelper } from "./navhelper"
import { Dashboard } from "../dashboard/dashboard"
import { ConsultantForm } from "../settings/consultantform"
import { YesNo, initYesNoState } from "../../components/portals/yesno"
import { useMousePosition } from "../../global/hooks/usemousepos"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { UsersGrid } from "../users/usersgrid"
import { UsersForm } from "../users/usersform"
import { PortalContainerLeftStyle, PortalContainerLeftTopStyle, PortalContainerNavStyle, PortalContainerStyle, PortalStyle, PortalTopNavStyle } from "../../components/portals/panelstyles"
import { UsersActivityGrid } from "../users/usersactivitygrid"
import { FlagAccount } from "../dashboard/flagaccount"
import "../../assets/css/consultants.css"

export const ConsultantPortal = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const mousePos = useMousePosition();
    const [componentState, setComponentState] = useState({ logo: "" });
    const [menuSelected, setMenuSelected] = useState({ page: 0, record: {} });
    const { globalState, fetchGlobalData, clearState } = useGlobalContext();
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const { reportUserAction } = useUserAction()

    const setMenuSelection = (val, record) => {
        if (val === 3) {
            setYnRequest({ message: "Logout Requested. Are You Sure?", left: mousePos.x, top: mousePos.y, halign: "right" });
        } else {
            setMenuSelected({ page: val, record: record })
        }
    }

    const logoutCallBack = (resp) => {
        setYnRequest({ ...initYesNoState });
        let url = "logout";
        if (globalState.reseller.recordid) url = `logout?logout_type=consultant`;
        if (resp) {            
            reportUserAction(`Logged Out Of The Consutlant Portal For ${globalState.consultant.companyname}`)
            let url = ""
            if (globalState.user.usertype !== "consultants") {
                url = globalState.master.recordid !== "" ? "/admin/portal" : `/${globalState.reseller.siteroute}.${globalState.reseller.sitedomain}/portal`;
            } else {
                clearState()
                url = `/consultants/login`
            }
            nav(url, { replace: true });
        }
    };

    useEffect(() => {
        if (globalState.apiData) {
            if (globalState.apiData.status === 200) {
                setComponentState(ps => ({
                    username: `${globalState.user.firstname} ${globalState.user.lastname}`,
                    company: globalState.reseller.companyname,
                    logo: globalState.reseller.logo
                }));
            }
            if (globalState.apiData.status === 400) {
                clearState()
                nav("/consultants/login", { replace: true })
            }
        }
    }, [globalState.apiData])

    useEffect(() => { fetchGlobalData("consultant", id) }, [])
    
    return (<>
        <PortalStyle>
            <PortalTopNavStyle>
                <div style={{ flex: 1 }}>Logged In As {componentState.username}</div>
                <div>&copy;2024 MyDriverFiles.com, Powered by TMFS Corporation</div>
            </PortalTopNavStyle>
            <PortalContainerStyle>
                <PortalContainerLeftStyle>
                    <PortalContainerLeftTopStyle>
                        {globalState.reseller.logo && <img src={`data:image/png;base64,${globalState.reseller.logo}`} style={{ height: "81px" }} alt=" " />}                        
                    </PortalContainerLeftTopStyle>
                    <PortalContainerNavStyle>
                        <SideNav selected={menuSelected.page} callback={setMenuSelection}></SideNav>
                    </PortalContainerNavStyle>
                    <div style={{ textAlign: "center", fontSize: "11px", paddingBottom: "20px", color: "#3A3A3A" }}>
                        <span style={{ fontWeight: 700 }}>Consultants</span><br />
                        <span>MyDriverFiles.com Portal</span>
                    </div>
                </PortalContainerLeftStyle>
                <NavHelper selected={menuSelected.page}></NavHelper>
                {menuSelected.page == 0 && <Dashboard setPage={setMenuSelected} />}
                {menuSelected.page == 1 && <ConsultantForm />}
                {menuSelected.page == 2 && <UsersGrid setPage={setMenuSelected} />}
                {menuSelected.page == 4 && <UsersForm setPage={setMenuSelected} record={menuSelected.record} />}
                {menuSelected.page == 5 && <UsersActivityGrid setPage={setMenuSelected} record={menuSelected.record} />}
                {menuSelected.page == 6 && <FlagAccount setPage={setMenuSelected} record={menuSelected.record} />}
            </PortalContainerStyle>
        </PortalStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={logoutCallBack} />}
    </>)
}