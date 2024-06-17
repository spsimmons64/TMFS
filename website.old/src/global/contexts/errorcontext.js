import { createContext, useState } from "react";

export const ErrorContext = createContext()

export const ErrorContextProvider = ({ children }) => {
    const [errorState, setErrorState] = useState([])
    return (<ErrorContext.Provider value={[errorState, setErrorState]}>{children}</ErrorContext.Provider>)
}