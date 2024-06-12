import { useEffect } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { FormButton } from "../../../components/portals/buttonstyle";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../../../global/contexts/globalcontext";

export const UsersGrid = ({ setPage }) => {
    const { globalState } = useGlobalContext()
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "username",
        width: "35%",
        header: "User Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].username}</div>
    }, {
        id: "emailaddress",
        width: "24%",
        header: "Email Address",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].emailaddress}</div>
    }, {
        id: "securitylevel",
        width: "10%",
        header: "Role",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].securitylevel=="admin" ? "Administrator" : "User"}</div>
    }, {
        id: "added",
        width: "10%",
        header: "Date Added",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].added}</div>
    }, {
        id: "lastlogin",
        width: "15%",
        header: "Last Login",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].lastlogin}</div>
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This User" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionColumn>
    }]

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 806, subpage: 1, entity: "", entityRecord: {}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => { updateGridData({ url: "users", parent: "resellers", parentid: globalState.master.recordid, sortcol: "username", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Administrative Users</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Administrative Users</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Administrative User Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Users..." id="search-users" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>{`New User`}</FormButton>
                    </div>
                </GridToolBox>
                <GridWrapper>
                    <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
                    {gridState.busy
                        ? <GridLoader />
                        : <GridData columns={columns} data={gridState.data}
                        />
                    }
                    <GridFooterContainer>
                        <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
                    </GridFooterContainer>
                </GridWrapper>
            </PortalPlaygroundScrollContainerStyle>
        </PortalPlayGroundStyle>
    )
}