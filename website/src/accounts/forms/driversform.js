import { useContext, useEffect, useState } from "react"
import { useBreadCrumb } from "../../global/contexts/breadcrumbcontext"
import { PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { DriverFlagsList, useDriverFlagsContext } from "../portal/dashboard/drivers/classes/driverflags"
import { DriverActionMenu, useDriverAction } from "../portal/dashboard/drivers/classes/driveractions"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import { DriverInfoForm } from "./driverinfoform"
import { QualificationsForm } from "./qualificationsform"
import { TabContainer } from "../../components/portals/tabcontainer"
import { OverviewPending } from "./overviewpending"
import { OverviewActive } from "./overviewactive"
import { OverviewInactive } from "./overviewinactive"
import { OverviewNew } from "./overviewnew"

export const DriversForm = ({ callback }) => {
    const { updateBreadCrumb } = useBreadCrumb();
    const { driverRecord } = useContext(DriverContext)
    const { setQualifications } = useContext(QualificationsContext)
    const { setFlagList } = useDriverFlagsContext()
    const { setActionOpen } = useDriverAction()
    const [currTab, setCurrTab] = useState(0)
    const tabMenu = [
        { text: "Overview", hidden: false },
        { text: "Driver Information", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Qualification Checklist", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "File Browser", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Custom Reminders", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
        { text: "Activity Log", hidden: driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Inactive" },
    ]

    useEffect(() => { setFlagList(driverRecord.flags) }, [driverRecord.flags])

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
                <FormButton onClick={setActionOpen}>Driver Actions</FormButton>
                <DriverActionMenu />
            </div>
            <div style={{ flex: 1, textAlign: "right", paddingRight: "10px" }}>
                <FormButton onClick={() => callback()}>Return To Driver List</FormButton>
            </div>
        </div>
        <div style={{ borderBottom: "1px dotted #B6B6B6" }}></div>
        {driverRecord.flags.length > 0 && <>
            <div style={{ borderBottom: "1px dotted #B6B6B6", padding: "10px 10px 5px 10px" }}><DriverFlagsList /></div>
        </>}
        <TabContainer options={tabMenu} selected={currTab} callback={setCurrTab} />
        <PortalPlaygroundScrollContainerStyle>
            <PortalPlayGroundScrollerStyle >
                {currTab == 0 && <>
                    {(driverRecord.driverstatus === "New" || driverRecord.driverstatus === "Pending" || driverRecord.driverstatus === "Inactive")
                        ? <>
                            {driverRecord.driverstatus === "Inactive" && <OverviewInactive callback={callback} />}
                            {driverRecord.driverstatus === "New" && <OverviewNew callback={callback} />}
                            {driverRecord.driverstatus === "Pending" && <OverviewPending settab={setCurrTab} callback={callback} />}
                        </>
                        : <OverviewActive />
                    }
                </>}
                {currTab == 1 && <DriverInfoForm />}
                {currTab == 2 && <QualificationsForm />}
            </PortalPlayGroundScrollerStyle>
        </PortalPlaygroundScrollContainerStyle>
    </>)
}