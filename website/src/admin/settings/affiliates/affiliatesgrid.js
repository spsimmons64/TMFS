import { useEffect, useState } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { FormButton } from "../../../components/portals/buttonstyle";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../../../global/contexts/globalcontext";

export const AffiliatesGrid = ({ setPage }) => {
    const { globalState } = useGlobalContext()
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "lookupcode",
        width: "10%",
        header: "Lookup ID",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].lookupcode}</div>
    }, {
        id: "affiliatename",
        width: "54%",
        header: "Affiliate Name",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].affiliatename}</div>
    }, {
        id: "telephone",
        width: "10%",
        header: "Telephone",
        cellStyle: {},
        hdrStyle: {},
        render: (ndx) => <div className="short">{gridState.data[ndx].telephone}</div>
    }, {
        id: "referrals",
        width: "10%",
        header: "Referrals",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].referrals}</div>
    }, {
        id: "added",
        width: "10%",
        header: "Date Added",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].added}</div>
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This Affiliate" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Accounts" data-id={gridState.data[ndx].recordid} onClick={handleViewAccounts}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
            </GridActionColumn>
    }]

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 801, subpage: 1, entity: "", entityRecord: {}, record: rec || {} })
    }

    
    const handleViewAccounts = ({ target }) => {
        const rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        rec && setPage({ page: 3, subpage: 1, entity: "affiliate", entityRecord: rec, record: {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });
    
    useEffect(() => { updateGridData({ url: "affiliates", sortcol: "affiliatename", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Affiliates</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>{`Affiliates`}</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Affiliate Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Affiliates..." id="search-affiliates" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>{`New Affiliate`}</FormButton>
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