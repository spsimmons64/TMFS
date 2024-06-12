import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Preloader from "../../../assets/images/preloader_128.gif";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

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
`

const GridContainerStyle = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-flow: column;
`
const GridScrollContainerStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
`
const GridScrollStyle = styled.div`
height:0;
flex: 1 1 auto;
overflow-Y: scroll;
`
const GridColumnHeaderContainerStyle = styled.div`
height: 26px;
width: 100%;
background-color: var(--grid-column-header-background);
`

const GridColumnHeaderContainerInnerStyle = styled.div`
width: calc(100% - 14px);
height: 100%;
display:flex;
align-items: center;
padding: 0px 8px;
`
const GridColumnHeaderCellStyle = styled.div`
width: ${(props) => props.width || "auto"};
font-size: 14px;
font-weight: 500;
color: var(--grid-column-header-text);
cursor:${props => props.sortable ? "pointer" : "auto"};
pointer-events:${props => props.sortable ? "auto" : "none"};
user-select: none;
`
const GridColumnContainerStyle = styled.div`
display:flex;
align-items: center;
width: 100%;
border-bottom: 1px dotted #d9d9d9;
padding:  6px;
&:hover{
    background-color: var(--grid-row-hover);
}
`
const GridColumnCellStyle = styled.div`
width: ${(props) => props.width || "auto"};
font-size: 14px;
font-weight: 400;
color: var(--grid-column-text);
`

const GridColumnActionCellStyle = styled.div`
width:100%;
display: flex;
align-items: center;
justify-content: space-evenly;
`
const GridColumnActionStyle = styled.div`
display: flex;
height: 100%
align-items: center;
justify-content: center;
font-size: 18px;
cursor: ${props=>props.disabled ? "auto" : "pointer"};
opacity: ${props=>props.disabled ? "50%" : "100%"};
`

export const buildGridRows = (columns, data, rowstyle = {}) => {
    return data.map((r, rndx) => {
        return (
            <GridColumnContainerStyle key={rndx}>
                {columns.map((c, cndx) => {
                    return (
                        <GridColumnCellStyle width={c.width} key={`r${rndx}c${cndx}`} style={c.cellStyle}>
                            {c.render(rndx)}
                        </GridColumnCellStyle>
                    )
                })}
            </GridColumnContainerStyle>
        )
    })
}

export const buildGridColumnHeaders = (columns, callback, sortcol = "", sortdir = "asc") => {
    return columns.map((c, cndx) => {
        return (
            <GridColumnHeaderCellStyle width={c.width} onClick={() => callback(c.id)} key={cndx} sortable={c.sortable} style={c.hdrStyle}>
                {c.header}&nbsp;&nbsp;
                {c.id === sortcol && <FontAwesomeIcon icon={sortdir === "asc" ? faCaretUp : faCaretDown} />}
            </GridColumnHeaderCellStyle>
        )
    })
}

export const GridContainer = (props) => {
    const { id, children, ...nprops } = props
    return (<GridContainerStyle id={id || ""} {...nprops}>{children}</GridContainerStyle>)
}

export const GridLoader = (props) => {
    const { message, ...nprops } = props;
    return (
        <GridLoaderStyle>
            <div><img src={Preloader} alt="Processing" style={{ height: "80px", width: "80px" }} /></div>
            <div>{message || "Retrieving Data..."}</div>
        </GridLoaderStyle>
    )
}

export const GridScrollContainer = (props) => {
    const { children, ...nprops } = props;
    return (
        <GridScrollContainerStyle>
            <GridScrollStyle>{children}</GridScrollStyle>
        </GridScrollContainerStyle>
    )
}
export const GridColumnHeader = (props) => {
    const { children, ...nprops } = props;
    return (
        <GridColumnHeaderContainerStyle>
            <GridColumnHeaderContainerInnerStyle>
                {children}
            </GridColumnHeaderContainerInnerStyle>
        </GridColumnHeaderContainerStyle>
    )
}
export const GridActionCell = (props) => {
    const { children, ...nprops } = props;
    return (<GridColumnActionCellStyle {...nprops}>{children}</GridColumnActionCellStyle>)
}
export const GridAction = (props) => {
    const { children,disabled, ...nprops } = props;
    return (<GridColumnActionStyle disabled={disabled} {...nprops}>{children}</GridColumnActionStyle>)
}
