import { useEffect, useState } from "react"
import { initGridState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { GridSearchInput, InputStyle } from "../../components/portals/inputstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { PanelContainerStyle, PanelHeaderStyle } from "../../components/portals/panelstyles";
import { TabContainer } from "../../components/portals/tabcontainer";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const UsersActivityGrid = ({ record, setPage }) => {
    const [gridState, setGridState] = useState({ ...initGridState });
    const [gridReset, setGridReset] = useState(false);
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset);
    const [tabSelected, setTabSelected] = useState(0);
    const tabMenu = [{ text: `User Activity Log`, key: 0 }];
    const {reportUserAction} = useUserAction();

    const columns = [{
        id: "added",
        width: "12%",
        header: "Log Date",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].userlogs_added
    }, {
        id: "ipaddress",
        width: "12%",
        header: "IP Address",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].userlogs_ipaddress
    }, {
        id: "action",
        width: "76%",
        header: "",
        header: "Activity",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].userlogs_action
    }]

    const getUrl = () => {
        const url = "userlogs"
        const params = {
            parentid: record.users_recordid,
            inactive: true,
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
        setGridState(ps => ({ ...ps, sortcol: id, page: 1, sortdir: dir, busy: true}))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val, busy: true}))
        setGridReset(!gridReset)
    }    

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset, selected: [] })) }, [gridReset])

    useEffect(() => { setGridState(ps => ({ ...ps,count:gridData.count,busy: false})) }, [gridData])

    useEffect(() => {
        reportUserAction(`View User Activity For Consultant User ${record.users_firstname} ${record.users_lastname}` )
        setGridState(ps => ({ ...ps, sortcol: "added", sortdir: "desc" }))
        setGridReset(!gridReset)
    }, [])

    return (<>
        <PanelContainerStyle>
            <PanelHeaderStyle>
                <div>{`Consultants > Portal > Users > ${record.users_firstname} ${record.users_lastname} > Activity Log`} </div>
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>
                    {`Activity Log For ${record.users_firstname} ${record.users_lastname}`}
                </div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            <div style={{ fontSize: "21px", fontWeight: 700, margin: "20px 0px" }}>Activity Log</div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ flex: 1 }} ><FormButton onClick={()=>setPage(ps=>({page:2,record:{}}))}>Return To User List</FormButton></div>
                <div style={{width:"400px"}}><GridSearchInput id="search-users" callback={handleSearch} /></div>                                    
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
    </>)
}