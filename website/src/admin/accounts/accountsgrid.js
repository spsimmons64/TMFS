import { useEffect } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../components/portals/inputstyles";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { useNavigate } from "react-router-dom";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faFileInvoiceDollar, faPenToSquare, faRocket } from "@fortawesome/free-solid-svg-icons";
import { formatMoney } from "../../global/globals";

export const AccountsGrid = ({ setPage }) => {
    const nav = useNavigate()
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "resellerid",
        width: "8%",
        header: "Reseller ID",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) => (
            <div className="short" title={(gridState.data[ndx].reseller && gridState.data[ndx].reseller.ismaster == 0) ? gridState.data[ndx].reseller.companyname : ""}>
                {(gridState.data[ndx].reseller && gridState.data[ndx].reseller.ismaster == 0) ? gridState.data[ndx].reseller.internalid : ""}
            </div>
        )
    }, {
        id: "ID",
        width: "8%",
        header: "Account ID",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].internalid}</div>
    }, {
        id: "companyname",
        width: "26%",
        header: "Company Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontSize: "16px", fontWeight: 600 }}>
                    <div className="short">{gridState.data[ndx].companyname}</div>
                </div>
                <div style={{ width: "100%", fontSize: "12px" }}>
                    <div className="short">{gridState.data[ndx].telephone}</div>
                </div>
            </>)
        }
    }, {
        id: "active",
        width: "7%",
        header: "Active Drivers",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "pending",
        width: "7%",
        header: "Pending Drivers",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "newapps",
        width: "8%",
        header: "New Applicants",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "explicense",
        width: "8%",
        header: "Expiring Licenses",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "expmedcard",
        width: "8%",
        header: "Expiring Med Cards",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "expclearinghouse",
        width: "8%",
        header: "Expiring Clearinghouse",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "balance",
        width: "8%",
        header: "Balance",
        cellStyle: { textAlign: "right" },
        hdrAlign: "right",
        sortable: 1,
        render: (ndx) => <div className="short">{formatMoney(gridState.data[ndx].balance)}</div>
    }, {
        id: "dateadded",
        width: "8%",
        header: "Date Added",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].dateadded}</div>
    }, {
        id: "action",
        width: "10%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This Record" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Notes" data-id={gridState.data[ndx].recordid} onClick={handleViewNotes}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faCommentDots} color="var(--grid-action-notes" />
                </GridAction>
                <GridAction title="Billing History" data-id={gridState.data[ndx].recordid} onClick={handleViewTransactions}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faFileInvoiceDollar} color="#164398" />
                </GridAction>
                <GridAction title="Launch The Account Portal" data-id={gridState.data[ndx].recordid} onClick={handleLaunch}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faRocket} color="var(--grid-action-launch)" />
                </GridAction>
            </GridActionColumn>
    }]

    const handleLaunch = ({ target }) => {
        const rec = gridState.data.find(r => r.recordid == target.getAttribute("data-id"))
        if (rec) {
            reportUserAction(`Logged Into Reseller Portal For ${rec.companyname}`)
            let url = `/accounts/portal/${target.getAttribute("data-id")}`
            nav(url)
        }
    }

    const handleUpdate = ({ target }) => {
        const rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))        
        setPage({ page: 2, subpage: rec ? 1 : 2, entity: "", entityRecord: {}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handleViewTransactions = ({ target }) => {
        const rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 2, entity: "account", entityRecord: rec, record: {} })
    }
    const handleViewNotes = ({ target }) => {
        const rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 3, entity: "account", entityRecord: rec, record: {} })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => updateGridData({ url: "accounts", parentid: "", sortcol: "companyname", sortdir: "asc" }), [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Accounts Listing</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Accounts</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Accounts Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Accounts..." id="search-accounts" callback={handleSearch} /></div>
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