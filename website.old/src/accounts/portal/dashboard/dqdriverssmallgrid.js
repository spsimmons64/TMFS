import { GridColumnHeader, GridData, GridLoader, GridWrapper } from "../../../components/portals/gridstyles"
import { useGlobalContext } from "../../../global/contexts/globalcontext"
import { useGridHook } from "../../../global/hooks/gridhook"
import { useContext, useEffect, useState } from "react"
import { GridPager } from "../../../components/portals/gridpager"
import { DriversForm } from "./drivers/forms/driversform"
import { DriverContext } from "./drivers/contexts/drivercontext"
import styled from "styled-components"

const GridContainer = styled.div`
width: 100%;
flex:1;
display:flex;
flex-flow: column;
`
export const DQDriversSmallGrid = () => {
    const { globalState } = useGlobalContext()
    const { setDriverRecord } = useContext(DriverContext)
    const { gridState, setGridUrl, setGridPage, setGridSort, setGridPageMax } = useGridHook()
    const [tabPage, setTabPage] = useState(0)
    const tabOptions = [{ text: "Driver List", hidden: false }, { text: "Search", hidden: false }]
    const [driverForm, setDriverForm] = useState(false)

    const columns = [{
    }, {
        id: "date",
        width: "10%",
        header: "Date",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].dates.disqualified}</div>
    }, {
        id: "drivername",
        width: "12.25%",
        header: "Driver Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            let newStyle = { fontWeight: 700, pointerEvents: "none" };
            if (gridState.data[ndx].status !== "Application" && gridState.data[ndx].status !== "Review") {
                Object.assign(newStyle, { textDecoration: "underline", color: "#164398" })
            }
            return (
                <div className="short" data-id={gridState.data[ndx].recordid} style={{ cursor: "pointer" }} onClick={handleDriverForm}>
                    <span style={newStyle}>{gridState.data[ndx].drivername}</span>
                </div>
            )
        }
    }, {
        id: "reason",
        width: "60%",
        header: "Reason For Disqualification",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].dates.annualreview}</div>
    }]

    const handleDriverForm = ({ target }) => {
        const id = target.getAttribute("data-id")
        const rec = gridState.data.find(r => r.recordid === id)
        if (rec) {
            setDriverRecord(rec)
            setDriverForm(true)
        }

    }

    const handleDriverFormCallBack = (resp) => {
        setDriverRecord({})
        setDriverForm(false)
    }

    useEffect(() => {
        if (globalState.account.recordid) {
            setGridUrl(`drivers?action=grid&parentid=${globalState.account.recordid}&route=disqualified&entity=account`, false)
            setGridSort("added", "desc", true)
        }
    }, [globalState])

    return (
        <>
            {!driverForm
                ? <div style={{ paddingBottom: "20px" }}>
                    <h2>Disqualified Drivers</h2>
                    <GridContainer style={{ height: "240px",border:"1px solid #B6B6B6" }}>
                        <GridWrapper style={{ border: "none" }}>
                            <GridColumnHeader columns={columns} sortHandler={setGridSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir}></GridColumnHeader>
                            {gridState.busy ? <GridLoader /> : <GridData columns={columns} data={gridState.data} />}
                        </GridWrapper>                        
                    </GridContainer>
                </div>
                : <DriversForm record={driverForm.record} callback={handleDriverFormCallBack} />
            }
        </>)
}
