import React from "react";
import styled from "styled-components";

import Preloader from "../../assets/images/preloader_128.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

export const GridWrapper = styled.div`
display: flex;
flex-flow: column;
width: 100%;
flex:1;
border: 1px solid #B6B6B6;
`
export const GridColumnHeaderContainer = styled.div`
width: 100%;
background-color: #F3F3F3;
border-bottom: 1px dotted #3A3A3A;
`
export const GridColumnHeaderStyle = styled.div`
display: flex;
align-items: center;
width: calc(100% - 14px);
`
export const GridColumnHeaderCellStyle = styled.div`
width: ${props => props.width || "auto"};
cursor:${props => props.sortable ? "pointer" : "auto"};
user-select: none;
padding: 5px 7px;
color: #404040;
font-weight: 600;
font-size: 14px;
`
export const GridColumnHeaderInnerStyle = styled.div`
width: 100%;
`
export const GridColumnHeaderInnerContainerStyle = styled.div`
display: flex;
width:100%;
align-items:center;
justify-content:${props => {
        if (props.align == "center") return "center";
        if (props.align == "right") return "flex-end";
        return "flex-start";
    }};
`
export const GridColumnHeaderSortStyle = styled.div`
display:flex;
align-items:center;
justify-content: center;
width:12px;
margin-left: 5px;
`
export const GridScrollContainer = styled.div`
flex:1;
display: flex;
flex-flow:column;
background-color: #FFF;
`
export const GridScroller = styled.div`
height:0;
flex: 1 1 auto;
overflow-y: scroll;
`
export const GridRowStyle = styled.div`
width: 100%;
display:flex;
align-items: center;
border-bottom: 1px dotted #808080;
&:hover{
     background-color: #DFEEDD;
}

`
export const GridCellStyle = styled.div`
width: ${props => props.width || "auto"};
padding: 5px 10px;
color: #404040;
font-size: 14px;
`
export const GridActionColumn = styled.div`
display: flex;
align-items: center;
justify-content: space-evenly;
width: 100%;
`
export const GridAction = styled.div`
display: flex;
height: 100%
align-items: center;
justify-content: center;
font-size: 18px;
cursor: ${props => props.disabled ? "auto" : "pointer"};
opacity: ${props => props.disabled ? "50%" : "100%"};
`

export const GridActionButton = styled.button`
width: 80px;
height: 25px;
font-size: 11px;
color: #E0E0E0;
outline: none;
border-width: 1px;
border-style: solid;
border-radius: 5px;
cursor: pointer;
&:disabled{
    opacity: 50%;
}
border-color: ${props => {
        if (props.color == "green") return "#117A00";
        if (props.color == "purple") return "#73006F";
        if (props.color == "red") return "#7E0000";
        if (props.color == "blue") return "#164398";
    }};
background-image: ${props => {
        if (props.color == "green") return "linear-gradient(to bottom, rgba(36,175,22,1) 0%,rgba(20,145,0,1) 100%)"
        if (props.color == "purple") return "linear-gradient(to bottom, rgba(175,22,173,1) 0%,rgba(145,0,140,1) 99%)"
        if (props.color == "red") return "linear-gradient(to bottom, rgba(175,22,22,1) 0%,rgba(145,0,0,1) 100%)"
        if (props.color == "blue") return "linear-gradient(#1d59c9,#164398)"
    }};
&:hover:${props => {
        if (props.color == "green") return "linear-gradient(to bottom, rgba(20,145,0,1) 0%,rgba(36,175,22,1) 100%)"
        if (props.color == "purple") return "linear-gradient(to bottom, rgba(145,0,140,1) 0%, rgba(175,22,173,1) 99%)"
        if (props.color == "red") return "linear-gradient(to bottom, rgba(145,0,0,1) 0%),rgba(175,22,22,1) 1000%"
        if (props.color == "blue") return "linear-gradient(#164398,#1d59c9)"
    }};
`
export const GridFooterContainer = styled.div`
background-color: #F3F3F3;
padding: 8px;
width: 100%;
font-size: 14px;
font-weight: 500;
height: 40px;
border-top: 1px solid #808080;
`

const GridLoaderStyle = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-flow: column;
align-items:center;
justify-content: center;
color: var(--grid-loader-text);
font-size: 20px;
font-weight: 500;
background-color: #FFF;
`

export const GridToolBox = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: flex-end;
padding: 8px;
`

const buildColumnHeaders = (columns, sortHandler, sortcol, sortdir) => {
    const handleSort = (id, sortable) => {
        sortable && sortHandler(id);
    }
    return columns.map((r, ndx) => {

        return (
            <GridColumnHeaderCellStyle style={r.hdrStyle} key={ndx} width={r.width} sortable={r.sortable} onClick={() => handleSort(r.id, r.sortable)}>
                <GridColumnHeaderInnerStyle >
                    <GridColumnHeaderInnerContainerStyle align={r.hdrAlign}>
                        <div style={{ width: "100%}" }}>{r.header}</div>
                        {r.sortable==1 &&
                            <div style={{ paddingLeft: "10px" }}>{r.id === sortcol && <FontAwesomeIcon icon={sortdir === "asc" ? faCaretUp : faCaretDown} />}</div>
                        }
                    </GridColumnHeaderInnerContainerStyle>
                </GridColumnHeaderInnerStyle>
            </GridColumnHeaderCellStyle>
        )
    });
}

const buildGridRows = (columns, data) => {
    return data.map((r, rndx) => {
        return (
            <GridRowStyle key={rndx} >
                {columns.map((c, cndx) => {
                    const newStyle = Object.assign({}, c.cellStyle, { opacity: r.deleted ? "50%" : "100%" })                    
                    return (
                        <GridCellStyle style={newStyle} width={c.width} key={`${r.recordid}-${cndx}`}>{c.render(rndx)}</GridCellStyle>
                    )
                })}
            </GridRowStyle>
        )
    })
}

export const GridColumnHeader = ({ columns, sortHandler, sortcol, sortdir }) => {
    return (
        <GridColumnHeaderContainer>
            <GridColumnHeaderStyle>
                {buildColumnHeaders(columns, sortHandler, sortcol, sortdir)}
            </GridColumnHeaderStyle>
        </GridColumnHeaderContainer>
    )
}

export const GridData = ({ columns, data }) => {
    return (
        <GridScrollContainer>
            <GridScroller>{buildGridRows(columns, data)}</GridScroller>
        </GridScrollContainer>
    )
}

export const GridLoader = (props) => {
    const { message, ...nprops } = props;
    return (
        <GridLoaderStyle {...nprops}>
            <div><img src={Preloader} alt="Processing" style={{ height: "80px", width: "80px" }} /></div>
            <div>{message || "Retrieving Data..."}</div>
        </GridLoaderStyle>
    )
}
