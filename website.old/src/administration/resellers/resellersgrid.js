import { useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../components/administration/panel"
import { faEye, faFileInvoiceDollar, faHand, faHandshake, faPenToSquare, faRocket} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../components/administration/grid/grid"
import { initGridState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { FormCheck } from "../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../components/administration/inputs/gridsearch"
import { GridPager } from "../../components/administration/grid/gridpager"
import { AccountsPopupGrid } from "../popups/accountspopupgrid"
import { faCommentDots } from "@fortawesome/free-regular-svg-icons"
import { NotesPopupGrid } from "../popups/notespopupgrid"
import { ResellersForm } from "./resellersform"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { useNavigate } from "react-router-dom"

export const ResellersGrid = () => {    
    const nav = useNavigate()
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const [accountGrid, setAccountGrid] = useState({ toggle: false, id: "", company: "" })
    const [notesGrid, setNotesGrid] = useState({ toggle: false, id: "", company: "" })
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const {reportUserAction} = useUserAction()
    const columns = [{
        id: "internalid",
        width: "6%",
        header: "ID",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => gridData.data[ndx].resellers_internalid
    }, {
        id: "companyname",
        width: "33%",
        header: "Reseller Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontSize: "16px", fontWeight: 600 }}>
                    <div className="short">{gridData.data[ndx].resellers_companyname}</div>
                </div>
                <div style={{ width: "100%", fontSize: "12px" }}>
                    <div className="short"><a href={`mailto:${gridData.data[ndx].resellers_emailaddress}`}>{gridData.data[ndx].resellers_emailaddress}</a></div>
                </div>
            </>)
        }
    }, {
        id: "telephone",
        width: "12%",
        header: "Telephone",
        cellStyle: { marginTop: "10px" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].resellers_telephone}</div>
    }, {
        id: "accounts",
        width: "7%",
        header: "Accounts",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].resellers_accounts}</div>
    }, {
        id: "drivers",
        width: "7%",
        header: "Drivers",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].resellers_drivers}</div>
    }, {
        id: "balance",
        width: "7%",
        header: "Balance",
        cellStyle: { marginTop: "10px", textAlign: "right" },
        hdrStyle: { textAlign: "right" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].resellers_balance}</div>
    }, {
        id: "added",
        width: "10%",
        header: "Date Added",
        cellStyle: { marginTop: "10px", textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].resellers_added}</div>
    }, {
        id: "action",
        width: "24%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: { marginTop: "5px" },
        sortable: 0,
        render: (ndx) => (
            <GridActionCell >
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].resellers_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Accounts" data-id={gridData.data[ndx].resellers_recordid} onClick={handleViewAccounts}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
                <GridAction title="View Notes" data-id={gridData.data[ndx].resellers_recordid} onClick={handleViewNotes}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faCommentDots} color="var(--grid-action-notes" />
                </GridAction>
                <GridAction title="View Transactions" data-id={gridData.data[ndx].resellers_recordid} onClick={handleViewNotes}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faFileInvoiceDollar} color="#164398" />
                </GridAction>
                <GridAction title="Launch The Reseller Portal" data-id={gridData.data[ndx].resellers_recordid} onClick={handleLaunch}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faRocket} color="var(--grid-action-launch)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "resellers"
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
        const rec = gridData.data.find(r=>r.resellers_recordid==target.getAttribute("data-id"))
        if(rec){
            reportUserAction(`Logged Into Reseller Portal For ${rec.resellers_companyname}`)
            let url = `/resellers/portal/${target.getAttribute("data-id")}`       
            nav(url)
        }
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.resellers_recordid === target.getAttribute("data-id"))
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
        const rec = gridData.data.find(r => r.resellers_recordid === target.getAttribute("data-id"))
        rec && setAccountGrid({ toggle: true, id: rec["resellers_recordid"], company: rec["resellers_companyname"] })
    }

    const handleViewNotes = ({ target }) => {
        const rec = gridData.data.find(r => r.resellers_recordid === target.getAttribute("data-id"))
        console.log(rec)
        rec && setNotesGrid({ toggle: true, id: rec["resellers_recordid"], company: rec["resellers_companyname"] })
    }

    useEffect(() => {
        reportUserAction("Viewed TMFS Administrative Resellers")
        setGridState(ps => ({ ...ps, sortcol: "companyname" }))
        setGridReset(!gridReset)
    }, [])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faHandshake} /></div>
                    <div style={{ flex: 1 }}>Resellers</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="faqs-search"
                        placeholder="Search All Resellers..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "122px", marginLeft: "10px" }} label="New Reseller" onClick={handleUpdate} />
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
        {gridState.rowEdit.editor && <ResellersForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
        {accountGrid.toggle &&
            <AccountsPopupGrid parent="resellers" parentid={accountGrid.id} companyname={accountGrid.company} callback={updateCallBack} />
        }
        {notesGrid.toggle &&
            <NotesPopupGrid parent="resellers" parentid={notesGrid.id} companyname={notesGrid.company} callback={updateCallBack} />
        }
    </>)
}