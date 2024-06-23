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
import { getBubbleColor, getBubbleIcon } from "../../global/globals"
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { FormRouterContext } from "./formroutercontext"


export const PSPReportForm = ({ callback }) => {
    const { globalState } = useGlobalContext()    
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { fetchData } = useRestApi()
    const { sendFormData, formState } = useFormHook("pspreport-form")
    const [pspPrice, setPspPrice] = useState()
    
    const getPSPPrice = async () => {
        const res = await fetchData("apiprofiles/fetch/price?apitype=PSP", "GET")
        if (res.status === 200) {
            setPspPrice(res.data.price)
    
        }
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "pspreport")
        data.append("entity", "account")
        data.append("driverid", driverRecord.recordid)
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback({ status: 0 })
        }
    }

    useEffect(() => { getPSPPrice() }, [])

    return (<>
        <ModalForm width="730px">
            <ModalFormHeader title="Run Pre-Employment Screening Program (PSP) Report" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px",marginBottom:"10px" }}>
                    Pre-Employment Screening Program (PSP) Reports are provided by the United States Department of Transporation
                    directly. If the DOT's system is down or slow, there will be a delay in receiving the report. When you click&nbsp;
                    <strong>Run PSP Report</strong> below, your account will be deducted the amount for the PSP Report. Once
                    submitted, you can continue using the system while the report is fetched from the DOT. Once the report
                    has been returned to us, a notification will appear at the top of your window and an email notification will
                    be sent to the email addresses listed as the driver notice recipients on the account preferences. In the event
                    of a no driver found response, you are still charged for the PSP as the DOT fees are still incurred.
                </FormSection>
                <FormQualification>
                    <FormQualificationDataIcon style={{ backgroundColor: "#E3F7FC", borderTop: "1px solid", borderColor: "#8ED9F6" }}>
                        <FormQualificationDataIconLeft>
                            <CircleBack color="blue" size="50px"><FontAwesomeIcon icon={faInfo} /></CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight style={{ padding: "10px 0px", fontSize: "12px", fontWeight: 600 }}>
                            If your account balance is below the PSP Report Cost, the system will automatically deposit funds
                            into your account based on the Auto Deposit Amount in your settings.
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
                <FormQualification>
                    <FormQualificationHeader title="Driver Pre-Emplyment Screening Report" />
                    <FormQualificationDataIcon style={{ padding: "10px 5px" }}>
                        <FormQualificationDataIconLeft>
                            <CircleBack color={getBubbleColor(qualifications.pspreport.status)} size="50px">
                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.pspreport.status)} />
                            </CircleBack>
                        </FormQualificationDataIconLeft>
                        <FormQualificationDataIconRight>
                            {qualifications.pspreport.text}
                        </FormQualificationDataIconRight>
                    </FormQualificationDataIcon>
                </FormQualification>
                <FormSection style={{ padding: "0px" }}></FormSection>
                <FormSection style={{ borderBottom: "none", paddingBottom: "0px" }}>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end", paddingRight: "5px" }}>
                        <div style={{ width: "210px" }}><strong>PSP Report Cost:</strong></div>
                        <div style={{ width: "90px", textAlign: "right" }}>{pspPrice}</div>
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
                        disabled={qualifications.pspreport.status == 1 || qualifications.pspreport.status == 4}
                        onClick={handleSubmit}>Run PSP Report
                    </FormButton>
                </div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Close</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    </>)
}




