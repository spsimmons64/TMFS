import React, { useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../../components/portals/formstyles"
import { FormDate, FormInput, FormSelect } from "../../../components/portals/inputstyles"
import { countryTypes, statesArray, yesNoNaTypes, yesNoTypes } from "../../../global/staticdata"
import { FormButton } from "../../../components/portals/buttonstyle"
import { v4 as uuidv4 } from 'uuid';
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll, ModalFormScrollFooter, ModalFormScrollHeader } from "../../../components/global/forms/forms"

export const Employersform = ({ record, callback }) => {
    const [formFields, setFormFields] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const handleChange = ({ target }) => setFormFields(ps => ({ ...ps, [target.id]: target.value }))

    const handleValidate = () => {
        var errors = {}
        const fromDate = new Date(formFields.emp_datefrom)
        const toDate = new Date(formFields.emp_dateto)
        if (!formFields.emp_employername) errors["emp_employername"] = "Employer Name Is Required!"
        if (!formFields.emp_address) errors["emp_address"] = "Employer Address Is Required!"
        if (!formFields.emp_city) errors["emp_city"] = "Employer City Is Required!"
        if (!formFields.emp_zipcode) errors["emp_zipcode"] = "Zip Code Is Required!"
        if (!formFields.emp_position) errors["emp_position"] = "Position Is Required!"
        if (!formFields.emp_telephone) errors["emp_telephone"] = "Telephone Is Required!"
        if (!formFields.emp_reasonleaving) errors["emp_reasonleaving"] = "Reason For Leaving Is Required!"
        if (isNaN(fromDate.getDate())) errors["emp_datefrom"] = "Valid Starting Date Is Required!"
        if (isNaN(toDate.getDate())) errors["emp_dateto"] = "Valid Ending Date Is Required!"
        if (toDate < fromDate) errors["emp_dateto"] = "Ending Date Should Be After The Starting Date!"
        Object.keys(errors).length ? setFormErrors(errors) : callback(formFields)
    }

    useEffect(() => {        
        if (!record.emp_recordid) {
            const sta_rec = statesArray.find(r => r.default)
            const cty_rec = countryTypes.find(r => r.default)
            record["emp_recordid"] = uuidv4().toString();
            record["emp_employername"] = "";
            record["emp_address"] = "";
            record["emp_city"] = ""
            record["emp_state"] = sta_rec.value || "";
            record["emp_zipcode"] = ""
            record["emp_country"] = cty_rec.value || "";
            record["emp_telephone"] = ""
            record["emp_fax"] = ""
            record["emp_emailaddress"] = "";
            record["emp_position"] = ""
            record["emp_datefrom"] = " ";
            record["emp_dateto"] = " "
            record["emp_reasonleaving"] = "";
            record["emp_reasongap"] = "";
            record["emp_dotfmcsregs"] = "A";
            record["emp_dotregulated"] = "N";
        }
        setFormFields(record)
    }, [])

    return (
        <ModalFormScroll width="750px" height="720px" >
            <ModalFormHeader title="Employment History" busy={false} />
            <ModalFormBodyScroll id="driver-licenses" busy={false}>
                <FormSection style={{ paddingTop: "0px" }}>
                    List all employers in the last 10 years
                </FormSection>
                <FormSection>
                    <FormTopLabel>Employer Name</FormTopLabel>
                    <FormInput
                        id="emp_employername"
                        mask="text"
                        value={formFields.emp_employername}
                        error={formErrors.emp_employername}
                        onChange={handleChange}
                        data-ignore
                        autoFocus
                    />
                    <FormTopLabel>Employer Address</FormTopLabel>
                    <FormInput
                        id="emp_address"
                        mask="text"
                        value={formFields.emp_address}
                        error={formErrors.emp_address}
                        onChange={handleChange}
                        data-ignore
                    />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>City</FormTopLabel>
                            <FormInput
                                id="emp_city"
                                mask="text"
                                value={formFields.emp_city}
                                error={formErrors.emp_city}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>State</FormTopLabel>
                            <FormSelect
                                id="emp_state"
                                options={statesArray}
                                value={formFields.emp_state}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Zip Code</FormTopLabel>
                            <FormInput
                                id="emp_zipcode"
                                mask="text"
                                value={formFields.emp_zipcode}
                                error={formErrors.emp_zipcode}
                                data-ignore
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Telephone</FormTopLabel>
                            <FormInput
                                id="emp_telephone"
                                mask="telephone"
                                value={formFields.emp_telephone}
                                error={formErrors.emp_telephone}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Fax Number</FormTopLabel>
                            <FormInput
                                id="emp_fax"
                                mask="telephone"
                                value={formFields.emp_fax}
                                error={formErrors.emp_fax}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Country</FormTopLabel>
                            <FormSelect
                                id="emp_country"
                                options={countryTypes}
                                value={formFields.emp_country}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Email Address</FormTopLabel>
                    <FormInput
                        id="emp_emailaddress"
                        mask="text"
                        value={formFields.emp_emailaddress}
                        error={formErrors.emp_emailaddress}
                        onChange={handleChange}
                        data-ignore
                    />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Starting Date</FormTopLabel>
                            <FormDate
                                id="emp_datefrom"
                                mask="text"
                                value={formFields.emp_datefrom || ""}
                                error={formErrors.emp_datefrom}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Ending Date</FormTopLabel>
                            <FormDate
                                id="emp_dateto"
                                options={statesArray}
                                value={formFields.emp_dateto || ""}
                                error={formErrors.emp_dateto}
                                onChange={handleChange}
                                data-ignore
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Position Held</FormTopLabel>
                    <FormInput
                        id="emp_position"
                        mask="text"
                        value={formFields.emp_position}
                        error={formErrors.emp_position}
                        onChange={handleChange}
                        data-ignore
                    />

                    <FormTopLabel>Reason For Leaving</FormTopLabel>
                    <FormInput
                        id="emp_reasonleaving"
                        mask="text"
                        value={formFields.emp_reasonleaving}
                        error={formErrors.emp_reasonleaving}
                        onChange={handleChange}
                        data-ignore
                    />
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ width: "80px" }}>
                            <FormSelect
                                id="emp_dotregulated"
                                options={yesNoTypes}
                                value={formFields.emp_dotregulated}
                                hideerror
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, padding: "0px 0px 0px 0px" }}>
                            <FormTopLabel>
                                Were you subject to the DOT/FMCSA regulations while employed by this carrier?<strong> If you were a driver, select 'Yes'.</strong>
                            </FormTopLabel>
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle style={{ margin: "10px 0px" }}>
                        <div style={{ width: "80px" }}>
                            <FormSelect
                                id="emp_dotfmcsregs"
                                options={yesNoNaTypes}
                                value={formFields.emp_dotfmcsregs}
                                hideerror
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, padding: "0px 0px 0px 0px" }}>
                            <FormTopLabel>
                                Was your job designated as a safety sensitive function, in any DOT regulated mode, subject to the alcohol and
                                controlled substances testing requirements required by 49 CFR Part 40?<strong> If you were a driver, select 'Yes'.</strong>
                            </FormTopLabel>
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBodyScroll>
            <ModalFormFooter>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div><FormButton style={{ width: "72px" }} onClick={handleValidate}>Save</FormButton></div>
                    <div><FormButton style={{ width: "72px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalFormScroll>
    )
}