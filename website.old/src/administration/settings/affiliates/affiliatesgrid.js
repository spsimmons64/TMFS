import { useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { faEye, faPenToSquare, faUsersGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { AffilatesForm } from "./affiliatesform"
import { AccountsPopupGrid } from "../../popups/accountspopupgrid"
import { useUserAction } from "../../../global/contexts/useractioncontext"

export const AffiliatesGrid = () => {   
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const [accountGrid,setAccountGrid] = useState({toggle:false,id:"",company:""})
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const {reportUserAction} = useUserAction();

    const columns = [{
        id: "lookupcode",
        width: "10%",
        header: "Code",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].affiliates_lookupcode}</div>
    }, {
        id: "affiliatename",
        width: "42%",
        header: "Affiliate ",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].affiliates_affiliatename}</div>
    }, {
        id: "Telephone",
        width: "14%",
        header: "Telephone",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].affiliates_telephone}</div>
    }, {
        id: "accountcount",
        width: "10%",
        header: "Accounts",
        cellStyle: {textAlign:"center",marginTop:"4px"},
        hdrStyle: {textAlign:"center"},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].affiliates_accountcount}</div>
    }, {
        id: "added",
        width: "16%",
        header: "Date Added",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].affiliates_added}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].affiliates_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize: "24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Accounts" data-id={gridData.data[ndx].affiliates_recordid} onClick={handleViewAccounts}>
                    <FontAwesomeIcon style={{fontSize: "24px",pointerEvents:"none"}} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "affiliates"
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
        const rec = gridData.data.find(r => r.affiliates_recordid === target.getAttribute("data-id"))
        setGridState(ps => ({ ...ps, rowEdit: { editor: true, record: rec || {} } }))
    }

    const updateCallBack = (resp) => {
        setGridState(ps => ({ ...ps, rowEdit: { editor: false, record: {} } }))
        setAccountGrid({toggle:false,id:"",company:""})
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

    const handleViewAccounts = ({target}) => {
        const rec = gridData.data.find(r => r.affiliates_recordid === target.getAttribute("data-id"))
        rec &&  setAccountGrid({toggle:true,id:rec["affiliates_recordid"],company:rec["affiliates_affiliatename"]})        
    }

    useEffect(() => { 
        reportUserAction("Viewed TMFS Administrative Affiliates")
        setGridState(ps => ({ ...ps, sortcol: "affiliatename" }))
        setGridReset(!gridReset) 
    }, [])    

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px"}}><FontAwesomeIcon icon={faUsersGear} /></div>
                    <div style={{ flex: 1 }}>Affiliates</div>
                    <div style={{ marginRight: "10px"}}>
                        <FormCheck style = {{color:"#737373"}} label="Include Deactivated" onChange={handleDeactivated} hideerror={1}/>
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="faqs-search"
                        placeholder="Search All Affiliates..."
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
        {gridState.rowEdit.editor && <AffilatesForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
        {accountGrid.toggle && 
            <AccountsPopupGrid parent="affiliate" parentid={accountGrid.id} companyname={accountGrid.company} callback={updateCallBack} />
        }
    </>)
}