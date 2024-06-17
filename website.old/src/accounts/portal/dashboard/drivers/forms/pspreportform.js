import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect, useState } from "react"
import { DriverContext } from "../contexts/drivercontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../global/contexts/globalcontext"
import { CircleBack, QualificationsContext } from "../classes/qualifications"
import { useRestApi } from "../../../../../global/hooks/apihook"
import { getBubbleColor, getBubbleIcon } from "../../../../../global/globals"
import { faInfo } from "@fortawesome/free-solid-svg-icons"


export const PSPReportForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { fetchData } = useRestApi()
    const { sendFormData, formState } = useFormHook("pspreport-form")
    const [pspPrice, setPspPrice] = useState()
    const [formOpen, setFormOpen] = useState(false)

    const getPSPPrice = async () => {
        const res = await fetchData("apiprofiles/fetch/price?apitype=PSP", "GET")
        if (res.status === 200) {
            setPspPrice(res.data.price)
            setFormOpen(true)
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
            callback({status:0})
        }
    }

    useEffect(() => { getPSPPrice() }, [])

    return (<>
        {formOpen &&
            <ModalForm width="720px">
                <ModalFormHeader title="Run Pre-Employment Screening Program (PSP) Report" busy={formState.busy} />
                <ModalFormBody id={formState.id} busy={formState.busy}>
                    <FormSection>
                        Pre-Employment Screening Program (PSP) Reports are provided by the United States Department of Transporation
                        directly. If the DOT's system is down or slow, there will be a delay in receiving the report. When you click&nbsp;
                        <strong>Run PSP Report</strong> below, your account will be deducted the amount for the PSP Report. Once
                        submitted, you can continue using the system while the report is fetched from the DOT. Once the report
                        has been returned to us, a notification will appear at the top of your window and an email notification will
                        be sent to the email addresses listed as the driver notice recipients on the account preferences. In the event
                        of a no driver found response, you are still charged for the PSP as the DOT fees are still incurred.
                    </FormSection>
                    <FormSection>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "60px" }}>
                                <CircleBack color={getBubbleColor(qualifications.pspreport.status)} size="40px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.pspreport.status)} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div>
                                    <div><strong>Driver PSP History</strong></div>
                                    <div>{qualifications.pspreport.text}</div>
                                </div>
                            </div>
                        </div>
                    </FormSection>
                    <FormSection style={{borderColor: "#8ED9F6"}}>
                        <FormFlexRowStyle style={{ justifyContent: "flex-end"}}>
                            <div style={{ width: "210px" }}><strong>PSP Report Cost:</strong></div>
                            <div style={{ width: "90px", textAlign: "right" }}>{pspPrice}</div>
                        </FormFlexRowStyle>
                        <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                            <div style={{ width: "210px" }}><strong>Current Account Balance:</strong></div>
                            <div style={{ width: "90px", textAlign: "right" }}>{parseFloat(globalState.tallies.accountbalance).toLocaleString('en-US', { style: 'currency', currency: "USD" })}</div>
                        </FormFlexRowStyle>
                    </FormSection>
                    <FormSection style={{ backgroundColor: "#E3F7FC", borderColor: "#8ED9F6" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "60px" }}>
                                <CircleBack color="blue" size="40px"><FontAwesomeIcon icon={faInfo} /></CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                If your account balance is below the PSP Report Cost, the system will automatically deposit funds
                                into your account based on the Auto Deposit Amount in your settings.
                            </div>
                        </div>
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
        }
    </>)
}




