import React, { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { CircleBack, QualificationsContext } from "../../classes/qualifications"
import { getBubbleColor, getBubbleIcon } from "../../../../../../global/globals"
import styled from "styled-components"
import { UploadFileForm } from "../../../../../../classes/uploadfileform"
import { GoodFaithDocForm } from "./goodfaithdocform"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import { PDFContext } from "../../../../../../global/contexts/pdfcontext"

const LicenseContainer = styled.div`
width:100%;
border: 1px dotted #B6B6B6;
border-bottom: none;
`

const LicenseHeader = styled.div`
background-color: #3A3A3A;
color: #F2F2F2;
font-weight: 600;
padding:3px 10px;
`
const LicenseBody = styled.div`
color:#333;
background-color:#e6e6e6;
padding: 6px;
border-bottom: 1px dotted #B6B6B6;
`
const NotifyContainer = styled.div`
width:100%;
background-color: #e6ffe6;
border: 1px dotted #00b300;
border-radius:5px;
padding: 5px;
font-size: 14px;
font-weight:600;
`

export const GoodFaithForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { viewDocument } = useContext(PDFContext)
    const { driverRecord } = useContext(DriverContext)
    const { formState } = useFormHook("drivinginquiry-form")
    const { qualifications } = useContext(QualificationsContext)
    const [form, setForm] = useState({ form: "0", params: null })

    const handlePdf = async ({ target }) => {
        let rec = driverRecord.documents.find(r => r.typecode === "20" && r.driverslicenseid == target.getAttribute("data-id"))
        if (rec) viewDocument(rec.recordid, 'Good Faith Effort Driving Record Inquiry');
    }

    const handleUploadRequest = (licenseid, licensenumber, licensestate) => {
        const params = {
            description: `Good Faith Effort - Inquiry Into Driving Record For License ${licensenumber} Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
            additional: `Reference ${licensestate} License Number ${licensenumber}`,
            typecode: "20",
            licenseid: licenseid
        }
        setForm({ form: "3", params: params })
    }

    const handleSetForm = ({ target }) => {
        const formId = target.getAttribute("data-form")
        if (formId == "1" || formId == "2") {
            setForm({ form: formId, params: target.getAttribute("data-id") })
        }
    }

    const formCallback = () => { setForm({}) }

    return (<>

        <ModalFormScroll width="800px" height="690px">
            <ModalFormHeader title="Good Faith Effort Driving Record Inquiry" busy={formState.busy} />
            <ModalFormBodyScroll id="driver-inquiry" busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px", borderBottom: "none" }}>
                    The Good Faith Effort Inquiry Into Driving Record is only required when you have attempted to
                    obtain the driver's Motor Vehicle Report (MVR) and was unsuccessful for any reason. If you have
                    not attempted to obtain the MVR for this driver, you must do so first. This program can provide
                    the driver MVR by visiting the qualification page for the Inquiry Into Driving Record. If you
                    have indeed attempted to obtain the MVR and was unsuccessful, please continue below.
                </FormSection>
                {driverRecord.license.map((r, rndx) => {
                    if (r.status == 1 && rndx > 0) return null
                    return (
                        <LicenseContainer key={r.recordid} style={{ marginTop: rndx === 0 ? "0px" : "30px" }}>
                            <LicenseHeader>
                                {r.state} License {r.licensenumber} Issued On {r.issued}, Expires On {r.expires}
                            </LicenseHeader>
                            <LicenseBody>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {(qualifications.mvrreport[rndx].status === 0 || qualifications.mvrreport[rndx].status === 3)
                                        ? <div style={{ width: "60px" }}>
                                            <CircleBack color={getBubbleColor(qualifications.goodfaitheffort[rndx].status)} size="40px">
                                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.goodfaitheffort[rndx].status)} />
                                            </CircleBack>
                                        </div>
                                        : <div style={{ width: "60px" }}>
                                            <CircleBack color="blue" size="40px">
                                                <FontAwesomeIcon icon={faMinus} />
                                            </CircleBack>
                                        </div>
                                    }
                                    <div style={{ flex: 1 }}>
                                        <div>
                                            <div><h3>Good Faith Effort Document </h3></div>
                                            {(qualifications.mvrreport[rndx].status === 0 || qualifications.mvrreport[rndx].status === 3)
                                                ? <>{qualifications.goodfaitheffort[rndx].status == 1
                                                    ? <div>{qualifications.goodfaitheffort[rndx].text}</div>
                                                    : <div>Complete the Good Faith Effort document if you were unable to complete the
                                                        driving record inquiry for this license.</div>
                                                }
                                                </>
                                                : <NotifyContainer>
                                                    The MVR For This License Is On File Or Currently Pending
                                                </NotifyContainer>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {(qualifications.mvrreport[rndx].status === 0 || qualifications.mvrreport[rndx].status === 3) && <>
                                    {qualifications.goodfaitheffort[rndx].status == 0
                                        ? <FormFlexRowStyle style={{ marginTop: "10px", paddingLeft: "60px" }}>
                                            <div style={{ width: "188px" }}>
                                                <FormButton
                                                    data-form="1"
                                                    data-id={r.recordid}
                                                    onClick={handleSetForm}
                                                    style={{ width: "188px" }}>Complete Form
                                                </FormButton>
                                            </div>
                                            <div>
                                                <FormButton
                                                    style={{ width: "188px" }}
                                                    onClick={() => handleUploadRequest(r.recordid, r.licensenumber, r.state)}>Upload Completed Form
                                                </FormButton>
                                            </div>
                                        </FormFlexRowStyle>
                                        : <div style={{ marginTop: "10px", paddingLeft: "60px" }}>
                                            <FormButton
                                                data-id={r.recordid}
                                                style={{ width: "188px" }}
                                                onClick={handlePdf}>View Document
                                            </FormButton>
                                        </div>
                                    }
                                </>}
                            </LicenseBody>
                        </LicenseContainer>
                    )
                })}
            </ModalFormBodyScroll>
            <ModalFormFooter style={{ justifyContent: "flex-end" }} busy={formState.busy}>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Close</FormButton></div>
            </ModalFormFooter>
        </ModalFormScroll >
        {form.form == "1" && <GoodFaithDocForm licenseid={form.params} callback={formCallback} />}
        {form.form == "3" && <UploadFileForm callback={formCallback} params={form.params} />}
    </>)
}