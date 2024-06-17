import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormDate, FormInput, FormSelect } from "../../../components/portals/inputstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { v4 as uuidv4 } from 'uuid';
import { yesNoTypes } from "../../../global/staticdata"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../components/global/forms/forms"

export const AccidentsForm = ({ record, callback }) => {
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => setFormFields(ps => ({ ...ps, [target.id]: target.value }))

    const handleValidate = () => {
        var errors = {}
        if (!formFields.cra_accidentdate) errors["cra_accidentdate"] = "Date Is Required!"
        if (!formFields.cra_location) errors["cra_location"] = "Location Is Required!"
        Object.keys(errors).length ? setFormErrors(errors) : callback(formFields)
    }

    useEffect(() => {
        if (!record.cra_recordid) {
            record["cra_recordid"] = uuidv4().toString();
            record["cra_accidentdate"] = "";
            record["cra_location"] = "";
            record["cra_injuries"] = "0";
            record["cra_fatalities"] = "0";
            record["cra_hazmat"] = "N";
        }
        setFormFields(record)
    }, [])

    return (
        <ModalForm width="700px">
            <ModalFormHeader title="Accidents And Crashes" busy={false} />
            <ModalFormBody id="driver-licenses" busy={false}>
                <FormSection style={{ paddingTop: "0px", borderColor: "#F2C779" }}>
                    List all accidents or crashes you have been involved in the last 3 years .
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Accident Date</FormTopLabel>
                            <FormDate
                                id="cra_accidentdate"
                                value={formFields.cra_accidentdate}
                                error={formErrors.cra_accidentdate}
                                onChange={handleChange}
                                data-ignore
                                autoFocus
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel># Injuries</FormTopLabel>
                            <FormInput
                                id="cra_injuries"
                                mask="text"
                                value={formFields.cra_injuries}
                                error={formErrors.cra_injuries}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel># Fatalities</FormTopLabel>
                            <FormInput
                                id="cra_fatalities"
                                mask="text"
                                value={formFields.cra_fatalities}
                                error={formErrors.cra_fatalities}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Hazmat Spill</FormTopLabel>
                            <FormSelect
                                id="cra_hazmat"
                                options={yesNoTypes}
                                value={formFields.cra_hazmat}
                                error={formErrors.cra_hazmat}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Accident Location</FormTopLabel>
                    <FormInput
                        id="cra_location"
                        mask="text"
                        value={formFields.cra_location}
                        error={formErrors.cra_location}
                        onChange={handleChange}
                        data-ignore
                    />
                    <FormTopLabel>Did you or anyone involved in the accident require towing?</FormTopLabel>
                    <FormSelect
                        id="cra_towed"
                        options={yesNoTypes}
                        value={formFields.cra_towed}
                        error={formFields.cra_towed}
                        hideerror
                        onChange={handleChange}
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