import { createContext, useState } from "react";

export const PricingContext = createContext()

export const PricingContextProvider = ({ children }) => {
    const [feesList, setFeesList] = useState({data:[],selected:-1})
    return (<PricingContext.Provider value={[feesList, setFeesList]}>{children}</PricingContext.Provider>)
}