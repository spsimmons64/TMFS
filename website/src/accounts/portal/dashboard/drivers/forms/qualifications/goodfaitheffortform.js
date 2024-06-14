import React, { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { CircleBack, QualificationsContext } from "../../classes/qualifications"
import { getApiUrl, getBubbleColor, getBubbleIcon } from "../../../../../../global/globals"
import { PDFModalContainer } from "../../../../../../components/portals/pdfviewer"
import { MVRReportForm } from "../mvrreoportform"
import { DriverInquiryLetterForm } from "./driverinquiryletterform"
import styled from "styled-components"
import { UploadFileForm } from "../../../../../../classes/uploadfileform"
import { YesNo } from "../../../../../../components/portals/yesno"
import { useMousePosition } from "../../../../../../global/hooks/usemousepos"
import { GoodFaithDocForm } from "./goodfaithdocform"
import { faMinus } from "@fortawesome/free-solid-svg-icons"

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


export const GoodFaithEffortForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, getValue, setFormBusy, formState } = useFormHook("drivinginquiry-form")
    const { qualifications } = useContext(QualificationsContext)
    const [currForm, setCurrForm] = useState(true)
    const [form, setForm] = useState({ form: "0", params: null })
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })
    const [yesNo, setYesNo] = useState({})


    const handlePdf = async ({ target }) => {
        setFormBusy(true)
        const id = target.getAttribute("data-id")
        let rec = driverRecord.documents.find(r => r.typecode === "20" && r.driverslicenseid == id)
        if (rec) {
            let url = `${getApiUrl()}/driverdocs/fetch?id=${rec.recordid}`
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
            const response = await fetch(url, headers);
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setPdfCard({ open: true, data: pdfUrl })
        }
        setFormBusy(false)
    }

    const handleUploadRequest = (licenseid, licensenumber, licensestate) => {
        const params = {
            description: `Good Faith Effort - Inquiry Into Driving Record For License ${licensenumber} Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
            additional: `Reference ${licensestate} License Number ${licensenumber}`,
            typecode: "20",
            licenseid: licenseid
        }
        setForm({ form: "3", params: params })
        setCurrForm(false)
    }

    const handleSetForm = ({ target }) => {
        const formId = target.getAttribute("data-form")
        if (formId == "1" || formId == "2") {
            setForm({ form: formId, params: target.getAttribute("data-id") })
        }
        setCurrForm(false)
    }

    const formCallback = () => {
        setCurrForm(true)
        setForm({})
    }

    return (<>
        {currForm &&
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
        }
        {yesNo.message && <YesNo {...yesNo} />}
        {
            pdfCard.open && <PDFModalContainer
                source={`${pdfCard.data}`}
                title="Good Faith Effort - Inquiry Into Driving Record"
                height="800px"
                width="1000px"
                callback={() => setPdfCard({ open: false, data: "" })}
            />
        }
        {form.form == "1" && <GoodFaithDocForm licenseid={form.params} callback={formCallback} />}
        {form.form == "3" && <UploadFileForm callback={formCallback} params={form.params} />}
    </>)
}