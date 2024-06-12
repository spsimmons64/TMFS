import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const MessageContainerStyle = styled.div`
position: absolute;
width: 350px;
top: 20px;
left: 50%;
transform: translateX(-50%);
overflow:hidden;
box-shadow: 4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77);
max-height: ${(props) => props.toggle == 1 ? "200px" : "0px"};
transition: all 0.2s ease-in;
border-radius: 5px;
background-color:${props => {
        if (props.level === "info") return "#FFF"
        if (props.level === "error") return "#FFF"
        if (props.level === "warning") return "#FFF"
    }};
z-index: 10000;
`
const MessageCloseWrapper = styled.div`
display: flex;
align-items:center;
width: 100%;
height: 100%;
background-color: var(--global-message-background);
border-width:3px;
border-style: solid;
border-radius: 5px;
border-left-width:18px;
border-color:${props => {
        if (props.level === "info") return "#76B66A"
        if (props.level === "error") return "#FF6666"
        if (props.level === "warning") return "#F2C779"
    }};
padding: 40px 20px 40px 0px;
`
const MessageIconContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 96px;
height: 100%;
color:${props => {
        if (props.level === "info") return "#76B66A"
        if (props.level === "error") return "#FF6666"
        if (props.level === "warning") return "#F2C779"
    }};
`
const MessageTextContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex:1;
text-align:center;
height:100%;
`

const MessageCloseContainer = styled.div`
position: absolute;
top:10px;
right: 10px;
font-size: 22px;
color: var(--global-message-close-icon);
cursor: pointer;
`

const GlobalMessage = () => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [toggle, setToggle] = useState(0)

    const closeMessage = () => setToggle(0)

    useEffect(() => {
        !toggle && setTimeout(() => { setMessageState({ message: "", level: "" }) }, 500)
    }, [toggle])

    useEffect(() => {
        setToggle(messageState.message !== "" ? 1 : 0)
        if (messageState.message !== "") setTimeout(() => setToggle(0), 2000)
    }, [messageState.message])

    return (
        <MessageContainerStyle toggle={toggle} level={messageState.level}>
            <MessageCloseWrapper level={messageState.level} toggle={toggle}>
                <MessageCloseContainer onClick={closeMessage}>
                    <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faCircleXmark} />
                </MessageCloseContainer>
                <MessageIconContainer level={messageState.level}><FontAwesomeIcon icon={faCircleCheck} size="4x" /></MessageIconContainer>
                <MessageTextContainer>{messageState.message}</MessageTextContainer>
            </MessageCloseWrapper>
        </MessageContainerStyle>
    )
}

export const MessageContext = createContext()
export const MessageContextProvider = ({ children }) => {
    const [messageState, setMessageState] = useState({ level: "", message: "", timeout: 2200, dispatch: null });
    return (
        <MessageContext.Provider value={[messageState, setMessageState]}>
            {children}
            <GlobalMessage />
        </MessageContext.Provider>
    )
}