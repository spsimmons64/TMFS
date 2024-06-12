import { FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect } from "react"
import { FormText } from "../../../../../components/portals/inputstyles"
import { DriverContext } from "../contexts/drivercontext"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"


export const RejectForm = ({ record, callback }) => {
    const { driverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, handleChange, formState } = useFormHook("discard-form")

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "reject")
        data.append("driverid", driverRecord.recordid)
        data.append("rejectreason", getValue("rejectreason"))
        const res = await sendFormData("POST", data, "accounts")
        res.status === 200 && callback(res)
    }

    useEffect(() => { setValue("rejectreason", "") }, [])

    return (
        <ModalForm width="680px">
            <ModalFormHeader title="Send Correction Request" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <div style={{ width: "100%", textAlign: "center", padding: "20px 0px" }}>
                    You are sending this application back to the Driver for corrections. Please provide the correction instructions below. The
                    driver be notified by email and they will have the opportunity to adjust their application and resubmit.
                </div>
                <FormTopLabel>Correction Reason</FormTopLabel>
                <FormText
                    id="rejectreason"
                    value={getValue("rejectreason")}
                    onChange={handleChange}
                    height="100px"
                    autoFocus

                />
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




