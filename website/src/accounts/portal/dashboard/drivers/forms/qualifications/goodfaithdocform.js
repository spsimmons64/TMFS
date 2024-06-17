import React, { useContext, useEffect, useState } from "react"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle, FormTopLabel } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { FormDate, FormInput, FormSelect, FormText } from "../../../../../../components/portals/inputstyles"
import { SignatureForm } from "../../../../../../classes/signatureform"
import { checkDate, toSimpleDate } from "../../../../../../global/globals"
import { useRestApi } from "../../../../../../global/hooks/apihook"
import { countryTypes, statesArray } from "../../../../../../global/staticdata"


export const GoodFaithDocForm = ({ licenseid, callback }) => {
    const { globalState, updateState } = useGlobalContext()
    const { getValue, getError, handleChange, setFormErrors, serializeFormData, buildFormControls } = useFormHook("gfedri-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({ id: "", date: " ", signature: "", signaturename: "" })
    const [license, setLicense] = useState({})
    const reasons = [
        { value: "Agency Refused To Release Information", text: "Agency Refused To Release Information" },
        { value: "Agency Moved And Cannot Be Located", text: "Agency Moved And Cannot Be Located" },
        { value: "other", text: "Other" }
    ]
    const { fetchData } = useRestApi()

    const handleSignatureLookup = () => setSigLookup(true)

    const signatureCallBack = (sig_rec) => {
        sig_rec && setSignature({
            date: sig_rec.signaturedate,
            id: sig_rec.recordid,
            signature: sig_rec["esignature"],
            signaturename: sig_rec["signaturename"]
        })
        setSigLookup(false)
    }

    const validate = () => {
        let errors = {}
        if (!checkDate(getValue("date"))) errors["date"] = "The Date Is Invalid."
        if (!getValue("agency")) errors["agency"] = "The State Agency Name Is Required."
        if (!getValue("address")) errors["address"] = "The Address Is Required."
        if (!getValue("city")) errors["city"] = "The City Is Required."
        if (!getValue("zipcode")) errors["zipcode"] = "The Zip Code Is Required."
        if (!getValue("telephone")) errors["telephone"] = "The Telephone Is Required."
        if (getValue("reason")=="other" && !getValue("otherreason")) errors["otherreason"]= "The Reason Is Required."
        if (!Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {        
        if (!validate()) {
            let data = serializeFormData()
            data.append("driverid", driverRecord["recordid"])
            data.append("userid", globalState.user.recordid)
            data.append("action", "create")
            data.append("licenseid", licenseid)
            data.append("typecode", "20")
            data.append("esignatureid", signature.id)
            data.append("completedate", signature.date)
            const res = await fetchData("driverdocs", "post", data)
            res.status == 200 && setDriverRecord(res.data)
            callback()
        }
    }

    useEffect(() => {
        const rec = driverRecord.license.find(r => r.recordid == licenseid)
        const state = statesArray.find(r => r.default)
        const country = countryTypes.find(r => r.default)
        if (rec) {
            const cty = countryTypes.find(r => r.value == rec["country"])
            if (cty) rec["country"] = cty.text
        }
        const defaults = {
            state: state.value || "",
            country: country.value || "",
            reason: "Agency Refused To Release Information",
            date: toSimpleDate(new Date())
        }
        buildFormControls(defaults)
        rec && setLicense(rec)
    }, [])

    return (<>
        <ModalFormScroll width="900px" height="700px">
            <ModalFormHeader title="Good Faith Effort Driver Record Inquiry" busy={false} />
            <ModalFormBodyScroll id="driver-inquiry-letter" busy={false}>
                <div style={{ fontWeight: 700 }}>Written Record of Good Faith Effort Inquiry Into Driving Record</div>
                <div>In accordance with 49 CFR Part 391.23 the following record is submitted:</div>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Driver Information</div>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Driver Name</FormTopLabel>
                            <FormInput value={`${driverRecord.firstname} ${driverRecord.lastname}`} readOnly />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>DOB</FormTopLabel>
                            <FormDate value={`${driverRecord.birthdate}`} disabled />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License Number</FormTopLabel>
                            <FormInput value={license.licensenumber} disabled />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>SSN</FormTopLabel>
                            <FormInput mask="ssn" value={`${driverRecord.socialsecurity}`} disabled />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License State</FormTopLabel>
                            <FormInput value={license.state} disabled />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License Country</FormTopLabel>
                            <FormInput value={license.country} disabled />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection id="gfedri-form">
                    <div style={{ padding: "10px 0px", fontWeight: 600, color: "#164398" }}>State Agency Information</div>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>State Agency Name</FormTopLabel>
                            <FormInput
                                id="agency"
                                mask="text"
                                value={getValue("agency")}
                                error={getError("agency")}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Address</FormTopLabel>
                    <FormInput
                        id="address"
                        mask="text"
                        value={getValue("address")}
                        error={getError("address")}
                        onChange={handleChange}
                    />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>City</FormTopLabel>
                            <FormInput
                                id="city"
                                mask="text"
                                value={getValue("city")}
                                error={getError("city")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>State</FormTopLabel>
                            <FormSelect
                                id="state"
                                options={statesArray}
                                value={getValue("state")}
                                error={getError("state")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>Zip Code</FormTopLabel>
                            <FormInput
                                id="zipcode"
                                value={getValue("zipcode")}
                                error={getError("zipcode")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Country</FormTopLabel>
                            <FormSelect
                                id="country"
                                options={countryTypes}
                                value={getValue("country")}
                                error={getError("country")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>Telephone</FormTopLabel>
                            <FormInput
                                id="telephone"
                                mask="telephone"
                                value={getValue("telephone")}
                                error={getError("telephone")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>Fax Number</FormTopLabel>
                            <FormInput
                                id="fax"
                                mask="telephone"
                                value={getValue("fax")}
                                error={getError("fax")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 600, color: "#164398" }}>Reason Driver Inquiry Was Not Conducted</div>
                    <FormFlexRowStyle>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Date</FormTopLabel>
                            <FormDate
                                id="date"
                                value={getValue("date") || " "}
                                error={getError("date")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Reason Not Conducted</FormTopLabel>
                            <FormSelect
                                id="reason"
                                options={reasons}
                                value={getValue("reason")}
                                error={getError("reason")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    {getValue("reason") == "other" && <>
                        <FormTopLabel>Other Reason</FormTopLabel>
                        <FormText
                            id="otherreason"
                            height="80px"
                            value={getValue("otherreason")}
                            error={getError("otherreason")}
                            onChange={handleChange}
                        />
                    </>}
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <div style={{ padding: "10px 0px", fontWeight: 600, color: "#164398" }}>Good Faith Signature</div>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Signature Of Person Making Inquiry</FormTopLabel>
                            <div style={{ width: "100%", height: "35px", border: "1px dotted #B6B6B6", backgroundColor: "#E9E9E9", borderRadius: "5px", marginBottom: "20px" }}>
                                {signature.date != " " && <img src={`data:image/png;base64,${signature.signature}`} style={{ height: "33px" }} alt=" " />}
                            </div>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Signature Date</FormTopLabel>
                            <FormDate value={signature.date} disabled />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Printed Name Of Person Making Inquiry</FormTopLabel>
                            <FormInput value={signature.signaturename} disabled />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Title</FormTopLabel>
                            <FormInput value={`${globalState.user.position}`} disabled />
                        </div>
                    </FormFlexRowStyle>
                    <FormButton
                        onClick={handleSignatureLookup}
                        disabled={signature.date !== " "}
                    >Sign Inquiry
                    </FormButton>
                </FormSection>
            </ModalFormBodyScroll>
            <ModalFormFooter>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div>
                        <FormButton
                            disabled={signature.date === " "}
                            style={{ width: "100px" }}
                            onClick={handleSubmit}
                        >Save</FormButton>
                    </div>
                    <div><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalFormScroll >
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "Good Faith Effort Driving Record Inquiry",
                    docdesc: "This document is used as a formal statement that a driving record was not able to be obtained despite reasonable efforts.",
                    signature: "Employee Signature",
                    sigdesc: "The signature of the employee representing the company verifying a driving record was unable to be obtained.",
                }}
                callback={signatureCallBack}
                esignature={globalState.user.esignature}
                entity="user"
                resourceid={globalState.user.recordid}
            />
        }
    </>)
}