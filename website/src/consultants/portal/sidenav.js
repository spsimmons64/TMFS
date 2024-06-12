import { faHouse, faPowerOff, faScrewdriverWrench, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../global/contexts/globalcontext";

const SideNavContainerStyle = styled.div`
display:flex;
align-items: center;
width: 100%;
height: 36px;
font-weight: 700;
font-size: 16px;
padding-left: 10px;
color: ${props => props.selected ? "#E0E0E0" : "#3A3A3A"};
background-color: ${props => props.selected ? "#3A3A3A" : "#E0E0E0"};
&:hover{
    background-color: ${props => props.selected ? "#3A3A3A" : "#BFBFBF"};
}
cursor:pointer;
`
const NavItemDividerStyle = styled.hr`
margin:0;
padding:0;
width: 100%
`
const NavItemIconStyle = styled.div`
display: flex;
align-items: center;
justify-content: center;
height: 100%;
width: 30px;
`
const NavItemTextstyle = styled.div`
flex:1;
`
export const SideNav = ({ selected, callback }) => {
    const [tickMark, setTickMark] = useState()
    const {globalState} = useGlobalContext()
    const navMenu = [
        { icon: faHouse, text: "Dashboard", level: "user" },
        { icon: faScrewdriverWrench, text: "Settings", level: "master" },
        { icon: faUserGroup, text: "Users", level: "master" },
        { icon: faPowerOff, text: "Logout", level: "user" }
    ]

    useEffect(() => {
        let tm = selected;
        if (tm === 4) tm = 2
        if (tm === 5) tm = 2
        setTickMark(tm)
    }, [selected])


    return (<>
        <NavItemDividerStyle />
        {navMenu.map((r, ndx) => {
            if (globalState.user.ismaster=="1" || (globalState.user.ismaster =="0" && r.level === "user")) {
                return (<React.Fragment key={ndx}>
                    <SideNavContainerStyle selected={tickMark == ndx ? 1 : 0} onClick={() => callback(ndx)}>
                        <NavItemIconStyle><FontAwesomeIcon icon={r.icon} style={{ pointerEvents: "none" }} /></NavItemIconStyle>
                        <NavItemTextstyle> {r.text} </NavItemTextstyle>
                    </SideNavContainerStyle>
                    <NavItemDividerStyle />
                </React.Fragment>)
            }
        })}
    </>)
}