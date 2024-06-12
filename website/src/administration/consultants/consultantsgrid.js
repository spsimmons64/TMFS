import {  useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../components/administration/panel"
import { faEye, faHand, faPenToSquare, faRocket, faUsersGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../components/administration/grid/grid"
import { initGridState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { FormCheck } from "../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../components/administration/inputs/gridsearch"
import { GridPager } from "../../components/administration/grid/gridpager"
import { ConsultantsForm } from "./consultantsform"
import { AccountsPopupGrid } from "../popups/accountspopupgrid"
import { faCommentDots } from "@fortawesome/free-regular-svg-icons"
import { NotesPopupGrid } from "../popups/notespopupgrid"
import { useNavigate } from "react-router-dom"
import { useUserAction } from "../../global/contexts/useractioncontext"


export const ConsultantsGrid = () => {
    const nav = useNavigate()    
    const {reportUserAction} = useUserAction()
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const [accountGrid, setAccountGrid] = useState({ toggle: false, id: "", company: "" })
    const [notesGrid, setNotesGrid] = useState({ toggle: false, id: "", company: "" })
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)    

    const columns = [{
        id: "consultantname",
        width: "46%",
        header: "Consultant Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontSize: "16px", fontWeight: 600 }}>
                    <div className="short">{gridData.data[ndx].consultants_companyname}</div>
                </div>
                <div style={{ width: "100%", fontSize: "12px" }}>
                    <div className="short"><a href={`mailto:${gridData.data[ndx].consultants_emailgeneral}`}>{gridData.data[ndx].consultants_emailgeneral}</a></div>
                </div>
            </>)
        }
    }, {
        id: "Telephone",
        width: "11%",
        header: "Telephone",
        cellStyle: { marginTop: "10px" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].consultants_telephone}</div>
    }, {
        id: "accounts",
        width: "15%",
        header: "Accounts",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].consultants_accounts}</div>
    }, {
        id: "added",
        width: "14%",
        header: "Date Added",
        cellStyle: { marginTop: "10px" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].consultants_added}</div>
    }, {
        id: "action",
        width: "16%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: { marginTop: "5px" },
        sortable: 0,
        render: (ndx) => (
            <GridActionCell >
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].consultants_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Accounts" data-id={gridData.data[ndx].consultants_recordid} onClick={handleViewAccounts}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
                <GridAction title="View Notes" data-id={gridData.data[ndx].consultants_recordid} onClick={handleViewNotes}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faCommentDots} color="var(--grid-action-notes" />
                </GridAction>
                <GridAction title="Launch The Consultant Portal" data-id={gridData.data[ndx].consultants_recordid} onClick={handleLaunch}> 
                        <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faRocket} color="var(--grid-action-launch)" />                    
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "consultants"
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

    const handleLaunch = ({target}) => {
        const rec = gridData.data.find(r=>r.consultants_recordid==target.getAttribute("data-id"))
        if(rec){
            reportUserAction(`Logged Into Consultant Portal For ${rec.consultants_companyname}`)
            let url = `/consultants/portal/${target.getAttribute("data-id")}`       
            nav(url)
        }
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.consultants_recordid === target.getAttribute("data-id"))
        setGridState(ps => ({ ...ps, rowEdit: { editor: true, record: rec || {} } }))
    }

    const updateCallBack = (resp) => {
        setGridState(ps => ({ ...ps, rowEdit: { editor: false, record: {} } }))
        setAccountGrid({ toggle: false, id: "", company: "" })
        setNotesGrid({ toggle: false, id: "", company: "" })
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

    const handleDeactivated = (v) => {
        setGridState(ps => ({ ...ps, inactive: v }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    const handleViewAccounts = ({ target }) => {
        const rec = gridData.data.find(r => r.consultants_recordid === target.getAttribute("data-id"))        
        rec && setAccountGrid({ toggle: true, id: rec["consultants_recordid"], company: rec["consultants_companyname"] })
    }

    const handleViewNotes = ({ target }) => {
        const rec = gridData.data.find(r => r.consultants_recordid === target.getAttribute("data-id"))
        console.log(rec)
        rec && setNotesGrid({ toggle: true, id: rec["consultants_recordid"], company: rec["consultants_companyname"] })
    }

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    useEffect(() => {
        reportUserAction("Viewed TMFS Administrative Consltants")
        setGridState(ps => ({ ...ps, sortcol: "companyname" }))
        setGridReset(!gridReset)
    }, [])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faHand} /></div>
                    <div style={{ flex: 1 }}>Consultants</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="faqs-search"
                        placeholder="Search All Consultants..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "122px", marginLeft: "10px" }} label="New Consultant" onClick={handleUpdate} />
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
        {gridState.rowEdit.editor && <ConsultantsForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
        {accountGrid.toggle &&
            <AccountsPopupGrid parent="consultant" parentid={accountGrid.id} companyname={accountGrid.company} callback={updateCallBack} />
        }
        {notesGrid.toggle &&
            <NotesPopupGrid parent="consultants" parentid={notesGrid.id} companyname={notesGrid.company} callback={updateCallBack} />
        }
    </>)
}