import React, { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faInfo } from "@fortawesome/free-solid-svg-icons"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { DriverContext } from "../contexts/drivercontext"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll } from "../../../../../components/global/forms/forms"
import { FormFlexRowStyle } from "../../../../../components/portals/formstyles"
import { useGlobalContext } from "../../../../../global/contexts/globalcontext"
import { CircleBack, QualificationsContext } from "../classes/qualifications"
import { useRestApi } from "../../../../../global/hooks/apihook"
import { formatMoney, getApiUrl, getBubbleColor, getBubbleIcon } from "../../../../../global/globals"
import { PDFModalContainer } from "../../../../../components/portals/pdfviewer"
import { FormCheck } from "../../../../../components/portals/inputstyles"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { KBViewer } from "../classes/kbviewer"

const WarningContainer = styled.div`
width: "100%";
padding: 10px;
border: 1px dotted #FF6666;
background-color: #FFE6E6;
color: #333333;
font-size: 14px;
border-radius: 5px;
margin-left: 60px;
`
export const MVRReportForm = ({ callback }) => {
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const { fetchData } = useRestApi()
    const { sendFormData, formState } = useFormHook("mvrreport-form")
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })
    const [kbCard, setKbCard] = useState({ open: false, id: "" })
    const [mvrTotal, setMvrTotal] = useState(0)
    const [formOpen, setFormOpen] = useState(false)
    const [licenseList, setLicenseList] = useState([])

    const calcMvrBalance = () => {
        let balance = 0;
        licenseList.forEach(r => { if (r.checked) balance += parseInt(r.cost) })
        setMvrTotal(balance);
    }

    const handleKbLink = (id) => { setKbCard({ open: 1, id: id }) }

    const kblinkCallback = () => { setKbCard({ open: false, id: "" }) }

    const handleMVRToggle = (e) => {
        let newList = [...licenseList]
        let id = e.target.id
        const ndx = newList.findIndex(r => r.id === id)
        if (ndx > -1) newList[ndx].checked = e.target.checked
        setLicenseList(newList)
    }

    const handlePdf = async () => {
        let url = `${getApiUrl()}/driverdocs/fetch?id=${driverRecord["recordid"]}&type=fcra`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfCard({ open: true, data: pdfUrl })
    }

    const getMvrPrices = async () => {
        const res = await fetchData(`apiprofiles/fetch/price?driverid=${driverRecord.recordid}&apitype=MVR`, "GET")
        if (res.status === 200) {
            let newList = []
            driverRecord.license.forEach(r => {
                let newRec = {
                    id: r.recordid,
                    state: r.state,
                    licensenumber: r.licensenumber,
                    issued: r.issued,
                    expires: r.expires,
                    cost: res.data.find(q => q.id === r.recordid).cost,
                    checked: false
                }
                newList.push(newRec)
            })
            setLicenseList(newList)
            setFormOpen(true)
        }
    }

    console.log(driverRecord)



    const handleSubmit = async () => {
        let newList = licenseList.filter(r => r.checked).map(r => r.id)
        let data = new FormData()
        data.append("action", "mvrreport")
        data.append("entity", "account")
        data.append("driverid", driverRecord.recordid)
        data.append("licenses", JSON.stringify(newList))
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback({status:0})
        }
    }

    useEffect(() => { calcMvrBalance() }, [licenseList])

    useEffect(() => { getMvrPrices() }, [])

    return (<>
        <ModalFormScroll width="800px" height="690px">
            <ModalFormHeader title="Motor Vehicle Report" busy={formState.busy} />
            <ModalFormBodyScroll id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    Motor Vehicle Reports are provided by the state directly. If the state's system is down or slow, there will be
                    a delay in receiving the report. When you click <b>Run Motor Vehicle Report(s)</b> below, your account will be deducted the
                    amount for the selected MVRs. Once submitted, you can continue using the system while the report is fetched
                    from the state. Once the report has been returned to us, a notification will appear at the top of your
                    window and an email notification will be sent to the email addresses listed as the driver notice recipients
                    on the account preferences. In the event of an error, such as no record found, you are still charged for the
                    report as the state fees are still incurred. Below is a list of driver licenses on file for this driver. Please
                    select the licenses you wish to run reports for.
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
                <FormSection style={{ borderBottomColor: "#8ED9F6" }}>
                    {licenseList.map((r, rndx) => {
                        if (r.status == 1 && rndx > 0) return null
                        let paerror = false
                        let uterror = false
                        if (r.state === "Pennsylvania" && !globalState.account.paaaccesscode) paerror = true;
                        if (r.state === "Utah" && !globalState.account.utorigid) uterror = true;
                        return (
                            <div style={{ marginBottom: "10px" }} key={r.id}>
                                <div style={{ display: "flex", width: "100%", padding: "5px 0px" }}>
                                    <div style={{ width: "60px" }}>
                                        <CircleBack color={getBubbleColor(qualifications.mvrreport[rndx].status)} size="40px">
                                            <FontAwesomeIcon icon={getBubbleIcon(qualifications.mvrreport[rndx].status)} />
                                        </CircleBack>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div>
                                            <div style={{ color: "#164398" }}><strong>
                                                {r.state} License {r.licensenumber} Issued On {r.issued}, Expires On {r.expires}
                                            </strong></div>
                                            <div>{qualifications.mvrreport[rndx].text}</div>
                                            <div style={{ color: "#998200", fontWeight: 600 }}>{r.state} MVR Report Cost: {formatMoney(r.cost)}</div>
                                        </div>
                                    </div>
                                </div>
                                {(!paerror && !uterror)
                                    ? <div style={{ padding: "0px 0px 0px 60px" }}>
                                        <FormCheck
                                            id={r.id}
                                            value={r.checked || false}
                                            checked={r.checked}
                                            onChange={handleMVRToggle}
                                            label="Run MVR Report For This License"
                                            disabled={qualifications.mvrreport[rndx].status == 1 || qualifications.mvrreport[rndx].status == 4}
                                            data-ignore
                                        />
                                    </div>
                                    : <>
                                        <WarningContainer>
                                            {paerror && <>
                                                <p><b>STOP!</b> Pennsylvania requires you to have a <b>Pennsylvania Access Code</b></p>
                                                <p>Please refer to <Link to="#" onClick={(() => handleKbLink("paaccess"))}>this knowledgebase article</Link> to
                                                    set up your account for Pennsylvania MVRs.</p>
                                            </>}
                                            {uterror && <>
                                                <p><b>STOP!</b> Utah requires you to have a <b>Utah Organization ID</b></p>
                                                <p>Please refer to <Link to="#" onClick={(() => handleKbLink("utorgid"))}> this knowledgebase article</Link> to
                                                    set up your account for Utah MVRs.</p>
                                            </>}
                                        </WarningContainer>
                                    </>
                                }
                            </div>
                        )
                    })}
                </FormSection>
                <FormSection style={{ backgroundColor: "#E3F7FC", borderColor: "#8ED9F6" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "60px" }}>
                            <CircleBack color="blue" size="40px"><FontAwesomeIcon icon={faInfo} /></CircleBack>
                        </div>
                        <div style={{ flex: 1 }}>
                            If your account balance is below the MVR Report Cost, the system will automatically deposit funds
                            into your account based on the Auto Deposit Amount in your settings.
                        </div>
                    </div>
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                        <div style={{ width: "210px" }}><strong>MVR Report Cost:</strong></div>
                        <div style={{ width: "90px", textAlign: "right" }}>{formatMoney(mvrTotal)}</div>
                    </FormFlexRowStyle>
                    <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                        <div style={{ width: "210px" }}><strong>Current Account Balance:</strong></div>
                        <div style={{ width: "90px", textAlign: "right" }}>{parseFloat(globalState.tallies.accountbalance).toLocaleString('en-US', { style: 'currency', currency: "USD" })}</div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBodyScroll>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <FormButton disabled={mvrTotal === 0} onClick={handleSubmit}>{`Run MVR Report(s)`}</FormButton>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Close</FormButton></div>
            </ModalFormFooter>
        </ModalFormScroll >
        {
            pdfCard.open &&
            <PDFModalContainer
                source={`${pdfCard.data}`}
                title="Drug & Alcohol Clearinghouse Consent Form"
                height="800px"
                width="1000px"
                callback={() => setPdfCard({ open: false, data: "" })}
            />
        }
        {kbCard.open && <KBViewer id={kbCard.id} callback={kblinkCallback} dispatch={undefined} />}
    </>)
}