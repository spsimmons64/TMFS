import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormInput, FormSelect } from "../../../components/portals/inputstyles"
import { countryTypes, statesArray } from "../../../global/staticdata"
import { FormButton } from "../../../components/portals/buttonstyle"
import { v4 as uuidv4 } from 'uuid';
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../components/global/forms/forms"

export const AddressForm = ({ record, callback }) => {
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => setFormFields(ps => ({ ...ps, [target.id]: target.value }))

    const handleValidate = () => {
        var errors = {}
        if (!formFields.add_address) errors["add_address"] = "Address Is Required!"
        if (!formFields.add_city) errors["add_city"] = "City Is Required!"
        if (!formFields.add_zipcode) errors["add_zipcode"] = "Zip Code  Is Required!"
        if (Object.keys(errors).length)
            setFormErrors(errors)
        else
            callback(formFields)
    }

    useEffect(() => {
        if (!record.add_recordid) {
            const sta_rec = statesArray.find(r => r.default)
            const cty_rec = countryTypes.find(r => r.default)
            record["add_recordid"] = uuidv4().toString();
            record["add_address"] = "";
            record["add_city"] = "";
            record["add_state"] = sta_rec.value | "";
            record["add_zipcode"] = "";
            record["add_country"] = cty_rec.value || "";
        }
        setFormFields(record)
    }, [])



    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Other Residences Previous 3 Years" busy={false} />
            <ModalFormBody id="driver-address" busy={false}>
                <FormSection style={{ paddingTop: "0px" }}>
                    List ANY different residences for the previous 3 years if you lived at the above address less than 3 years
                </FormSection>
                <FormSection style={{borderBottom:"none"}}>
                    <FormTopLabel>Address</FormTopLabel>
                    <FormInput
                        id="add_address"
                        mask="text"
                        value={formFields.add_address}
                        error={formErrors.add_address}
                        onChange={handleChange}
                        data-ignore
                    />
                    <FormTopLabel>City</FormTopLabel>
                    <FormInput
                        id="add_city"
                        mask="text"
                        value={formFields.add_city}
                        error={formErrors.add_city}
                        onChange={handleChange}                        
                        data-ignore
                    />

                    <FormFlexRowStyle>
                        <div style={{ flex:"1" }}>
                            <FormTopLabel>State</FormTopLabel>
                            <FormSelect
                                id="add_state"
                                options={statesArray}
                                value={formFields.add_state}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex:"1" }}>
                            <FormTopLabel>Zip Code</FormTopLabel>
                            <FormInput
                                id="add_zipcode"
                                mask="text"
                                value={formFields.add_zipcode}
                                error={formErrors.add_zipcode}
                                data-ignore
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Country</FormTopLabel>
                    <FormSelect
                        id="add_country"
                        options={countryTypes}
                        value={formFields.add_country}
                        onChange={handleChange}
                        data-ignore
                    />
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div><FormButton style={{ width: "72px" }} onClick={handleValidate}>Save</FormButton></div>
                    <div><FormButton style={{ width: "72px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalForm>
    )
}