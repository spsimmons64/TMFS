import { faBackward, faBackwardStep, faForward, faForwardStep } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import styled from "styled-components"

const GridPagerStyle = styled.div`
display:flex;
align-items: center;
width: 100%;
height: 100%;
`
const GridPagerRecordCountStyle = styled.div`
flex:1;
font-weight: 500;
padding-left: 10px;
font-size: 12px;
`
const GridPagerIconStyle = styled.div`
width: 38px;
text-align:center;
font-size: 22px;
color: #737373;
cursor: pointer;
& > svg{pointer-events:none;}
`

const GridPagerTextStyle = styled.div`
border: 1px solid grey;
font-size: 12px;
font-weight: 500;
color: #737373;
border-radius: 5px;
padding: 4px 8px;
background-color: #FFF;
`

export const GridPager = (props) => {
    const { page, count, limit, callback, ...nprops } = props
    const [pageCount, setPageCount] = useState(1)

    const dispatchPage = (newPage) => {        
        if (newPage < 1 || newPage > pageCount) return;
        callback(newPage);
    }

    useEffect(() => {
        let recCount = count || 1;
        setPageCount(Math.ceil(recCount / limit));
    }, [page, count, limit])

    return (
        <GridPagerStyle {...nprops}>
            <GridPagerRecordCountStyle>Total Records {count}</GridPagerRecordCountStyle>
            <GridPagerIconStyle onClick={()=>dispatchPage(1)}><FontAwesomeIcon icon={faBackwardStep} /></GridPagerIconStyle>
            <GridPagerIconStyle onClick={()=>dispatchPage(page-1)}><FontAwesomeIcon icon={faBackward} /></GridPagerIconStyle>
            <GridPagerTextStyle>Page {page} Of {pageCount}</GridPagerTextStyle>
            <GridPagerIconStyle onClick={()=>dispatchPage(page+1)}><FontAwesomeIcon icon={faForward} /></GridPagerIconStyle>
            <GridPagerIconStyle onClick={()=>dispatchPage(pageCount)}><FontAwesomeIcon icon={faForwardStep} /></GridPagerIconStyle>
        </GridPagerStyle>
    )
}