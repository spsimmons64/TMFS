import styled from "styled-components";

export const PanelContainerStyle = styled.div`
width:100%;
height: 100%;
display: flex;
flex-flow: column;
padding: 10px 20px 20px 10px;
`

export const PanelHeaderStyle = styled.div`
width:100%;
`
export const PanelScrollContainerStyle = styled.div`
flex: 1;
display: flex;
flex-flow: column;
`

export const PanelScroller = styled.div`
height:0;
flex: 1 1 auto;
overflow-Y: auto
`

export const PortalStyle = styled.div`
font-family: "Open Sans",sans-serif;
font-size: 16px;
font-weight: 400;
color: #3A3A3A;
position: absolute;
width: 100%;
height: 100%;
display: flex;
flex-flow:column;
`
export const PortalTopNavStyle = styled.div`
display: flex;
align-items: center;
width: 100%;
min-height: 36px;
color: #E2E2E2;
font-size: 13px;
font-weight: 600;
background-image: linear-gradient(#171717,#474747);
padding:0px 10px;
`
export const PortalContainerStyle = styled.div`
flex:1;
display: flex;
width: 100%;
`

export const PortalContainerLeftStyle = styled.div`
display: flex;
flex-flow: column;
height: 100%;
width: 250px;
background-color:#DADADA;
border-right: 1px solid #B9B9B9; 
`
export const PortalContainerLeftTopStyle = styled.div`
display:flex;
align-items:center;
justify-content:center;
width: 200px;
height: 104px;
background-color:#FFF;
border: 1px solid #808080;
margin: 20px auto;
`
export const PortalContainerNavStyle = styled.div`
margin-bottom: 30px;
`

export const PortalPlaygroundScroller = styled.div`
height: 0;
flex: 1 1 auto;
overflow-y:auto;
`