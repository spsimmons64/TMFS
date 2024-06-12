import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CardButton } from "./button";

const YesNoWrapperStyle = styled.div`
position:absolute;
left:0;
top:0;
width:${props=>props.toggle ? "100%" : "0px"};
height:${props=>props.toggle ? "100%" : "0px"};
background-color: rgba(0,0,0,45%);
z-index: 10000;
`
const YesNoContainerStyle = styled.div`
position:absolute;
left: ${props => props.left || "0"};
top: ${props => props.top || "0"};
width: 340px;
max-height: ${(props) => props.toggle==1 ? "157px" : "0px"};
transition: all 0.2s ease-in-out;
background-color: var(--global-yesno-border);
border-radius:5px;
overflow: hidden;
box-shadow: 4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77);
`
const YesNoInnerContainerStyle = styled.div`
display: flex;
flex-flow: column;
background-color: var(--global-message-background);
border: 3px solid var(--global-yesno-border);
border-radius:5px;
width: 100%;
height: 100%;
`
const YesNoInfoContainerStyle = styled.div`
flex:1;
display: flex;
align-items: center;
padding: 20px 0px;
`
const YesNoInfoIconStyle = styled.div`
width: 90px;
text-align:center;
`
const YesNoInfoTextStyle = styled.div`
flex: 1;
text-align: center;
padding-right: 20px;
`
const YesNoButtonBarStyle=styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
background-color: var(--card-footer-background);
padding: 8px;
border-top: 1px solid var(--card-border);
`
export const initYesNoState = {
    message: "",
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    callback: ""
}

export const YesNo = (props) => {
    const {message,left,top,valign,halign,callback,...nprops} = props;    
    const [toggle,setToggle] = useState(0);
    const width = 350;
    const height= 157;
    const newHAlign = halign || "right"    
    const newVAlign = valign || "top"    
    let newLeft = left;
    let newTop = top;
    if (newHAlign==="left") newLeft = left - width;
    if (newHAlign==="center") newLeft= left-(width/2);
    if (newVAlign==="bottom") newTop = top- height;
    if (newVAlign==="center") newTop = top- (height/2);
    newLeft = `${newLeft}px`
    newTop =  `${newTop}px`

    const handleCallback = (resp) => {
        setToggle(0);
        callback(resp)
    }

    useEffect(()=>{setToggle(message !== "" ? 1 : 0)},[message])

    return (
        <YesNoWrapperStyle toggle={toggle}>
            <YesNoContainerStyle left={newLeft} top={newTop} toggle={toggle}>
                <YesNoInnerContainerStyle>
                    <YesNoInfoContainerStyle>
                        <YesNoInfoIconStyle>
                             <FontAwesomeIcon icon={faCircleQuestion} color="var(--global-yesno-border)" size="4x" />
                        </YesNoInfoIconStyle>
                        <YesNoInfoTextStyle>{message}</YesNoInfoTextStyle>
                    </YesNoInfoContainerStyle>
                    <YesNoButtonBarStyle>
                        <div style={{ marginRight: "4px" }}>
                            <CardButton style={{ width: "90px", height: "30px" }} onClick={()=>handleCallback(true)} >Yes</CardButton>
                        </div>
                        <div style={{ marginLeft: "4px" }}>
                            <CardButton style={{ width: "90px", height: "30px" }} onClick={()=>handleCallback(false)}>No</CardButton></div>
                    </YesNoButtonBarStyle>                    
                </YesNoInnerContainerStyle>
            </YesNoContainerStyle>
        </YesNoWrapperStyle>
    )
}