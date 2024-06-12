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
import { getApiUrl, getBubbleColor, getBubbleIcon } from "../../../../../global/globals"
import { faCheck, faInfo } from "@fortawesome/free-solid-svg-icons"
import { PDFModalContainer } from "../../../../../components/portals/pdfviewer"


export const CDLISReportForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { fetchData } = useRestApi()
    const { sendFormData, formState } = useFormHook("pspreport-form")
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })
    const [cdlisPrice, setCdlisPrice] = useState()
    const [formOpen, setFormOpen] = useState(false)

    const getCDLISPrice = async () => {
        const res = await fetchData("apiprofiles/fetch/price?apitype=CDLIS", "GET")
        if (res.status === 200) {
            setCdlisPrice(res.data.price)
            setFormOpen(true)
        }
    }

    const handlePdf = async () => {
        let url = `${getApiUrl()}/driverdocs/fetch?id=${driverRecord["recordid"]}&type=fcra`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfCard({ open: true, data: pdfUrl })
    }

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "cdlisreport")
        data.append("entity", "account")
        data.append("driverid", driverRecord.recordid)
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback({status:0})
        }
    }

    useEffect(() => { getCDLISPrice() }, [])

    return (<>
        {formOpen && <>
            {!pdfCard.open
                ?
                <ModalForm width="720px">
                    <ModalFormHeader title="Run Commercial Driver's License Information Report" busy={formState.busy} />
                    <ModalFormBody id={formState.id} busy={formState.busy}>
                        <FormSection>
                            Commercial Driver's License Information System (CDLIS) Reports are provided by the United States
                            Department of Transporation directly. If the DOT's system is down or slow, there will be a delay
                            in receiving the report. When you click <b>Run CDLIS Report</b> below, your account will be deducted the
                            amount for the CDLIS Report. Once submitted, you can continue using the system while the report is
                            fetched from the DOT. Once the report has been returned to us, a notification will appear at the
                            top of your window and an email notification will be sent to the email addresses listed as the driver
                            notice recipients on the account preferences. In the event of a no driver found response, you are
                            still charged for the CDLIS report as the DOT fees are still incurred.
                        </FormSection>
                        <FormSection>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "60px" }}>
                                    <CircleBack color="green" size="40px"><FontAwesomeIcon icon={faCheck} /></CircleBack>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>
                                        <div><strong>FCRA Release</strong></div>
                                        <div>A Fair Credit Reporting Authorization is required before you can run an MVR.</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: "10px 0px 0px 60px" }}>
                                <FormButton onClick={handlePdf}>View Signed FCRA Authorization</FormButton>
                            </div>
                        </FormSection>
                        <FormSection>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "60px" }}>
                                    <CircleBack color={getBubbleColor(qualifications.cdlisreport.status)} size="40px">
                                        <FontAwesomeIcon icon={getBubbleIcon(qualifications.cdlisreport.status)} />
                                    </CircleBack>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>
                                        <div><strong>Driver CDLIS History</strong></div>
                                        <div>{qualifications.cdlisreport.text}</div>
                                    </div>
                                </div>
                            </div>
                        </FormSection>
                        <FormSection style={{ borderColor: "#8ED9F6" }}>
                            <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                                <div style={{ width: "210px" }}><strong>CDLIS Report Cost:</strong></div>
                                <div style={{ width: "90px", textAlign: "right" }}>{cdlisPrice}</div>
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
                                    If your account balance is below the CDLIS Report Cost, the system will automatically deposit funds
                                    into your account based on the Auto Deposit Amount in your settings.
                                </div>
                            </div>
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
                : <PDFModalContainer
                    source={`${pdfCard.data}`}
                    title="Drug & Alcohol Clearinghouse Consent Form"
                    height="800px"
                    width="1000px"
                    callback={() => setPdfCard({ open: false, data: "" })}
                />}
        </>}
    </>)
}