import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { getApiUrl, toSimpleDate } from "../../global/globals";
import { SignatureForm } from "../../classes/signatureform";

import styled from "styled-components";
import { useButtonContext } from "./buttoncontext";

const PDFContainerStyle = styled.iframe`
width: 100%;
margin:10px 0px;
height: 520px;
border: 2px solid #323639;
`
export const SetupPage13 = ({ account }) => {
    const { setValue, getValue, getError, handleChange } = useMultiFormContext()
    const [pdfData, setPdfData] = useState()
    const [sigLookup, setSigLookup] = useState(false)
    const [signature,setSignature] = useState({})
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()

    const signatureCallBack = (sig_rec) => {
        if (sig_rec) {
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "14",
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
            const rec = getValue("drv_signatures").find(r => r.sig_typecode == "14")
            setSignature(rec || {})
            setNextDisable(rec ? false : true)
        }
    }

    const getPdfFile = async () => {
        let url = `${getApiUrl()}/fetchobj/account/gwpolicy?id=${getValue("acc_recordid")}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfData(pdfUrl)
    }

    useEffect(() => checkForSignature(), [getValue("drv_signatures")])

    useEffect(() => {
        setNextVisible(true)
        setPrevVisible(true)
        checkForSignature()
        getPdfFile()
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>General Work Policy</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please review the company general work policy below. Once finished, electronically sign to
            confirm receipt, understanding and agree. Upon completion of the online application, you will be emailed a copy of this 
            policy. You may also click the <strong>Download</strong> button in the top right corner of the viewer to save a copy of the policy now.</b></div>
        {pdfData && <PDFContainerStyle src={`${pdfData}`} width="100%" height="400px" title="Alcohol & Drug Testing Policy"></PDFContainerStyle>}
        <p style={{ marginBottom: "12px" }}>I have read, fully understand and agree to all terms as set forth in the company alcohol and drug testing policy.</p>
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
                    id="gwp_datesigned"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || " "}
                    tabIndex={-1}
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <FormButton
            id="gwp_sign-button"
            data-ignore style={{ marginBottom: "10px" }}
            disabled={signature.sig_esignaturedate}
            onClick={handleSignatureLookup}
        >Sign Policy Agreement
        </FormButton>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "General Work Policy Receipt",
                    docdesc: "This document is used to confirm a prospective employee has receives, understands and agrees to the prospective employer's General Work Policy.",
                    signature: "Prospective Employee Signature",
                    sigdesc: "The signature of the prospective employee confirming receipt and agreeing to the company's General Work Policy.",
                    doctype: "14"
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