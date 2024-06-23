import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { useContext, useEffect, useState } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormQualification, FormQualificationDataIcon, FormQualificationDataIconLeft, FormQualificationDataIconRight, FormQualificationHeader, FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../components/portals/formstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { CircleBack, QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import { useRestApi } from "../../global/hooks/apihook"
import { getApiUrl, getBubbleColor, getBubbleIcon } from "../../global/globals"
import { faCheck, faInfo } from "@fortawesome/free-solid-svg-icons"

import { PDFContext } from "../../global/contexts/pdfcontext"
import { FormRouterContext } from "./formroutercontext"


export const CDLISReportForm = ({ callback }) => {
    const { viewDocument } = useContext(PDFContext)
    const { openForm } = useContext(FormRouterContext);
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { fetchData } = useRestApi()
    const { sendFormData, formState } = useFormHook("pspreport-form")
    const [cdlisPrice, setCdlisPrice] = useState()
    const [formOpen, setFormOpen] = useState(false)

    const getCDLISPrice = async () => {
        const res = await fetchData("apiprofiles/fetch/price?apitype=CDLIS", "GET")
        if (res.status === 200) {
            setCdlisPrice(res.data.price)
            setFormOpen(true)
        }
    }

    const handleUpload  = ({target}) => {
        const formparams = {
            description: `Commercial Driver's License Information Report Uploaded By ${globalState.user.firstname} ${globalState.user.lastname}`,
            additional: `CDLIS Report For Driver ${driverRecord.firstname} ${driverRecord.lastname}`,
            typecode: "15",
            callbackid: 11,
            callbackparams: {},
            callback: callback
        }
        openForm(12,formparams)                    
    }    

    const handlePdf = async ({ target }) => {
        let typecode = target.getAttribute("data-id")
        let rec = driverRecord.documents.find(r => r.typecode === typecode);
        if (rec) viewDocument(rec.recordid, 'Drug & Alcohol Clearinghouse Qualification');
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "cdlisreport")
        data.append("entity", "account")
        data.append("driverid", driverRecord.recordid)
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback({ status: 0 })
        }
    }

    useEffect(() => { getCDLISPrice() }, [])

    return (
        <ModalForm width="730px">
            <ModalFormHeader title="Run Commercial Driver's License Information Report" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ marginBottom: "10px", paddingTop:"0px" }}>
                    Commercial Driver's License Information System (CDLIS) Reports are provided by the United States
                    Department of Transporation directly. If the DOT's system is down or slow, there will be a delay
                    in receiving the report. When you click <b>Run CDLIS Report</b> below, your account will be deducted the
                    amount for the CDLIS Report. Once submitted, you can continue using the system while the report is
                    fetched from the DOT. Once the report has been returned to us, a notification will appear at the
                    top of your window and an email notification will be sent to the email addresses listed as the driver
                    notice recipients on the account preferences. In the event of a no driver found response, you are
                    still charged for the CDLIS report as the DOT fees are still incurred.
                </FormSection>
                <FormQualification>
                    <FormQualificationDataIcon style={{ backgroundColor: "#E3F7FC", borderTop: "1px solid", borderColor: "#8ED9F6" }}>
                        <FormQualificationDataIconLeft>
                            <CircleBack color="blue" size="50px"><FontAwesomeIcon icon={faInfo} /></CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight style={{ padding: "10px 0px", fontSize: "12px", fontWeight: 600 }}>
                            If your account balance is below the CDLIS Report Cost, the system will automatically deposit funds
                            into your account based on the Auto Deposit Amount in your settings.
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
                <FormQualification>
                    <FormQualificationHeader title="Fair Credit Reporting Authorization Release" />
                    <FormQualificationDataIcon>
                        <FormQualificationDataIconLeft>
                            <CircleBack color="green" size="50px"><FontAwesomeIcon icon={faCheck} /></CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight>
                            A Fair Credit Reporting Authorization is required before you can run a CDLIS Report.
                            <div style={{ margin: "5px 0px" }}>
                                <FormButton style={{width:"235px"}} data-id="41" onClick={handlePdf}>View Signed FCRA Authorization</FormButton>
                            </div>
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
                <FormQualification>
                    <FormQualificationHeader title="Commercial Driver's License Information Report" />
                    <FormQualificationDataIcon style={{ padding: "10px 5px" }}>
                        <FormQualificationDataIconLeft>
                            <CircleBack color={getBubbleColor(qualifications.cdlisreport.status)} size="50px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.cdlisreport.status)} />
                            </CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight>                            
                            {qualifications.cdlisreport.text}
                            <FormFlexRowStyle style={{ margin: "5px 0px" }}>
                                {qualifications.cdlisreport.status==1 &&                                 
                                    <FormButton data-id="15" style={{marginRight:"10px", width:"235px"}}  onClick={handlePdf}>View CDLIS Report</FormButton>
                                }
                                <FormButton style={{width:"235px"}}  onClick={handleUpload}>Upload CDLIS Report</FormButton>
                            </FormFlexRowStyle>
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
                <FormSection style={{ padding: "0px" }}></FormSection>
                <FormSection style={{ borderBottom: "none",paddingBottom:"0px" }}>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end", paddingRight: "5px" }}>
                        <div style={{ width: "210px" }}><strong>CDLIS Report Cost:</strong></div>
                        <div style={{ width: "90px", textAlign: "right" }}>{cdlisPrice}</div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end", paddingRight: "5px" }}>
                        <div style={{ width: "210px" }}><strong>Current Account Balance:</strong></div>
                        <div style={{ width: "90px", textAlign: "right" }}>{parseFloat(globalState.tallies.accountbalance).toLocaleString('en-US', { style: 'currency', currency: "USD" })}</div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div>
                    <FormButton
                        disabled={qualifications.cdlisreport.status == 1 || qualifications.cdlisreport.status == 4}
                        onClick={handleSubmit}>Run CDLIS Report
                    </FormButton>
                </div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Close</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}