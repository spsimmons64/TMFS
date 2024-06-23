
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { useContext, useEffect, useState } from "react"
import { FormCheck, FormDate, FormInput } from "../../components/portals/inputstyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { checkDate, getApiUrl, getBubbleColor, getBubbleIcon, toSimpleDate } from "../../global/globals"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormQualification, FormQualificationData, FormQualificationDataIcon, FormQualificationDataIconLeft, FormQualificationDataIconRight, FormQualificationHeader, FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"
import { CircleBack, QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import styled from "styled-components"
import { PDFContext } from "../../global/contexts/pdfcontext"


const CustomCheckContainer = styled.div`
background-color: #E3F7FC;
border: 1px solid #8ED9F6;
padding: 5px;
border-radius: 5px;
margin: 0px auto;
`

export const ClearinghouseForm = ({ callback }) => {
    const { viewDocument } = useContext(PDFContext)
    const { sendFormData, setValue, getValue, getError, handleChange, serializeFormData, formState, formControls, setFormErrors } = useFormHook("clearinghouse-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const [filefields, setFileFields] = useState("")

    const handlePdf = async ({target}) => {
        let typecode = target.getAttribute("data-id")
        let rec = driverRecord.documents.find(r => r.typecode === typecode);
        if (rec) viewDocument(rec.recordid, 'Drug & Alcohol Clearinghouse Qualification');
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
                callback(false)
            }
        }
    }

    useEffect(() => {
        setValue("chexempt", driverRecord.chexempt.toString())
        setValue("chremovesafety", driverRecord.chremovesafety)
        setValue("completedate", "")
    }, [driverRecord])
    

    return (<>
        <input id="uploadfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        ? <ModalForm width="670px">
            <ModalFormHeader title="Drug & Alcohol Clearinghouse Qualification" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    This qualification requires that you keep a signed driver consent form and perform&nbsp;
                    {driverRecord.status == "pending" ? "a pre-employment" : "an annual"} query with the FMCSA Drug & Alcohol Clearinghouse. &nbsp;
                    {driverRecord.status == "pending" &&
                        <span>The pre-emploment query will satisfy the annual query qualification should you hire the driver.</span>
                    }
                </FormSection>
                <FormSection>
                    <CustomCheckContainer>
                        <FormCheck
                            id="chexempt"
                            value={getValue("chexempt")}
                            checked={getValue("chexempt") == "1"}
                            onChange={handleChange}
                            style={{ fontSize: "14px", fontWeight: 600 }}
                            label="THIS DRIVER IS EXEMPT FROM THE DRUG & ALCOHOL CLEARINGHOUSE QUALIFICATION"
                            data-ignore
                        >
                        </FormCheck>
                    </CustomCheckContainer>
                </FormSection>
                {getValue("chexempt") == "0" && <>
                    <FormQualification>
                        <FormQualificationHeader title="Signed Limited Query Consent" />
                        <FormQualificationDataIcon>
                            <FormQualificationDataIconLeft>
                                <CircleBack color="green" size="50px"><FontAwesomeIcon icon={faCheck} /></CircleBack>
                            </FormQualificationDataIconLeft>
                            <FormQualificationDataIconRight>
                                You must keep a signed consent form by the driver for a limited query.
                                <div style={{ margin: "5px 0px" }}><FormButton data-id= "39" style={{ width: "230px" }} onClick={handlePdf}>View Signed Consent</FormButton></div>
                            </FormQualificationDataIconRight>
                        </FormQualificationDataIcon>
                    </FormQualification>
                    <FormQualification>
                        <FormQualificationHeader title={driverRecord.driverstatus == "Pending" ? "Pre-Employment Query" : "Annual Query"} />
                        <FormQualificationDataIcon>
                            <FormQualificationDataIconLeft>
                                <CircleBack color={getBubbleColor(qualifications.chpreemployment.status)} size="50px">
                                    {driverRecord.driverstatus == "Pending"
                                        ? <FontAwesomeIcon icon={getBubbleIcon(qualifications.chpreemployment.status)} />
                                        : <FontAwesomeIcon icon={getBubbleIcon(qualifications.clearinghouse.status)} />
                                    }
                                </CircleBack>
                                <FormQualificationDataIconRight>
                                    {driverRecord.driverstatus == "Pending"
                                        ? <div>{qualifications.chpreemployment.text}. Annual Also {qualifications.clearinghouse.text}</div>
                                        : <div>{qualifications.clearinghouse.text}</div>
                                    }
                                    <FormFlexRowStyle style={{ padding: "5px 0px" }}>
                                        {driverRecord.driverstatus == "Pending"
                                            ? <FormButton style={{ width: "230px" }} onClick={handleFMCSA}>Submit Pre-Employment Query</FormButton>
                                            : <FormButton style={{ width: "230px" }} onClick={handleFMCSA}>Submit Annual Query</FormButton>
                                        }
                                        <FormButton style={{ marginLeft:"10px", width: "230px" }} data-id="40" onClick={handlePdf}>View Clearinghouse Report</FormButton>
                                    </FormFlexRowStyle>
                                </FormQualificationDataIconRight>
                            </FormQualificationDataIconLeft>
                        </FormQualificationDataIcon>
                    </FormQualification>
                    <FormQualification style={{ marginBottom: "0px" }}>
                        <FormQualificationHeader title="Clearinghouse Qualification Information" />
                        <FormQualificationData style={{ padding: "10px" }}>
                            <FormFlexRowStyle>
                                <div style={{ width: "160px" }}>
                                    <FormTopLabel>Date Completed</FormTopLabel>
                                    <FormDate
                                        id="completedate"
                                        value={getValue("completedate") || " "}
                                        error={getError("completedate")}
                                        onChange={handleChange}
                                        data-ignore
                                    />
                                </div>
                                <div style={{ flex: 1, paddingTop: "10px" }}>
                                    <FormCheck
                                        id="chremovesafety"
                                        value={getValue("chremovesafety")}
                                        checked={getValue("chremovesafety") == "1" ? true : false}
                                        onChange={handleChange}
                                        label="Driver Must Be Removed From Safety-Sensitive Functions"
                                        style={{ marginBottom: "10px" }}
                                        data-ignore
                                    />
                                </div>
                            </FormFlexRowStyle>
                            <FormFlexRowStyle>
                                <div style={{ flex: 1, paddingRight: "10px" }}>
                                    <FormTopLabel>Drug & Alcohol Clearinghouse Report</FormTopLabel>
                                    <FormInput
                                        id="filefields"
                                        value={filefields}
                                        readOnly
                                        hideerror
                                    />
                                </div>
                                <div style={{ alignSelf: "flex-end" }}>
                                    <FormButton onClick={() => document.getElementById("uploadfile").click()}>Select Report</FormButton>
                                </div>
                            </FormFlexRowStyle>

                        </FormQualificationData>
                    </FormQualification>
                </>}
            </ModalFormBody>
            <ModalFormFooter busy={formState.busy}>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }}>
                    <div><FormButton
                        style={{ width: "155px" }}
                        disabled={!getValue("completedate") || !getValue("chexempt") == "1"}
                        onClick={handleSubmit}>Mark As Completed
                    </FormButton>
                    </div>
                    <div><FormButton
                        style={{ width: "155px" }}
                        onClick={() => callback(false)}>Cancel
                    </FormButton>
                    </div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalForm>
    </>)
}