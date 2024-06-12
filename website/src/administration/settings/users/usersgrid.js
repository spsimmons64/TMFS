import { useContext, useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { faPenToSquare, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initFormState, initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { UsersForm } from "./usersform"
import { useUserAction } from "../../../global/contexts/useractioncontext"
import { useGlobalContext } from "../../../global/contexts/globalcontext"

export const UsersGrid = () => {    
    const {globalState} = useGlobalContext()
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const [position, setPosition] = useState({ ...initFormState })
    const posData = useRestApi(position.url, "POST", position.data, position.reset)
    const {reportUserAction} = useUserAction()

    const columns = [{
        id: "username",
        width: "25%",
        header: "User",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].users_username}</div>
    }, {
        id: "emailaddress",
        width: "33%",
        header: "Email",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short"><a href={`mailto:${gridData.data[ndx].users_emailaddress}`}>{gridData.data[ndx].users_emailaddress}</a></div>
    }, {
        id: "rank",
        width: "14%",
        header: "User Rank",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].users_securitylevel=="user" ? "User" : "Administrator"}</div>
    }, {
        id: "lastlogin",
        width: "20%",
        header: "Last Login",
        cellStyle: { textAlign: "center",marginTop:"4px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].users_lastlogin}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].users_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "users"
        const params = {            
            parentname:"resellers",
            parentid: globalState.reseller.recordid,
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
        const rec = gridData.data.find(r => r.users_recordid === target.getAttribute("data-id"))
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
        reportUserAction("Viewed TMFS Administrative Users")
        setGridReset(!gridReset) 
    }, [])

    useEffect(() => { posData.status == 200 && setGridReset(!gridReset) }, [posData])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faUsers} /></div>
                    <div style={{ flex: 1 }}>Users</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="faqs-search"
                        placeholder="Search All Users..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "110px", marginLeft: "10px" }} label="New User" onClick={handleUpdate} />
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
        {gridState.rowEdit.editor && <UsersForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}