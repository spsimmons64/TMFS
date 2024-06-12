import { useEffect} from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export const APIProfilesGrid = ({ setPage }) => {    
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "apiname",
        width: "38%",
        header: "API Profile",
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontWeight: 600 }}>
                    <div className="short">{`${gridState.data[ndx].apiname} (${gridState.data[ndx].apitype})`}</div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className="short">{gridState.data[ndx].companyname}</div>
                </div>
            </>)
        }
    }, {
        id: "supportemail",
        width: "26%",
        header: "Support",
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%" }}>
                    <div className="short">
                        <a href={`href=mailto:${gridState.data[ndx].supportemail}`} taget="_blank">{gridState.data[ndx].supportemail}</a>
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className="short">{gridState.data[ndx].supportphone}</div>
                </div>
            </>)
        }
    }, {
        id: "passwordlastchange",
        width: "15%",
        header: "Last Password / Token Change",
        cellStyle: { textAlign: "center"},
        hdrAlign:"center",
        sortable: 0,
        render: (ndx) => <div className="short">{gridState.data[ndx].passwordlastchange}</div>
    }, {
        id: "passwordnextchange",
        width: "15%",
        header: "Next Password / Token Change",
        cellStyle: { textAlign: "center"},
        hdrAlign:"center",
        sortable: 0,
        render: (ndx) => <div className="short">{gridState.data[ndx].passwordexpiredate}</div>
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        cellStyle: { textAlign: "center"},
        hdrAlign:"center",
        sortable: 0,
        render: (ndx) => (
            <GridActionColumn>
                <GridAction title="Edit This Record" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px", pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>                
            </GridActionColumn>
        )
    }]

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        if (rec["apitype"]== "MVR")
            setPage({ page: 808, subpage: 1, entity: "", entityRecord:{}, record: rec || {} })
        if (rec["apitype"]== "PSP")
            setPage({ page: 808, subpage: 2, entity: "", entityRecord:{}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => { updateGridData({ url: "apiprofiles", sortcol: "apiname", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; API Profiles</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>API Profiles</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>API Profiles Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Profiles..." id="search-profiles" callback={handleSearch} /></div>
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