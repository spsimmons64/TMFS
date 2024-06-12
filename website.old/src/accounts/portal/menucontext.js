import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";


const NavMenuWrapper = styled.div`
width: 100%;
flex:1;
display: flex;
flex-flow:column;
`
const NavMenuItemWrapper = styled.div`
height: 36px;
display: flex;
align-items: center;
font-size: 14px;
font-weight: 700;
padding: 0px 5px 0px 20px;
background-color: ${props => props.selected ? "#484848" : "transparent"};
color: ${props => props.selected ? "#E0E0E0" : "#3A3A3A"};
&:hover{background-color: ${props => props.selected ? "#3A3A3A" : "#BFBFBF"};}
border-bottom: 1px solid #B9B9B9;
cursor:pointer;
`
const NavItemTextStyle = styled.div`
flex:1;
pointer-events:none;
user-select: none;
padding-top: 2px;
`
const NavItemIconStyle = styled.div`
display: flex;
align-items: center;
width: 26px;
font-size: 18px;
pointer-events:none;
`
const NavItemToggleStyle = styled.div`
display: flex;
align-items: center;
font-size: 18px;
pointer-events:none;
user-select: none;
`
const NavItemToggleIcon = styled(FontAwesomeIcon)`
transform: ${props => props.toggled === "true" ? "rotate(-90deg)" : "rotate(0deg)"};
transition: transform .2s ease;
color: ${props => props.selected ? "#E0E0E0" : "#3A3A3A"};
`
const NavSubMenuContainer = styled.div`
max-height: ${props => props.toggled === "true" ? "500px" : "0px"};
opacity: ${props => props.toggled === "true" ? "100%" : "0%"};
visibility: ${props => props.toggled ? "visible" : "hidden"};
transition:  all .30s ease;
overflow:hidden;
`
const NavSubMenuItem = styled.div`
width: 100%;
height: 26px;
display: flex;
align-items: center;
font-size: 12px;
font-weight: 700;
padding: 0px 20px 0px 50px;
background-color: ${props => props.selected ? "#FEFEFE" : "transparent"};
color: #3A3A3A;
&:hover{
    background-color: ${props => props.selected ? "#FEFEFE" : "#BFBFBF"};    
}
cursor:pointer;
border-bottom: 1px dotted #999999
`
const NavScrollStyle = styled.div`
height: 0;
flex:1 1 auto;
overflow-Y: auto;
`
const NavItemStyle = styled.div`
width: 100%;
height: 36px;
display: flex;
align-items: center;
font-size: 14px;
font-weight: 700;
padding: 0px 5px 0px 20px;
background-color: ${props => props.selected ? "#484848" : "transparent"};
color: ${props => props.selected ? "#E0E0E0" : "#3A3A3A"};
&:hover{
    background-color: ${props => props.selected ? "#3A3A3A" : "#BFBFBF"};
}
border-bottom: 1px dotted #999999;
cursor:pointer;
`

const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
    const [menuSelected, setMenuSelected] = useState("");
    const [menuCast, setMenuCast] = useState([]);
    const [selectList, setSelectList] = useState([])
    const [toggleList, setToggleList] = useState([]);

    const handleMenuSelect = ({ target }) => {
        let id = target.getAttribute("data-key")
        const newToggle = []
        const newSelect = [id]
        const rec = menuCast.find(r => r.page == id)        
        if (rec) {
            if (rec.isparent) {                
                const ndx = newToggle.findIndex(r => r === rec.page)
                if (ndx === -1) {
                    if (rec.default){
                        id = rec.default
                        newSelect.push(rec.default)
                    }
                    newToggle.push(rec.page)
                } else {
                    newToggle.splice(ndx, 1)
                }
            }
            if (rec.parent) {
                newSelect.push(rec.parent)
                newToggle.push(rec.parent)
            }
            setSelectList(newSelect)
            setToggleList(newToggle)
        }
        setMenuSelected(id)
    }

    const setTheMenu = (page, parent = "") => {
        const newSelect = [page]
        const newToggle = [...toggleList]
        if(parent){
            newToggle.push(parent)
            newSelect.push(parent)
        }
        setMenuSelected(page)
        setSelectList(newSelect)
        setToggleList(newToggle)        
    }
    return (
        <MenuContext.Provider value={{
            menuSelected,
            menuCast,
            selectList,
            toggleList,
            setMenuSelected,
            setMenuCast,
            setSelectList,
            setToggleList,
            handleMenuSelect,
            setTheMenu
        }}>{children}
        </MenuContext.Provider>);
}

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    return context;
}

export const NavMenu = ({ menudata }) => {
    const { handleMenuSelect, setMenuCast, toggleList, selectList } = useMenuContext();

    const buildMenuList = (node, parent = null) => {
        let result = []
        node.forEach(r => {
            result.push({ page: r.page, isparent: r.hasOwnProperty("submenu"), parent: parent, default: r.default })
            if (r.hasOwnProperty("submenu")) result.push(...buildMenuList(r.submenu, r.page));
        });
        return (result);
    }

    useEffect(() => { setMenuCast(buildMenuList(menudata)) }, [])

    const buildNavMenu = (items, parent = "") => {
        return items.map(r => {
            const toggled = toggleList.includes(r.page).toString();
            const selected = selectList.includes(r.page)
            return (
                <React.Fragment key={r.page}>
                    {!parent
                        ? <NavItemStyle data-key={r.page} toggled={toggled} onClick={handleMenuSelect} selected={selected}>
                            <NavItemIconStyle><FontAwesomeIcon icon={r.icon} style={{ pointerEvents: "none" }} /></NavItemIconStyle>
                            <NavItemTextStyle>{r.text}</NavItemTextStyle>
                            {r.submenu && <NavItemToggleStyle><NavItemToggleIcon icon={faCaretLeft} selected={selected} toggled={toggled} /></NavItemToggleStyle>}
                        </NavItemStyle>
                        : <NavSubMenuItem data-key={r.page} parent={parent} selected={selected} onClick={handleMenuSelect}>
                            {r.text}
                        </NavSubMenuItem>
                    }
                    {r.submenu && <NavSubMenuContainer toggled={toggled}>{buildNavMenu(r.submenu, r.page)}</NavSubMenuContainer>}
                </React.Fragment>
            )
        })
    }
    return (
        <NavMenuWrapper>
            <NavScrollStyle>
                {buildNavMenu(menudata)}
            </NavScrollStyle>
        </NavMenuWrapper>
    )
}