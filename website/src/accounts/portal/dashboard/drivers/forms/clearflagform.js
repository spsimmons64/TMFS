
import { FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect } from "react"
import { FormInput } from "../../../../../components/portals/inputstyles"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"
import { DriverContext } from "../contexts/drivercontext"

export const ClearFlagForm = ({ record, callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, handleChange, setFormErrors, formState } = useFormHook("clearflag-form")

    const validate = () => {
        let errors = {}
        if (!getValue("clearreason")) errors["clearreason"] = "The Clear Reason Is Required!"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = new FormData()
            data.append("action", "clearflag")
            data.append("flagid", record.recordid)
            data.append("clearreason", getValue("clearreason"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback({ status: 0 })
            }
        }
    }
    useEffect(() => { setValue("clearreason", "") }, [])

    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Clear Driver Flag" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <div style={{ width: "100%", textAlign: "center", padding: "10px 0px" }}>
                    You should not clear the flag until the issue has been resolved and the driver no longer needs to be flagged.
                </div>
                <div style={{ width: "100%", padding: "10px 0px" }}>
                    <strong>Flag To Clear: &nbsp; &nbsp;</strong>{record.reason}
                </div>
                <FormTopLabel>Reason For Clearing This Flag</FormTopLabel>
                <FormInput
                    id="clearreason"
                    mask="text"
                    value={getValue("clearreason")}
                    error={getError("clearreason")}
                    onChange={handleChange}
                    autoFocus
                />
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Clear Flag</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




