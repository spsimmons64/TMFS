import { faCaretLeft, faGauge, faHandshake, faTruckField, faFolder, faFileLines, faHand, faPeopleArrows, faUsersGear, faCommentDots, faBook, faCircleQuestion, faTags, faCogs, faUsers, faBriefcase, faEnvelope, faRss, faBuilding } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import styled from "styled-components"
import { deepFind } from "../../global/globals"


const NavContainer = styled.div`
display: flex;
flex-flow: column;
height:100%;
border-radius: 5px;
padding-right: 1px;
`

const NavScroller = styled.div`
height: 0;
flex: 1 1 auto;
overflow-y: auto;
padding: 8px;
`

const NavItem = styled.div`
display: flex;
align-items: center;
width: 214px;
height: 34px;
background: ${(props) => props.selected ? "var(--sidenav-item-select)" : "transparent"};
border-radius: 5px;
margin-bottom: 10px;
font-size: 18px;
font-weight: 500;
color: var(--sidenav-item-text);
cursor: pointer;
&:hover{
    background-color: var(--sidenav-item-hover);
}
`
const NavItemIcon = styled.div`
width: 40px;
font-size: 22px;
padding-top: 2px;
pointer-events: none;
text-align:center;
`
const NavItemToggle = styled.div`
width: 20px;
font-size: 22px;
padding-top: 2px;
text-algin: right;
pointer-events: none;
`
const NavItemToggleIcon = styled(FontAwesomeIcon)`
    transform: ${(props)=>props.toggled ? "rotate(-90deg)" : "rotate(0deg)"};
    transition: transform .2s ease;
`
const NavItemText = styled.div`
flex:1;
user-select: none;
pointer-events: none;
`
const SubMenuContainer = styled.div`
width: 214px;
max-height:${(props)=>props.toggled ? "300px" : "0px"};
opacity: ${(props)=>props.toggled ? "100%" : "0%"};
visibility: ${(props)=>props.toggled ? "visible" : "hidden"};
transition: all .2s ease-in-out;
`
const SubMenuItem = styled.div`
display: flex;
align-items: center;
width: 100%;
height: 28px;
background: ${(props) => props.selected ? "var(--sidenav-item-select)" : "transparent"};
border-radius: 5px;
margin-bottom: 10px;
font-size: 16px;
font-weight: 500;
color: var(--sidenav-subitem-text);
cursor: pointer;
padding-left: 30px;
&:hover{
    background-color: var(--sidenav-item-hover);
}
`
const SubMenuItemIcon = styled.div`
width: 30px;
font-size: 18px;
pointer-events: none;

`
const SubMenuItemText = styled.div`
flex:1;
user-select: none;
pointer-events: none;
`

export const SideNav = ({ id, selected, callback }) => {
    const [toggledItems, setToggledItems] = useState([])    
    const navMenu = [
        { text: "Dashboard", icon: faGauge, rank: [0, 1, 2], key: 0 },
        {text: "Reports", icon: faFileLines, rank: [0, 1, 2], key: 1, children: [
                { text: "Report 1", icon: faFolder, rank: [0, 1, 2], key: 100 },
                { text: "Report 2", icon: faFolder, rank: [0, 1, 2], key: 101 },
                { text: "Report 3", icon: faFolder, rank: [0, 1, 2], key: 102 },
                { text: "User Activity Logs", icon: faFolder, rank: [0, 1, 2], key: 103 },
                { text: "API Error Reports", icon: faFolder, rank: [0, 1, 2], key: 104 },
            ]
        },
        { text: "Accounts", icon: faTruckField, rank: [0, 1, 2], key: 2 },
        { text: "Resellers", icon: faHandshake, rank: [0, 1, 2], key: 3 },
        { text: "Consultants", icon: faHand, rank: [0, 1, 2], key: 4 },
        { text: "Notes", icon: faCommentDots, rank: [0, 1, 2], key: 7 },
        { text: "Settings", icon: faCogs, rank: [0], key: 8,children:[
            { text: "Company Profile", icon: faBuilding, rank: [0, 1, 2], key: 800 },
            { text: "Affiliates", icon: faPeopleArrows, rank: [0, 1, 2], key: 801 },
            { text: "PEI Employers", icon: faBriefcase, rank: [0, 1, 2], key: 802 },    
            { text: "Knowledge Base", icon: faBook, rank: [0, 1, 2], key: 803 },
            { text: "FAQ's", icon: faCircleQuestion, rank: [0, 1, 2], key: 804 },
            { text: "Pricing Packages", icon: faTags, rank: [0, 1, 2], key: 805 },
            { text: "Users", icon: faUsers, rank: [0, 1, 2], key: 806 },
            { text: "SMTP Profiles", icon: faEnvelope, rank: [0, 1, 2], key: 807 },
            { text: "API Profiles", icon: faRss, rank: [0, 1, 2], key: 808 }    
        ]}
    ]

    const handleSelect = ({target}) => {        
        let id = parseInt(target.getAttribute("data-key"))                
        const rec = deepFind(navMenu,"key",id)        
        if (!rec.children){
            callback(id);                
            return
        } else {
            let pos = navMenu.findIndex(r=>r===id);
            let newList = [...toggledItems]
            let ndx = newList.findIndex(r=>r===id);
            if(ndx > -1){ 
                callback(pos > 0 ? pos-1 : 0);                
                newList.splice(ndx,1)
            }else{         
                callback(rec.children[0].key)       
                newList.push(id)
            }
            setToggledItems(newList);            
        }
    }

    const buildNavMenu = (node, parent = "") => {        
        return node.map((r, ndx) => {       
            const toggle = toggledItems.includes(r.key) ? 1 : 0;                        
            return (
                <React.Fragment key={ndx}>
                    {!parent
                        ? <NavItem key={ndx} data-key={r.key} toggled={toggle} onClick={handleSelect} selected={selected==r.key}>
                            <NavItemIcon><FontAwesomeIcon icon={r.icon} /></NavItemIcon>
                            <NavItemText>{r.text}</NavItemText>
                            {r.children && <NavItemToggle><NavItemToggleIcon toggled={toggle} icon={faCaretLeft} /></NavItemToggle>}
                          </NavItem>
                        : <SubMenuItem data-key={r.key} selected={selected==r.key} onClick={handleSelect}> 
                            <SubMenuItemIcon><FontAwesomeIcon icon={r.icon} /></SubMenuItemIcon>
                            <SubMenuItemText>{r.text}</SubMenuItemText>
                          </SubMenuItem>                          
                    }
                    {r.children && <SubMenuContainer toggled={toggle}>{buildNavMenu(r.children,r.key)}</SubMenuContainer>}
                </React.Fragment>
            )
        })
    }
    return (
        <NavContainer id={id}>
            <NavScroller>{buildNavMenu(navMenu)}</NavScroller>
        </NavContainer>
    )    
}