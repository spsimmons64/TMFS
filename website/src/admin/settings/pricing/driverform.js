import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react"
import { FormCheck, FormInput } from "../../../components/portals/inputstyles"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FormButton } from "../../../components/portals/buttonstyle";

const GridWrapperStyle = styled.div`
display: flex;
flex-flow: column;
margin-left: 135px;
height: 400px;
border: 1px solid #BABABA;

`
const GridHeaderStyle = styled.div`
width: 100%;
padding: 10px;
text-align:right;
`
const GridColumnHeaderWrapperStyle = styled.div`
width: 100%;
background-color: #3A3A3A;
`
const GridColumnHeaderStyle = styled.div`
width: calc(100% - 14px);
display: flex;
align-items: center;
padding: 2px 5px;
color: #E0E0E0;
font-size: 14px;
font-weight: 600;
`
const GridScrollerWrapper = styled.div`
flex:1;
display: flex;
flex-flow: column;
`
const GridScrollerStyle = styled.div`
height: 0;
flex: 1 1 auto;
overflow-Y: scroll;
`
const GridRowStyle = styled.div`
width: 100%;
display: flex;
padding: ${props => props.ndx === 0 ? "15px 5px 5px 5px" : "0px 5px 5px 5px"};
`
const RowIconStyle = styled.div`
width: 3%;
font-size: 22px;
color: red;
`
const RowEntryStyle = styled.div`
width: 22%;
padding-right: 10px;
`
const RowCheckStyle = styled.div`
width: 9%;
padding-top: 5px;
`

