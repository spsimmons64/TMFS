import { useEffect} from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { FormButton } from "../../../components/portals/buttonstyle";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck,faSquare } from "@fortawesome/free-regular-svg-icons";

export const SMTPProfilesGrid = ({ setPage }) => {    
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "isdefault",
        width: "3%",
        header: "",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            if (gridState.data[ndx].isdefault)
                return (<FontAwesomeIcon style={{ fontSize: "18px" }} icon={faCheck} color="var(--grid-isdefault-icon" title="Default" />)
            else
                return (<></>)
        }
    }, {
        id: "domainname",
        width: "25%",
        header: "Domain Name",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].domainname}</div>
    }, {
        id: "endpoint",
        width: "30%",
        header: "End-Point",        
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].endpoint}</div>
    }, {
        id: "usessl",
        width: "14%",
        header: "Use SSL",
        cellStyle: { textAlign: "center", fontSize: "24px"},
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <FontAwesomeIcon icon={gridState.data[ndx].usessl ? faSquareCheck : faSquare} />
    }, {
        id: "sslport",
        width: "20%",
        header: "SSL Port",
        cellStyle: { textAlign: "center"},
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].sslport}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrAlign: "center",
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionColumn>
                <GridAction title="Edit This Record" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionColumn>
        )
    }]    

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 807, subpage: 1, entity: "", entityRecord:{}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => { updateGridData({ url: "smtpprofiles", sortcol: "domainname", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Mail Profiles</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Mail Profiles</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Mail Profiles Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Profiles..." id="search-profiles" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>{`New Profile`}</FormButton>
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