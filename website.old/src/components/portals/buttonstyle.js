import styled from "styled-components";


export const FormButtonStyle = styled.button`
font-family: 'Open Sans', sans-serif;
outline: none;
width: ${props=>props.width || "auto"};
height: ${props=>props.height || "34px"};
border-width: 1px;
border-style: solid;
border-radius: 5px;
border-color: ${props => {
    if (props.color == "green") return "#117A00"
    if (props.color == "purple") return "#73006F"
    if (props.color == "red") return "#7E0000"
    if (props.color == "blue") return "#164398"
    if (props.color == "gold") return "#998200"
    return "#333333"
}};
background-image: ${props => {
    if (props.color == "green") return "linear-gradient(to bottom, rgba(36,175,22,1) 0%,rgba(20,145,0,1) 100%)"
    if (props.color == "purple") return "linear-gradient(to bottom, rgba(175,22,173,1) 0%,rgba(145,0,140,1) 99%)"
    if (props.color == "red") return "linear-gradient(to bottom, rgba(175,22,22,1) 0%,rgba(145,0,0,1) 100%)"        
    if (props.color == "blue") return "linear-gradient(#1d59c9,#164398)"
    if (props.color == "gold") return "linear-gradient(#CCAD00,#998200)"
    return "linear-gradient(to bottom, rgba(83,83,83,1) 1%,rgba(51,51,51,1) 100%);"
}};
&:hover:${props => {
    if (props.color == "green") return "linear-gradient(to bottom, rgba(20,145,0,1) 0%,rgba(36,175,22,1) 100%)"
    if (props.color == "purple") return "linear-gradient(to bottom, rgba(145,0,140,1) 0%, rgba(175,22,173,1) 99%)"
    if (props.color == "red") return "linear-gradient(to bottom, rgba(145,0,0,1) 0%),rgba(175,22,22,1) 1000%"        
    if (props.color == "blue") return "linear-gradient(#164398,#1d59c9)"
    if (props.color == "gold") return "linear-gradient(#998200,#CCAD00)"
    return "linear-gradient(to bottom, rgba(51,51,51,1) 1%,rgba(83,83,83,1) 100%)"    
}};
font-size: 14px;
color: #E2E2E2;
padding: 5px 12px 6px 12px;
cursor:${props=>props.disabled ? "auto" : "pointer"};
opacity: ${props=>props.disabled ? "50%" : "100%"};
`

const CircleButtonStyle = styled.div`
display: flex;
align-items:center;
justify-content:center;
color: ${props=>props.fontcolor || props.color};
width: ${props=>props.size || "36px"};
height: ${props=>props.size || "36px"};
border: 2px solid ${props=>props.color || "#3A3A3A"};
border-radius: 50%;
cursor: pointer;
background-color: ${props=>props.fill ? props.color : "transparent" };
`










export const FormButton = (props) => {    
    return <FormButtonStyle {...props}></FormButtonStyle>
}


export const CircleButton = (props) => {
    const {children,color,...nprops} = props
    const newColor = color || "#3A3A3A";
    return <CircleButtonStyle {...nprops} color={newColor}>{children}</CircleButtonStyle>
}