import { useEffect, useState } from "react"
import styled from "styled-components"
import { CardButton } from "../../components/administration/button"
import { YesNo} from "../../components/administration/yesno"

const NavWrapper = styled.div`
background-image: var(--top-nav-background);
height: 28px;
width: 100%;
padding: 0px 8px;
`
const NavContainer = styled.div`
display: flex;
align-items: center;
width: 100%;
height: 100%;
color: var(--top-nav-text);
font-size:12px;
`
export const BottomNav = ({ company }) => {
    return (
        <NavWrapper>
            <NavContainer>
                <div style={{ flex: 1 }}>Copyright @ 2024 {company}. All Rights Reserved</div>
                <div style={{ flex: 1,textAlign:"right" }}>Powered By TMFS Corporation</div>
            </NavContainer>
        </NavWrapper>
    )
}