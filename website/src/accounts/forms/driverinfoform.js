import { useContext, useEffect, useState } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormSection } from "../../components/global/forms/forms"
import { FormDate, FormInput, FormSelect, FormText } from "../../components/portals/inputstyles"
import { useFormHook } from "../../global/hooks/formhook"
import { countryTypes, driverTypes, statesArray } from "../../global/staticdata"
import { FormButton } from "../../components/portals/buttonstyle"
import { GridLoader } from "../../components/portals/gridstyles"
import { checkDate } from "../../global/globals"
import { MessageContext } from "../../administration/contexts/messageContext"

export const DriverInfoForm = () => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, formState, handleChange, getValue, setFormErrors, getError, serializeFormData, buildFormControls } = useFormHook("driver-info-form")

    const validateForm = () => {
        let errors = {}
        if (!getValue("firstname")) errors["firstname"] = "The First Name Is Required!"
        if (!getValue("lastname")) errors["lastname"] = "The Last Name Is Required!"
        if (!checkDate(getValue("birthdate"))) errors["birthdate"] = "Invalid Date Field"
        if (!getValue("socialsecurity")) errors["socialsecurity"] = "The Social Security Is Required!"
        if (!getValue("emailaddress")) errors["emailaddress"] = "The Email Address Is Required!"
        if (!getValue("telephone1")) errors["telephone1"] = "The Primary Telephone Is Required!"
        if (!getValue("address")) errors["address"] = "The Address Is Required!"
        if (!getValue("city")) errors["city"] = "The City Is Required!"
        if (!getValue("zipcode")) errors["zipcode"] = "The Zip Code Is Required!"
        return Object.keys(errors).length ? setFormErrors(errors) : true
    }

    const handleSubmit = async () => {        
        document.getElementById("formtop").scrollIntoView({ behavior: "smooth" })
        if (validateForm()) {
            let data = serializeFormData()
            data.append("recordid", driverRecord.recordid)
            const res = await sendFormData("PUT", data, "drivers")
            res.status === 200 && setDriverRecord(res.data)
        } else {
            setMessageState({ level: 400, message: "Please Correct The Errors On This Page", timeout: 1500 });
        }        
    }

    useEffect(() => { 
        document.getElementById("formtop").scrollIntoView({ top: 0, behavior: "smooth" })
        buildFormControls(driverRecord) 
    }, [])

    return (<>        
        {formState.busy
            ? <GridLoader message="Saving The Driver Information" />
            : <>
                <div id="formtop"></div>
                <div style={{ padding: "10px 160px" }}>
                    <fieldset id="driver-info-form" style={{ border: 'none', outline: "none", padding: "0", margin: "0" }} disabled={formState.busy}>
                        <FormSection>
                            <h2> Driver Information</h2>
                        </FormSection>
                        <FormSection style={{ borderBottom: "none" }}>
                            <FormInput
                                id="firstname"
                                mask="text"
                                label="First Name *"
                                value={getValue("firstname")}
                                error={getError("firstname")}
                                onChange={handleChange}
                                labelwidth="220px"
                                autoFocus
                            />
                            <FormInput
                                id="middlename"
                                label="Middle Name&nbsp; &nbsp;"
                                mask="text"
                                value={getValue("middlename")}
                                error={getError("middlename")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="lastname"
                                label="Last Name *"
                                mask="text"
                                value={getValue("lastname")}
                                error={getError("lastname")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="suffix"
                                mask="text"
                                label="Suffix&nbsp; &nbsp;"
                                value={getValue("suffix")}
                                error={getError("suffix")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormDate
                                id="birthdate"
                                label="Birth Date *"
                                value={getValue("birthdate") || " "}
                                error={getError("birthdate")}
                                labelwidth="220px"
                                readOnly
                            />
                            <FormInput
                                id="socialsecurity"
                                mask="ssn"
                                label="Social Security *"
                                value={getValue("socialsecurity")}
                                error={getError("socialsecurity")}
                                labelwidth="220px"
                                readOnly
                            />
                        </FormSection>
                        <FormSection>
                            <h2> Driver Contact Information</h2>
                        </FormSection>
                        <FormSection style={{ borderBottom: "none" }}>
                            <FormInput
                                id="emailaddress"
                                mask="text"
                                label="Email Address *"
                                value={getValue("emailaddress")}
                                error={getError("emailaddress")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="telephone1"
                                mask="telephone"
                                label="Primary Telephone *"
                                value={getValue("telephone1")}
                                error={getError("telephone1")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="telephone2"
                                mask="telephone"
                                label="Secondary Telephone &nbsp;&nbsp;"
                                value={getValue("telephone2")}
                                error={getError("telephone2")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                        </FormSection>
                        <FormSection>
                            <h2> Driver Address</h2>
                        </FormSection>
                        <FormSection style={{ borderBottom: "none" }}>
                            <FormInput
                                id="address"
                                mask="text"
                                label="Street Address *"
                                value={getValue("address")}
                                error={getError("address")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="city"
                                mask="text"
                                label="City *"
                                value={getValue("city")}
                                error={getError("city")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormSelect
                                id="state"
                                options={statesArray}
                                label="State *"
                                value={getValue("state")}
                                error={getError("state")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormSelect
                                id="country"
                                options={countryTypes}
                                label="Country *"
                                value={getValue("country")}
                                error={getError("country")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="zipcode"
                                mask="text"
                                label="Zip Code *"
                                value={getValue("zipcode")}
                                error={getError("zipcode")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                        </FormSection>
                        <FormSection>
                            <h2> Company Information</h2>
                        </FormSection>
                        <FormSection style={{ borderBottom: "none" }}>
                            <FormInput
                                id="companyid"
                                mask="text"
                                label="Company Driver ID"
                                value={getValue("companyid")}
                                error={getError("companyid")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="division"
                                mask="text"
                                label="Company/Terminal Division"
                                value={getValue("division")}
                                error={getError("division")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormInput
                                id="vehicletypes"
                                mask="text"
                                label="Operate Vehicle Types"
                                value={getValue("vehicletypes")}
                                error={getError("vehicletypes")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormSelect
                                id="drivertype"
                                options={driverTypes}
                                label="Driver Type"
                                value={getValue("drivertype")}
                                error={getError("drivertype")}
                                labelwidth="220px"
                                onChange={handleChange}
                            />
                            <FormText
                                id="notes"
                                label="Notes"
                                value={getValue("notes") || ""}
                                error={getError("notes")}
                                labelwidth="220px"
                                height="200px"
                                onChange={handleChange}
                            />
                        </FormSection>
                        <FormSection style={{ textAlign: "center" }}>
                            <FormButton onClick={handleSubmit}>Save Driver Information</FormButton>
                        </FormSection>
                    </fieldset>
                </div>
            </>
        }
    </>)
}
