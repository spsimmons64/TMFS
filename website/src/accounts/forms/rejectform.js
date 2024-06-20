import { useContext, useEffect } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormTopLabel } from "../../components/portals/formstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { FormText } from "../../components/portals/inputstyles"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"

export const RejectForm = ({ record, callback }) => {
    const { driverRecord,setDriverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, handleChange, formState } = useFormHook("discard-form")

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "reject")
        data.append("driverid", driverRecord.recordid)
        data.append("rejectreason", getValue("rejectreason"))
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback(true)
        }
    }

    useEffect(() => { setValue("rejectreason", "") }, [])

    return (
        <ModalForm width="680px">
            <ModalFormHeader title="Send Correction Request" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    You are sending this application back to the Driver for corrections. Please provide the correction instructions below. The
                    driver be notified by email and they will have the opportunity to adjust their application and resubmit.
                </FormSection>
                <FormSection style={{ borderBottom: "none", paddingBottom: "0px" }}>
                    <FormTopLabel>Correction Reason</FormTopLabel>
                    <FormText
                        id="rejectreason"
                        value={getValue("rejectreason")}
                        onChange={handleChange}
                        height="100px"
                        autoFocus
                    />
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}