import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";


const NavHelperContainerStyle = styled.div`
width: 30px;
height: 100%;
`
const NavHelperIconContainer = styled.div`
height: 38px;
width: 100%;
font-size:80px;
`
const NavHelperCaretStyle = styled.div`
width: 0;
height: 0;
margin-left: -1px;
border-top: 18px solid transparent;
border-bottom: 18px solid transparent;
border-left: 18px solid #3A3A3A;
`

export const NavHelper = ({ selected }) => {
    const helpArray = [0, 1, 2, 3];    
    const [tickMark,setTickMark] = useState()

    useEffect(()=>{
        let tm = selected
        if(tm===4) tm = 2
        if(tm===5) tm = 2
        setTickMark(tm)
    },[selected])


    return (
        <NavHelperContainerStyle>
            <div style={{ height: "146px", width: "100%" }}></div>
            {helpArray.map((r) => {
                return (
                    <NavHelperIconContainer key={r}>
                        {tickMark === r && <NavHelperCaretStyle/>}
                    </NavHelperIconContainer>
                )
            })}
        </NavHelperContainerStyle>
    )
}
