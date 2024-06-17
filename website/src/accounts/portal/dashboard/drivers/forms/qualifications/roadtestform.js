import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../../global/hooks/formhook"
import { useContext, useState } from "react"
import { DriverContext } from "../../contexts/drivercontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../../components/portals/formstyles"
import { CircleBack, QualificationsContext } from "../../classes/qualifications"
import { getBubbleColor, getBubbleIcon } from "../../../../../../global/globals"
import { FormInput } from "../../../../../../components/portals/inputstyles"
import { PDFContext } from "../../../../../../global/contexts/pdfcontext"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { UploadFileForm } from "../../../../../../classes/uploadfileform"
import { RoadTestDocForm } from "./roadtestdocform"


export const RoadTestForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { viewDocument } = useContext(PDFContext)
    const { driverRecord } = useContext(DriverContext)
    const [filefields, setFileFields] = useState("")
    const { qualifications } = useContext(QualificationsContext)
    const { sendFormData, getValue, setFormBusy, formState } = useFormHook("pspreport-form")
    const [form, setForm] = useState({ form: "0", params: null })

    const handlePdf = async ({ target }) => {
        let rec = driverRecord.documents.find(r => r.typecode === target.getAttribute("data-id"))
        if (rec) viewDocument(rec.recordid, 'Good Faith Effort Driving Record Inquiry');
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("files[]", document.getElementById("uploadfile").files[0])
        data.append("typecode", "11")
        data.append("driverid", driverRecord.recordid)
        data.append("action", "upload")
        const res = await sendFormData("POST", data, "drivers")
        res.status === 200 && callback(res)
    }

    const handleSetForm = ({ target }) => {
        const formId = target.getAttribute("data-form")
        let params = {}
        if (formId == "3") {
            params = {
                description: `Copy Of Driver's License Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
                additional: `Copy Of Driver's Current Driver's License`,
                typecode: "16",
            }            
        }
        setForm({ form: formId, params: params })
    }

    const formCallback = () => { setForm({}) }

    return (<>
        <ModalForm width="670px">
            <ModalFormHeader title="Road Test Of Copy Of Driver's License Qualification" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    This qualification requires either a copy of the drivers license be valid and on file, or a road test be administered
                    and results entered into the program. &nbsp;
                    <Link to="https://www.ecfr.gov/current/title-49/section-391.31" target="_blank">FMCSA 49 CFR Part 391.31</Link> &&nbsp;
                    <Link to="https://www.ecfr.gov/current/title-49/section-391.33" target="_blank">FMCSA 49 CFR Part 391.33</Link>
                </FormSection>

                <FormSection>
                    <FormFlexRowStyle>
                        <div style={{ width: "60px" }}>
                            <CircleBack color={getBubbleColor(qualifications.dlcopy.status)} size="40px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.dlcopy.status)} />
                            </CircleBack>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div>
                                <div><strong>Copy Of Current Driver's License</strong></div>
                                <div>If using this option, a copy of the drivers license must be valid and on file. Please select the appropriate
                                    option below.
                                </div>
                            </div>
                        </div>
                    </FormFlexRowStyle>
                    <div style={{ paddingLeft: "60px", marginTop: "10px" }}>
                        {qualifications.dlcopy.status == 1
                            ? <FormButton data-id="16" onClick={handlePdf}>View Drivers License</FormButton>
                            : <FormButton data-form="3" onClick={handleSetForm}>Upload Copy Of Driver's License</FormButton>
                        }
                    </div>
                </FormSection>

                <FormSection>
                    <FormFlexRowStyle>
                        <div style={{ width: "60px" }}>
                            <CircleBack color={getBubbleColor(qualifications.roadtest.status)} size="40px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.roadtest.status)} />
                            </CircleBack>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div>
                                <div><strong>Road Test</strong></div>
                                <div>If using this option, a road test must be administered and the results entered into the
                                    program. Please select the appropriate option below.
                                </div>
                            </div>
                        </div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle style={{paddingLeft:"60px",marginTop:"10px"}}>
                        <div><FormButton data-form="1" onClick={handleSetForm}>Complete Road Test</FormButton></div>
                        <div><FormButton data-form="3" onClick={handleSetForm}>Upload Road Test</FormButton></div>
                        <div><FormButton data-id="33" onClick={handlePdf}>View Road Test Results</FormButton></div>
                    </FormFlexRowStyle>
                </FormSection>
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
        {form.form == "1" && <RoadTestDocForm callback={formCallback} params={form.params} />}
        {form.form == "3" && <UploadFileForm callback={formCallback} params={form.params} />}
    </>)
}




