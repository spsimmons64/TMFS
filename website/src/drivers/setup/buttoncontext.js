import { createContext, useContext, useState } from "react";


const ButtonContext = createContext()

export const ButtonContextProvider = ({ children }) => {
    const [buttonState, setButtonState] = useState({
        prev: { disabled: false, visible: false },
        next: { disabled: false, visible: false }
    })

    const setPrevDisable = (toggle) => setButtonState(ps => ({ ...ps, prev: { ...ps.prev, disabled: toggle } }))

    const setPrevVisible = (toggle) => setButtonState(ps => ({ ...ps, prev: { ...ps.prev, visible: toggle } }))

    const setNextDisable = (toggle) => setButtonState(ps => ({ ...ps, next: { ...ps.next, disabled: toggle } }))

    const setNextVisible = (toggle) => setButtonState(ps => ({ ...ps, next: { ...ps.next, visible: toggle } }))

    return (<ButtonContext.Provider
        value={{
            buttonState,
            setPrevDisable,
            setPrevVisible,
            setNextDisable,
            setNextVisible
        }}>{children}
    </ButtonContext.Provider>
    )
}

export const useButtonContext = () => {
    const context = useContext(ButtonContext);
    return context;
}