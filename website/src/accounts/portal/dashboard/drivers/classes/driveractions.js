import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMousePosition } from "../../../../../global/hooks/usemousepos";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";


const ActionMenuContainerStyle = styled.div`
position: absolute;
top: calc(100% + 2px);
left: 50%;
width: 270px;
max-height: ${props => props.open ? "200px" : "0px"};
background-color:#FFF;
border-radius: 5px;
opacity: ${props => props.open ? "1" : "0"};
border: 3px solid #164398;
z-index:50000;
overflow: hidden;
box-shadow: 0 29px 52px rgba(0,0,0,0.40), 0 25px 16px rgba(0,0,0,0.20);
transition: max-height .2s ease-in-out, opacity .5s ease-in-out;

`
const ActionMenuContainer = styled.div`
    padding: 5px 0px;    
    font-size: 12px;        
    user-select: none;
    cursor: pointer;    
    font-weight: 600;    
    border-radius:4px;
    &:hover{
        background-color: #e6e6e6;
    }
`

export const DriverActionContext = createContext()

export const DriverActionProvider = ({ children }) => {
    const mousePos = useMousePosition();
    const [isOpen, setIsOpen] = useState({ open: false, xpos: 0, ypos: 0 })
    const setActionOpen = () => { setIsOpen({ open: true, xpos: mousePos.x, ypos: mousePos.y }) }
    const setActionClose = () => { setIsOpen({ open: false, xpos: 0, ypos: 0 }) }
    return <DriverActionContext.Provider value={{ isOpen, setActionOpen, setActionClose }}>{children}</DriverActionContext.Provider>
}

export const useDriverAction = () => {
    const contexts = useContext(DriverActionContext);
    return contexts;
}

export const DriverActionMenu = ({ menu }) => {
    const { isOpen, setActionOpen, setActionClose } = useDriverAction()
    const divRef = useRef(null)

    const handleMouseDown = ({ target }) => {
        if (divRef.current && !divRef.current.contains(target)) setActionClose();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);
        return () => {document.removeEventListener("mousedown", handleMouseDown)}
    }, [])

    return (
        <ActionMenuContainerStyle ref={divRef} open={isOpen.open} xpos={isOpen.xpos} ypos={isOpen.ypos}>
            <div style={{ width: "100%", padding: "10px" }}>
                {menu.map((r, rndx) => {
                    const color = r.text === "Flag This Driver" ? "red" : "#164398"
                    return (<React.Fragment key={r.text}>
                        {!r.hidden
                            ? <ActionMenuContainer onClick={r.action}>
                                <FontAwesomeIcon icon={faCaretRight} style={{ paddingRight: "5px" }} color={color} />
                                <span style={{ color: color, textDecoration: "underline" }}>{r.text}</span>
                            </ActionMenuContainer>
                            : <></>
                        }
                    </React.Fragment>)
                })}
            </div>
        </ActionMenuContainerStyle>
    )
}