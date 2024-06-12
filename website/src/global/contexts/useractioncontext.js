
import React, { createContext, useContext } from 'react';
import { getApiUrl } from '../globals';

const UserActionContext = createContext();

export const UserActionProvider = ({ children }) => {
    const reportUserAction = async (action) => {        
        let data = new FormData()
        data.append("action",action)
        let api = new URL(`${getApiUrl()}/userlogs`)
        const headers = { credentials: "include", method: "POST", body: data }
        const resp = await fetch(api, { ...headers });
        const jsonResp = await resp.json();
    };
    const contextValue = { reportUserAction };
    return (
        <UserActionContext.Provider value={contextValue}>
            {children}
        </UserActionContext.Provider>
    );
};
export const useUserAction = () => {
    const context = useContext(UserActionContext);
    return context;
};