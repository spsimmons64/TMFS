import React, { useEffect, useState } from "react"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import styled from "styled-components"
import { countryTypes, dlClassTypes, statesArray } from "../../../global/staticdata"
import { FormFlexRowStyle } from "../../../components/portals/formstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { LicenseForm } from "./licenseform"


const LicenseGridStyle = styled.div`
display: grid;
grid-template-columns: max-content 1fr max-content 100px;
box-sizing: border-box;
width: 100%;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin: 10px 0px;
`
const LicenseLabelStyle = styled.div`
font-size: 14px;
font-weight: 600;
background-color:#e9effc;
padding: 2px 10px;
border-right: 1px dotted #B6B6B6;
`

const LicenseFieldStyle = styled.div`
font-size: 14px;
padding: 2px 10px;
width: max-content;
`

export const LicenseGrid = () => {
    const [licenseList, setLicenseList] = useState([])
    const [formStatus, setFormStatus] = useState({ open: false, record: {} })
    const { getValue, setValue, getError } = useMultiFormContext()

    const handleEditLicense = ({ target }) => {        
        const rec = licenseList.find(r => r.lic_recordid == target.getAttribute('data-id'))
        setFormStatus({ open: "true", record: rec ? rec : {} })
    }

    const handleDeleteLicense = ({ target }) => {
        let newList = [...licenseList]
        const ndx = newList.findIndex(r => r.lic_recordid == target.getAttribute('data-id'))
        if (ndx > -1) newList.splice(ndx, 1)
        setLicenseList(newList)
    }

    const licenseFormCallback = (resp) => {
        let newList = [...licenseList]
        setFormStatus({ open: false, record: {} })
        if (resp !== false) {
            const ndx = licenseList.findIndex(r => r.lic_recordid === resp.lic_recordid)
            ndx === -1 ? newList.push(resp) : newList[ndx] = resp
            setLicenseList(newList)
        }
    }

    useEffect(()=>{setValue("drv_licenses",licenseList)},[licenseList])

    useEffect(() => {setLicenseList(getValue("drv_licenses"))}, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Driver License Information</div>
        <div style={{ padding: "5px 0px" , color:"#0A21C0"}}><b>List all driver licenses held within the last 3 years. </b></div>
        {licenseList.map(r => {
            const con_rec = countryTypes.find(q => q.value === r.lic_country)
            const sta_rec = statesArray.find(q => q.value === r.lic_state)
            const cls_rec = dlClassTypes.find(q => q.value === r.lic_class)            
            return (
                <React.Fragment key={r.lic_recordid}>
                    <LicenseGridStyle>
                        <LicenseLabelStyle>First Name</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_firstname}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ backgroundColor: "#628dea", textAlign: "center", color: "#FFF", borderLeft: "1px dotted #B6B6B6" }}>ENDORSEMENTS</LicenseLabelStyle>
                        <LicenseFieldStyle></LicenseFieldStyle>
                        <LicenseLabelStyle>Last Name</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_lastname}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }} />
                        <LicenseFieldStyle />
                        <LicenseLabelStyle>License Number</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_licensenumber}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>H - Placarded Hazmat</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[0] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                        <LicenseLabelStyle>License Class</LicenseLabelStyle>
                        <LicenseFieldStyle>{cls_rec.text}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>N - Tank Vehicles</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[1] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                        <LicenseLabelStyle>Issue Date</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_issued}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>P - Passengers</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[2] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                        <LicenseLabelStyle>Expire Date</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_expires}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>T - Double/Triple Trailers</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[3] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                        <LicenseLabelStyle>License State</LicenseLabelStyle>
                        <LicenseFieldStyle>{sta_rec.text}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>S - School Bus</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[4] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                        <LicenseLabelStyle>License Country</LicenseLabelStyle>
                        <LicenseFieldStyle>{con_rec.text}</LicenseFieldStyle>
                        <LicenseLabelStyle style={{ borderLeft: "1px dotted #B6B6B6" }}>X - Placarded Hazmat & Tank Vehicles</LicenseLabelStyle>
                        <LicenseFieldStyle>{r.lic_endorsements[5] == "1" ? "Yes" : "No"}</LicenseFieldStyle>
                    </LicenseGridStyle>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                        <div><FormButton style={{ width: "80px" }} data-id={r.lic_recordid} onClick={handleEditLicense}>Change</FormButton></div>
                        <div><FormButton style={{ width: "80px" }} data-id={r.lic_recordid} onClick={handleDeleteLicense}>Delete</FormButton></div>
                    </FormFlexRowStyle>
                </React.Fragment>
            )
        })}
        {licenseList.length===0 && 
            <div style={{width:"100%",color:getError("drv_licenses") ? "#FF6666" : "#76B66A", fontSize:"28px",paddingBottom:"10px"}}>
                <span style={{fontWeight:700,fontSize:"24px"}}>Please Enter At Least One Driver's License</span>
            </div>
        }
        <div style={{ flex: 1, marginBottom: "10px", marginTop: licenseList.length ? "-32px" : "0px" }}>
            <FormButton id="new-license-button" data-ignore onClick={handleEditLicense} style={{ width:"150px" }} >Add A License</FormButton>
        </div>
        {formStatus.open && <LicenseForm record={formStatus.record} callback={licenseFormCallback} />}
    </>)
}