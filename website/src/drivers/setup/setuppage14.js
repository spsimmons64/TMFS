import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { SignatureForm } from "../../classes/signatureform";
import { useButtonContext } from "./buttoncontext";
import { toSimpleDate } from "../../global/globals";


export const SetupPage14 = ({ account, submit }) => {
    const { setValue, getValue } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({})
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()

    const signatureCallBack = (sig_rec) => {
        if (sig_rec) {
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "41",
                sig_esignatureid: sig_rec["recordid"],
                sig_esignaturedate: toSimpleDate(new Date())
            }
            newList.push(new_rec)
            setValue("drv_signatures", newList)
        }
        setSigLookup(false)
    }

    const handleSignatureLookup = () => setSigLookup(true)

    const checkForSignature = () => {
        if (getValue("drv_signatures").length) {
            const rec = getValue("drv_signatures").find(r => r.sig_typecode == "41")
            setSignature(rec || {})
            setNextDisable(rec ? false : true)
        }
    }

    useEffect(() => checkForSignature(), [getValue("drv_signatures")])

    useEffect(() => {
        setNextVisible(false)
        setPrevVisible(true)
        checkForSignature()
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>Fair Credit Reporting Authorization</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please Review And Sign The Below Statement</b></div>
        <p style={{ marginBottom: "12px" }}>Pursuant to the federal Fair Credit Reporting Act, I hereby authorize <strong>{getValue("acc_companyname")}</strong>&nbsp;
            and its designated agents and representatives to conduct a comprehensive review of my background through a consumer report
            and/or an investigative consumer report to be generated for employment, promotion, reassignment or retention as an employee.
            I understand that the scope of the consumer report/investigative consumer report may include, but is not limited to, the
            following areas: verification of Social Security number; current and previous residences; employment history, including
            all personnel files; education; references; credit history and reports; criminal history, including records from any criminal
            justice agency in any or all federal, state or county jurisdictions; birth records; motor vehicle records, including traffic
            citations and registration; and any other public records.</p>
        <p style={{ marginBottom: "12px" }}>I, <strong>{`${getValue("drv_firstname")} ${getValue("drv_lastname")}`}</strong>, authorize
            the complete release of these records or data pertaining to me that an individual, company, firm, corporation or public agency
            may have. I hereby authorize and request any present or former employer, school, police department, financial institution or other
            persons having personal knowledge of me to furnish Simmons Trucking or its designated agents with any and all information in
            their possession regarding me in connection with an application of employment. I am authorizing that a photocopy of this
            authorization be accepted with the same authority as the original.</p>
        <p style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px dotted  #B6B6B6" }}>I understand that, pursuant to the federal Fair Credit Reporting Act, if any adverse action is
            to be taken based upon the consumer report, a copy of the report and a summary of the consumer's rights will be provided to me.</p>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Applicant Signature</FormTopLabel>
                <div style={{ width: "100%", height: "35px", border: "1px dotted #B6B6B6", backgroundColor: "#E9E9E9", borderRadius: "5px", marginBottom: "20px" }}>
                    {signature.sig_esignaturedate && <img src={`data:image/png;base64,${getValue("drv_esignature").esignature}`} style={{ height: "33px" }} alt=" " />}
                </div>
            </div>
            <div style={{ width: "200px" }}>
                <FormTopLabel>Date Signed</FormTopLabel>
                <FormDate
                    id="fcr_datesigned"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || ""}
                    tabIndex={-1}
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <FormButton
            id="fcr_sign-button"
            data-ignore style={{ marginBottom: "10px" }}
            disabled={signature.sig_esignaturedate}
            onClick={handleSignatureLookup}
        >Sign Authorization
        </FormButton>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "Fair Credit Report Authorization",
                    docdesc: "This document is used to consent to the Fair Credit Reporting Act.",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee consenting to the Fair Credit Reporting Act.",                  
                }}
                callback={signatureCallBack}
                esignature={getValue("drv_esignature")}
                entity="driver"
                resourceid={getValue("drv_recordid")}
            />
        }
        <div style={{ width: "100%", padding: "30px", textAlign: "center" }}>
            <FormButton disabled={!signature.sig_esignaturedate} style={{ height: "60px" }} onClick={submit}><strong>Submit Application</strong></FormButton>
        </div>
    </>
    )
}