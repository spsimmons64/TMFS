import { useEffect, useState } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../components/portals/inputstyles";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { FormButton } from "../../components/portals/buttonstyle";
import { useNavigate } from "react-router-dom";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faFlag, faRocket } from "@fortawesome/free-solid-svg-icons";
import { ModalDropCard, ModalDropContentRow } from "../../components/portals/cardstyle";
import { toProperCase } from "../../global/globals";

export const AltAccountsGrid = ({ assets , setPage }) => {
    const nav = useNavigate()
    const { gridState, updateGridData, fetchGridData } = useGridContext();
    const [toggles, setToggles] = useState({ flags: 0, documents: 0 });
    const { reportUserAction } = useUserAction();
    const [parent, setParent] = useState({ parent: "", id: "", name: "" })

    const columns = [{    
        id: "ID",
        width: "5%",
        header: "Acct ID",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].internalid}</div>
    }, {
        id: "companyname",
        width: "25%",        
        header: "Company Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].companyname}</div>
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
        width: "8%",
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
        id: "New",
        width: "8%",
        header: "New Applicants",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "flagged",
        width: "8%",
        header: "Flagged Drivers",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "needreview",
        width: "8%",
        header: "Unreviewed Documents",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Launch The Account Portal" data-id={gridState.data[ndx].recordid} onClick={handleLaunch}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "20px" }} icon={faRocket} color="var(--grid-action-launch)" />
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

    const handleReturnButton = () => {
        if (assets.entity === "reseller") setPage({ page: 3, subpage: -1, record: {} })
        if (assets.entity === "consultant") setPage({ page: 4, subpage: -1, record: {} })
        if (assets.entity === "affiliate") setPage({ page: 801, subpage: -1, record: {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => {
        let new_parent = toProperCase(assets.entity);
        let new_url = `accounts/${assets.entity}s`
        let new_id = assets.entityRecord.recordid
        let new_name = assets.entity !== "affiliate" ? assets.entityRecord.companyname : assets.entityRecord.affiliatename
        setParent({ parent: new_parent, id: new_id, name: new_name })
        updateGridData({ url: new_url, parentid: new_id, sortcol: "companyname", sortdir: "asc" })
    }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>
                    {`TMFS Administration > ${parent.parent} > ${parent.name} > Account Listing`}
                </PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>{`${parent.parent} Accounts`}</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                        <GridToolBox>
                            <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>{`${parent.parent} Account Listing For ${parent.name}`}</div>
                            <div style={{ marginRight: "20px" }}>
                                <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                            </div>
                            <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Accounts..." id="search-accounts" callback={handleSearch} /></div>
                            <div style={{ marginLeft: "20px" }}>
                                <FormButton style={{ height: "34px" }} onClick={handleReturnButton}>{`Back To ${parent.parent}s`}
                                </FormButton></div>
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