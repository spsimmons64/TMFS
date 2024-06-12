import React, { useEffect, useState } from "react"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import { FormFlexRowStyle } from "../../../components/portals/formstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { ViolationsForm } from "./violationsform"
import styled from "styled-components"

const ViolationGridStyle = styled.div`
display: grid;
grid-template-columns: max-content 1fr;
box-sizing: border-box;
width: 100%;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin: 10px 0px;
`
const ViolationLabelStyle = styled.div`
font-size: 14px;
font-weight: 600;
background-color:#e9effc;
padding: 2px 10px;
border-right: 1px dotted #B6B6B6;
`

const ViolationFieldStyle = styled.div`
font-size: 14px;
padding: 2px 10px;
width: max-content;
`

export const ViolationsGrid = () => {
    const [violationList, setViolationList] = useState([])
    const [formStatus, setFormStatus] = useState({ open: false, record: {} })
    const { getValue,setValue } = useMultiFormContext()

    const handleEditViolation = ({ target }) => {
        const rec = violationList.find(r => r.vio_recordid == target.getAttribute('data-id'))
        setFormStatus({ open: "true", record: rec ? rec : {} })
    }

    const handleDeleteViolation = ({ target }) => {
        let newList = [...violationList]
        const ndx = newList.findIndex(r => r.vio_recordid == target.getAttribute('data-id'))
        if (ndx > -1) newList.splice(ndx, 1)
        setViolationList(newList)
    }

    const violationsFormCallback = (resp) => {
        let newList = [...violationList]
        setFormStatus({ open: false, record: {} })
        if (resp !== false) {
            const ndx = violationList.findIndex(r => r.vio_recordid === resp.vio_recordid)
            ndx === -1 ? newList.push(resp) : newList[ndx] = resp
            setViolationList(newList)
        }
    }

    useEffect(()=>{setValue("drv_violations",violationList)},[violationList])

    useEffect(() => { setViolationList(getValue("drv_violations")) }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px", flex: 1 }}>Moving Traffic Violations</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>List all moving traffic violations in the last 3 years.</b></div>
        {violationList.map(r => {
            return (
                <React.Fragment key={r.vio_recordid}>
                    <ViolationGridStyle>
                        <ViolationLabelStyle>Violation Date</ViolationLabelStyle>
                        <ViolationFieldStyle>{r.vio_violationdate}</ViolationFieldStyle>
                        <ViolationLabelStyle>Location</ViolationLabelStyle>
                        <ViolationFieldStyle>{r.vio_location}</ViolationFieldStyle>
                        <ViolationLabelStyle>Vehicle Type</ViolationLabelStyle>
                        <ViolationFieldStyle>{r.vio_vehicletype}</ViolationFieldStyle>
                        <ViolationLabelStyle>Offense Type</ViolationLabelStyle>
                        <ViolationFieldStyle>{r.vio_offense}</ViolationFieldStyle>
                    </ViolationGridStyle>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                        <div><FormButton style={{ width: "80px" }} data-id={r.vio_recordid} onClick={handleEditViolation}>Change</FormButton></div>
                        <div><FormButton style={{ width: "80px" }} data-id={r.vio_recordid} onClick={handleDeleteViolation}>Delete</FormButton></div>
                    </FormFlexRowStyle>
                </React.Fragment>
            )
        })}
        <div style={{ flex: 1, marginBottom: "10px", marginTop: violationList.length ? "-32px" : "0px" }}>
            <FormButton id="new-violation-button" data-ignore onClick={handleEditViolation} style={{width: "150px" }} >Add A Violation</FormButton>
        </div>        
        {formStatus.open && <ViolationsForm record={formStatus.record} callback={violationsFormCallback} />}
    </>)
}