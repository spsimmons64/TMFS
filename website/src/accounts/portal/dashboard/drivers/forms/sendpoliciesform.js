import { FormFlexRowStyle, FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect, useState } from "react"
import { FormInput } from "../../../../../components/portals/inputstyles"
import { FormCheck } from "../../../../../components/portals/inputstyles"
import { getApiUrl } from "../../../../../global/globals"
import { PDFModalContainer } from "../../../../../components/portals/pdfviewer"
import { DriverContext } from "../contexts/drivercontext"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"

export const SendPoliciesForm = ({ callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, handleChange, formState, setFormErrors } = useFormHook("policy-form")
    const [pdfCard, setPdfCard] = useState({ open: false, data: "" })

    const validate = () => {
        let errors = {}
        if (!getValue("emailaddress")) errors["emailaddress"] = "The Email Address Is Required!"
        if (getValue("general") == "N" && getValue("substance") == "N") errors["policyerror"] = "Select A Policy To Send"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handlePdf = async ({ target }) => {
        let id = target.getAttribute("data-id")
        let url = `${getApiUrl()}/accounts/policies?id=${driverRecord["accountid"]}&ptype=${id}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfCard({ open: true, data: pdfUrl })
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = new FormData()
            data.append("action", "policies")
            data.append("driverid", driverRecord.recordid)
            data.append("emailaddress", getValue("emailaddress"))
            data.append("general", getValue("general"))
            data.append("substance", getValue("substance"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback({ status: 0 })
            }
        }
    }

    useEffect(() => {
        setValue("emailaddress", driverRecord.emailaddress)
        setValue("general", 1)
        setValue("substance", 1)
    }, [])
    
    return (<>
        {!pdfCard.open
            ? <>
                <ModalForm width="460px">
                    <ModalFormHeader title="Email Driver Company Policies" busy={formState.busy} />
                    <ModalFormBody id={formState.id} busy={formState.busy}>

                        <FormTopLabel>Email Address To Send To</FormTopLabel>
                        <FormInput
                            id="emailaddress"
                            mask="text"
                            value={getValue("emailaddress")}
                            error={getError("emailaddress")}
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormTopLabel>Select The Policies To Email</FormTopLabel>
                        <div style={{ backgroundColor: "#E9E9E9", border: "1px dotted #B6B6B6", borderRadius: "5px", padding: "5px" }}>
                            <div style={{ marginBottom: "5px" }}>
                                <FormFlexRowStyle>
                                    <div style={{ width: "250px" }}>
                                        <FormCheck style={{ paddingBottom: "10px" }}
                                            id="general"
                                            label="General Work Policy"
                                            value={getValue("general")}
                                            checked={getValue("general") == 1}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div data-id="w" style={{ flex: 1, color: "#164398", cursor: "pointer" }} onClick={handlePdf} ><u style={{ pointerEvents: "none" }}>View This Policy</u></div>
                                </FormFlexRowStyle>
                            </div>
                            <div style={{ marginTop: "5px" }}>
                                <FormFlexRowStyle>
                                    <div style={{ width: "250px" }}>
                                        <FormCheck
                                            id="substance"
                                            label="Alcohol And Drug Policy"
                                            value={getValue("substance")}
                                            checked={getValue("substance") == 1}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div data-id="d" style={{ flex: 1, color: "#164398", cursor: "pointer" }} onClick={handlePdf} ><u style={{ pointerEvents: "none" }}>View This Policy</u></div>
                                </FormFlexRowStyle>
                            </div>
                        </div>

                        <div style={{ padding: "2px 0px 0px 3px", height: "20px", color: "#FF6666", fontSize: "12px" }}>{getError("policyerror")}</div>
                    </ModalFormBody>
                    <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                        <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                        <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
                    </ModalFormFooter>
                </ModalForm>
            </>
            : <PDFModalContainer
                source={`${pdfCard.data}#view=Fit`}
                title="Company Policy"
                height="100%"
                width="100%"
                callback={() => setPdfCard({ open: false, data: "" })}
            />
        }
    </>)
}






