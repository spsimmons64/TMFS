import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormDate, FormInput } from "../../../components/portals/inputstyles"
import { FormButton } from "../../../components/portals/buttonstyle"
import { v4 as uuidv4 } from 'uuid';
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../components/global/forms/forms"

export const ViolationsForm = ({ record, callback }) => {
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => setFormFields(ps => ({ ...ps, [target.id]: target.value }))

    const handleValidate = () => {
        var errors = {}
        if (!formFields.vio_violationdate) errors["vio_violationdate"] = "Violation Date Is Required!"
        if (!formFields.vio_location) errors["vio_location"] = "Location Is Required!"
        if (!formFields.vio_offense) errors["vio_offense"] = "Offense Is Required!"
        if (!formFields.vio_vehicletype) errors["vio_vehicletype"] = "Vehicle Type Is Required!"
        Object.keys(errors).length ? setFormErrors(errors) : callback(formFields)
    }

    useEffect(() => {
        if (!record.vio_recordid) {
            record["vio_recordid"] = uuidv4().toString();
            record["vio_violationdate"] = "";
            record["vio_location"] = "";
            record["vio_offense"] = "";
            record["vio_vehicletype"] = "";
        }
        setFormFields(record)
    }, [])

    return (
        <ModalForm width="700px">
            <ModalFormHeader title="Moving Violations Previous 3 Years" busy={false} />
            <ModalFormBody id="driver-licenses" busy={false}>
                <FormSection style={{ paddingTop: "0px"}}>
                    List all moving traffic violations in the last 3 years.
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Violation Date</FormTopLabel>
                            <FormDate
                                id="vio_violationdate"
                                mask="text"
                                value={formFields.vio_violationdate}
                                error={formErrors.vio_violationdate}
                                onChange={handleChange}
                                data-ignore
                                autoFocus
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Violation Location</FormTopLabel>
                            <FormInput
                                id="vio_location"
                                mask="text"
                                value={formFields.vio_location}
                                error={formErrors.vio_location}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Vehicle Type</FormTopLabel>
                            <FormInput
                                id="vio_vehicletype"
                                mask="text"
                                value={formFields.vio_vehicletype}
                                error={formErrors.vio_vehicletype}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Offense</FormTopLabel>
                            <FormInput
                                id="vio_offense"
                                mask="text"
                                value={formFields.vio_offense}
                                error={formErrors.vio_offense}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
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