import { createContext, useContext, useReducer, useState } from "react";
import { useRestApi } from "../hooks/apihook";

const GlobalContext = createContext()

const globalReducer = (state, action) => {
    switch (action.type) {
        case "clear_state": return action.payload
        case "update_state":
            return {
                ...state,
                user: action.payload.user,
                master: action.payload.master,
                reseller: action.payload.reseller,
                consultant: action.payload.consultant,
                account: action.payload.account,
                tallies: action.payload.tallies
            }
    }
}

export const GlobalContextProvider = ({ children }) => {       
    const [globalState, setGlobalState] = useReducer(globalReducer, { user: {}, master: {}, account: {}, reseller: {}, consultant: {}, tallies:{} });
    const { fetchData } = useRestApi()

    const updateState = (data) => { setGlobalState({ type: "update_state", payload: data }); }

    const clearState = () => setGlobalState({ type: "clear_state", payload: { user: {}, master: {}, account: {}, reseller: {}, consultant: {}, tallies:{} } });

    const fetchProfile = async (entity, entityid, userid) => {
        const url = `login/profile?entity=${entity}&entityid=${entityid}&userid=${userid}`
        const data = await fetchData(url,"GET")        
        data.status===200 && updateState(data.data)        
    }

    return (<GlobalContext.Provider value={{ globalState, setGlobalState, fetchProfile, updateState, clearState }}>{children}</GlobalContext.Provider>)
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    return context;
}