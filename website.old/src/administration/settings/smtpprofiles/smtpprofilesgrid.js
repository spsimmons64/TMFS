import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faEnvelope, faPenToSquare, faUsers } from "@fortawesome/free-solid-svg-icons"
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initFormState, initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { SMTPProfilesForm } from "./smtpprofilesform"
import { useUserAction } from "../../../global/contexts/useractioncontext"


export const SMTPProfilesGrid = () => {
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const [position, setPosition] = useState({ ...initFormState })
    const posData = useRestApi(position.url, "POST", position.data, position.reset)
    const {reportUserAction} = useUserAction()
    
    const columns = [{
        id: "isdefault",
        width: "3%",
        header: "",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            if (gridData.data[ndx].smtpprofiles_isdefault)
                return (<FontAwesomeIcon style={{ fontSize: "18px" }} icon={faCheck} color="var(--grid-isdefault-icon" title={`Default For Fee Type "${gridData.data[ndx].pricing_feetype}"`} />)
            else
                return (<></>)
        }
    }, {
        id: "domainname",
        width: "25%",
        header: "Domain Name",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].smtpprofiles_domainname}</div>
    }, {
        id: "endpoint",
        width: "30%",
        header: "End-Point",
        cellStyle: {marginTop:"4px"},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].smtpprofiles_endpoint}</div>
    }, {
        id: "usessl",
        width: "14%",
        header: "Use SSL",
        cellStyle: { textAlign: "center", fontSize: "24px"},
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <FontAwesomeIcon icon={gridData.data[ndx].smtpprofiles_usessl ? faSquareCheck : faSquare} />
    }, {
        id: "sslport",
        width: "20%",
        header: "SSL Port",
        cellStyle: { textAlign: "center" ,marginTop:"4px"},
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].smtpprofiles_sslport}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].smtpprofiles_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize:"24px",pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "smtpprofiles"
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
        const rec = gridData.data.find(r => r.smtpprofiles_recordid === target.getAttribute("data-id"))
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

    const handleDeactivated = (e) => {
        setGridState(ps => ({ ...ps, inactive: e.target.checked }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    useEffect(() => { 
        reportUserAction("Viewed TMFS Administrative Users")
        setGridReset(!gridReset)         
    }, [])

    useEffect(() => { posData.status == 200 && setGridReset(!gridReset) }, [posData])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faEnvelope} /></div>
                    <div style={{ flex: 1 }}>SMTP Profiles</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="smtpprofiles-search"
                        placeholder="Search All Profiles..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "110px", marginLeft: "10px" }} label="New Profile" onClick={handleUpdate} />
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
        {gridState.rowEdit.editor && <SMTPProfilesForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}