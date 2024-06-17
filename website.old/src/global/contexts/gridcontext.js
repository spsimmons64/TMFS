import { createContext, useContext, useEffect, useState } from "react";
import { getApiUrl } from "../globals";

const initGridState = {
    url: "",    
    params: {},
    busy: false,    
    page: 1,
    status: 0,    
    count: 0,
    limit: 25,
    sortcol: "",
    sortdir: "asc",
    search: "",
    inactive: false,
    parent: "",
    parentid: "",
    rowEdit: { editor: false, record: {} },
    reset: false,
    data: [],
    selected:[]
}

const GridContext = createContext()

export const GridContextProvider = ({ children }) => {
    const [gridState, setGridState] = useState({ ...initGridState });
    
    const buildUrl = () => {        
        const params = {            
            parent: gridState.parent,
            parentid: gridState.parentid,
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        const newParams = {...params,...gridState.params}        
        return gridState.url + "?" + Object.entries(newParams).map(([k, v]) => `${k}=${v}`).join("&");        
    }

    const updateGridData = (values) => {setGridState(ps=>({...ps,...values,busy:true,reset:!gridState.reset}))}

    const fetchGridData = async () => {           
        if(gridState.url){                            
            let url = `${getApiUrl()}/${buildUrl()}`        
            let api = new URL(url)
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
            const resp = await fetch(api, { ...headers });    
            const jsonResp = await resp.json();            
            setGridState(ps=>({...ps,data:jsonResp.data || [],count:jsonResp.count || 0,status:jsonResp.status,busy:false,}))
        }
    }        
    useEffect(()=>{fetchGridData()},[gridState.reset])
    return ( <GridContext.Provider value={{gridState,fetchGridData,updateGridData}}>{children}</GridContext.Provider>)
}
export const useGridContext = () => {
    const context = useContext(GridContext);
    return context;
}