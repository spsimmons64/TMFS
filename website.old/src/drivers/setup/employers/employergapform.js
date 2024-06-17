import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormDate, FormInput, FormSelect, FormText } from "../../../components/portals/inputstyles"
import { countryTypes, statesArray, yesNoNaTypes, yesNoTypes } from "../../../global/staticdata"
import { FormButton } from "../../../components/portals/buttonstyle"
import { ModalCard, ModalCardStyle } from "../../../components/portals/cardstyle"
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components"
import { CardModal, CardScrollContent } from "../../../components/administration/card"

const FormScrollWrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-flow:column;

`
const FormScrollContainer = styled.div`
flex:1;
display:flex;
flex-flow:column;
width:100%;
background-color:green;
`

const FormScroller = styled.div`
height:0;
flex:1 1 auto;
overflow-y:auto;
`
export const EmployerGapForm = ({ record, callback }) => {
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => setFormFields(ps => ({ ...ps, [target.id]: target.value }))

    const handleValidate = () => {
        var errors = {}
        if (!formFields.emp_reasongap) errors["emp_reasongap"] = "The Gap Reason Is Required!"
        Object.keys(errors).length ? setFormErrors(errors) : callback(formFields)
    }

    useEffect(()=>{setFormFields(record)},[])

    return (
        <CardModal style={{ padding: "5px", width: "730px", border: "3px solid #3A3A3A" }}>
            <div style={{ borderBottom: "1px dotted #B6B6B6", fontSize: "24px", fontWeight: 700, padding: "5px 0px 10px 10px" }}>Explanation For Gap In Employment</div>
            <div style={{ padding: "10px" }}>                
                <FormTopLabel>Gap Reason</FormTopLabel>
                <FormText height="150px"
                    id="emp_reasongap"
                    value={formFields.emp_reasongap}
                    error={formErrors.emp_reasongap}
                    onChange={handleChange}
                    autoFocus
                    data-ignore
                />
            </div>
            <hr />
            <FormFlexRowStyle style={{ justifyContent: "flex-end", padding: "10px 0px" }}>
                <div><FormButton style={{ width: "72px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                <div><FormButton style={{ width: "72px" }} onClick={handleValidate}>Save</FormButton></div>
            </FormFlexRowStyle>
        </CardModal>
    )
}