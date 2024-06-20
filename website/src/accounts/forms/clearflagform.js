import { useContext, useEffect } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { useFormHook } from "../../global/hooks/formhook"
import { FormTopLabel } from "../../components/portals/formstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { FormInput } from "../../components/portals/inputstyles"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"

export const ClearFlagForm = ({ params, callback }) => {   
    const { setDriverRecord } = useContext(DriverContext)    
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
            data.append("flagid", params.recordid)
            data.append("clearreason", getValue("clearreason"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback()
            }
        }
    }

    useEffect(() => { setValue("clearreason", "") }, [])

    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Clear Driver Flag" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    You should not clear the flag until the issue has been resolved and the driver no longer needs to be flagged.
                    <div style={{ padding: "10px 0px" }}>
                        <strong>Flag To Clear: &nbsp; &nbsp;</strong>{params.flagreason}
                    </div>
                </FormSection>
                <FormSection style={{ borderBottom: "none", paddingBottom: "0px" }}>
                    <FormTopLabel>Reason For Clearing This Flag</FormTopLabel>
                    <FormInput
                        id="clearreason"
                        mask="text"
                        value={getValue("clearreason")}
                        error={getError("clearreason")}
                        onChange={handleChange}
                        autoFocus
                    />
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Clear Flag</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={callback}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




