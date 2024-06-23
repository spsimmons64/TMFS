import React, { useContext, useEffect, useState } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormRouterContext } from "./formroutercontext"
import { FormButton } from "../../components/portals/buttonstyle"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../components/global/forms/forms"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { FormDate, FormInput } from "../../components/portals/inputstyles"
import { SignatureForm } from "../../classes/signatureform"
import { useRestApi } from "../../global/hooks/apihook"


export const DriverInquiryDocForm = ({ params, callback }) => {
    const { globalState ,updateState} = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { openForm, closeForm } = useContext(FormRouterContext);
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({ id: "", date: " ", signature: "", signaturename: "" })
    const [license,setLicense] = useState({})
    const { fetchData } = useRestApi()

    const closeWindow = () => {
        params.callbackid ? openForm(params.callbackid,params.callbackparams,params.callback) : closeForm()
    }

    const signatureCallBack = (sig_rec) => {                
        sig_rec && setSignature({
            date: sig_rec.esignaturedate,
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
        data.append("licenseid",params.licenseid)        
        data.append("typecode", "22")
        data.append("esignatureid", signature.id)
        data.append("completedate", signature.date)
        data.append("position",globalState.user.position)
        const res = await fetchData("driverdocs", "post", data)
        res.status == 200 && setDriverRecord(res.data)
        closeWindow()
    }

    const handleSignatureLookup = () => setSigLookup(true)

    useEffect(()=>{
        const rec = driverRecord.license.find(r=>r.recordid==params.licenseid)        
        rec && setLicense(rec)
    },[])
    
    return (<>
        <ModalFormScroll width="900px" height="700px">
            <ModalFormHeader title="Driver Record Inquiry" busy={false} />
            <ModalFormBodyScroll id="driver-inquiry-letter" busy={false}>
                <FormSection style={{ paddingTop: "0px", borderBottom: "none", fontWeight: 600 }}>
                    <div>DEPARTMENT OF TRANSPORTATION</div>
                    <div>MOTOR CARRIER SAFETY PROGRAM</div>
                    <div>INQUIRY TO STATE AGENCY FOR DRIVER'S RECORD</div>
                </FormSection>
                <FormSection>
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
                            <FormInput mask="ssn" value={`${driverRecord.socialsecurity}`} disabled  />
                        </div>
                    </FormFlexRowStyle>
                    <p style={{ fontWeight: 600 }}>To Whom in May Concern:</p><br />
                    <p>The above listed individual has made application with us for employment as a driver. The applicant has indicated
                        the above numbered operator's license or permit has been issued by your State to the applicant and that it is in
                        good standing.</p><br />
                    <p>In accordance with Section 391.23(a)(1) and (b) of the Federal Motor Carrier Safety Regulations, we are required
                        to make an inquiry into the driving record during the preceding 3 years, to every State, in which an applicant has
                        held a motor vehicle operator's license or permit.</p><br />
                    <p>Therefore, could you please provide to us, a copy of the driving record for the above listed individual for the
                        preceding 3 years, or certify that no record exists if that be the case.</p><br />
                    <p>In the event this inquiry does not satisfy your requirements for making such inquiries, please send us such forms
                        as are necessary for us to complete our inquiry into the driving record of this individual.</p><br />
                    <p>Respectfully,</p><br />
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
                    <div><FormButton style={{ width: "100px" }} onClick={closeWindow}>Cancel</FormButton></div>
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