import React, { useEffect, useState } from "react"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import { countryTypes, statesArray } from "../../../global/staticdata"
import { FormFlexRowStyle } from "../../../components/portals/formstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { AddressForm } from "./addressform"

import styled from "styled-components"

const AddressDisplayStyle = styled.div`
display: flex;
align-items: center;
width: 100%;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin: 10px 0px;
`
const AddressLableContainerStyle = styled.div`
padding: 5px 10px 5px 5px;
background-color:#e9effc;
font-weight: 700;
font-size: 14px;
border-right: 1px dotted #B6B6B6;
`

const AddressFieldContainerStyle = styled.div`
flex:1;
padding:5px 5px 5px 10px;
font-size: 14px;
`

const AddressCellContainerStyle = styled.div`
padding: 2px;
font-size: 14px;
`

export const AddressGrid = () => {
    const [addressList, setAddressList] = useState([])
    const [formStatus, setFormStatus] = useState({ open: false, record: {} })
    const { getValue, setValue } = useMultiFormContext()

    const handleEditAddress = ({ target }) => {
        const rec = addressList.find(r => r.add_recordid == target.getAttribute('data-id'))
        setFormStatus({ open: "true", record: rec ? rec : {} })
    }

    const handleDeleteAddress = ({ target }) => {
        let newList = [...addressList]
        const ndx = newList.findIndex(r => r.add_recordid == target.getAttribute('data-id'))
        if (ndx > -1) newList.splice(ndx, 1)
        setAddressList(newList)
    }

    const addressFormCallBack = (resp) => {
        let newList = [...addressList]
        setFormStatus({ open: false, record: {} })
        if (resp !== false) {
            const ndx = addressList.findIndex(r => r.add_recordid === resp.add_recordid)
            ndx === -1 ? newList.push(resp) : newList[ndx] = resp
            setAddressList(newList)
        }
    }

    useEffect(()=>{setValue("drv_addresses",addressList)},[addressList])

    useEffect(() => { setAddressList(getValue("drv_addresses")) }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 0px 0px" }}>Other Residences Previous 3 Years</div>
        <div style={{ padding: "5px 0px 20px 0px", color:"#0A21C0" }}><b>List ANY different residences for the previous 3 years if you lived at the above address less than 3 years</b></div>
        {addressList.map(r => {
            const con_rec = countryTypes.find(q => q.value === r.add_country)
            const sta_rec = statesArray.find(q => q.value === r.add_state)
            return (<React.Fragment key={r.add_recordid}>
                <AddressDisplayStyle >
                    <AddressLableContainerStyle>
                        <AddressCellContainerStyle>Address:</AddressCellContainerStyle>
                        <AddressCellContainerStyle>City:</AddressCellContainerStyle>
                        <AddressCellContainerStyle>State:</AddressCellContainerStyle>
                        <AddressCellContainerStyle>Zip Code:</AddressCellContainerStyle>
                        <AddressCellContainerStyle>Country:</AddressCellContainerStyle>
                    </AddressLableContainerStyle>
                    <AddressFieldContainerStyle>
                        <AddressCellContainerStyle>{r.add_address}</AddressCellContainerStyle>
                        <AddressCellContainerStyle>{r.add_city}</AddressCellContainerStyle>
                        <AddressCellContainerStyle>{sta_rec.text}</AddressCellContainerStyle>
                        <AddressCellContainerStyle>{r.add_zipcode}</AddressCellContainerStyle>
                        <AddressCellContainerStyle>{con_rec.text}</AddressCellContainerStyle>
                    </AddressFieldContainerStyle>
                </AddressDisplayStyle>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div><FormButton style={{ width: "80px" }} data-id={r.add_recordid} onClick={handleEditAddress}>Change</FormButton></div>
                    <div><FormButton style={{ width: "80px" }} data-id={r.add_recordid} onClick={handleDeleteAddress}>Delete</FormButton></div>
                </FormFlexRowStyle>
            </React.Fragment>)
        })}
        <div style={{ flex: 1 ,marginBottom:"10px",marginTop:addressList.length ? "-32px" : "0px"}}>
            <FormButton id="new-residence-button" data-ignore onClick={handleEditAddress} style={{ width:"150px" }} >Add A Residence</FormButton>
        </div>
        {formStatus.open && <AddressForm record={formStatus.record} callback={addressFormCallBack} />}
    </>)
}



