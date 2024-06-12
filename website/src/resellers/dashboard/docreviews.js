import { useEffect, useState } from "react"
import { initGridState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridWrapper } from "../../components/portals/gridstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { GridPager } from "../../components/portals/gridpager"
import { GridSearchInput } from "../../components/portals/inputstyles"

export const DocReviews = () => {
    const { globalState } = useGlobalContext();
    const [gridState, setGridState] = useState({ ...initGridState })
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)

    const columns = [{
        id: "date",
        width: "16%",
        header: "Date",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].docreviews_date
    }, {
        id: "account",
        width: "16%",
        header: "Account",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].docreviews_accountname
    }, {
        id: "type",
        width: "16%",
        header: "Type",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].docreviews_doctype
    }, {
        id: "description",
        width: "16%",
        header: "Description",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => gridData.data[ndx].docreviews_accountname
    }]

    const getUrl = () => {
        const url = "docreviews"
        const params = {
            parent: "resellers",
            parentid: globalState.reseller.recordid,
            inactive: true,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleSearch = (val) => { }//updateGridData({ search: val, page: 1 })

    const handlePageChange = (val) => { }//updateGridData({ page: val })

    const handleSort = (id) => {
        // const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        // updateGridData({ sortcol: id, page: 1, sortdir: dir })
    }

    //useEffect(() => { setGridState(ps => ({ ...ps, busy: true, url: buildUrl() })) }, [])

    useEffect(() => { }, [gridData])

    return (<>
        <div style={{ width: "100%", textAlign: "right", display: "flex", alignItems:"center",padding:"10px 0px" }}>
            <div style={{flex:1}}></div>
            <div style={{width:"400px"}}><GridSearchInput id="search-docreviews" callback={handleSearch} /></div>
        </div>
        <GridWrapper>
            <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
            {gridState.busy
                ? <GridLoader />
                : <GridData columns={columns} data={gridState.data} />
            }
            <GridFooterContainer style={{ borderTop: "1px dotted #B3B3B3" }}>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </GridFooterContainer>
        </GridWrapper>
    </>)
}