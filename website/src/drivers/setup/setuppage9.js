import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormDate } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { SignatureForm } from "../../classes/signatureform";
import { useButtonContext } from "./buttoncontext";
import { toSimpleDate } from "../../global/globals";


export const SetupPage9 = () => {
    const { getValue, setValue } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({})
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()

    const handleSignatureLookup = () => setSigLookup(true)

    const signatureCallBack = (sig_rec) => {
        if (sig_rec) {
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "42",
                sig_esignatureid: sig_rec["recordid"],
                sig_esignaturedate: toSimpleDate(new Date())
            }            
            newList.push(new_rec)
            setValue("drv_signatures", newList)
        }
        setSigLookup(false)
    }

    const checkForSignature = () => {

        const rec = getValue("drv_signatures").find(r => r.sig_typecode == "42")
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
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Safety Performance History Investigation</div>
        {getValue("drv_employers").length
            ? <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>I hereby authorize release of information to this prospective employer from my employment file
                    and my Department of Transportation regulated drug and alcohol testing records. This release is in accordance with DOT Regulation 49
                    CFR Parts 40.25/382.413/391.23. I understand that information to be released, by my previous employer, is limited to the previous
                    three years. You are released from any and all liability which may result from releasing such information. Pursuant to the federal
                    Fair Credit Reporting Act, I hereby authorize this company and its designated agents and representatives to conduct a comprehensive review
                    of my background through any consumer report for employment. I understand that the scope of the consumer report/investigative consumer
                    report may include, but is not limited to, the following areas: verification of Social Security number; current and previous residences;
                    employment history, including all personnel files; education; references; credit history and reports; criminal history, including records
                    from any criminal justice agency in any or all federal, state or county jurisdictions; birth records; motor vehicle records, including
                    traffic citations and registration; and any other public records.</b>
                </div>

                <div style={{ marginBottom: "20px", fontSize: "10px", fontStyle: "italic" }}>I understand that it is my right to review information provided
                    by previous employers; to  have errors in the information corrected by the previous employer and for that previous employer to re-send the
                    corrected information; as well as the right to have a rebuttal statement attached to the alleged erroneous information if the previous
                    employer and I cannot agree on the accuracy of the information. I understand that if I wish to review previous employer-provided investigative
                    information, I must submit a written request, which may be done at any time, including when applying, or as late as 30 days after being
                    employed or being notified of denial of employment. I understand that if I have not arranged to pick up or receive the requested records within
                    thirty (30) days of them becoming available, it may be considered that I have waived my request to review the record(s).</div>

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
                            id="sph_datesigned"
                            style={{ textAlign: "center" }}
                            value={signature.sig_esignaturedate || ""}
                            tabIndex={-1}
                            readOnly
                        />
                    </div>
                </FormFlexRowStyle>
                <FormButton
                    id="sph_sign-button"
                    data-ignore style={{ marginBottom: "10px" }}
                    disabled={signature.sig_esignaturedate}
                    onClick={handleSignatureLookup}
                >Sign Authorization
                </FormButton>
                <div style={{ margin: "5px 0px" }}></div>
                {sigLookup &&
                    <SignatureForm
                        doctype={{
                            document: "Safety Performance History Investigation",
                            docdesc: "This document is used to investigate a prospective employee's driving and safety history with previous employers.",
                            signature: "Prospective Employee Signature",
                            sigdesc: "The signature of the prospective employee/applicant the history investigation is being conducted against.",
                            doctype: "42"
                        }}                        
                        callback={signatureCallBack}
                        esignature={getValue("drv_esignature")}
                        entity="driver"
                        resourceid={getValue("drv_recordid")}
                    />
                }
            </>
            : <>
                <div style={{ marginBottom: "20px" }}>
                    You did not enter any previous employers. Therefore, this section does not apply to you, please click continue. If you do have
                    previous employers, please return to step 1, <strong>Application For Employment</strong> , and enter your previous employers.
                </div>
            </>
        }
    </>
    )
}