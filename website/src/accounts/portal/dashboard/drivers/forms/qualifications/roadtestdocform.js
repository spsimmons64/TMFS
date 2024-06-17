import React, { useContext, useEffect, useState } from "react"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle, FormTopLabel } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { FormDate, FormInput, FormRadio, FormSelect, FormText } from "../../../../../../components/portals/inputstyles"
import { SignatureForm } from "../../../../../../classes/signatureform"
import { checkDate, toSimpleDate } from "../../../../../../global/globals"
import { useRestApi } from "../../../../../../global/hooks/apihook"
import { statesArray, yesNoNaTypes } from "../../../../../../global/staticdata"
import { v4 as uuidv4 } from 'uuid';

export const RoadTestDocForm = ({ licenseid, callback }) => {
    const { globalState, updateState } = useGlobalContext()
    const { getValue, getError, handleChange, setFormErrors, serializeFormData, buildFormControls, formControls } = useFormHook("roadtest-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({ id: "", date: " ", signature: "", signaturename: "" })
    const { fetchData } = useRestApi()
    const handleSignatureLookup = () => setSigLookup(true)
    const [rowHovered, setRowHovered] = useState()

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
        if (getValue("reason") == "other" && !getValue("otherreason")) errors["otherreason"] = "The Reason Is Required."
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
            data.append("typecode", "20")
            data.append("esignatureid", signature.id)
            data.append("completedate", signature.date)
            const res = await fetchData("driverdocs", "post", data)
            res.status == 200 && setDriverRecord(res.data)
            callback()
        }
    }

    const buildCheckFields = () => {
        const questionList = [
            "The pre-trip inspection (As required by Sec. 392.7).",
            "Coupling and uncoupling of combination units, if applicable.",
            "Familiar with vehicle's controls",
            "Placing the vehicle in operation",
            "Use of vehicle's controls",
            "Use of vehicle's emergency equipment",
            "Operating the vehicle in traffic",
            "Operating the vehicle while passing other vehicles",
            "Turning the vehicle",
            "Operating the vehicle while passing other vehicles",
            "Braking, and slowing the vehicle by means other than braking.",
            "Backing the vehicle",
            "Parking the vehicle",
        ]
        return questionList.map((r, rndx) => {
            return (<>
                <FormFlexRowStyle style={{ flex: 1 }}>
                    <div style={{ flex: 1 }}><FormTopLabel>{r}</FormTopLabel></div>
                    <div style={{ width: "240px" }}><FormRadio name={`passfail${rndx}`} items={["Pass", "Fail", "N/A"]} /></div>
                </FormFlexRowStyle>
            </>)
        })
    }

    useEffect(() => {
        const defaults = {
            testdate: toSimpleDate(new Date()),
            stclasshazmat : "A",
            ttclasshazmat : "A",
            smclasshazmat : "A",
            dtclasshazmat : "A",
            busclasshazmat : "A",
            otclasshazmat : "A"    
        }
        buildFormControls(defaults)
    }, [])

    return (<>
        <ModalFormScroll width="800px" height="700px">
            <ModalFormHeader title="Road Test" busy={false} />
            <ModalFormBodyScroll id="roadtest-form" busy={false}>
                <FormSection style={{ paddingTop: "0px" }}>
                    <span style={{ fontWeight: "bold" }}>The road test shall be given by the motor carrier or a person designated by
                        the motor carrier. <span style={{ color: "#FF6666" }}>However, a driver who is a motor carrier must be given the
                            test by another person.</span></span> The test shall be given by a person who is competent to evaluate and determine
                    whether the person who takes the test has demonstrated that he/she is capable of operating the vehicle and
                    associated equipment that the motor carrier intends to assign.
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Driver Information</div>
                    <FormTopLabel>Driver Name</FormTopLabel>
                    <FormInput value={`${driverRecord.firstname} ${driverRecord.lastname}`} readOnly />
                    <FormTopLabel>Address</FormTopLabel>
                    <FormInput mask="text" value={driverRecord.address} disabled />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>City</FormTopLabel>
                            <FormInput
                                id="city"
                                mask="text"
                                value={driverRecord.city}
                                disabled
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>State</FormTopLabel>
                            <FormSelect
                                id="state"
                                options={statesArray}
                                value={driverRecord.state}
                                disabled
                            />
                        </div>
                        <div style={{ width: "220px" }}>
                            <FormTopLabel>Zip Code</FormTopLabel>
                            <FormInput
                                id="zipcode"
                                value={driverRecord.zipcode}
                                disabled
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Country</FormTopLabel>
                            <FormInput mask="text" value={driverRecord.country} disabled />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Phone Number</FormTopLabel>
                            <FormInput mask="phone" value={`${driverRecord.telephone}`} disabled />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection style={{ paddingBottom: "0px" }}>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Rating Of Performance</div>
                    {buildCheckFields()}
                    <FormTopLabel style={{ paddingTop: "5px" }}>Other, Explain:</FormTopLabel>
                    <FormText
                        id="other"
                        value={getValue("other")}
                        error={getError("other")}
                        height="150px"
                        onChange={handleChange}
                    />
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Type Of Equipment Used In Giving Test</div>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Equipment Class</FormTopLabel>
                            <FormInput value="Straight Truck" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Equipment Class</FormTopLabel>
                            <FormInput
                                id="stclasstype"
                                value={getValue("stclasstype")}
                                error={getError("stclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>
                            <FormTopLabel>Hazmat</FormTopLabel>
                            <FormSelect
                                id="stclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("stclasshazmat")}
                                error={getError("stclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>
                            <FormTopLabel>Approx Miles</FormTopLabel>
                            <FormInput
                                id="stclassmiles"
                                mask="number"
                                value={getValue("stclassmiles")}
                                error={getError("stclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormInput value="Truck-Tractor" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>                            
                            <FormInput
                                id="ttclasstype"
                                value={getValue("ttclasstype")}
                                error={getError("ttclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormSelect
                                id="ttclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("ttclasshazmat")}
                                error={getError("ttclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormInput
                                id="ttclassmiles"
                                mask="number"
                                value={getValue("ttclassmiles")}
                                error={getError("ttclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormInput value="Semi-Trailers" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>                            
                            <FormInput
                                id="smclasstype"
                                value={getValue("smclasstype")}
                                error={getError("smclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormSelect
                                id="smclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("smclasshazmat")}
                                error={getError("smclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormInput
                                id="smclassmiles"
                                mask="number"
                                value={getValue("smclassmiles")}
                                error={getError("smclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormInput value="Doubles / Triples" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>                            
                            <FormInput
                                id="dtclasstype"
                                value={getValue("dtclasstype")}
                                error={getError("dtclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormSelect
                                id="dtclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("dtclasshazmat")}
                                error={getError("dtclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormInput
                                id="dtclassmiles"
                                mask="number"
                                value={getValue("dtclassmiles")}
                                error={getError("dtclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>                    
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormInput value="Bus" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>                            
                            <FormInput
                                id="busclasstype"
                                value={getValue("busclasstype")}
                                error={getError("busclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormSelect
                                id="busclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("busclasshazmat")}
                                error={getError("busclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormInput
                                id="busclassmiles"
                                mask="number"
                                value={getValue("busclassmiles")}
                                error={getError("busclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormInput value="Other" readOnly />
                        </div>
                        <div style={{ flex: 1 }}>                            
                            <FormInput
                                id="otclasstype"
                                value={getValue("otclasstype")}
                                error={getError("otclasstype")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormSelect
                                id="otclasshazmat"
                                options = {yesNoNaTypes}
                                value={getValue("otclasshazmat")}
                                error={getError("otclasshazmat")}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ width: "100px" }}>                            
                            <FormInput
                                id="otclassmiles"
                                mask="number"
                                value={getValue("otclassmiles")}
                                error={getError("otclassmiles")}
                                onChange={handleChange}
                            />
                        </div>
                    </FormFlexRowStyle>                                        
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <div style={{ padding: "10px 0px", fontWeight: 700, color: "#164398" }}>Conducted By</div>
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Signature Of Examiner</FormTopLabel>
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
                            <FormTopLabel>Printed Name Of Examiner</FormTopLabel>
                            <FormInput value={signature.signaturename} disabled />
                        </div>
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Road Test Date</FormTopLabel>
                            <FormDate
                                id="testdate"
                                value={getValue("testdate")}
                                error={getError("testdate")} disabled
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