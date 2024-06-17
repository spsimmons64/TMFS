import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { toSimpleDate } from "../../global/globals";
import { SignatureForm } from "../../classes/signatureform";
import { useButtonContext } from "./buttoncontext";


export const SetupPage10 = ({ account }) => {
    const { setValue, getValue } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()
    const [signature,setSignature] = useState({})

    const signatureCallBack = (sig_rec) => {
        if (sig_rec) {
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "39",
                sig_esignatureid: sig_rec["recordid"],
                sig_esignaturedate: toSimpleDate(new Date())
            }
            newList.push(new_rec)
            setValue("drv_signatures", newList)
        }
        setSigLookup(false)
    }

    const handleSignatureLookup = () => {
        setSigLookup(true)
    }

    const checkForSignature = () => {
        const rec = getValue("drv_signatures").find(r => r.sig_typecode == "39")        
        setSignature(rec || {})
        setNextDisable(rec ? false : true)
    }

    useEffect(() => checkForSignature(), [getValue("drv_signatures")])

    useEffect(() => {
        setNextVisible(true)
        setPrevVisible(true)
        checkForSignature()
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>PSP Driver Disclosure & Authorization</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>
            THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL ACCOUNT HOLDERS
            IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP ONLINE SERVICE.</b>
        </div>
        <p style={{ marginBottom: "12px" }}>In connection with your application for employment with <strong>{getValue("acc_companyname")}</strong> (“Prospective Employer”),
            Prospective Employer, its employees, agents or contractors may obtain one or more reports regarding your
            driving, and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).</p>
        <p style={{ marginBottom: "12px" }}>When the application for employment is submitted in person, if the Prospective Employer uses any information
            it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer
            will provide you with a copy of the report upon which its decision was based and a written summary of your rights under the
            Fair Credit Reporting Act before taking any final adverse action. If any final adverse action is taken against you based upon
            your driving history or safety report, the Prospective Employer will notify you that the action has been taken and that the
            action was based in part or in whole on this report.</p>
        <p style={{ marginBottom: "12px" }}>When the application for employment is submitted by mail, telephone, computer, or other similar
            means, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment
            decision regarding you, the Prospective Employer must provide you within three business days of taking adverse action oral, written or electronic
            notification: that adverse action has been taken based in whole or in part on information obtained from FMCSA; the name, address, and the
            toll free telephone number of FMCSA; that the FMCSA did not make the decision to take the adverse action and is unable to provide you the
            specific reasons why the adverse action was taken; and that you may, upon providing proper identification, request a free copy of the report
            and may dispute with the FMCSA the accuracy or completeness of any information or report. If you request a copy of a driver record from the
            Prospective Employer who procured the report, then, within 3 business days of receiving your request, together with proper identification,
            the Prospective Employer must send or provide to you a copy of your report and a summary of your rights under the Fair Credit Reporting Act.</p>
        <p style={{ marginBottom: "12px" }}>Neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the
            capability to correct any safety data that appears to be incorrect. You may challenge the accuracy of the data by submitting a request to
            https://dataqs.fmcsa.dot.gov. If you challenge crash or inspection information reported by a State, FMCSA cannot change or correct
            this data. Your request will be forwarded by the DataQs system to the appropriate State for adjudication.</p>
        <p style={{ marginBottom: "12px" }}>Any crash or inspection in which you were involved will display on your PSP report. Since the PSP report
            does not report, or assign, or imply fault, it will include all Commercial Motor Vehicle (CMV) crashes where you were a driver or
            co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, all inspections, with or without violations,
            appear on the PSP report. State citations associated with Federal Motor Carrier Safety Regulations (FMCSR) violations that have been
            adjudicated by a court of law will also appear, and remain, on a PSP report.</p>
        <p style={{ marginBottom: "12px" }}>The Prospective Employer cannot obtain background reports from FMCSA without your authorization.</p>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>AUTHORIZATION </div>
        <p style={{ marginBottom: "12px" }}>If you agree that the Prospective Employer may obtain such background reports, please read the following
            and sign below:</p>
        <p style={{ marginBottom: "12px" }}>I authorize <strong>{getValue("acc_companyname")}</strong> (“Prospective Employer”) to access the FMCSA
            Pre-Employment Screening Program (PSP) system to seek information regarding my commercial driving safety record and information
            regarding my safety inspection history. I understand that I am authorizing the release of safety performance information including
            crash data from the previous five (5) years and inspection history from the previous three (3) years. I understand and acknowledge
            that this release of information may assist the Prospective Employer to make a determination regarding my suitability as an employee.</p>
        <p style={{ marginBottom: "12px" }}>I further understand that neither the Prospective Employer nor the FMCSA contractor supplying
            the crash and safety information has the capability to correct any safety data that appears to be incorrect. I understand I may
            challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If I challenge crash or inspection
            information reported by a State, FMCSA cannot change or correct this data. I understand my request will be forwarded by the DataQs
            system to the appropriate State for adjudication.</p>
        <p style={{ marginBottom:"20px",paddingBottom: "20px", borderBottom:"1px dotted  #B6B6B6"}}>I understand that any crash or inspection in 
            which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it 
            will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. 
            Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with 
            FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report. I have read the above 
            Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and 
            Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer 
            and its employees, authorized agents, and/or affiliates to obtain the information authorized above.</p>
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
                    id="psp_datesigned"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || ""}
                    tabIndex={-1}
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <p style={{ marginTop:"12px",marginBottom:"12px"}}><strong>NOTICE:</strong> This form is made available to monthly account holders by NIC on behalf of 
        the U.S. Department of Transportation, Federal Motor Carrier Safety Administration (FMCSA). Account holders are required by federal 
        law to obtain an Applicant’s written or electronic consent prior to accessing the Applicant’s PSP report. Further, account holders are 
        required by FMCSA to use the language contained in this Disclosure and Authorization form to obtain an Applicant’s consent. The 
        language must be used in whole, exactly as provided. Further, the language on this form must exist as one stand-alone document. The 
        language may NOT be included with other consent forms or any other language.</p>
        <p style={{marginBottom:"12px"}}><strong>NOTICE:</strong> The prospective employment concept referenced in this form contemplates the 
        definition of "employee" contained at 49 C.F.R. 383.5.</p>
        <p style={{marginBottom:"40px"}}>LAST UPDATED 2/11/2016</p>
        <FormButton
            id="psp_sign-button"
            data-ignore style={{ marginBottom: "10px" }}
            disabled={signature.sig_esignaturedate}
            onClick={handleSignatureLookup}
        >Sign Authorization
        </FormButton>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document:"PSP Authorization",
                    docdesc: "This document allows the applicant to give authorization to the prospective employer to obtain on Pre-Employment Screening Program (PSP) report.",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee authorizing the PSP report.",                    
                }}
                callback={signatureCallBack}
                esignature={getValue("drv_esignature")}
                entity="driver"
                resourceid={getValue("drv_recordid")}
    />
        }
    </>
    )
}