import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LocationWarningStyle } from "../../../../../components/portals/newpanelstyles"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FormButton } from "../../../../../components/portals/buttonstyle"
import { useFormHook } from "../../../../../global/hooks/formhook"
import { useContext } from "react"
import { DriverContext } from "../contexts/drivercontext"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"

export const PendingForm = ({ callback }) => {
    const { driverRecord} = useContext(DriverContext)
    const { sendFormData, formState } = useFormHook()

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "status")
        data.append("status","pending")
        data.append("driverid", driverRecord.recordid)
        const res = await sendFormData("POST", data, "accounts")
        res.status === 200 && callback(res)
    }

    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Move To Pending Employment" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>                
                <LocationWarningStyle style={{ width: "100%", margin: "10px auto" }}>
                    <div style={{ padding: "0px 10px", color: "#164398", fontSize: "24px" }}><FontAwesomeIcon icon={faCircleInfo} /></div>
                    <b>Once the driver is moved to pending status, you have 45 days to hire the driver or they will be moved to inactive status
                        and the driver will need to re-apply.</b>
                </LocationWarningStyle>
                <div style={{ width: "100%", textAlign: "center" }}>
                    You have chosen to consider employing <strong>{driverRecord["firstname"]} {driverRecord["lastname"]}</strong> and to move this driver into the Pending Employment status.
                    Please confirm this action.
                </div>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




