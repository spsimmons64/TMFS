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


export const GoodFaithEffortForm = ({ callback }) => {
    const mousePos = useMousePosition()
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
        let rec = driverRecord.documents.find(r => r.typecode === "22" && r.driverslicenseid == id)
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

    const handleYesNo = ({ target }) => {                
        setYesNo({
            message: "Are you sure you want to start a new driver inquiry?",
            licenseid: target.getAttribute("data-id"),
            left: mousePos.x,
            top: mousePos.y,
            callback: yesNoCallback
        })        
    }

    const yesNoCallback = (resp,data={}) => {           
        if(resp){            
            setForm({form:"1",params:data.licenseid})
        } else {
            setForm({form:"",params:null})
        }        
        setYesNo({})    
    }

    const handleUploadRequest = (uploadtype, licenseid, licensenumber, licensestate) => {
        let params = {}
        if (uploadtype === "inq") {
            params = {
                description: `Inquiry Into Driving Record For License ${licensenumber} Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
                additional: `Reference ${licensestate} License Number ${licensenumber}`,
                typecode: "22",
                licenseid: licenseid
            }
        }
        if (uploadtype === "mvr") {
            params = {
                description: `Motor Vehicle Report (MVR) For License ${licensenumber} Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
                additional: `Reference ${licensestate} License Number ${licensenumber}`,
                typecode: "25",
                licenseid: licenseid
            }
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
                <ModalFormHeader title="Inquiry Into Driving Record Qualification" busy={formState.busy} />
                <ModalFormBodyScroll id="driver-inquiry" busy={formState.busy}>
                    <FormSection style={{ paddingTop: "0px", borderBottom: "none" }}>
                        This qualification requires the completed and signed Driving Record Inquiry form AND a Motor Vechicle Report (MVR)
                        be ran/uploaded for each license the driver has held in the last 3 years. We can handle both of these tasks for you.
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
                                        <div style={{ width: "60px" }}>
                                            <CircleBack color={getBubbleColor(qualifications.drivinginquiry[rndx].status)} size="40px">
                                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.drivinginquiry[rndx].status)} />
                                            </CircleBack>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div>
                                                <div><h3>Driving Record Inquiry Form</h3></div>
                                                {qualifications.drivinginquiry[rndx].status == 1
                                                    ? <div>{qualifications.drivinginquiry[rndx].text}</div>
                                                    : <div>You must complete and sign the Driving Record Inquiry form pertaining
                                                        to this license. Please select the appropriate option below.</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <FormFlexRowStyle style={{ marginTop: "10px" }}>
                                        <div style={{ width: "54px" }}></div>
                                        {qualifications.drivinginquiry[rndx].status == 1
                                            ? <>
                                                <div><FormButton
                                                    style={{ width: "202px" }} data-id={r.recordid} onClick={handlePdf} >View Driver Record Inquiry
                                                </FormButton>
                                                </div>
                                                <div>
                                                    <FormButton
                                                        data-id = {r.recordid}
                                                        onClick={handleYesNo}
                                                        style={{ width: "202px" }}>Start New Inquiry
                                                    </FormButton>
                                                </div>
                                            </>
                                            : <>
                                                <div>
                                                    <FormButton
                                                        data-form="1"
                                                        data-id={r.recordid}
                                                        onClick={handleSetForm}
                                                        style={{ width: "202px" }}>Complete Form
                                                    </FormButton>
                                                </div>
                                                <div>
                                                    <FormButton
                                                        style={{ width: "202px" }}
                                                        onClick={() => handleUploadRequest("inq", r.recordid, r.licensenumber, r.state)}>Upload Completed Form
                                                    </FormButton>
                                                </div>
                                            </>
                                        }
                                    </FormFlexRowStyle>
                                </LicenseBody>
                                {(qualifications.mvrreport[rndx].status == 0 && qualifications.drivinginquiry[rndx].status == 1) &&
                                    <LicenseBody>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div style={{ width: "60px" }}>
                                                <CircleBack color={getBubbleColor(qualifications.mvrreport[rndx].status)} size="40px">
                                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.mvrreport[rndx].status)} />
                                                </CircleBack>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div>
                                                    <div><h3>Motor Vehicle Report</h3></div>
                                                    <div>You must run a state Motor Vehicle Report (MVR) for the license. Please
                                                        select the appropriate option below.</div>
                                                </div>
                                            </div>                                            
                                        </div>
                                        <div style={{fontSize:"12px",color:"#164398",padding:"10px 0px 10px 60px"}}>
                                            Note: Please complete the Good Faith Effort document if unable to obtain the driving record.
                                        </div>
                                        <FormFlexRowStyle style={{ marginTop: "10px" }}>
                                            <div style={{ width: "54px" }}></div>
                                            <div><FormButton
                                                data-form="2"
                                                data-id={r.recordid}
                                                onClick={handleSetForm}
                                                style={{ width: "202px" }}>Run MVR</FormButton></div>
                                            <div>
                                                <FormButton
                                                    onClick={() => handleUploadRequest("mvr", r.recordid, r.licensenumber, r.state)}
                                                    style={{ width: "202px" }}>Upload MVR Report
                                                </FormButton>
                                            </div>
                                        </FormFlexRowStyle>
                                    </LicenseBody>
                                }
                            </LicenseContainer>
                        )
                    })}
                </ModalFormBodyScroll>
                <ModalFormFooter style={{ justifyContent: "flex-end" }} busy={formState.busy}>
                    <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Close</FormButton></div>
                </ModalFormFooter>
            </ModalFormScroll >
        }
        {yesNo.message && <YesNo {...yesNo}/>}
        {pdfCard.open && <PDFModalContainer
            source={`${pdfCard.data}`}
            title="Inquiry Into Driving Record"
            height="800px"
            width="1000px"
            callback={() => setPdfCard({ open: false, data: "" })}
        />
        }
        {form.form == "1" && <DriverInquiryLetterForm licenseid={form.params} callback={formCallback} />}
        {form.form == "2" && <MVRReportForm callback={formCallback} />}
        {form.form == "3" && <UploadFileForm callback={formCallback} params={form.params} />}
    </>)
}