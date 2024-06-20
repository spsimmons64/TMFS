import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LocationWarningStyle } from "../../components/portals/newpanelstyles"
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { useContext } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"
import { CircleBack } from "../portal/dashboard/drivers/classes/qualifications"

export const PendingForm = ({ callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, formState } = useFormHook()

    const handleSubmit = async () => {
        let data = new FormData()
        data.append("action", "status")
        data.append("status", "pending")
        data.append("driverid", driverRecord.recordid)
        const res = await sendFormData("POST", data, "accounts")
        if (res.status === 200) {
            setDriverRecord(res.data)
            callback(false)
        }
    }

    return (
        <ModalForm width="500px">
            <ModalFormHeader title="Move To Pending Employment" busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    You have chosen to consider employing <strong>{driverRecord["firstname"]} {driverRecord["lastname"]}</strong> and to move this driver into the Pending Employment status.
                    Please confirm this action.
                </FormSection>
                <FormSection style={{ borderBottom: "none", paddingBottom: "0px" }}>
                    <LocationWarningStyle style={{ width: "100%", margin: "10px auto" }}>
                        <div style={{ padding: "0px 10px", color: "#164398", fontSize: "22px" }}>
                            <CircleBack color="blue" size="44px" style={{paddingLeft:"2px"}}>
                                <FontAwesomeIcon icon={faInfo} />
                            </CircleBack>
                        </div>
                        <b>Once the driver is moved to pending status, you have 45 days to hire the driver or they will be moved to inactive status
                            and the driver will need to re-apply.</b>
                    </LocationWarningStyle>
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Confirm</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}




