
import { FormFlexRowStyle, FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect, useState } from "react"
import { FormCheck, FormDate, FormInput } from "../../../../../components/portals/inputstyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { checkDate, getApiUrl, getBubbleColor, getBubbleIcon, toSimpleDate } from "../../../../../global/globals"
import { DriverContext } from "../contexts/drivercontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"
import { CircleBack, QualificationsContext } from "../classes/qualifications"
import { PDFModalContainer } from "../../../../../components/portals/pdfviewer"
import styled from "styled-components"


const CustomCheckContainer = styled.div`
background-color: #E3F7FC;
border: 1px solid #8ED9F6;
padding: 5px;
border-radius: 5px;
margin: 0px auto;
`

export const ClearinghouseForm = ({ callback }) => {
    const { sendFormData, setValue, getValue, getError, handleChange, serializeFormData, formState, formControls, setFormErrors } = useFormHook("clearinghouse-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const [filefields, setFileFields] = useState("")
    const [formLoaded, setFormLoaded] = useState(false)
    const [chStatus, setChStatus] = useState(driverRecord.dates.clearinghousestatus)
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })
    const [completeOpen, setCompleteOpen] = useState(false)

    const handlePdf = async ({ target }) => {
        const rec = driverRecord.documents.find(r=>r.typecode === "39")
        console.log(rec)
        if(rec){
            let url = `${getApiUrl()}/driverdocs/fetch?id=${rec.recordid}`
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
            const response = await fetch(url, headers);
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setPdfCard({ open: true, data: pdfUrl })
        }
    }

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            setFileFields(filename)
        }
    }

    const handleFMCSA = () => {
        setFormErrors({})
        setValue("completedate", toSimpleDate(new Date()))
        window.open('https://clearinghouse.fmcsa.dot.gov/', '_blank')
    }

    const handleValidate = () => {
        let errors = {}        
        if (!checkDate(getValue("completedate"))) errors["completedate"] = "Invalid Date Field"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if (handleValidate()) {
            let data = serializeFormData()
            data.append("files[]", document.getElementById("uploadfile").files[0])
            data.append("action", "clearinghouse")
            data.append("typecode", "40")
            data.append("entity", "account")
            data.append("driverid", driverRecord.recordid)
            data.append("chexempt", getValue("chexempt"))
            data.append("completedate", getValue("completedate"))
            data.append("chremovesafety", getValue("chremovesafety"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback({status:0})
            }
        }
    }

    useEffect(() => {
        if (!formLoaded) setFormLoaded(true);
        if (getValue("chexempt") == "Y") setCompleteOpen(true);
    }, [getValue("chexempt")])

    useEffect(() => {
        setValue("chexempt", driverRecord.chexempt)
        setValue("chremovesafety", driverRecord.chremovesafety)
        setValue("completedate", "")
    }, [driverRecord])

    
    return (<>
        {formLoaded && <>
            <input id="uploadfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
            {!pdfCard.open
                ? <ModalForm width="660px">
                    <ModalFormHeader title="Drug & Alcohol Clearinghouse Qualification" busy={formState.busy} />
                    <ModalFormBody id={formState.id} busy={formState.busy}>
                        <FormSection>
                            This qualification requires that you keep a signed driver consent form and perform a pre-employment and annual
                            query with the FMCSA Drug & Alcohol Clearinghouse.
                        </FormSection>
                        <FormSection>
                            <CustomCheckContainer>
                                <FormCheck
                                    id="chexempt"
                                    value={getValue("chexempt")}
                                    checked={getValue("chexempt") == "Y" ? true : false}
                                    onChange={handleChange}
                                    style={{ fontSize: "14px", fontWeight: 600 }}
                                    label="THIS DRIVER IS EXEMPT FROM THE DRUG & ALCOHOL CLEARINGHOUSE QUALIFICATION"
                                    data-ignore
                                >
                                </FormCheck>
                            </CustomCheckContainer>
                        </FormSection>
                        <FormSection style={{ borderBottom: getValue("chexempt") == "Y" ? "none" : "1px dotted #B6B6B6" }}>
                            <div style={{ display: "flex", width: "100%", padding: "10px 0px" }}>
                                <div style={{ width: "60px" }}>
                                    <CircleBack color="green" size="40px"><FontAwesomeIcon icon={faCheck} /></CircleBack>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>
                                        <div><strong>Signed Limited Query Consent</strong></div>
                                        <div>You must keep a signed consent form by the driver for a limited query.</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: "60px" }}>
                                <FormButton style={{ width: "168px" }} onClick={handlePdf}>View Signed Consent</FormButton>
                            </div>
                        </FormSection>
                        {getValue("chexempt") == "N" && <>
                            {driverRecord.driverstatus == "Pending" &&
                                <FormSection style={{ borderBottom: (!completeOpen && qualifications.chpreemployment.status == 0) ? "none" : "1px dotted #B6B6B6" }}>
                                    <div style={{ display: "flex", width: "100%", padding: "10px 0px" }}>
                                        <div style={{ width: "60px" }}>
                                            <CircleBack color={getBubbleColor(qualifications.chpreemployment.status)} size="40px">
                                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.chpreemployment.status)} />
                                            </CircleBack>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div>
                                                <div><strong>Pre-Employment Query</strong></div>
                                                <div>{qualifications.chpreemployment.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {qualifications.chpreemployment.status === 0 &&
                                        <FormFlexRowStyle style={{ marginTop: "10px 0px", paddingLeft: "60px" }}>
                                            <div>
                                                <FormButton onClick={handleFMCSA}
                                                >Submit Pre-Employment Query
                                                </FormButton>
                                            </div>
                                            <div>
                                                <FormButton onClick={() => setCompleteOpen(true)}
                                                >Mark As Completed
                                                </FormButton>
                                            </div>
                                        </FormFlexRowStyle>
                                    }
                                </FormSection>
                            }
                            {qualifications.chpreemployment.status == 1 &&
                                <FormSection style={{ borderBottom: !completeOpen ? "none" : "1px dotted #B6B6B6" }}>
                                    <div style={{ display: "flex", width: "100%", padding: "10px 0px" }}>
                                        <div style={{ width: "60px" }}>
                                            <CircleBack color={getBubbleColor(qualifications.clearinghouse.status)} size="40px">
                                                <FontAwesomeIcon icon={getBubbleIcon(qualifications.clearinghouse.status)} />
                                            </CircleBack>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div>
                                                <div><strong>Annual Query</strong></div>
                                                <div>{qualifications.clearinghouse.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <FormFlexRowStyle style={{ marginTop: "10px 0px", paddingLeft: "60px" }}>
                                        <div>
                                            <FormButton style={{ width: "168px" }} onClick={handleFMCSA}
                                            >Submit Annual Query
                                            </FormButton>
                                        </div>
                                        <div>
                                            <FormButton style={{ width: "168px" }} onClick={() => setCompleteOpen(true)}
                                            >Mark As Completed
                                            </FormButton>
                                        </div>
                                    </FormFlexRowStyle>
                                </FormSection>
                            }
                        </>}
                        {completeOpen && <>
                            {getValue("chexempt") === "N" &&
                                <FormSection style={{ paddingLeft: "10px" }}>
                                    <FormCheck
                                        id="chremovesafety"
                                        value={getValue("chremovesafety")}
                                        checked={getValue("chremovesafety") == "Y" ? true : false}
                                        onChange={handleChange}
                                        label="Driver Must Be Removed From Safety-Sensitive Functions"
                                        data-ignore
                                    />
                                </FormSection>
                            }
                            <FormSection style={{ borderBottom: "none" }}>
                                <FormTopLabel>Date Completed</FormTopLabel>
                                <FormDate
                                    id="completedate"
                                    value={getValue("completedate") || " "}
                                    error={getError("completedate")}
                                    onChange={handleChange}
                                    data-ignore
                                />
                                {getValue("chexempt") === "N" &&
                                    <FormFlexRowStyle>
                                        <div style={{ flex: 1, paddingRight: "10px" }}>
                                            <FormTopLabel>Drug & Alcohol Clearinghouse Report</FormTopLabel>
                                            <FormInput
                                                id="filefields"
                                                value={filefields}
                                                hideerror
                                            />
                                        </div>
                                        <div style={{ alignSelf: "flex-end" }}>
                                            <FormButton onClick={() => document.getElementById("uploadfile").click()}>Select Report</FormButton>
                                        </div>
                                    </FormFlexRowStyle>
                                }
                            </FormSection>
                        </>}
                    </ModalFormBody>
                    <ModalFormFooter busy={formState.busy}>
                        <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                            <div><FormButton
                                style={{ width: "74px" }}
                                disabled={!completeOpen}
                                onClick={handleSubmit}>Save
                            </FormButton>
                            </div>
                            <div><FormButton
                                style={{ width: "74px" }}
                                onClick={() => callback(false)}>Cancel
                            </FormButton>
                            </div>
                        </FormFlexRowStyle>
                    </ModalFormFooter>
                </ModalForm>
                : <PDFModalContainer
                    source={`${pdfCard.data}`}
                    title="Drug & Alcohol Clearinghouse Consent Form"
                    height="800px"
                    width="1000px"
                    callback={() => setPdfCard({ open: false, data: "" })}
                />
            }
        </>
        }
    </>)
}