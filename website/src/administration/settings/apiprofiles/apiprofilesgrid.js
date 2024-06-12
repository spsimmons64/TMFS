import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faPenToSquare, faRss, faUsers } from "@fortawesome/free-solid-svg-icons"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initFormState, initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { APIProfilesForm } from "./apiprofilesform"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { useUserAction } from "../../../global/contexts/useractioncontext"

export const APIProfilesGrid = () => {
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const [position, setPosition] = useState({ ...initFormState })
    const posData = useRestApi(position.url, "POST", position.data, position.reset)
    const {reportUserAction} = useUserAction()

    const columns = [{
        id: "apiname",
        width: "38%",
        header: "API Profile",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontWeight: 600 }}>
                    <div className="short">{`${gridData.data[ndx].apiprofiles_apiname} (${gridData.data[ndx].apiprofiles_apitype})`}</div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className="short">{gridData.data[ndx].apiprofiles_companyname}</div>
                </div>
            </>)
        }
    }, {
        id: "company",
        width: "26%",
        header: "Support",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%" }}>
                    <div className="short">
                        <a href={`href=mailto:${gridData.data[ndx].apiprofiles_supportemail}`} taget="_blank">{gridData.data[ndx].apiprofiles_supportemail}</a>
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className="short">{gridData.data[ndx].apiprofiles_supportphone}</div>
                </div>
            </>)
        }
    }, {
        id: "passwordlastchange",
        width: "15%",
        header: "Last PW Change",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].apiprofiles_passwordlastchange}</div>
    }, {
        id: "passwordnextchange",
        width: "15%",
        header: "Next PW Change",
        cellStyle: { textAlign: "center", marginTop: "10px" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].apiprofiles_passwordexpiredate}</div>
    }, {
        id: "action",
        width: "6%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: { textAlign: "center", marginTop: "4px" },
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].apiprofiles_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px", pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "apiprofiles"
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
        const rec = gridData.data.find(r => r.apiprofiles_recordid === target.getAttribute("data-id"))
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
        reportUserAction("Viewed TMFS Administrative API Profiles")
        setGridReset(!gridReset) 
    }, [])

    useEffect(() => { posData.status == 200 && setGridReset(!gridReset) }, [posData])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faRss} /></div>
                    <div style={{ flex: 1 }}>API Profiles</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="apiprofiles-search"
                        placeholder="Search All Profiles..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
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
        {gridState.rowEdit.editor && <APIProfilesForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}