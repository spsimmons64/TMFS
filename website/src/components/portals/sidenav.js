import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { deepFind } from "../../global/globals"
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons"

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
`
const NavItemToggleStyle = styled.div`
display: flex;
align-items: center;
font-size: 18px;
pointer-events:none;
user-select: none;
`
const NavItemToggleIcon = styled(FontAwesomeIcon)`
transform: ${props => props.toggled ? "rotate(-90deg)" : "rotate(0deg)"};
transition: transform .2s ease;
color: ${props => props.toggled || props.selected ? "#E0E0E0" : "#3A3A3A"};
`

const NavSubMenuContainer = styled.div`
max-height: ${props => props.toggled ? "400px" : "0px"};
opacity: ${props => props.toggled ? "100%" : "0%"};
visibility: ${props => props.toggled ? "visible" : "hidden"};
transition: all .2s ease-in-out;
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
border-bottom: 1px solid #B9B9B9
`

export const SideNav = ({ menu, callback }) => {
    const [toggleList, setToggleList] = useState([])
    const [menuSelected, setMenuSelected] = useState({ par: 0, sub: 0 })

    const handleSelect = ({ target }) => {
        let id = parseInt(target.getAttribute("data-key"))
        const rec = deepFind(menu, "key", id)
        id > 99 ? setMenuSelected(ps => ({ ...ps, sub: id })) : setMenuSelected({ par: id, sub: 0 })
        if (rec.submenu) {
            let newList = [...toggleList]
            let ndx = newList.findIndex(r => r === id);
            if (ndx === -1) {
                newList.push(id)                
                setMenuSelected(ps => ({ ...ps, sub: rec.submenu[0].key }))
                callback({ page: rec.submenu[0].key, subpage: -1, record: {} })
            }
            setToggleList(newList);
        } else {
            id < 100 && setToggleList([])
            callback({ page: id, subpage: -1, record: {} })
        }
    }

    const buildMenu = (items, parent) => {
        return items.map((r, ndx) => {
            const toggle = toggleList.includes(r.key) ? 1 : 0;
            return (
                <React.Fragment key={ndx}>
                    {!parent
                        ? <NavItemStyle data-key={r.key} toggled={toggle} onClick={handleSelect} selected={menuSelected.par === r.key}>
                            <NavItemIconStyle><FontAwesomeIcon icon={r.icon} /></NavItemIconStyle>
                            <NavItemTextStyle>{r.text}</NavItemTextStyle>
                            {r.submenu &&
                                <NavItemToggleStyle><NavItemToggleIcon icon={faCaretLeft} toggled={toggle} /></NavItemToggleStyle>
                            }
                        </NavItemStyle>
                        : <NavSubMenuItem data-key={r.key} selected={menuSelected.sub === r.key} onClick={handleSelect}>
                            {r.text}
                        </NavSubMenuItem>
                    }
                    {r.submenu && <NavSubMenuContainer toggled={toggle}>{buildMenu(r.submenu, r.key)}</NavSubMenuContainer>}
                </React.Fragment>
            )
        })
    }
    return (<NavScrollStyle>{buildMenu(menu, "")}</NavScrollStyle>)
}