import { useContext, useEffect, useState } from "react"
import { faRocket,  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../components/administration/grid/grid"
import { initGridState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { GridPager } from "../../components/administration/grid/gridpager"
import { CardFooter, CardHeader, CardModal, CardToolBar } from "../../components/administration/card"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { FormCheck } from "../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../components/administration/inputs/gridsearch"

export const AccountsPopupGrid = ({parent,parentid,companyname,callback}) => {    
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)

    const columns = [{
        id: "accountname",
        width: "47%",
        header: "Account Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].accounts_companyname}</div>
    }, {
        id: "Telephone",
        width: "16%",
        header: "Telephone",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            return (<>
                <div style={{ width: "100%", fontWeight: 600 }}>
                    <div className="short">{gridData.data[ndx].accounts_contactname}</div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className="short">{gridData.data[ndx].accounts_telephone}</div>
                </div>
            </>)
        }
    }, {
        id: "drivers",
        width: "15%",
        header: "Drivers",
        cellStyle: { textAlign: "center"},
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].accounts_drivers}</div>
    }, {
        id: "added",
        width: "14%",
        header: "Date Added",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].accounts_added}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: {},
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Launch Portal" data-id={gridData.data[ndx].accounts_recordid} onClick={handleLaunch}>
                    <FontAwesomeIcon style={{ fontSize:"20px",pointerEvents: "none" }} icon={faRocket} color="purple" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "accounts/resellers"
        const params = {
            parent: parent,
            parentid: parentid,
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleDeactivated = (v) => {
        setGridState(ps => ({ ...ps, inactive: v }))
        setGridReset(!gridReset)
    }

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        setGridState(ps => ({ ...ps, sortcol: id, sortdir: dir }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    const handleSearch = (val) => {
        setGridState(ps => ({ ...ps, search: val }))
        setGridReset(!gridReset)
    }

    const handleLaunch = ({ target }) => {
        alert("Hello")
    }

    useEffect(() => {
        setGridState(ps => ({ ...ps, sortcol: "accountname" }))
        setGridReset(!gridReset)
    }, [])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <CardModal width="800px" height="600px">
            <CardHeader label={`Accounts For ${companyname}`}>
                <div style={{cursor:"pointer"}} onClick={()=>callback()}>
                    <FontAwesomeIcon icon={faCircleXmark} color="#FFF" style={{fontSize:"22px"}}/>
                </div>
            </CardHeader>
            <CardToolBar>                
                <div style={{flex:1}}></div>
                <div style={{ marginRight: "10px" }}>
                    <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                </div>
                <GridSearchInput
                    width="300px"
                    id="accounts-search"
                    placeholder="Search All Accounts..."
                    busy={gridState.busy}
                    callback={handleSearch}
                />                
            </CardToolBar>
            <GridContainer>
                <GridColumnHeader >{buildGridColumnHeaders(columns, handleSort, gridState.sortcol, gridState.sortdir)} </GridColumnHeader>
                <GridScrollContainer>
                    {gridState.busy
                        ? <GridLoader />
                        : buildGridRows(columns, gridData.data)
                    }
                </GridScrollContainer>
            </GridContainer>
            <CardFooter>                
                <div style={{ flex: 1 }}><GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} /></div>                
            </CardFooter>
        </CardModal>
    </>)
}