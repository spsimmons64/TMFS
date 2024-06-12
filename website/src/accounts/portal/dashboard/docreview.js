import { GridColumnHeader, GridData, GridLoader, GridWrapper } from "../../../components/portals/gridstyles"
import { useGlobalContext } from "../../../global/contexts/globalcontext"
import { useGridHook } from "../../../global/hooks/gridhook"
import { useEffect } from "react"
import { GridPager } from "../../../components/portals/gridpager"
import styled from "styled-components"
import { Link } from "react-router-dom"

const GridContainer = styled.div`
width: 100%;
height: 240px;
display:flex;
flex-flow: column;
margin-top: 5px;
border: 1px solid #B6B6B6;
`
export const DocReviews = () => {
    const { globalState } = useGlobalContext()
    const { gridState, setGridUrl, setGridPage, setGridSort } = useGridHook()
    const columns = [{
        id: "added",
        width: "15%",
        header: "",
        hdrStyle: {},
        header: "Date",
        sortable: 1,
        render: (ndx) => gridState.data[ndx].docdate
    }, {
        id: "doctype",
        width: "10%",
        header: "Type",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].type}</div>
    }, {
        id: "description",
        width: "75%",
        header: "Description",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short"><Link>{gridState.data[ndx].description}</Link></div>
    }]

    useEffect(() => {                     
        if(globalState.account.recordid){                        
            setGridUrl(`docreviews?parentid=${globalState.account.recordid}`,false)
            setGridSort("added","desc",true)        
        }
    }, [globalState])        


    return (
        <div style={{ paddingBottom: "20px" }}>
            <h2>Documents To Be Reviewed</h2>
            <GridContainer>
                <GridWrapper style={{ border: "none" }}>
                    <GridColumnHeader columns={columns} sortHandler={setGridSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir}></GridColumnHeader>
                    {gridState.busy ? <GridLoader /> : <GridData columns={columns} data={gridState.data} />}
                </GridWrapper>                
            </GridContainer>
        </div>
    )

}