import { useContext, useEffect, useState } from "react"
import { useBreadCrumb } from "../../../../../global/contexts/breadcrumbcontext"
import { PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlaygroundScrollContainerStyle } from "../../../../../components/portals/newpanelstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useGlobalContext } from "../../../../../global/contexts/globalcontext"
import { DriverFlagsList, useDriverFlagsContext } from "../classes/driverflags"
import { DriverActionMenu, useDriverAction } from "../classes/driveractions"
import { FlagDriverForm } from "./flagdriverform"
import { UploadForm } from "./uploadform"
import { SendPoliciesForm } from "./sendpoliciesform"
import { TabContainer } from "../../../../../components/portals/tabcontainer"
import { OverviewPending } from "./subforms/overviewpending"
import { OverviewNew } from "./subforms/overviewnew"
import { OverviewActive } from "./subforms/overviewactive"
import { OverviewInactive } from "./subforms/overviewinactive"
import { DriverContext } from "../contexts/drivercontext"
import { QualificationsContext } from "../classes/qualifications"
import { getApiUrl } from "../../../../../global/globals"
import { useRestApi } from "../../../../../global/hooks/apihook"
import { DriverInfoForm } from "./driverinfoform"
import { QualificationsForm } from "./qualifications/qualificationsform"


export const DriversForm = ({ callback }) => {
    const { updateBreadCrumb } = useBreadCrumb();
    const { fetchData } = useRestApi();
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications, setQualifications } = useContext(QualificationsContext)
    const { globalState, fetchProfile } = useGlobalContext();
    const { setFlagList } = useDriverFlagsContext()
    const { setActionOpen, setActionClose } = useDriverAction()
    const [actionForms, setActionForms] = useState({
        policy: false,
        memo: false,
        license: false,
        medcard: false,
        flag: false,
        employment: false
    })
    const [currTab, setCurrTab] = useState(0)
    const tabMenu = [
        { text: "Overview", hidden: false },
        { text: "Driver Information", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Qualification Checklist", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "File Browser", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Custom Reminders", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Activity Log", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
    ]
    const actions = [
        { text: "Send Workplace Policies", action: () => { setForm("policy") }, hidden: false },
        { text: "Send Memo", action: () => { setForm("memo") }, hidden: driverRecord.status === "New" || driverRecord.status === "Inactive" },
        { text: "Request License Upload", action: () => { setForm("license") }, hidden: driverRecord.status === "New" || driverRecord.status === "Inactive" },
        { text: "Request Medical Certificate Upload", action: () => { setForm("medcard") }, hidden: driverRecord.status === "New" || driverRecord.status === "Inactive" },
        { text: "Request Employement Correction", action: () => { setForm("employment") }, hidden: driverRecord.status === "New" || driverRecord.status === "Inactive" },
        { text: "Flag This Driver", action: () => { setForm("flag") }, hidden: false },
    ]

    const updateDriverRecord = async () => {
        const response = await fetchData(`drivers?action=fetch&driverid=${driverRecord["recordid"]}&entity="account"`, "get")
        response.status == 200 && setDriverRecord(response.data)
    }

    const closeWindow = () => { callback() }

    const setForm = (formType) => {
        setActionClose()
        setActionForms({
            policy: formType === "policy" ? true : false,
            memo: formType === "memo" ? true : false,
            license: formType === "license" ? true : false,
            medcard: formType === "medcard" ? true : false,
            flag: formType === "flag" ? true : false,
            employment: formType === "employment" ? true : false,
        })
    }

    const handleFormCallback = (res) => {
        setActionForms({ record: {}, pending: false, discard: false, reject: false, policy: false, flag: false });
        if (res.status === 200) {
            fetchProfile("accounts", globalState.account.recordid, globalState.user.recordid)
            callback()
        }
    }

    useEffect(()=>{setFlagList(driverRecord.flags)},[driverRecord.flags])

    useEffect(() => {        
        let bc = "Active Drivers"        
        setQualifications(driverRecord.qualifications)
        if (driverRecord.driverstatus === "New") bc = "New Applications"
        if (driverRecord.driverstatus === "Pending") bc = "Pending Drivers"
        if (driverRecord.driverstatus === "Inactive") bc = "Inactive Drivers"
        updateBreadCrumb(`Portal > Drivers > ${bc} > ${driverRecord.firstname} ${driverRecord.lastname}`)
    }, [])


    return (<>
        <PortalPlayGroundPageTitleStyle style={{ paddingRight: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: "1" }}><h1>{`${driverRecord.firstname} ${driverRecord.lastname}`}</h1></div>
            </div>
        </PortalPlayGroundPageTitleStyle>
        <div style={{ borderBottom: "1px dotted #B6B6B6" }}></div>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: "12px", padding: "10px 20px 10px 10px" }}>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "110px" }}><strong>Telephone:</strong></div>
                    <div style={{ flex: 1 }}>{driverRecord.telephone1}</div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "110px" }}><strong>Email Address:</strong></div>
                    <div style={{ flex: 1 }}><a href={`mailto:${driverRecord.emailaddress}`}>{driverRecord.emailaddress}</a></div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "110px" }}><strong>Current Status:</strong></div>
                    <div style={{ flex: 1 }}>{driverRecord.driverstatus}</div>
                </div>
            </div>
            <div style={{ position: "relative" }} >
                <FormButton onClick={setActionOpen}>
                    Driver Actions
                </FormButton>
                <DriverActionMenu menu={actions} />
            </div>
            <div style={{ flex: 1, textAlign: "right", paddingRight: "10px" }}>
                <FormButton onClick={() => callback()}>Return To Driver List</FormButton>
            </div>
        </div>
        <div style={{ borderBottom: "1px dotted #B6B6B6" }}></div>
        {driverRecord.flags.length > 0 && <>
            <div style={{ borderBottom: "1px dotted #B6B6B6", padding: "10px 10px 5px 10px" }}>
                <DriverFlagsList />
            </div>
        </>}
        <TabContainer options={tabMenu} selected={currTab} callback={setCurrTab} />
        <PortalPlaygroundScrollContainerStyle>
            <PortalPlayGroundScrollerStyle >
                {currTab == 0 && <>
                    {(driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Pending" || driverRecord.driverstatus === "Inactive")
                        ? <>
                            {driverRecord.driverstatus === "Inactive" && <OverviewInactive />}
                            {driverRecord.driverstatus === "New" && <OverviewNew callback={closeWindow} />}
                            {driverRecord.driverstatus === "Pending" && <OverviewPending settab = {setCurrTab} callback={closeWindow} />}
                        </>
                        : <OverviewActive />
                    }
                </>}
                {currTab == 1 && <DriverInfoForm />}
                {currTab == 2 && <QualificationsForm />}                
            </PortalPlayGroundScrollerStyle>
        </PortalPlaygroundScrollContainerStyle>
        {actionForms.policy && <SendPoliciesForm callback={handleFormCallback} />}
        {actionForms.flag && <FlagDriverForm callback={handleFormCallback} />}
        {actionForms.license && <UploadForm route="license" callback={handleFormCallback} />}
        {actionForms.medcard && <UploadForm route="medcard" callback={handleFormCallback} />}
        {actionForms.employment && <UploadForm route="employment" callback={handleFormCallback} />}
    </>)
}