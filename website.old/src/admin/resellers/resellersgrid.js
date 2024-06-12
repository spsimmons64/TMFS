import { useEffect } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../components/portals/inputstyles";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { FormButton } from "../../components/portals/buttonstyle";
import { useNavigate } from "react-router-dom";
import { faCommentDots, faEye, faFileInvoiceDollar, faPenToSquare, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { formatMoney } from "../../global/globals";

export const ResellersGrid = ({ setPage }) => {
    const nav = useNavigate()
    const { gridState, updateGridData, fetchGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "internalid",
        width: "8%",
        header: "Reseller ID",
        hdrAlign: "center",
        cellStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => gridState.data[ndx].res_internalid
    }, {
        id: "companyname",
        width: "27%",
        header: "Reseller Name",
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontSize: "16px", fontWeight: 600 }}>
                    <div className="short">{gridState.data[ndx].res_companyname}</div>
                </div>
                <div style={{ width: "100%", fontSize: "12px" }}>
                    <div className="short">{gridState.data[ndx].res_telephone}</div>
                </div>
            </>)
        }
    }, {
        id: "emailaddress",
        width: "22%",
        header: "Email Address",
        sortable: 1,
        render: (ndx) => <div className="short"><a href={`mailto:${gridState.data[ndx].eml_emailcontact}`}>{gridState.data[ndx].eml_emailcontact}</a></div>
    }, {
        id: "accounts",
        width: "7%",
        header: "Accounts",
        hdrAlign: "center",
        cellStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].accounts}</div>
    }, {
        id: "drivers",
        width: "6%",
        header: "Drivers",
        hdrAlign: "center",
        cellStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].drivers}</div>
    }, {
        id: "balance",
        width: "8%",
        header: "Balance",
        hdrAlign: "right",
        cellStyle: { textAlign: "right" },
        sortable: 1,
        render: (ndx) => <div className="short">{formatMoney(gridState.data[ndx].balance)}</div>
    }, {
        id: "added",
        width: "8%",
        header: "Date Added",
        hdrAlign: "center",
        cellStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].res_dateadded}</div>
    }, {
        id: "action",
        width: "13%",
        header: "Actions",
        sortable: 0,
        hdrAlign: "center",
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This Record" data-id={gridState.data[ndx].res_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Accounts" data-id={gridState.data[ndx].res_recordid} onClick={handleViewAccounts}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
                <GridAction title="View Notes" data-id={gridState.data[ndx].res_recordid} onClick={handleViewNotes}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faCommentDots} color="var(--grid-action-notes" />
                </GridAction>
                <GridAction title="Billing History" data-id={gridState.data[ndx].res_recordid} onClick={handleViewTransactions}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faFileInvoiceDollar} color="#164398" />
                </GridAction>
                <GridAction title="Launch The Reseller Portal" data-id={gridState.data[ndx].res_recordid} onClick={handleLaunch}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faRocket} color="var(--grid-action-launch)" />
                </GridAction>
            </GridActionColumn>
    }]

    const handleLaunch = ({ target }) => {        
        const rec = gridState.data.find(r => r.res_recordid == target.getAttribute("data-id"))
        if (rec) {
            reportUserAction(`Logged Into Reseller Portal For ${rec.res_companyname}`)
            let url = `/resellers/portal/${target.getAttribute("data-id")}`
            nav(url)
        }
    }

    const handleUpdate = ({ target }) => {        
        const rec = gridState.data.find(r => r.res_recordid === target.getAttribute("data-id"))        
        setPage({ page: 3, subpage: 6, entity: "", entityRecord: {}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir, page: 1 })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    const handleViewAccounts = ({ target }) => {
        const rec = gridState.data.find(r => r.res_recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 1, entity: "reseller", entityRecord: rec, record: {} })
    }
    const handleViewTransactions = ({ target }) => {
        const rec = gridState.data.find(r => r.res_recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 2, entity: "reseller", entityRecord: rec, record: {} })
    }
    const handleViewNotes = ({ target }) => {
        const rec = gridState.data.find(r => r.res_recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 3, entity: "reseller", entityRecord: rec, record: {} })
    }

    useEffect(() => updateGridData({ url: "resellers", sortcol: "companyname", sortdir: "asc" }), [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Resellers</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Resellers</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle >
                <GridToolBox >
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror="true" />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Resellers..." id="search-accounts" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "20px" }}><FormButton height="34px" onClick={handleUpdate}>New Reseller</FormButton></div>
                </GridToolBox>
                <GridWrapper>
                    <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
                    {gridState.busy
                        ? <GridLoader />
                        : <GridData columns={columns} data={gridState.data}
                        />
                    }
                </GridWrapper>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
    )
}