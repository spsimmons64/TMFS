import React, { useEffect, useState } from "react"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import { FormFlexRowStyle } from "../../../components/portals/formstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { AccidentsForm } from "./accidentsform"
import styled from "styled-components"
import { yesNoTypes } from "../../../global/staticdata"

const AccidentGridStyle = styled.div`
display: grid;
grid-template-columns: max-content 1fr;
box-sizing: border-box;
width: 100%;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin: 10px 0px;
`
const AccidentLabelStyle = styled.div`
font-size: 14px;
font-weight: 600;
background-color:#e9effc;
padding: 2px 10px;
border-right: 1px dotted #B6B6B6;
`

const AccidentFieldStyle = styled.div`
font-size: 14px;
padding: 2px 10px;
width: max-content;
`

export const AccidentsGrid = () => {
    const [accidentList, setAccidentList] = useState([])
    const [formStatus, setFormStatus] = useState({ open: false, record: {} })
    const { getValue, setValue } = useMultiFormContext()

    const handleEditAccident = ({ target }) => {
        const rec = accidentList.find(r => r.cra_recordid == target.getAttribute('data-id'))
        setFormStatus({ open: "true", record: rec ? rec : {} })
    }

    const handleDeleteAccident = ({ target }) => {
        let newList = [...accidentList]
        const ndx = newList.findIndex(r => r.cra_recordid == target.getAttribute('data-id'))
        if (ndx > -1) newList.splice(ndx, 1)
        setAccidentList(newList)
    }

    const accidentsFormCallback = (resp) => {
        let newList = [...accidentList]
        setFormStatus({ open: false, record: {} })
        if (resp !== false) {
            const ndx = accidentList.findIndex(r => r.cra_recordid === resp.cra_recordid)
            ndx === -1 ? newList.push(resp) : newList[ndx] = resp
            setAccidentList(newList)
        }
    }

    useEffect(()=>{setValue("drv_crashes",accidentList)},[accidentList])

    useEffect(() => { setAccidentList(getValue("drv_crashes")) }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px", flex: 1 }}>Accidents And Crashes</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>List all accidents or crashes you have been involved in the last 3 years.</b></div>
        {accidentList.map(r => {
            const yn_rec = yesNoTypes.find(q=>q.value===r.cra_hazmat)
            return (
                <React.Fragment key={r.cra_recordid}>
                    <AccidentGridStyle>
                        <AccidentLabelStyle>Accident Date</AccidentLabelStyle>
                        <AccidentFieldStyle>{r.cra_accidentdate}</AccidentFieldStyle>
                        <AccidentLabelStyle>Location</AccidentLabelStyle>
                        <AccidentFieldStyle>{r.cra_location}</AccidentFieldStyle>
                        <AccidentLabelStyle># of Injuries</AccidentLabelStyle>
                        <AccidentFieldStyle>{r.cra_injuries}</AccidentFieldStyle>
                        <AccidentLabelStyle># of Fatalities</AccidentLabelStyle>
                        <AccidentFieldStyle>{r.cra_fatalities}</AccidentFieldStyle>
                        <AccidentLabelStyle>Hazmat Spill</AccidentLabelStyle>
                        <AccidentFieldStyle>{yn_rec.text}</AccidentFieldStyle>
                    </AccidentGridStyle>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                        <div><FormButton style={{ width: "80px" }} data-id={r.cra_recordid} onClick={handleEditAccident}>Change</FormButton></div>
                        <div><FormButton style={{ width: "80px" }} data-id={r.cra_recordid} onClick={handleDeleteAccident}>Delete</FormButton></div>
                    </FormFlexRowStyle>
                </React.Fragment>
            )
        })}
        <div style={{ flex: 1, marginBottom: "10px", marginTop: accidentList.length ? "-32px" : "0px" }}>
            <FormButton id="new-accident-button" data-ignore onClick={handleEditAccident} style={{width: "150px" }} >Add A Accident</FormButton>
        </div>
        {formStatus.open && <AccidentsForm record={formStatus.record} callback={accidentsFormCallback} />}
    </>)
}