export const PricingDriverForm = ({ feeList, callBack }) => {
    const [driverFees, setDriverFees] = useState([])    
    const [formInputState, setFormInputState] = useState({ safetyToggle: false, errorToggle: false, selected: -1 })
    const [error,setError] = useState({id:"",msg:""})
    const stripForInt = (value) => {
        return parseInt(value.toString().replace(/[^0-9]/g, ''))
    }
    const getFieldId = (e) => {
        const targetArray = e.target.id.split("-");
        const ndx = targetArray[1];
        return ({ field: targetArray[0], ndx: stripForInt(targetArray[1]) })
    }
    const handleAdd = () => {
        if (formInputState.safetyToggle || formInputState.errorToggle) return;
        let newDriverStart = 1;
        let newList = [...driverFees];
        if (newList.length) newDriverStart = stripForInt(newList[newList.length - 1].driverend) + 1;
        newList.push({ recordid: uuidv4(), driverstart: newDriverStart, driverend: "", cost: "", price: "", flatfee: 0 });
        setFormInputState(ps => ({ ...ps, errorToggle: false, safetyToggle: 1, selected: newList.length - 1 }));
        setDriverFees(newList);
        callBack(newList)
    }
    const handleUpdate = (e) => {
        const { field, ndx } = getFieldId(e)
        const newList = [...driverFees]
        const value = e.target.type == "checkbox" ? e.target.checked : e.target.value
        newList[ndx][field] = value;
        setDriverFees(newList)
        callBack(newList)
    }
    const handleDelete = (e, row = -1) => {
        let ndx = row === -1 ? stripForInt(e.target.getAttribute("data-row")) : row
        if (!formInputState.safetyToggle || (formInputState.safetyToggle && formInputState.selected === ndx)) {
            let newList = [...driverFees];
            let buildList = []
            newList.splice(ndx, 1)
            let startDriver = 1;
            newList.forEach((r) => {
                let endDriver = stripForInt(r.driverend)
                buildList.push({ recordid: uuidv4(), driverstart: startDriver, driverend: endDriver, price: r.price, cost: r.cost, flatfee: r.flatfee })
                startDriver = endDriver + 1
            })
            setDriverFees(buildList)
            callBack(buildList)
            setFormInputState(ps => ({ errorToggle: false, safetyToggle: false, selected: buildList.length - 1 }))
        }
    }
    const handleValidate = (e) => {
        const { field, ndx } = getFieldId(e)
        let driverStart = stripForInt(feeList[ndx].driverstart)
        let driverEnd = feeList[ndx].driverend == "" ? 0 : stripForInt(feeList[ndx].driverend)
        if (driverEnd < driverStart) {
            if (e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id.includes("price")) {
                setError({[e.target.id]: "Required"})
                e.target.focus()
            } else {
                handleDelete(null, ndx) 
                setFormInputState(ps => ({ ...ps, safetyToggle: false }))
                setError("")
            }

        } else {
            setFormInputState(ps => ({ ...ps, safetyToggle: false }))
            setError("")     
        }
    }    

    const handleEndOfRow = (e) => {        
        if(e.relatedTarget && e.relatedTarget.id==="pricing-deactivate") handleAdd()
    }

    const buildFeeRows = () => {
        return driverFees.map((r, ndx) => {
            return (
                <GridRowStyle key={r.recordid} ndx={ndx}>
                    <RowIconStyle data-row={ndx} onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt} style={{ pointerEvents: "none" }} /></RowIconStyle>
                    <RowEntryStyle>
                        <FormInput id={`driverstart-${ndx}`} mask="number" value={r.driverstart} hideerror="true" readOnly tabIndex={-1} />
                    </RowEntryStyle>
                    <RowEntryStyle>
                        <FormInput
                            id={`driverend-${ndx}`}
                            mask="number"
                            value={r.driverend}
                            error={error[`driverend-${ndx}`]}
                            onChange={handleUpdate}                            
                            onBlur={handleValidate}                                                        
                            readOnly={(ndx + 1) < driverFees.length}
                            hideerror="true"
                            placeholder="0"
                        />
                    </RowEntryStyle>
                    <RowEntryStyle>
                        <FormInput
                            id={`price-${ndx}`}
                            mask="currency"
                            value={r.price}
                            hideerror="true"
                            onChange={handleUpdate}
                            placeholder="$0.00"
                        />
                    </RowEntryStyle>
                    <RowEntryStyle>
                        <FormInput
                            id={`cost-${ndx}`}
                            mask="currency"
                            value={r.cost}
                            onChange={handleUpdate}
                            hideerror="true"                            
                            placeholder="$0.00"
                        />
                    </RowEntryStyle>
                    <RowCheckStyle>
                        <FormCheck
                            id={`flatfee-${ndx}`}
                            label="Flat Fee"
                            value={r.flatfee}
                            onChange={handleUpdate}
                            onBlur={handleEndOfRow}
                            hideerror="true"
                        />
                    </RowCheckStyle>
                </GridRowStyle>
            )
        })
    }

    useEffect(() => {
        let el = document.getElementById(`driverend-${formInputState.selected}`)
        el && el.focus()
        el && el.select()
    }, [formInputState.selected])

    useEffect(() => {
        document.getElementById("pricing-form-save").disabled = (formInputState.safetyToggle)
    }, [formInputState.safetyToggle])

    useEffect(() => setDriverFees(feeList), [feeList])

    return (
        <GridWrapperStyle>
            <GridHeaderStyle>
                <FormButton onClick={handleAdd}>New Driver Fee</FormButton>
            </GridHeaderStyle>
            <GridColumnHeaderWrapperStyle>
                <GridColumnHeaderStyle>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "22%" }}>Driver Start</div>
                    <div style={{ width: "22%" }}>Driver End</div>
                    <div style={{ width: "22%" }}>Price</div>
                    <div style={{ width: "22%" }}>Cost</div>
                    <div style={{ width: "9%" }}>Flat Rate</div>
                </GridColumnHeaderStyle>
            </GridColumnHeaderWrapperStyle>
            <GridScrollerWrapper>
                <GridScrollerStyle>{buildFeeRows()}</GridScrollerStyle>
            </GridScrollerWrapper>
        </GridWrapperStyle>
    )
}