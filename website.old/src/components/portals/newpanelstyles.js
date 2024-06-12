import styled from "styled-components"
import PortalNavHeaderBorder from "../../assets/images/top-bar-divider.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CircleButton } from "./buttonstyle"
import { faFlag } from "@fortawesome/free-solid-svg-icons"

export const PortalLayoutStyle = styled.div`
display: flex;
flex-flow:column;
width: 100%;
height: 100%;
background-color: #FFF;
`
export const PortalHeaderStyle = styled.div`
display: flex;
align-items:center;
height: 40px;
padding: 0px 10px;
color: #F2F2F2;
font-weight: 700;
font-size: 14px;
background-image: linear-gradient(to bottom, rgba(22,22,22,1) 0%,rgba(71,71,71,1) 100%);
`
export const PortalHeaderDividerStyle = styled.div`
width: 3px;
height: 80%;
background-image: url(${PortalNavHeaderBorder});
background-repeat: repeat-y;
background-position: center center;
`
export const PortalHeaderLableStyle = styled.div`
display: inline-block;
float: left;
padding: 3px 10px 0px 10px;
`
export const PortalFooterStyle = styled.div`
display: flex;
align-items:center;
height: 30px;
color: #F2F2F2;
font-size: 12px;
padding: 0px 10px;
background-image: linear-gradient(to bottom, rgba(22,22,22,1) 0%,rgba(71,71,71,1) 100%);
`
export const PortalContentStyle = styled.div`
display: flex;
flex:1;
`
export const PortalNavigationStyle = styled.div`
display: flex;
flex-flow: column;
width: 300px;
height: 100%;
background-color: #cccccc;
border-right: 1px solid #B3B3B3;
`
export const PortalPlayGroundStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
color: #3A3A3A;
background-color: #E6E6E6
`
export const PortalPlayGroundHeaderStyle = styled.div`
width: 100%;
padding: 10px 10px 0px 10px;
`
export const PortalPlaygroundFooterStyle = styled.div`
width: 100%;
border-top: 1px dotted #B3B3B3;
display: flex;
align-items: center;
background-color:#d9d9d9;
padding: 8px 50px 8px 20px;
`

export const PortalPlayGroundBreadCrumbStyle = styled.div`
width: 100%;
font-size: 12px;
font-weight: 600;
margin-bottom: 5px;
`
export const PortalPlayGroundPageTitleStyle = styled.div`
width: 100%;
padding-left:10px;
height: 50px;

`
export const PortalPlayGroundStatsContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
padding:5px;
`
export const PortalPlayGroundStatsBox = styled.div`
flex:1;
height: 115px;
display: flex;
flex-flow:column;
color: #F6F6F6;
border-width:2px;
border-style: solid;
border-radius: 5px;
cursor: pointer;
border-color: ${props => {
        if (props.color === "blue") return "#1a5d7f"
        if (props.color === "red") return "#7f1a1a"
        if (props.color === "brown") return "#7f4e1a"
        if (props.color === "grey") return "#404040"
        if (props.color === "purple") return "#7f1a7f"
        if (props.color === "green") return "#1a7f1f"
    }};
margin: 0px 10px;
`
export const PortalPlayGroundStatBoxTop = styled.div`
flex:1;
font-size: 36px;
display: flex;
align-items: center;
justify-content: center;
background-color: ${props => {
        if (props.color === "blue") return "#4A9EC9"
        if (props.color === "red") return "#CA4A4A"
        if (props.color === "brown") return "#C98B49"
        if (props.color === "grey") return "#8F8F8F"
        if (props.color === "purple") return "#C94ACA"
        if (props.color === "green") return "#4ACA51"
    }};
`
export const PortalPlayGroundStatBoxBot = styled.div`
height: 45px;
font-size: 14px;
text-align:center;
display: flex;
align-items: center;
justify-content: center;
flex-flow: column;
background-color: ${props => {
        if (props.color === "blue") return "#20739E"
        if (props.color === "red") return "#9E2020"
        if (props.color === "brown") return "#9E6120"
        if (props.color === "grey") return "#595959"
        if (props.color === "purple") return "#9D209E"
        if (props.color === "green") return "#209E26"
    }};
`
export const PortalSplitPlaygroundContainer = styled.div`
flex: 1;
display: flex;
width: 100%;


`
export const PortalSplitPlaygroundLeftContainer = styled.div`
flex:1;
display:flex;
flex-flow:column;
padding: 10px;
background: #F2F2F2;
border-right: 1px dotted #B6B6B6;

`
export const PortalSplitPlaygroundRightContainer = styled.div`
width: 480px;
padding: 10px;
`

export const PortalPlaygroundScrollContainerStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
width: 100%;
background-color: #FFF;
`

export const PortalPlayGroundScrollerStyle = styled.div`
height: 0px;
flex: 1 1 auto;
overflow-Y: scroll;
`

export const LocationWarningStyle = styled.div`
display: flex;
align-items:center;
width: 100%;
padding: 5px;
border: 1px solid #8ED9F6;
background-color: #E3F7FC;
border-radius: 4px;
font-size: 12px;
margin-bottom: 5px;

`
export const DriverFlagContainerStyle = styled.div`
display: flex;
align-items:center;
width: 100%;
padding: 5px;
border: 1px solid #FF6666;
background-color: #FFE6E6;
border-radius: 4px;
font-size: 14px;
font-weight: 600;
margin-bottom: 5px;
`



export const DriverFlagContainer = (props) => {
    return (
        <DriverFlagContainerStyle>
            <CircleButton
                style={{ marginRight: "5px", border: "none", backgroundColor: "none", backgroundImage: "linear-gradient(to bottom, rgba(233,73,73,1) 0%,rgba(159,20,20,1) 100%)" }}
                fontcolor="#FFF"
                size="24px"
            >
                <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFlag} />
            </CircleButton>
            {props.children}
        </DriverFlagContainerStyle>
    )



}