import { FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect } from "react"
import { FormInput } from "../../../../../components/portals/inputstyles"
import { DriverContext } from "../contexts/drivercontext"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"

export const FlagDriverForm = ({ callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, setFormErrors, handleChange, formState } = useFormHook("discard-form")

    const validate = () => {
        let errors = {}
        if (!getValue("flagreason")) errors["flagreason"] = "The Flag Reason Is Required!"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = new FormData()
            data.append("action", "flag")
            data.append("driverid", driverRecord.recordid)
            data.append("flagreason", getValue("flagreason"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback({ status: 0 })
            }
        }
    }

    useEffect(() => { setValue("flagreason", "") }, [])

    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Flag This Driver" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <div style={{ width: "100%", textAlign: "center", padding: "10px 0px" }}>
                    You are about to flag this driver, please provide the reason.
                </div>
                <FormTopLabel>Flag Reason</FormTopLabel>
                <FormInput
                    id="flagreason"
                    mask="text"
                    value={getValue("flagreason")}
                    error={getError("flagreason")}
                    onChange={handleChange}
                    autoFocus
                />
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Flag Driver</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




