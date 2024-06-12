import { useEffect, useState } from "react"
import { initGridState, userRankTypes } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { GridActionButton, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { GridSearchInput, InputStyle } from "../../components/portals/inputstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { useGlobalContext } from "../../global/contexts/globalcontext";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { initYesNoState, YesNo } from "../../components/portals/yesno";
import { PanelContainerStyle, PanelHeaderStyle, PanelScrollContainerStyle } from "../../components/portals/panelstyles";
import { TabContainer } from "../../components/portals/tabcontainer";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const UsersGrid = ({ setPage }) => {
    const mousePos = useMousePosition()
    const { globalState } = useGlobalContext();
    const [gridState, setGridState] = useState({ ...initGridState });
    const [gridReset, setGridReset] = useState(false)
    const [updateState, setUpdateState] = useState({ url: "", data: {}, verb: "", reset: false })
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const updateData = useRestApi(updateState.url, updateState.verb, updateState.data, updateState.reset)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [tabSelected, setTabSelected] = useState(0)
    const tabMenu = [{ text: `Consultant Users`, key: 0 }]
    const { reportUserAction } = useUserAction()


    const columns = [{
        id: "username",
        width: "20%",
        header: "User Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].users_firstname} {gridData.data[ndx].users_lastname}</div>
    }, {
        id: "emailaddress",
        width: "20%",
        header: "Email Address",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) =>
            <div className="short">
                <a href={`mailto:${gridData.data[ndx].users_emailaddress}`}>{gridData.data[ndx].users_emailaddress}</a>
            </div>
    }, {
        id: "telephone",
        width: "14%",
        header: "Phone Number",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].users_telephone
    }, {
        id: "securitylevel",
        width: "8%",
        header: "Rank",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            const rec = userRankTypes.find(r => r.value === gridData.data[ndx].users_securitylevel)
            return (rec.value === "admin" ? "Master" : "User")
        }
    }, {
        id: "lastlogin",
        width: "14%",
        header: "Last Login",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].users_lastlogin ? gridData.data[ndx].users_lastlogin : "Never Logged In"
    }, {
        id: "deleted",
        width: "8%",
        header: "Active",
        hdrAlign: "center",
        cellStyle: { textAlign: "center" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].users_deleted ? "No" : "Yes"
    }, {
        id: "action",
        width: "15%",
        header: "Actions",
        hdrAlign: 'center',
        sortable: 0,
        render: (ndx) => (
            <GridActionColumn>
                <GridActionButton style={{ width: "70px" }} color="green" data-id={gridData.data[ndx].users_recordid} onClick={handleUpdate}>Edit</GridActionButton>
                <GridActionButton style={{ width: "70px" }} color="purple" data-id={gridData.data[ndx].users_recordid} onClick={handleViewActivity}>Activity</GridActionButton>
                {gridData.data[ndx].users_deleted
                    ? <GridActionButton style={{ width: "70px" }} color="blue" data-id={gridData.data[ndx].users_recordid} onClick={handleActivate}>Reactivate</GridActionButton>
                    : <GridActionButton style={{ width: "70px" }} color="red" data-id={gridData.data[ndx].users_recordid} onClick={handleActivate}>Deactivate</GridActionButton>
                }
            </GridActionColumn>
        )
    }]

    const getUrl = () => {
        const url = "users"
        const params = {
            parentname: "consultants",
            parentid: globalState.consultant.recordid,
            inactive: false,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleSearch = (val) => {
        const url = getUrl()
        setGridState(ps => ({ ...ps, url: url, search: val, page: 1, busy: true }))
        setGridReset(!gridReset)
    }

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        setGridState(ps => ({ ...ps, sortcol: id, page: 1, sortdir: dir, busy: true }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val, busy: true }))
        setGridReset(!gridReset)
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.users_recordid === target.getAttribute("data-id"))
        setPage({ page: 4, record: rec || {} })
    }

    const handleViewActivity = ({ target }) => {
        const rec = gridData.data.find(r => r.users_recordid === target.getAttribute("data-id"))
        setPage({ page: 5, record: rec || {} })
    }

    const handleActivate = (e) => {
        const rec = gridData.data.find(r => r.users_recordid == e.target.getAttribute("data-id"))
        let data = new FormData();
        data.append("users_recordid", rec.users_recordid)
        setUpdateState(ps => ({ ...ps, data: data, verb: rec.users_deleted ? "PUT" : "DELETE" }))
        const msg = `${rec.users_deleted ? "Activate" : "Deactivate"} This User. Are You Sure?`
        setYnRequest({ message: msg, left: mousePos.x, top: mousePos.y, halign: "left" });
    }

    const updateActivate = (response) => {
        setYnRequest({ ...initYesNoState });
        response && setUpdateState(ps => ({ ...ps, url: "users", reset: !updateState.reset }))
    }

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset, selected: [] })) }, [gridReset])

    useEffect(() => { setGridState(ps => ({ ...ps, busy: false })) }, [gridData])

    useEffect(() => { setGridReset(!gridReset) }, [updateData])

    useEffect(() => {
        reportUserAction(`View User List For Consultant ${globalState.consultant.companyname}`)
        setGridState(ps => ({ ...ps, sortcol: "username" }))
        setGridReset(!gridReset)
    }, [])

    return (<>
        <PanelContainerStyle>
            <PanelHeaderStyle>
                <div>Consultants &gt; Portal &gt; Users</div>
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>
                    Consultant Users for {globalState.consultant.companyname}
                </div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            <div style={{ fontSize: "21px", fontWeight: 700, margin: "20px 0px" }}>User List</div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ flex: 1 }} ><FormButton onClick={handleUpdate}>New User</FormButton> </div>
                <div style={{ width: "400px" }}><GridSearchInput id="search-users" callback={handleSearch} /></div>
            </div>
            <GridWrapper>
                <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
                {gridState.busy
                    ? <GridLoader />
                    : <GridData columns={columns} data={gridData.data} />
                }
                <GridFooterContainer>
                    <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
                </GridFooterContainer>
            </GridWrapper>
        </PanelContainerStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={updateActivate} />}
    </>)
}