import { useState } from "react"
import { ModalCard } from "../components/portals/cardstyle"
import { FormFlexRowStyle, FormTopLabel } from "../components/portals/formstyles"
import { FormDate, FormInput, FormSelect } from "../components/portals/inputstyles"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { checkDate, toSimpleDate } from "../global/globals"
import { useGlobalContext } from "../global/contexts/globalcontext"
import { ModalFormFooter } from "../components/global/forms/forms"

export const SignatureForm = ({ esignature, entity, resourceid, doctype, callback }) => {
    const { globalState, updateState } = useGlobalContext()
    const [ lookupMode, setLookupMode ] = useState(true)
    const { handleChange, getValue, getError, sendFormData, setFormErrors } = useFormHook()
    const validate = () => {
        let errors = {}
        if (!getValue("socialsecurity")) errors["socialsecurity"] = "The Social Security Number Is Required"
        if (!getValue("csocialsecurity")) errors["csocialsecurity"] = "The Confirmation Social Security Is Required"
        if (!checkDate(getValue("birthdate"))) errors["birthdate"] = "Invalid Date Field"
        if (!checkDate(getValue("cbirthdate"))) errors["cbirthdate"] = "Invalid Date Field"
        if (getValue("socialsecurity") && getValue("csocialsecurity")) {
            if (getValue("socialsecurity") !== (getValue("csocialsecurity"))) {
                errors["socialsecurity"] = "Social Security Numbers Don't Match!"
                errors["csocialsecurity"] = "Social Security Numbers Don't Match!"
            }
        }
        if (checkDate(getValue("birthdate")) && checkDate(getValue("cbirthdate"))) {
            if (getValue("birthdate") !== (getValue("cbirthdate"))) {
                errors["birthdate"] = "Birth Dates Don't Match!"
                errors["cbirthdate"] = "Birth Dates Don't Match!"
            }
        }
        if (!lookupMode && !getValue("entityname")) errors["entityname"] = "Please Enter Your Signature Name"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!Object.keys(esignature).length) {
            if (validate()) {
                var data = new FormData()
                data.append("action", lookupMode ? "lookup" : "")
                data.append("socialsecurity", getValue("socialsecurity"))
                data.append("csocialsecurity", getValue("csocialsecurity"))
                data.append("birthdate", getValue("birthdate"))
                data.append("cbirthdate", getValue("cbirthdate"))
                data.append("entityname", getValue("entityname"))
                data.append("resourceid", resourceid)
                const response = await sendFormData("POST", data, "signatures");                
                if(response.status === 200){
                    if (entity === "user") {
                        let holdstate = { ...globalState }
                        holdstate.user.esignature = response.data
                        updateState(holdstate)
                    }
                    callback(response.data)
                }                                 
                setLookupMode(false)
            }
        } else {
            esignature.signaturedate = toSimpleDate(new Date())
            callback(esignature)
        }        
    }    

    return (
        <ModalCard style={{ padding: "10px", width: "730px", zIndex: 2000 }} id="signature-form">
            <div style={{ borderBottom: "1px dotted #B6B6B6", fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>Document Signature</div>
            <div><b>Document: {doctype.document}</b></div>
            <div style={{ paddingBottom: "20px" }}>{doctype.docdesc}</div>
            <div><b>Signature: {doctype.signature}</b></div>
            <div style={{ paddingBottom: "20px" }}>{doctype.sigdesc}</div>
            {!Object.keys(esignature).length && <>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Social Security</FormTopLabel>
                        <FormInput
                            id="socialsecurity"
                            mask="ssn"
                            value={getValue("socialsecurity")}
                            error={getError("socialsecurity")}
                            disabled={!lookupMode}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Confirm Social Security</FormTopLabel>
                        <FormInput
                            id="csocialsecurity"
                            mask="ssn"
                            value={getValue("csocialsecurity")}
                            error={getError("csocialsecurity")}
                            disabled={!lookupMode}
                            onChange={handleChange}
                        />
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Birth Date</FormTopLabel>
                        <FormDate
                            id="birthdate"
                            value={getValue("birthdate")}
                            error={getError("birthdate")}
                            disabled={!lookupMode}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Confirm Birth Date</FormTopLabel>
                        <FormDate
                            id="cbirthdate"
                            value={getValue("cbirthdate")}
                            error={getError("cbirthdate")}
                            disabled={!lookupMode}
                            onChange={handleChange}
                        />
                    </div>
                </FormFlexRowStyle>
                {!lookupMode && <>
                    <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Create Your E-Signature</div>
                    <div style={{ marginBottom: "20px" }}>
                        To create your E-Signature, please enter your name below <u>as you would like it to appear on your signature.</u>
                        You only need to create one E-Signature for use on the entire system.
                    </div>
                    <FormTopLabel>First And Last Name {`(Please use proper casing).`}</FormTopLabel>
                    <FormInput
                        id="entityname"
                        mask="text"
                        value={getValue("entityname")}
                        error={getError("entityname")}
                        onChange={handleChange}
                        autoFocus
                    />
                </>}
            </>}
            <ModalFormFooter>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div>
                        <FormButton
                            style={{ width: "130px", marginLeft: "10px" }}
                            onClick={handleSubmit}>Sign Document
                        </FormButton>
                    </div>
                    <div><FormButton style={{ width: "130px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalCard>
    )
}    