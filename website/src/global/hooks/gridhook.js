import { useContext, useEffect, useState } from "react"
import { MessageContext } from "../../administration/contexts/messageContext";
import { getApiUrl } from "../globals";

export const initGridState = {
    url: "",
    busy: false,
    ready: false,
    page: 1,
    count: 0,
    limit: 25,
    sortcol: "",
    sortdir: "asc",
    search: "",
    inactive: false,
    rowEdit: { editor: false, record: {} },
    reset: false,
    data: [],
    selected: []
}

export const useGridHook = () => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [gridState, setGridState] = useState({ ...initGridState }); 

    const buildUrl = (url) => {
        const params = {
            url: "",
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        const newParams = { ...params, ...gridState.params }
        const sep = gridState.url.includes("?") ? "&" : "?"
        return `${gridState.url}${sep}${Object.entries(newParams).map(([k, v]) => `${k}=${v}`).join("&")} `
    }

    const fetchGridData = async () => {
        if (gridState.url) {
            let api = new URL(`${getApiUrl()}/${buildUrl()}`)
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
            const resp = await fetch(api, { ...headers });
            const jsonResp = await resp.json();            
            if (jsonResp.message) {
                let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
                setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
            }
            jsonResp.status === 200 &&
                setGridState(ps => ({ ...ps, data: jsonResp.data, count: jsonResp.count || 0, total: jsonResp.total || 0 }))
            return jsonResp
        }
    }

    const setGridSort = (sortcol, forcedir = "", fetch = true) => {
        let sortDir = sortcol !== gridState.sortcol ? "asc" : (gridState.sortdir === "asc" ? "desc" : "asc");
        if (forcedir) sortDir = forcedir;
        setGridState(ps => ({ ...ps, sortcol: sortcol, sortdir: sortDir, page: 1 }));
        fetch && fetchGridData()
    }

    const setGridPageMax = (max, fetch = true) => {
        setGridState(ps => ({ ...ps, limit: max }));
        fetch && fetchGridData()
    }

    const setGridPage = (pageNum, fetch = true) => {
        setGridState(ps => ({ ...ps, page: pageNum }));
        fetch && fetchGridData()
    }

    const setGridUrl = (url, fetch = true) => {
        setGridState(ps => ({ ...ps, url: url }));
        fetch && fetchGridData()
    }

    useEffect(() => { fetchGridData() }, [gridState.url])

    return {
        gridState,
        fetchGridData,        
        setGridUrl,
        setGridPage,
        setGridPageMax,
        setGridSort,
    }
}