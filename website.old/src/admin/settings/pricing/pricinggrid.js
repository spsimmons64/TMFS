import { useEffect, useState } from "react"
import { GridAction, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { FormButton } from "../../../components/portals/buttonstyle";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { priceByType, pricingFeeTypes, pricingFrequency } from "../../../global/staticdata";

export const PricingGrid = ({ setPage }) => {    
    const { gridState, updateGridData } = useGridContext();
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "isdefault",
        width: "3%",
        header: "",        
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            if (gridState.data[ndx].isdefault)
                return (<FontAwesomeIcon style={{ fontSize: "18px" }} icon={faCheck} color="var(--grid-isdefault-icon" title="Default"/>)
            else
                return (<></>)
        }
    },{
        id: "packagename",
        width: "60%",
        header: "Pricing Package",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].packagename}</div>
    }, {
        id: "packagetype",
        width: "14%",
        header: "Type",
        sortable: 1,
        render: (ndx) => {
            const priceType = pricingFeeTypes.find(r=>r.value==gridState.data[ndx].packagetype)
            return(<div className="short">{priceType.text}</div>)
        }
    }, {
        id: "frequency",
        width: "14%",
        header: "Frequency",
        sortable: 1,
        render: (ndx) => {
            const priceFreq = pricingFrequency.find(r=>r.value==gridState.data[ndx].frequency)
            return(<div className="short">{priceFreq.text}</div>)
        }
    }, {
        id: "priceby",
        width: "14%",
        header: "Pricing By",
        sortable: 1,
        render: (ndx) => {
            const priceBy = priceByType.find(r=>r.value==gridState.data[ndx].priceby)
            return(<div className="short">{priceBy.text}</div>)
        }
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
                <GridAction title="Edit This Package" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionColumn>
    }]

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 805, subpage: 1, entity: "", entityRecord:{}, record: rec || {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => { updateGridData({ url: "pricing", sortcol: "packagename", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Pricing Packages</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Pricing Packages</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Pricing Packages Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Packages..." id="search-packages" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>New Package</FormButton>
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