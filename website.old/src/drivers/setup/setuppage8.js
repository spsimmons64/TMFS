import { useState, useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate, FormSelect } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { toSimpleDate } from "../../global/globals";
import { yesNoNaTypes, yesNoTypes } from "../../global/staticdata";
import { SignatureForm } from "../../classes/signatureform";
import { useButtonContext } from "./buttoncontext";


export const SetupPage8 = () => {
    const { setValue, getValue, getError, handleChange } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()
    const [signature, setSignature] = useState({ date: "", signature: "" })

    const handleSignatureLookup = () => {
        setSigLookup(true)
    }

    const signatureCallBack = (sig_rec) => {
        if (sig_rec) {
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "27",
                sig_esignatureid: sig_rec["recordid"],
                sig_esignaturedate: toSimpleDate(new Date())
            }
            newList.push(new_rec)
            setValue("drv_signatures", newList)
        }
        setSigLookup(false)
    }

    const checkForSignature = () => {
        const rec = getValue("drv_signatures").find(r => r.sig_typecode == "27")
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
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Pre-Employment Employee Alcohol & Drug Test Statement</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>49 CFR Part 40.25(j) states, as the employer, you must ask the employee whether he or she has tested positive, or refused to
            test, on any pre-employment drug or alcohol test administered by an employer to which the employee applied for, but did
            not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past
            two years. If the employee admits that he or she had a positive test or a refusal to test, you must not use the employee to
            perform safety-sensitive functions for you, until and unless the employee documents successful completion of the return-to-duty
            process required in 49 CFR Subpart O.</b>
        </div>
        <FormFlexRowStyle >
            <div style={{ paddingTop: "20px" }}>
                <FormSelect style={{ width: "78px" }}
                    id="drv_adtestedpositive"
                    options={yesNoTypes}
                    value={getValue("drv_adtestedpositive")}
                    error={getError("drv_adtestedpositive")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel >
                    Tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer
                    to which the employee applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency
                    drug and alcohol testing rules during the past two years.
                </FormTopLabel>
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle >
            <div style={{ paddingTop: "20px" }}>
                <FormSelect style={{ width: "78px" }}
                    id="drv_adcanprovidedocs"
                    options={yesNoNaTypes}
                    value={getValue("drv_adcanprovidedocs")}
                    error={getError("drv_adcanprovidedocs")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel >
                    If you answered yes to the above question, can you provide documentation of successful completion of DOT
                    return-to-duty requirements (including follow-up tests).
                </FormTopLabel>
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle style={{ marginTop: "40px" }}>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Applicant Signature</FormTopLabel>
                <div style={{ width: "100%", height: "35px", border: "1px dotted #B6B6B6", backgroundColor: "#E9E9E9", borderRadius: "5px", marginBottom: "20px" }}>
                    {signature.sig_esignaturedate && <img src={`data:image/png;base64,${getValue("drv_esignature").esignature}`} style={{ height: "33px" }} alt=" " />}
                </div>
            </div>
            <div style={{ width: "200px" }}>
                <FormTopLabel>Date Signed</FormTopLabel>
                <FormDate
                    id="esignaturedate"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || ""}
                    tabIndex={-1}
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <FormButton
            id="ads_sign-button"
            data-ignore style={{ marginBottom: "10px" }}
            disabled={signature.sig_esignaturedate}
            onClick={handleSignatureLookup}
        >Sign Statement
        </FormButton>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "Pre-Employment Employee Alcohol & Drug Test Statement",
                    docdesc: "This document ensures compliance with DOT regulation 49 CFR Part 40.25(j) in that the employer asks the prospective employee about their alcohol and drug test history.",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee completing the document.",
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