import { useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { faBriefcase, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { PEIEmployersForm } from "./peiemployersform"
import { useUserAction } from "../../../global/contexts/useractioncontext"

export const PEIEmployersGrid = () => {    
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const {reportUserAction} = useUserAction()

    const columns = [{
        id: "employername",
        width: "28%",
        header: "Employer Name",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].peiemployers_employername}</div>
    }, {
        id: "notes",
        width: "36%",
        header: "Notes",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].peiemployers_notes}</div>
    }, {
        id: "Updated",
        width: "13%",
        header: "Updated",
        cellStyle: {marginTop:"4px",textAlign:"center"},
        hdrStyle: {textAlign:"center"},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].peiemployers_updated}</div>
    }, {
        id: "updatedby",
        width: "17%",
        header: "Updated By",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].peiemployers_username}</div>
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].peiemployers_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "peiemployers"
        const params = {            
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.peiemployers_recordid === target.getAttribute("data-id"))
        setGridState(ps => ({ ...ps, rowEdit: { editor: true, record: rec || {} } }))
    }

    const updateCallBack = (resp) => {
        setGridState(ps => ({ ...ps, rowEdit: { editor: false, record: {} } }))
        resp && setGridReset(!gridReset)
    }

    const handleSearch = (val) => {
        setGridState(ps => ({ ...ps, search: val }))
        setGridReset(!gridReset)
    }

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        setGridState(ps => ({ ...ps, sortcol: id, sortdir: dir }))
        setGridReset(!gridReset)
    }

    const handleDeactivated = (e) => {        
        setGridState(ps => ({ ...ps, inactive: e.target.checked }))
        setGridReset(!gridReset)
    }
    
    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    useEffect(() => { 
        reportUserAction("Viewed TMFS Administrative PEI Employers")
        setGridState(ps => ({ ...ps, sortcol: "employername" }))
        setGridReset(!gridReset) 
    }, [])    

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px"}}><FontAwesomeIcon icon={faBriefcase} /></div>
                    <div style={{ flex: 1 }}>PEI Employers</div>
                    <div style={{ marginRight: "10px"}}>
                        <FormCheck style = {{color:"#737373"}} label="Include Deactivated" onChange={handleDeactivated} hideerror={1}/>
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="peiemployers-search"
                        placeholder="Search All Employers..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "115px", marginLeft: "10px" }} label="New Employer" onClick={handleUpdate} />
                </div>
            </PanelHeader>
            <PanelContent>
                <GridContainer>
                    <GridColumnHeader >{buildGridColumnHeaders(columns, handleSort, gridState.sortcol, gridState.sortdir)} </GridColumnHeader>
                    <GridScrollContainer>
                        {gridState.busy
                            ? <GridLoader />
                            : buildGridRows(columns, gridData.data)
                        }
                    </GridScrollContainer>
                </GridContainer>
            </PanelContent>
            <PanelFooter>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </PanelFooter>
        </Panel >
        {gridState.rowEdit.editor && <PEIEmployersForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}