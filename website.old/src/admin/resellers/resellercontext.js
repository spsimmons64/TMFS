import { createContext, useState } from "react";

export const ResellerContext = createContext()

export const ResellerContextProvider = ({ children }) => {
    const [record, setRecord] = useState({})
    const [error, setError] = useState({})
    return (<ResellerContext.Provider value={{record, setRecord,error, setError}}>{children}</ResellerContext.Provider>)
}