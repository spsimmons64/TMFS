import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { CardRow } from "../../../components/administration/card"
import { FormInput } from "../../../components/administration/inputs/forminput"
import { Form } from "react-router-dom"
import { statesArray } from "../../../global/staticdata"
import { GridInput } from "../../../components/administration/inputs/gridinput"
import { PricingContext } from "./pricingcontext"


const StatesFormContainerStyle = styled.div`
display: flex;
flex-flow: column;
width: 100%;
height: 314px;
border: 1px solid #808080;
margin-bottom: 18px;
`
const StatedFormContainerHeader = styled.div`
width: 100%;
border-bottom: 1px solid var(--input-border);
background-color: var(--form-grid-header-background);
padding: 3px 10px;
font-size:14px;
font-weight: 500;
`
const StatesFormScrollStyle = styled.div`
height:0;
flex: 1 1 auto;
overflow-Y: scroll;
& > div:first-child{padding-top:6px;}
`
const StatesFormScrollRow = styled.div`
display: flex;
align-items: center;
padding: 3px 8px;
`
const GridStateStyle = styled.div`
flex:1;
margin-right: 2px;
`
const GridPriceStyle = styled.div`
width: 100px;
margin: 0px 2px;
`
const GridCostStyle = styled.div`
width: 100px;
margin-left: 2px;
`

export const StatesForm = () => {
    const [feesList, setFeesList] = useContext(PricingContext);

    const updateFeesList = (e) => {
        let newList = [...feesList]
        const field = e.target.id.split("-")
        const ndx = newList.findIndex(r => r.state == field[1])
        if (ndx > -1) 
            newList[ndx][field[0]] = e.target.value
        else 
            newList.push({ state: field[1], driverstart: 0, driverend: 0, cost: 0, [field[0]]: e.target.value })        
        setFeesList(newList)
    }

    const buildRows = () => {
        return statesArray.map((r, rndx) => {
            const stateRec = feesList.find(f => f.state === r.value)
            return (
                <StatesFormScrollRow key={rndx}>
                    <GridStateStyle>
                        <GridInput
                            data-ignore={true}
                            id={`state-${r.value}`}
                            value={r.text}
                            mask="text"
                            tabIndex={-1}
                            readOnly />
                    </GridStateStyle>
                    <GridPriceStyle>
                        <GridInput
                            data-ignore={true}
                            style={{ textAlign: "right" }}
                            id={`price-${r.value}`}
                            mask="currency"
                            onChange={updateFeesList}
                            value={stateRec ? stateRec.price : "$0.00"} />
                    </GridPriceStyle>
                    <GridCostStyle>
                        <GridInput
                            data-ignore={true}
                            style={{ textAlign: "right" }}
                            id={`cost-${r.value}`}
                            mask="currency"
                            onChange={updateFeesList}
                            value={stateRec ? stateRec.cost : "$0.00"} />
                    </GridCostStyle>
                </StatesFormScrollRow>
            )
        })
    }

    console.log(feesList)
    return (
        <StatesFormContainerStyle>
            <StatedFormContainerHeader>
                <StatesFormScrollRow>
                    <GridStateStyle>State</GridStateStyle>
                    <GridPriceStyle style={{ textAlign: "center" }}>Price</GridPriceStyle>
                    <GridCostStyle style={{ textAlign: "center" }}>Cost</GridCostStyle>
                </StatesFormScrollRow>
            </StatedFormContainerHeader>
            <StatesFormScrollStyle>{buildRows()}</StatesFormScrollStyle>
        </StatesFormContainerStyle>
    )
}