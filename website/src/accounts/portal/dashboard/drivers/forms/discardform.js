import { FormTopLabel } from "../../../../../components/portals/formstyles"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext, useEffect } from "react"
import { noHireType } from "../../../../../global/staticdata"
import { toSimpleDate } from "../../../../../global/globals"
import { FormDate, FormSelect, FormText } from "../../../../../components/portals/inputstyles"
import { DriverContext } from "../contexts/drivercontext"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"

export const DiscardForm = ({ callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, setValue, getValue, getError, handleChange, setFormErrors, formState } = useFormHook("discard-form")

    const validate = () => {
        let errors = {}
        if (!getValue("additionalinfo")) errors["additionalinfo"] = "Additional Details Are Required!"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = new FormData()
            data.append("action", "status")
            data.append("status","nothired")
            data.append("driverid", driverRecord.recordid)
            data.append("nohirereason", getValue("nohirereason"))
            data.append("additionalinfo", getValue("additionalinfo"))
            data.append("recorddate", getValue("recorddate"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback(res)
            }
        }
    }

    useEffect(() => {
        const nohire_rec = noHireType.find(r => r.default)
        const current_date = new Date()
        setValue("nohirereason", nohire_rec.value || "")
        setValue("additionalinfo", "")
        setValue("recorddate", toSimpleDate(new Date(Date.UTC(
            current_date.getUTCFullYear(),
            current_date.getUTCMonth(),
            current_date.getUTCDate(),
            current_date.getUTCHours(),
            current_date.getUTCMinutes(),
            current_date.getUTCSeconds()
        ))))
    }, [])

    return (
        <ModalForm width="680px">
            <ModalFormHeader title="Discard Application" busy={formState.busy} />
            <div style={{ width: "100%", textAlign: "center", padding: "20px 0px" }}>
                You have chosen NOT to consider employing <strong>{driverRecord["firstname"]} {driverRecord["lastname"]}</strong>. Please choose the
                reason below and provide more details if desired. Once finished, please confirm the action to not hire the applicant.
            </div>
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormTopLabel>Reason For Not Hiring</FormTopLabel>
                <FormSelect
                    id="nohirereason"
                    options={noHireType}
                    value={getValue("nohirereason")}
                    onChange={handleChange}
                    autoFocus
                />
                <FormTopLabel>Additional Details</FormTopLabel>
                <FormText
                    id="additionalinfo"
                    value={getValue("additionalinfo")}
                    error={getError("additionalinfo")}
                    onChange={handleChange}
                    height="100px"
                />
                <FormTopLabel>Discard Date</FormTopLabel>
                <FormDate
                    id="recorddate"
                    value={getValue("recorddate")}
                    error={getError("recorddate")}
                    onChange={handleChange}
                />
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




