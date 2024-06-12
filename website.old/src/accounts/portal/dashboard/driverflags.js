import { GridColumnHeader, GridData, GridLoader, GridWrapper } from "../../../components/portals/gridstyles"
import { useGlobalContext } from "../../../global/contexts/globalcontext"
import { useGridHook } from "../../../global/hooks/gridhook"
import { useEffect } from "react"
import { GridPager } from "../../../components/portals/gridpager"
import styled from "styled-components"

const GridContainer = styled.div`
width: 100%;
height: 240px;
display:flex;
flex-flow: column;
margin-top: 5px;
border: 1px solid #B6B6B6;
`
export const DriverFlags = () => {
    const { globalState } = useGlobalContext()
    const { gridState, setGridUrl, setGridPage, setGridSort } = useGridHook()
    const columns = [{
        id: "added",
        width: "15%",
        header: "",
        hdrStyle: {},
        header: "Date",
        sortable: 1,
        render: (ndx) => gridState.data[ndx].added
    }, {
        id: "drivername",
        width: "20%",
        header: "Driver Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].drivername}</div>
    }, {
        id: "reason",
        width: "65%",
        header: "Reason For Disqualification",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].reason}</div>
    }]

    useEffect(() => {                     
        if(globalState.account.recordid){                        
            setGridUrl(`driverflags?parentid=${globalState.account.recordid}`,false)
            setGridSort("added","desc",true)        
        }
    }, [globalState])        


    return (
        <div style={{ paddingBottom: "20px" }}>
            <h2>Driver Flags</h2>
            <GridContainer>
                <GridWrapper style={{ border: "none" }}>
                    <GridColumnHeader columns={columns} sortHandler={setGridSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir}></GridColumnHeader>
                    {gridState.busy ? <GridLoader /> : <GridData columns={columns} data={gridState.data} />}
                </GridWrapper>                
            </GridContainer>
        </div>
    )

}