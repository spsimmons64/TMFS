import React, { useContext, useEffect, useState } from "react"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle, FormTopLabel } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { QualificationsContext } from "../../classes/qualifications"
import { FormDate, FormInput } from "../../../../../../components/portals/inputstyles"
import { SignatureForm } from "../../../../../../classes/signatureform"
import { toSimpleDate } from "../../../../../../global/globals"
import { useRestApi } from "../../../../../../global/hooks/apihook"


export const GoodFaithDocForm = ({ licenseid, callback }) => {
    const { globalState, updateState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({ id: "", date: " ", signature: "", signaturename: "" })
    const [license, setLicense] = useState({})
    const { fetchData } = useRestApi()

    const signatureCallBack = (sig_rec) => {
        sig_rec && setSignature({
            date: sig_rec.signaturedate,
            id: sig_rec.recordid,
            signature: sig_rec["esignature"],
            signaturename: sig_rec["signaturename"]
        })
        setSigLookup(false)
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("driverid", driverRecord["recordid"])
        data.append("userid", globalState.user.recordid)
        data.append("action", "create")
        data.append("licenseid", licenseid)
        data.append("typecode", "22")
        data.append("esignatureid", signature.id)
        data.append("completedate", signature.date)
        const res = await fetchData("driverdocs", "post", data)
        res.status == 200 && setDriverRecord(res.data)
        callback()
    }

    const handleSignatureLookup = () => setSigLookup(true)

    useEffect(() => {
        const rec = driverRecord.license.find(r => r.recordid == licenseid)
        rec && setLicense(rec)
    }, [])

    return (<>
        <ModalFormScroll width="900px" height="700px">
            <ModalFormHeader title="Good Faith Effort Driver Record Inquiry" busy={false} />
            <ModalFormBodyScroll id="driver-inquiry-letter" busy={false}>                
                <div style={{fontWeight:700}}>Written Record of Good Faith Effort Inquiry Into Driving Record</div>                
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
                            <FormInput mask="ssn" value={`${driverRecord.country}`} disabled />
                        </div>
                    </FormFlexRowStyle>
                </FormSection>
                <FormSection>
                    <div style={{ padding: "10px 0px", fontWeight: 600, color: "#164398" }}>State Agency Informaton</div>
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
                    document: "Alcohol & Drug Testing Policy Receipt",
                    docdesc: "This document is used to confirm a prospective employee has received, understands and agrees to the prospective employer's Alcohol & Drug Testing Policy.",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee confirming receipt and agreeing to the company's Alcohol & Drug Testing Policy.",
                }}
                callback={signatureCallBack}
                esignature={globalState.user.esignature}
                entity="user"
                resourceid={globalState.user.recordid}
            />
        }
    </>)
}