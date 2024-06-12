import React, { useContext, useEffect, useState } from "react"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import { countryTypes, statesArray, yesNoNaTypes, yesNoTypes } from "../../../global/staticdata"
import { FormFlexRowStyle } from "../../../components/portals/formstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { Employersform } from "./employersform"
import { MessageContext } from "../../../administration/contexts/messageContext"
import { EmployerGapForm } from "./employergapform"
import styled from "styled-components"
import { FormText } from "../../../components/portals/inputstyles"


const EmployerWrapperStyle = styled.div`
position:relative;
width: 100%;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin: 10px 0px;
`

const EmployerGridStyle = styled.div`
display: grid;
grid-template-columns: max-content 1fr max-content 1fr;
width: 100%;
border-bottom: 1px dotted #B6B6B6;
`

const EmployerSupGridStyle = styled.div`
width: 100%;
`

const EmployerLabelStyle = styled.div`
font-size: 14px;
font-weight: 600;
background-color:#e9effc;
padding: 2px 10px;
border-right: 1px dotted #B6B6B6;
height: 24px;
`

const EmployerFieldStyle = styled.div`
font-size: 14px;
padding: 2px 10px;
width: max-content;
height: 24px;
width:100%;
background-color:${props => props.error == "true" ? "#FFE6E6" : "#FFFFFF"}
`

export const EmployersGrid = ({ gapTrack }) => {
    const { getValue, setValue } = useMultiFormContext()
    const [employerList, setEmployerList] = useState([])
    const [formStatus, setFormStatus] = useState({ open: false, record: {} })
    const [gapReason, setGapReason] = useState([])

    const handleChange = ({ target }) => {
        let newList = [...gapReason]
        const splitId = target.id.split("-")
        newList[splitId[1]] = target.value
        setGapReason(newList)
    }

    const gapRequired = (ndx) => {
        const rec = gapTrack.find(r => r.ndx === ndx)
        return rec ? true : false;
    }

    const gapError = (ndx) => {
        const rec = gapTrack.find(r => r.ndx === ndx)
        return rec.error ? true : false;
    }

    const handleEditEmployer = ({ target }) => {
        const rec = employerList.find(r => r.emp_recordid == target.getAttribute('data-id'))
        setFormStatus({ open: "true", record: rec ? rec : {} })
    }

    const handleDeleteEmployer = ({ target }) => {
        let newList = [...employerList]
        const ndx = newList.findIndex(r => r.emp_recordid == target.getAttribute('data-id'))
        if (ndx > -1) newList.splice(ndx, 1)
        setEmployerList(newList)
    }

    const employerFormCallback = (resp) => {
        let newList = [...employerList]
        if (resp !== false) {
            const ndx = employerList.findIndex(r => r.emp_recordid === resp.emp_recordid)
            if (formStatus.open) {
                ndx > -1 ? newList[ndx] = resp : newList.push(resp)
                newList = [...newList.sort((a, b) => {
                    const startDate = new Date(`${a.emp_datefrom}T00:00:00+00:00`).getTime()
                    const endDate = new Date(`${b.emp_datefrom}T00:00:00+00:00`).getTime()
                    return (startDate - endDate)
                })]
            } else {
                if (ndx > -1) newList[ndx].emp_reasongap = resp.emp_reasongap
            }
            setEmployerList(newList)
            setValue("drv_employers", newList)
        }
        setFormStatus({ open: false, record: {} })
    }

    const loadGapReasons = () =>{
        let epmList = getValue("drv_employers")
        let newList = []
        epmList.forEach((r)=>{newList.push(r.emp_reasongap)})
        setGapReason(newList)
    }

    useEffect(() => {        
        loadGapReasons()
        setEmployerList(getValue("drv_employers"))
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Employment History</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>List All Employers in the last 10 years.</b></div>
        {employerList.map((r, rndx) => {
            const con_rec = countryTypes.find(q => q.value === r.emp_country)
            const sta_rec = statesArray.find(q => q.value === r.emp_state)
            const yn_rec = yesNoTypes.find(q => q.value === r.emp_dotregulated)
            const yna_rec = yesNoNaTypes.find(q => q.value === r.emp_dotfmcsregs)
            return (<React.Fragment key={r.emp_recordid}>
                <EmployerWrapperStyle >
                    <EmployerGridStyle>
                        <EmployerLabelStyle>Employer Name</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_employername}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Country</EmployerLabelStyle>
                        <EmployerFieldStyle>{con_rec.text}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Address</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_address}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Telephone</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_telephone}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer City</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_city}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Fax</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_fax}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer State</EmployerLabelStyle>
                        <EmployerFieldStyle>{sta_rec.text}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Email</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_emailaddress}</EmployerFieldStyle>
                        <EmployerLabelStyle>Employer Zip Code</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_zipcode}</EmployerFieldStyle>
                        <EmployerLabelStyle>Starting Date</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_datefrom}</EmployerFieldStyle>
                        <EmployerLabelStyle>Position Held</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_position}</EmployerFieldStyle>
                        <EmployerLabelStyle>Ending Date</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_dateto}</EmployerFieldStyle>
                    </EmployerGridStyle>
                    <EmployerSupGridStyle>
                        <EmployerLabelStyle>Reason For Leaving</EmployerLabelStyle>
                        <EmployerFieldStyle>{r.emp_reasonleaving}</EmployerFieldStyle>
                        <EmployerLabelStyle>Subject to the DOT/FMCSA regulations while employed by this carrier?</EmployerLabelStyle>
                        <EmployerFieldStyle>{yn_rec.text}</EmployerFieldStyle>
                        <EmployerLabelStyle>Governed By DOT 49 CFR Part 40 Drug And Alcohol Testing?</EmployerLabelStyle>
                        <EmployerFieldStyle>{yna_rec.text}</EmployerFieldStyle>
                        {gapRequired(rndx) && <>
                            <EmployerLabelStyle>
                                Please Enter Reason For Employment Gap (<u>30 Or More Days Of No Employment Between Employers</u>) Below:</EmployerLabelStyle>
                            <EmployerFieldStyle style={{ padding: 0, height: "100px" }}>
                                <FormText
                                    id={`gapreason-${rndx}`}
                                    value={gapReason[rndx]}                                    
                                    onChange={handleChange}                                    
                                    style={{
                                        height: "100px",
                                        border: "none",
                                        borderRadius: "0px",                                        
                                        backgroundColor: gapError(rndx) ? "#FFE6E6": "#E9E9E9"
                                    }}
                                    hideerror                                    
                                />
                            </EmployerFieldStyle>
                        </>}
                    </EmployerSupGridStyle>
                </EmployerWrapperStyle>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div><FormButton style={{ width: "80px" }} data-id={r.emp_recordid} onClick={handleEditEmployer}>Change</FormButton></div>
                    <div><FormButton style={{ width: "80px" }} data-id={r.emp_recordid} onClick={handleDeleteEmployer}>Delete</FormButton></div>
                </FormFlexRowStyle>
            </React.Fragment>)
        })}
        <div style={{ flex: 1, marginBottom: "10px", marginTop: employerList.length ? "-32px" : "0px" }}>
            <FormButton id="new-license-button" data-ignore onClick={handleEditEmployer} style={{ width: "150px" }} >Add A Employer</FormButton>
        </div>
        {formStatus.open && <Employersform record={formStatus.record} employerlist={employerList} callback={employerFormCallback} />}
    </>)
}