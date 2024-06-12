import { createContext, useState } from "react"

export const DriverContext = createContext()

export const DriverContextProvider = ({children}) => {    
    const[driverRecord,setDriverRecord] = useState({})
    return(<DriverContext.Provider value={{driverRecord,setDriverRecord}}>{children}</DriverContext.Provider>)
}