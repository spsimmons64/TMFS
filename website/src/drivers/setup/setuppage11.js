import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { toSimpleDate } from "../../global/globals";
import { SignatureForm } from "../../classes/signatureform";
import { useButtonContext } from "./buttoncontext";


export const SetupPage11 = ({ account }) => {
    const { setValue, getValue, getError, handleChange } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({})
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()

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

    const handleSignatureLookup = () => setSigLookup(true)

    const checkForSignature = () => {
        if (getValue("drv_signatures").length) {
            const rec = getValue("drv_signatures").find(r => r.sig_typecode == "39")
            setSignature(rec || {})
            setNextDisable(rec ? false : true)
        }
    }

    useEffect(() => checkForSignature(), [getValue("drv_signatures")])

    useEffect(() => {
        setNextVisible(true)
        setPrevVisible(true)
        checkForSignature()
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>General Consent for Limited Queries of the
            Federal Motor Carrier Safety Administration (FMCSA) Drug and Alcohol Clearinghouse</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please Review And Sign The Below Statement</b></div>
        <p style={{ marginBottom: "12px" }}>I, <strong>{`${getValue("drv_firstname")} ${getValue("drv_lastname")}`}</strong>, hereby provide consent
            to <strong>{getValue("acc_companyname")}</strong> conduct a limited query of the FMCSA Commercial Driver’s License Drug and Alcohol Clearinghouse
            (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse.</p>
        <p style={{ marginBottom: "12px" }}>I am consenting to multiple unlimited queries and for the duration of employment with {getValue("acc_companyname")}.</p>
        <p style={{ marginBottom: "12px" }}>I understand that if the limited query conducted by {getValue("acc_companyname")} indicates that drug or alcohol
            violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to {getValue("acc_companyname")}
            without first obtaining additional specific consent from me.</p>
        <p style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px dotted  #B6B6B6" }}>I further understand that if I refuse
            to provide consent for {getValue("acc_companyname")} to conduct a limited query of the Clearinghouse, {getValue("acc_companyname")} must
            prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA’s drug and alcohol
            program regulations.</p>
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
                    id="dac_datesigned"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || ""}
                    tabIndex={-1}
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <FormButton
            id="dac_sign-button"
            data-ignore style={{ marginBottom: "10px" }}
            disabled={signature.sig_esignaturedate}
            onClick={handleSignatureLookup}
        >Sign Authorization
        </FormButton>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "Drug & Alcohol Clearinghouse Consent",
                    docdesc: "This document is used to consent to a Limited Query of the FMCSA Drug & Alcohol Clearinghouse",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee consenting to the Limited Query FMCSA Drug & Alcohol Clearinghouse report.",                    
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