import styled from "styled-components";

export const ModalDropCard = styled.div`
position: absolute;
display: flex;
flex-direction: column;
top: ${props=>props.top || "0px"};
left: ${props=>props.left || "0px"};
width: ${props=>props.width || "auto"};
max-height: ${props=>props.toggled ? props.height : "0px"};
border: ${props=>props.toggled ? "2px solid #F2C779" : "none"};
border-radius: 5px;
background-color: #FFF8C4;
overflow-Y: scroll;
text-align: left;
padding: ${props=>props.toggled ? "4px" : "0px"};
box-shadow: 4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77);
opacity: ${props=>props.toggled ? "100%" : "0%"};
visibility: ${props=>props.toggled ? "visible" : "hidden"};
transition: max-height .2s ease-in-out;
scrollbar-color: #ba7f12 #F2C779;
` 
export const ModalDropContentRow = styled.div`
width: 100%;
display: flex;
align-items:center;
font-size: 12px;
`
export const ModalCardWrapperStyle = styled.div`
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(0,0,0,.7);
z-index: 20000;
`
export const ModalCardStyle = styled.div`
position: relative;
border: ${props=>props.toggled ? "2px solid #F2C779" : "none"};
border-radius: 5px;
background-color: #FFFFFF;
box-shadow: 4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77);
`


export const ModalCard = (props) => {
    const {children,...nprops} = props
    return(
        <ModalCardWrapperStyle>
            <ModalCardStyle {...nprops}>{children}</ModalCardStyle>
        </ModalCardWrapperStyle>
    )
}