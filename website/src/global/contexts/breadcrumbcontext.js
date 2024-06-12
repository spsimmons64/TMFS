import { createContext, useContext, useState } from "react"

const BreadCrumbContext = createContext()

export const BreadCrumbContextProvider = ({ children }) => {       
    const [breadCrumb, setBreadCrumb] = useState("Portal > Dashboard")
    
    const updateBreadCrumb = (data) => setBreadCrumb(data);

    return (<BreadCrumbContext.Provider value={{breadCrumb,updateBreadCrumb }}>{children}</BreadCrumbContext.Provider>)
}

export const useBreadCrumb = () => {
    const context = useContext(BreadCrumbContext);
    return context;
}
