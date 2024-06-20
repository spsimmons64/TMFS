import React, { useEffect } from "react"
import { useBreadCrumb } from "../../../../global/contexts/breadcrumbcontext"
import { DriverFlagContextProvider, DriverFlagsList } from "./classes/driverflags"
import { AllDriversGrid } from "./grids/alldriversgrid"
import { NewDriversGrid } from "./grids/newdriversgrid"
import { PendingDriversGrid } from "./grids/pendingdriversgrid"
import { ActiveDriversGrid } from "./grids/activedriversgrid"
import { RejectedDriversGrid } from "./grids/rejecteddriversgrid"
import { DQDriversGrid } from "./grids/dqdriversgrid"
import { InactiveDriversGrid } from "./grids/inactivedriversgrid"
import { IncompleteDriversGrid } from "./grids/incompletedriversgrid"
import { QualificationsContextProvider } from "./classes/qualifications"
import { PDFContextProvider } from "../../../../global/contexts/pdfcontext"
import { FormRouterContextProvider } from "../../../forms/formroutercontext"


export const Drivers = ({ drivertype }) => {
    const { updateBreadCrumb } = useBreadCrumb()

    useEffect(() => {
        let bc = ""
        if (drivertype == "alldrivers") bc = "All Drivers"
        if (drivertype == "activedrivers") bc = "Active Drivers"
        if (drivertype == "pendingdrivers") bc = "Pending Employment"
        if (drivertype == "newdrivers") bc = "New Applicants"
        if (drivertype == "rejecteddrivers") bc = "Rejected Applicants"
        if (drivertype == "inactivedrivers") bc = "Inactive Drivers"
        if (drivertype == "dqdrivers") bc = "Disqualified Drivers"
        if (drivertype == "incompletedrivers") bc = "Incomplete Applications"
        updateBreadCrumb(`Portal > Drivers > ${bc}`)
    }, [drivertype])

    return (
        <PDFContextProvider>
            <QualificationsContextProvider>
                <FormRouterContextProvider>
                    {drivertype === "alldrivers" && <AllDriversGrid />}
                    {drivertype === "activedrivers" && <ActiveDriversGrid />}
                    {drivertype === "pendingdrivers" && <PendingDriversGrid />}
                    {drivertype === "newdrivers" && <NewDriversGrid />}
                    {drivertype === "rejecteddrivers" && <RejectedDriversGrid />}
                    {drivertype === "dqdrivers" && <DQDriversGrid />}
                    {drivertype === "inactivedrivers" && <InactiveDriversGrid />}
                    {drivertype === "incompletedrivers" && <IncompleteDriversGrid />}
                </FormRouterContextProvider>
            </QualificationsContextProvider>
        </PDFContextProvider>
    )
}