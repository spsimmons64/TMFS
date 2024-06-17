import styled from "styled-components";

const DriversFormContainerStyle = styled.div`
display: flex;
flex-flow: column;
width: 100%;
height: 314px;
border: 1px solid #808080;
margin-bottom: 18px;

`
const DriversFormContainerHeader = styled.div`
width: 100%;
border-bottom: 1px solid var(--input-border);
background-color: var(--form-grid-header-background);
font-size:14px;
font-weight: 500;
`
const DriversFormContainerHeaderInner = styled.div`
display: flex;
align-items: center;
width: calc(100% - 12px);
padding: 4px 8px;
font-size:14px;
font-weight: 500;
`
const DriversFormScrollStyle = styled.div`
height:0;
flex: 1 1 auto;
overflow-Y: scroll;
& > div:first-child{
    padding-top:6px;
}
`
const DriversFormScrollRow = styled.div`
display: flex;
align-items: center;
padding: 3px 8px;
`
const GridDriverStartStyle = styled.div`
flex:1;
margin-right: 2px;
text-align: center;
`
const GridDriverEndStyle = styled.div`
flex:1;
margin: 0px 2px;
text-align: center;
`
const GridPriceStyle = styled.div`
width: 100px;
margin: 0px 2px;
`
const GridCostStyle = styled.div`
width: 100px;
margin: 0px 2px;
`
const GridFlatStyle = styled.div`
width: 40px;
text-align:center;
`
const GridDeleteStyle = styled.div`
width: 20px;
cursor:pointer;
`

export const DriversForm = () => {

    return (<>
    </>)
}