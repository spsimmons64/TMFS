import { Link } from "react-router-dom"
import { CircleBack, QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { useContext, useState } from "react"
import { FormQualification, FormQualificationDataIcon, FormQualificationDataIconLeft, FormQualificationDataIconRight, FormQualificationHeader, FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../components/portals/formstyles"
import { getBubbleColor, getBubbleIcon } from "../../global/globals"
import { FormInput } from "../../components/portals/inputstyles"
import { PDFContext } from "../../global/contexts/pdfcontext"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { FormRouterContext } from "./formroutercontext"

export const ApplicationForm = ({ callback }) => {
    const { globalState } = useGlobalContext();
    const { openForm, closeForm } = useContext(FormRouterContext);
    const { viewDocument } = useContext(PDFContext)
    const { driverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { sendFormData, getValue, setFormBusy, formState } = useFormHook("pspreport-form")

    const handleUpload  = ({target}) => {        
        const formId = target.getAttribute("data-id")        
        if(formId){            
            const formparams = {
                description: `Application For Employment Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
                additional: `Reference Driver ${driverRecord.firstname} ${driverRecord.lastname}`,
                typecode: formId,                
                callbackid: 13,
                callbackparams: {},
                callback: callback
            }            
            openForm(12,formparams)            
        }
    }

    const handlePdf = async () => {
        let rec = driverRecord.documents.find(r => r.typecode === "11");
        if (rec) viewDocument(rec.recordid, 'Proper "DOT" Application Qualification');
    }

    return (
        <ModalForm width="600px">
            <ModalFormHeader title='Proper "DOT" Application Qualification' busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px", marginBottom: "10px" }}>
                    This qualification requires that a proper DOT application be in the driver's file. If the driver
                    did not complete the online application, you will need to manually upload the completed application.
                    If you manually upload the application, you must ensure it is DOT compliant following the regulations
                    found at <Link to="https://www.ecfr.gov/current/title-49/section-391.21" target="_blank">FMCSA 49 CFR Part 391.21</Link>.
                </FormSection>
                <FormQualification style={{ marginBottom: "0px" }}>
                    <FormQualificationHeader title="Driver Application" />
                    <FormQualificationDataIcon>
                        <FormQualificationDataIconLeft>
                            <CircleBack color={getBubbleColor(qualifications.application.status)} size="50px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.application.status)} />
                            </CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight>
                            <div>Completed On 05/24/2024</div>
                            <div style={{ marginTop: "5px" }}>
                                <FormButton data-id="11" onClick={handleUpload}>Upload Application</FormButton>                                
                                {qualifications.application.status == 1 &&
                                    <FormButton style={{marginLeft:"10px"}} onClick={handlePdf}>View Application</FormButton>
                                }
                            </div>
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }} busy={formState.busy}>
                <FormButton onClick={() => callback(false)}>Close</FormButton>
            </ModalFormFooter>
        </ModalForm>
    )
}




