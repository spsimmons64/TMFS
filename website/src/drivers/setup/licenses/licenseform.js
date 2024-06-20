import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormCheck, FormDate, FormInput, FormSelect } from "../../../components/portals/inputstyles"
import { countryTypes, dlClassTypes, statesArray } from "../../../global/staticdata"
import { FormButton } from "../../../components/portals/buttonstyle"
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { checkDate } from "../../../global/globals"
import { useMultiFormContext } from "../../../global/contexts/multiformcontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../components/global/forms/forms"
import { CircleBack } from "../../../accounts/portal/dashboard/drivers/classes/qualifications"
import styled from "styled-components"


const EndorsementBoxStyle = styled.div`
width: 100%;
background-color: #E9E9E9;
border: 1px solid #D1D1D1;
border-radius: 4px;
padding: 5px;
margin-bottom: 10px;
`

export const LicenseForm = ({ record, callback }) => {
    const { getValue } = useMultiFormContext()
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => {
        setFormFields(ps => ({ ...ps, [target.id]: target.value }))
        setFormErrors(ps => ({ ...ps, [target.id]: "" }))
    }

    const handleValidate = () => {
        var errors = {}
        if (!checkDate(formFields.lic_issued)) errors["lic_issued"] = "Invalid Date Field"
        if (!checkDate(formFields.lic_expires)) errors["lic_expired"] = "Invalid Date Field"
        if (!formFields.lic_firstname) errors["lic_firstname"] = "First Name is Required!"
        if (!formFields.lic_lastname) errors["lic_lastname"] = "Last Name Is Required!"
        if (!formFields.lic_issued) errors["lic_issued"] = "Issue Date Is Required!"
        if (!formFields.lic_expires) errors["lic_expires"] = "Expires Date Is Required!"
        if (!formFields.lic_licensenumber) errors["lic_licensenumber"] = "License Number Is Required!"
        if (!formFields.lic_clicensenumber) errors["lic_clicensenumber"] = "Confirmation License Number Is Required!"
        if (formFields.lic_licensenumber !== formFields.lic_clicensenumber) {
            errors["lic_licensenumber"] = "License Number And Conformation Do Not Match!"
            errors["lic_clicensenumber"] = "License Number And Conformation Do Not Match!"
        }
        const rec = getValue("drv_licenses").find(r => (r.lic_licensenumber == formFields.lic_licensenumber && r.lic_expires == formFields.lic_expires))
        if (rec && record["lic_recordid"] !== formFields.lic_recordid) errors["lic_licensenumber"] = "This License Number Is Already Registered!"
        Object.keys(errors).length ? setFormErrors(errors) : callback(formFields)
    }

    const handleEndorsements = ({ target }) => {
        const checkStr = "HNPTSX"
        const pos = checkStr.indexOf(target.id)
        let endStr = formFields.lic_endorsements
        let newFlag = target.checked ? "1" : "0"
        let newStr = endStr.substring(0, pos) + newFlag + endStr.substring(pos + 1)
        setFormFields(ps => ({ ...ps, lic_endorsements: newStr }))
    }

    useEffect(() => {
        if (!record.lic_recordid) {
            const sta_rec = statesArray.find(r => r.default)
            const cty_rec = countryTypes.find(r => r.default)
            const cls_rec = dlClassTypes.find(r => r.default)
            record["lic_recordid"] = uuidv4().toString()
            record["lic_firstname"] = getValue("drv_firstname");
            record["lic_lastname"] = getValue("drv_lastname");
            record["lic_issued"] = ""
            record["lic_expired"] = "";
            record["lic_licensenumber"] = "";
            record["lic_clicensenumber"] = "";
            record["lic_class"] = cls_rec.value || "";
            record["lic_state"] = sta_rec.value || "";
            record["lic_country"] = cty_rec.value || "";
            record["lic_endorsements"] = "000000"
        }
        setFormFields(record)
    }, [])



    return (
        <ModalForm width="700px">
            <ModalFormHeader title="Driver's Licenses Previous 3 Years" busy={false} />
            <ModalFormBody id="driver-licenses" busy={false}>
                <FormSection style={{ paddingTop: "0px", borderColor: "#F2C779" }}>
                    List all driver licenses held within the last 3 years. Enter your first and last name
                    exactly as it appears on your license
                </FormSection>
                <FormSection style={{ backgroundColor: "#FFF8C4", border: "1px dotted #F2C779", borderTop: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ padding: "0px 10px", color: "#164398", fontSize: "20px" }}>
                            <CircleBack color="gold" size="60px" style={{ fontSize: "34px",paddingLeft:"2px" }}>
                                <FontAwesomeIcon icon={faExclamation} color="#FFFFFF" />
                            </CircleBack>
                        </div>
                        <div style={{ flex: 1, paddingRight: "5px", textAlign: "justify" }}>
                            <strong>WARNING! <u>Triple check the license information for accuracy.</u></strong> If you enter the wrong information,
                            all documents relating to your license will have to be discarded and completed again. <strong>Failure to enter accurate
                                license information may result in non-consideration and a rejected application!</strong>
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>First Name</FormTopLabel>
                            <FormInput
                                id="lic_firstname"
                                mask="text"
                                value={formFields.lic_firstname}
                                error={formErrors.lic_firstname}
                                onChange={handleChange}
                                data-ignore
                                autoFocus
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Last Name</FormTopLabel>
                            <FormInput
                                id="lic_lastname"
                                mask="text"
                                value={formFields.lic_lastname}
                                error={formErrors.lic_lastname}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License Number</FormTopLabel>
                            <FormInput
                                id="lic_licensenumber"
                                mask="text"
                                value={formFields.lic_licensenumber}
                                error={formErrors.lic_licensenumber}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Confirm License Number</FormTopLabel>
                            <FormInput
                                id="lic_clicensenumber"
                                mask="text"
                                value={formFields.lic_clicensenumber}
                                error={formErrors.lic_clicensenumber}
                                onChange={handleChange}
                                nopaste
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Classification</FormTopLabel>
                            <FormSelect
                                id="lic_class"
                                options={dlClassTypes}
                                value={formFields.lic_class}
                                error={formErrors.lic_class}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ width: "160px" }}>
                            <FormTopLabel>Issue Date</FormTopLabel>
                            <FormDate
                                id="lic_issued"
                                value={formFields.lic_issued || ""}
                                error={formErrors.lic_issued}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ width: "160px" }}>
                            <FormTopLabel>Expire Date</FormTopLabel>
                            <FormDate
                                id="lic_expires"
                                value={formFields.lic_expires || ""}
                                error={formErrors.lic_expires}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "300px" }}>
                            <FormTopLabel>State Issued</FormTopLabel>
                            <FormSelect
                                id="lic_state"
                                options={statesArray}
                                value={formFields.lic_state}
                                error={formErrors.lic_state}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Country Issued</FormTopLabel>
                            <FormSelect
                                id="lic_country"
                                options={countryTypes}
                                value={formFields.lic_country}
                                error={formErrors.lic_country}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Endorsements</FormTopLabel>
                    {formFields.lic_endorsements &&
                        <EndorsementBoxStyle>
                            <FormFlexRowStyle style={{ marginBottom: "5px" }}>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`H`}
                                        label="H - Placarded Hazmat"
                                        value={formFields.lic_endorsements[0]}
                                        checked={formFields.lic_endorsements[0] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}

                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`T`}
                                        label="T - Double/Triple Trailers"
                                        value={formFields.lic_endorsements[3]}
                                        checked={formFields.lic_endorsements[3] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}
                                    />
                                </div>
                            </FormFlexRowStyle>
                            <FormFlexRowStyle style={{ marginBottom: "5px" }}>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`N`}
                                        label="N - Tank Vehicles"
                                        value={formFields.lic_endorsements[1]}
                                        checked={formFields.lic_endorsements[1] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`S`}
                                        label="S - School Bus"
                                        value={formFields.lic_endorsements[4]}
                                        checked={formFields.lic_endorsements[4] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}
                                    />
                                </div>
                            </FormFlexRowStyle>
                            <FormFlexRowStyle>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`P`}
                                        label="P-Passengers"
                                        value={formFields.lic_endorsements[2]}
                                        checked={formFields.lic_endorsements[2] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <FormCheck
                                        id={`X`}
                                        label="X - Placarded Hazmat & Tank Vehicles"
                                        value={formFields.lic_endorsements[5]}
                                        checked={formFields.lic_endorsements[5] == "1"}
                                        data-ignore
                                        onChange={handleEndorsements}
                                    />
                                </div>
                            </FormFlexRowStyle>
                        </EndorsementBoxStyle>
                    }
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