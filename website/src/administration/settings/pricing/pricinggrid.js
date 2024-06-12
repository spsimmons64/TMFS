import { useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { faCheck, faEye, faPenToSquare, faTags } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initGridState, priceByData, pricingFeeTypes, pricingFrequency } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { PricingForm } from "./pricingform"
import { useUserAction } from "../../../global/contexts/useractioncontext"

export const PricingGrid = () => {    
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const {reportUserAction} = useUserAction()

    const columns = [{
        id: "isdefault",
        width: "3%",
        header: "",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            if (gridData.data[ndx].pricing_isdefault)
                return (<FontAwesomeIcon style={{ fontSize: "18px" }} icon={faCheck} color="var(--grid-isdefault-icon" title={`Default For Fee Type "${gridData.data[ndx].pricing_feetype}"`} />)
            else
                return (<></>)
        }
    }, {
        id: "packagename",
        width: "43%",
        header: "Package Name",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].pricing_packagename}</div>
    }, {
        id: "feetype",
        width: "20%",
        header: "Package Type",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            const getOptionData = (val) => {
                const pt = pricingFeeTypes.find(r=>r.value==val);
                return pt ? pt.text : "Unknown";
            }
            return(<div className="short">{getOptionData(gridData.data[ndx].pricing_packagetype)}</div>)
        }        
    }, {
        id: "frequency",
        width: "20%",
        header: "Frequency",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},        
        sortable: 1,
        render: (ndx) => {
            const getOptionData = (val) => {
                const pt = pricingFrequency.find(r=>r.value==val);
                return pt ? pt.text : "Unknown";
            }
            return(<div className="short">{getOptionData(gridData.data[ndx].pricing_frequency)}</div>)
        }        
        
    }, {
        id: "priceby",
        width: "14%",
        header: "Structure",
        cellStyle: {marginTop:"4px"},
        sortable: 1,
        render: (ndx) => {
            const getOptionData = (val) => {
                const pt = priceByData.find(r=>r.value==val);
                return pt ? pt.text : "Unknown";
            }
            return(<div className="short">{getOptionData(gridData.data[ndx].pricing_priceby)}</div>)
        }        

    }, {
        id: "added",
        width: "11%",
        header: "Date Added",
        cellStyle: {marginTop:"4px"},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].pricing_added}</div>
    }, {
        id: "action",
        width: "10%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].pricing_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="View Associations" data-id={gridData.data[ndx].pricing_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faEye} color="var(--grid-action-view)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "pricing"
        const params = {            
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.pricing_recordid === target.getAttribute("data-id"))
        setGridState(ps => ({ ...ps, rowEdit: { editor: true, record: rec || {} } }))
    }

    const updateCallBack = (resp) => {
        setGridState(ps => ({ ...ps, rowEdit: { editor: false, record: {} } }))
        resp && setGridReset(!gridReset)
    }

    const handleSearch = (val) => {
        setGridState(ps => ({ ...ps, search: val }))
        setGridReset(!gridReset)
    }

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        setGridState(ps => ({ ...ps, sortcol: id, sortdir: dir }))
        setGridReset(!gridReset)
    }

    const handleDeactivated = (v) => {
        setGridState(ps => ({ ...ps, inactive: v }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    useEffect(() => {
        reportUserAction("Viewed TMFS Administrative Pricing Packages")
        setGridState(ps => ({ ...ps, sortcol: "packagename" }))
        setGridReset(!gridReset)
    }, [])

    useEffect(() => {
        setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset }))
    }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faTags} /></div>
                    <div style={{ flex: 1 }}>Pricing Packages</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="pricing-search"
                        placeholder="Search All Pricing..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "110px", marginLeft: "10px" }} label="New Package" onClick={handleUpdate} />
                </div>
            </PanelHeader>
            <PanelContent>
                <GridContainer>
                    <GridColumnHeader >{buildGridColumnHeaders(columns, handleSort, gridState.sortcol, gridState.sortdir)} </GridColumnHeader>
                    <GridScrollContainer>
                        {gridState.busy
                            ? <GridLoader />
                            : buildGridRows(columns, gridData.data)
                        }
                    </GridScrollContainer>
                </GridContainer>
            </PanelContent>
            <PanelFooter>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </PanelFooter>
        </Panel >
        {gridState.rowEdit.editor && <PricingForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}