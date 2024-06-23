import React, { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { FormQualification, FormQualificationDataIcon, FormQualificationDataIconLeft, FormQualificationDataIconRight, FormQualificationHeader, FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../components/portals/formstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { getBubbleColor, getBubbleIcon } from "../../global/globals"
import { YesNo } from "../../components/portals/yesno"
import { useMousePosition } from "../../global/hooks/usemousepos"
import { PDFContext } from "../../global/contexts/pdfcontext"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { CircleBack, QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import styled from "styled-components"
import { FormRouterContext } from "./formroutercontext"

const WarningContainer = styled.div`
width: 100%;
padding: 5px 10px;
border: 1px solid #FF6666;
background-color: #FFE6E6;
color: #333333;
font-size: 12px;
font-weight: 600;
border-radius: 5px;
margin:10px 0px;
`

export const DriverInquiryForm = ({ callback }) => {
    const mousePos = useMousePosition()
    const { viewDocument } = useContext(PDFContext)
    const { driverRecord } = useContext(DriverContext)
    const { openForm, closeForm } = useContext(FormRouterContext);
    const { globalState } = useGlobalContext()
    const { formState } = useFormHook("drivinginquiry-form")
    const { qualifications } = useContext(QualificationsContext)
    const [yesNo, setYesNo] = useState({})

    const handlePdf = async ({ target }) => {
        let rec = driverRecord.documents.find(r => r.typecode === "22" && r.driverslicenseid == target.getAttribute("data-id"))
        if (rec) viewDocument(rec.recordid, 'Driving Record Inquiry Form');
    }

    const handleUpload = ({ target }) => {
        const rec = driverRecord.license.find(r => r.recordid === target.getAttribute("data-id"))
        if (rec) {
            const formparams = {
                description: `Inquiry Into Driving Record For License ${rec.licensenumber} Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
                additional: `Reference ${rec.state} License Number ${rec.licensenumber}`,
                typecode: "22",
                licenseid: rec.recordid,
                callbackid: 14,
                callbackparams: {},
                callback: callback
            }
            openForm(12, formparams)
        }
    }
    const handleForm = ({ target }) => {
        const rec = driverRecord.license.find(r => r.recordid === target.getAttribute("data-id"))
        const formId = target.getAttribute("data-form")
        if (formId && rec) {
            const params = {
                licenseid: rec.recordid,
                callbackid: 14,
                callbackparams: {},
                callback: callback
            }
            openForm(formId, params)
        }
    }

    const handleYesNo = ({ target }) => {
        setYesNo({
            message: "Are you sure you want to start a new driver inquiry for this license?",            
            licenseid: target.getAttribute("data-id"),
            left: mousePos.x,
            top: mousePos.y,
            callback: yesNoCallback
        })
    }

    const yesNoCallback = (resp, data = {}) => {              
        if (resp) {            
            const params = {
                licenseid: data.licenseid,
                callbackid: 14,
                callbackparams: {},
                callback: callback
            }
            openForm(15, params)
        }
        setYesNo({})
    }

    return (<>
        <ModalFormScroll width="730px" height="700px">
            <ModalFormHeader title="Inquiry Into Driving Record Qualification" busy={formState.busy} />
            <ModalFormBodyScroll id="driver-inquiry" busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px", borderBottom: "none" }}>
                    This qualification requires the completed and signed Driving Record Inquiry form AND a Motor Vechicle Report (MVR)
                    be ran/uploaded for each license the driver has held in the last 3 years. We can handle both of these tasks for you.
                </FormSection>
                {driverRecord.license.map((r, rndx) => {
                    if (r.status == 1 && rndx > 0) return null
                    return (
                        <FormQualification key={r.recordid}>
                            <FormQualificationHeader title={`${r.state} License ${r.licensenumber} Issued On ${r.issued}, Expires On ${r.expires}`} />
                            <FormQualificationDataIcon>
                                <FormQualificationDataIconLeft>
                                    <CircleBack color={getBubbleColor(qualifications.drivinginquiry[rndx].status)} size="50px">
                                        <FontAwesomeIcon icon={getBubbleIcon(qualifications.drivinginquiry[rndx].status)} />
                                    </CircleBack>
                                </FormQualificationDataIconLeft>
                                <FormQualificationDataIconRight>
                                    {qualifications.drivinginquiry[rndx].status == 1
                                        ? <div>{qualifications.drivinginquiry[rndx].text}</div>
                                        : <div>You must complete and sign the Driving Record Inquiry form pertaining
                                            to this license. Please select the appropriate option below.</div>
                                    }
                                    {(qualifications.mvrreport[rndx].status == 0 && qualifications.drivinginquiry[rndx].status == 1) &&
                                        <WarningContainer>
                                            <div style={{ lineHeight: "1.25em" }}>
                                                <p><strong>NOTE: </strong>You must run a state Motor Vehicle Report (MVR) for this license.</p>
                                                <p><u> Please complete the Good Faith Effort document if unable to obtain the driving record.</u></p>
                                            </div>
                                        </WarningContainer>
                                    }
                                    {qualifications.drivinginquiry[rndx].status == 1
                                        ? <FormFlexRowStyle style={{ paddingTop: "5px" }}>
                                            <div style={{ display: "flex", width: "100%", flex: 1 }}>
                                                <div style={{ marginRight: "10px" }}>
                                                    <FormButton
                                                        style={{ width: "202px" }}
                                                        data-id={r.recordid}
                                                        onClick={handlePdf} >View Driver Record Inquiry
                                                    </FormButton>
                                                </div>
                                                <div>
                                                    <FormButton
                                                        data-id={r.recordid}
                                                        onClick={handleYesNo}
                                                        style={{ width: "202px" }}>Start New Inquiry
                                                    </FormButton>
                                                </div>
                                            </div>
                                            {qualifications.mvrreport[rndx].status == 0 &&
                                                <div>
                                                    <FormButton
                                                        data-id={r.recordid}
                                                        data-form="10"
                                                        onClick={handleForm}
                                                        style={{ width: "202px" }}>Process MVR
                                                    </FormButton>
                                                </div>
                                            }
                                        </FormFlexRowStyle>
                                        : <FormFlexRowStyle style={{ marginTop: "5px" }}>
                                            <div>
                                                <FormButton
                                                    style={{ width: "202px", marginRight: "10px" }}
                                                    data-form="15"
                                                    data-id={r.recordid}
                                                    onClick={handleForm} >Complete Inquiry
                                                </FormButton>
                                            </div>
                                            <div>
                                                <FormButton
                                                    data-id={r.recordid}
                                                    onClick={handleUpload}
                                                    style={{ width: "202px" }}>Upload Completed Inquiry
                                                </FormButton>
                                            </div>
                                        </FormFlexRowStyle>
                                    }
                                </FormQualificationDataIconRight>
                            </FormQualificationDataIcon>
                        </FormQualification>
                    )
                })}
            </ModalFormBodyScroll>
            <ModalFormFooter style={{ justifyContent: "flex-end" }} busy={formState.busy}>
                <FormButton onClick={() => callback(false)}>Close</FormButton>
            </ModalFormFooter>
        </ModalFormScroll >
        {yesNo.message && <YesNo {...yesNo} />}
    </>)
}