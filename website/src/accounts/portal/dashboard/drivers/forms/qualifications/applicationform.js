import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { useContext, useState } from "react"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../../components/portals/formstyles"
import { CircleBack, QualificationsContext } from "../../classes/qualifications"
import { getApiUrl, getBubbleColor, getBubbleIcon } from "../../../../../../global/globals"
import { FormInput } from "../../../../../../components/portals/inputstyles"
import { PDFModalContainer } from "../../../../../../components/portals/pdfviewer"
import { PDFContext } from "../../../../../../global/contexts/pdfcontext"


export const QualApplicationForm = ({ callback }) => {
    const { viewDocument } = useContext(PDFContext)
    const { driverRecord } = useContext(DriverContext)
    const [filefields, setFileFields] = useState("")
    const { qualifications } = useContext(QualificationsContext)
    const { sendFormData, getValue, setFormBusy, formState } = useFormHook("pspreport-form")
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("files[]", document.getElementById("uploadfile").files[0])
        data.append("typecode", "11")
        data.append("driverid", driverRecord.recordid)
        data.append("action", "upload")
        const res = await sendFormData("POST", data, "drivers")
        res.status === 200 && callback(res)
    }

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            setFileFields(filename)
        }
    }

    const handlePdf = async () => {        
        let rec = driverRecord.documents.find(r => r.typecode === "11");
        if (rec) viewDocument(rec.recordid, 'Proper "DOT" Application Qualification');
    }

    return (<>
        <input id="uploadfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <ModalForm width="600px">
            <ModalFormHeader title='Proper "DOT" Application Qualification' busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    This qualification requires that a proper DOT application be in the driver's file. If the driver
                    did not complete the online application, you will need to manually upload the completed application.
                    If you manually upload the application, you must ensure it is DOT compliant following the regulations
                    found at <Link to="https://www.ecfr.gov/current/title-49/section-391.21" target="_blank">FMCSA 49 CFR Part 391.21</Link>.
                </FormSection>
                <FormSection style={{ borderBottom: qualifications.application.status == 1 ? "none" : "1px dotted #B6B6B6" }}>
                    <FormFlexRowStyle>
                        <div style={{ width: "60px" }}>
                            <CircleBack color={getBubbleColor(qualifications.application.status)} size="40px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.application.status)} />
                            </CircleBack>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div>
                                <div><strong>Driver DOT Application</strong></div>
                                <div>Completed On 05/24/2024</div>
                            </div>
                        </div>
                    </FormFlexRowStyle>
                    <div style={{ paddingLeft: "60px",marginTop:"10px" }}>
                        <FormButton hidden={qualifications.application.status == 0} onClick={handlePdf}>View Application</FormButton>
                    </div>
                </FormSection>
                {qualifications.application.status == 0 &&
                    <FormSection style={{ borderBottom: "none", marginBottom: "0px" }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 1 }}><FormInput value={filefields} readOnly hideerror /></div>
                            <div style={{ paddingLeft: "10px" }}>
                                <FormButton onClick={() => document.getElementById('uploadfile').click()}>Select File</FormButton>
                            </div>
                        </div>
                    </FormSection>
                }
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }} busy={formState.busy}>
                {qualifications.application.status == 0 &&
                    <FormButton disabled={filefields === ""} onClick={handleSubmit}>Upload Application</FormButton>
                }
                <FormButton style={{ width: "150px", marginLeft: "10px" }} onClick={() => callback(false)}>
                    {qualifications.application.status == 0 ? "Cancel" : "Close"}
                </FormButton>

            </ModalFormFooter>
        </ModalForm>
    </>)
}




