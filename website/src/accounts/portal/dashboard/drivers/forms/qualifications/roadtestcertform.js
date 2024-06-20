import React, { useContext, useEffect, useState } from "react"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle, FormTopLabel } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { FormDate, FormInput, FormRadio, FormSelect, FormText } from "../../../../../../components/portals/inputstyles"
import { SignatureForm } from "../../../../../../classes/signatureform"
import { checkDate, convertSimpleDate, convertToIsoDate, toSimpleDate } from "../../../../../../global/globals"
import { useRestApi } from "../../../../../../global/hooks/apihook"
import { countryTypes, statesArray, yesNoNaTypes } from "../../../../../../global/staticdata"

export const RoadTestCertForm = ({ licenseid, callback }) => {
    const { globalState, updateState } = useGlobalContext()
    const { getValue, getError, handleChange, setFormErrors, serializeFormData, buildFormControls, formControls } = useFormHook("roadtestcert-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({ id: "", date: " ", signature: "", signaturename: "" })
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
        if (!checkDate(getValue("roadtestdate"))) errors["date"] = "The Date Is Invalid."
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
            data.append("typecode", "34")
            data.append("esignatureid", signature.id)
            data.append("completedate", signature.date)
            const res = await fetchData("driverdocs", "post", data)
            res.status == 200 && setDriverRecord(res.data)
            callback()
        }
    }

    useEffect(() => {
        const defaults = {
            roadcertdate:driverRecord.qualifications.roadtest.date,
            roadcertmiles:driverRecord.qualifications.roadtest.miles,
        }
        buildFormControls(defaults)
    }, [])

    return (<>
        <ModalFormScroll width="800px" height="700px">
            <ModalFormHeader title="Road Test Certificate" busy={false} />
            <ModalFormBodyScroll id="roadtestcert-form" busy={false}>
                <FormSection style={{ paddingTop: "0px" }}>
                    Instructions: If the road test is successfully completed, the person who gave it shall complete a
                    certificate of the driver's road test. The original or copy of the certificate shall be retained in
                    the employing motor carrier's driver qualification file of the person examined and a copy given to
                    the person who was examined. (49 CFR 391.31(e)(f)(g))
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Driver Information</div>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Driver Name</FormTopLabel>
                            <FormInput value={`${driverRecord.firstname} ${driverRecord.lastname}`} readOnly />
                        </div>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Birth Date</FormTopLabel>
                            <FormDate value = {driverRecord.birthdate || " "} readOnly />
                        </div>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Social Security</FormTopLabel>
                            <FormInput mask="ssn" value={driverRecord.socialsecurity} readOnly />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License Number</FormTopLabel>
                            <FormInput defaultValue={driverRecord.license[0].licensenumber} readOnly />
                        </div>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Issued</FormTopLabel>
                            <FormDate value={convertToIsoDate(driverRecord.license[0].issued) || " "} readOnly />
                        </div>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Expires</FormTopLabel>
                            <FormDate value={convertToIsoDate(driverRecord.license[0].expires) || " "} readOnly />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>License State</FormTopLabel>
                            <FormInput value={driverRecord.license[0].state} readOnly />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>License Country</FormTopLabel>
                            <FormInput value={driverRecord.license[0].country} readOnly />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Certification Of Road Test</div>
                    <FormTopLabel>Power Unit Type</FormTopLabel>
                    <FormInput
                        id="roadcertpowerunit"
                        mask="text"
                        value={getValue("roadcertpowerunit")}
                        error={getError("roadcertpowerunit")}
                        onChange={handleChange}
                        autoFocus
                    />
                    <FormTopLabel>Trailer Type(s)</FormTopLabel>
                    <FormInput
                        id="roadcerttrailertype"
                        mask="text"
                        value={getValue("roadcerttrailertype")}
                        error={getError("roadcerttrailertype")}
                        onChange={handleChange}

                    />
                    <FormTopLabel>If Passenger Carrier, Type Of Bus</FormTopLabel>
                    <FormInput
                        id="roadcertbustype"
                        mask="text"
                        value={getValue("roadcertbustype")}
                        error={getError("roadcertbustype")}
                        onChange={handleChange}
                    />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Date Of Road Test</FormTopLabel>
                            <FormDate
                                id="roadcertdate"
                                value={getValue("roadcertdate") || " "}
                                error={getError("roadcertdate")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Approximate Miles Driven</FormTopLabel>
                            <FormInput
                                id="roadcertmiles"
                                mask="number"
                                value={getValue("roadcertmiles") || " "}
                                error={getError("roadcertmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Examiner Information</div>
                    <FormSection style={{border:"none"}}>
                        <p>This is to certify that the above-named driver was given a road test under my supervision on the date of&nbsp;
                        {convertSimpleDate(getValue("roadcertdate"))}, consisting of approximately {getValue("roadcertmiles")} miles of driving.
                        It is my considered opinion that this driver possesses sufficient driving skill to operate safely the 
                        type of commercial motor vehicle listed above.</p>
                    </FormSection>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Signature Of Examiner</FormTopLabel>
                            <div style={{ width: "100%", height: "35px", border: "1px dotted #B6B6B6", backgroundColor: "#E9E9E9", borderRadius: "5px", marginBottom: "20px" }}>
                                {signature.date != " " && <img src={`data:image/png;base64,${signature.signature}`} style={{ height: "33px" }} alt=" " />}
                            </div>
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Signature Date</FormTopLabel>
                            <FormDate value={signature.date || " "} disabled />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Printed Name Of Examiner</FormTopLabel>
                            <FormInput value={signature.signaturename} disabled />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Road Test Date</FormTopLabel>
                            <FormDate
                                id="roadtestdate"
                                value={getValue("roadtestdate") || " "}
                                error={getError("roadtestdate")}
                                disabled
                                onChange={handleChange}
                            />
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