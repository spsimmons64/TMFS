import { useContext, useEffect, useState } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { FormTopLabel } from "../../components/portals/formstyles"
import { useFormHook } from "../../global/hooks/formhook"
import { FormInput } from "../../components/portals/inputstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { FormQualification, FormQualificationData, FormQualificationHeader, FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../components/global/forms/forms"
import { FormButton } from "../../components/portals/buttonstyle"

export const UploadRequestForm = ({ params, callback }) => {
    const { sendFormData, setValue, getValue, getError, handleChange, formState, setFormErrors } = useFormHook("discard-form")
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { globalState } = useGlobalContext();
    const [routeText, setRouteText] = useState("")

    const validate = () => {
        let errors = {}
        if (!getValue("emailaddress")) errors["emailaddress"] = "The Email Address Is Required!"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = new FormData()
            data.append("action", `request_${params.route}`)
            data.append("driverid", driverRecord.recordid)
            data.append("emailaddress", getValue("emailaddress"))
            data.append("linktosend", getValue("linktosend"))
            const res = await sendFormData("POST", data, "accounts")
            if (res.status === 200) {
                setDriverRecord(res.data)
                callback({ status: 0 })
            }
        }
    }

    useEffect(() => {
        setRouteText("Send Driver's License Upload");
        if (params.route === "employment") setRouteText("Send Employment Correction");
        if (params.route === "medcard") setRouteText("Send Medical Certificate Upload");
        let url = `https://${globalState.reseller.siteroute}.${globalState.reseller.sitedomain}/${globalState.account.siteroute}`
        url = `${url}/upload/${params.route}/${driverRecord.recordid}`
        setValue("emailaddress", driverRecord.emailaddress || "")
        setValue("linktosend", url)
    }, [])

    return (
        <ModalForm width="680px">
            <ModalFormHeader title={`${routeText} Request To Driver`} busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px",marginBottom:"10px" }}>
                    This action will allow you to send an email to driver <strong>{driverRecord.firstname} {driverRecord.lastname}</strong> requesting
                    {params.route === "license" && " they upload a copy of thier driver's license."}
                    {params.route === "medcard" && " they upload a copy of thier medical certificate."}
                    {params.route === "employment" && " they make corrections to thier employment history."}
                    &nbsp; After the driver completes the requested
                    {params.route === "employment" ? " corrections" : " upload"}
                    , you will receive a notification.
                </FormSection>
                <FormQualification style={{marginBottom:"0px"}}>
                    <FormQualificationHeader title="Send Request To Driver" />
                    <FormQualificationData style={{ padding: "10px" }}>
                        <FormTopLabel>Email Address(es)</FormTopLabel>
                        <FormInput
                            id="emailaddress"
                            mask="text"
                            value={getValue("emailaddress")}
                            error={getError("emailaddress")}
                            onChange={handleChange}
                            placeholder="Separate Multiple Emails With A Comma..."
                            autoFocus
                        />
                        <FormTopLabel>Link To Send</FormTopLabel>
                        <FormInput
                            style={{ backgroundColor: "#E3F7FC", borderColor: "#8ED9F6" }}
                            id="linktosend"
                            mask="text"
                            value={getValue("linktosend")}
                            onChange={handleChange}
                            height="100px"
                            readOnly
                        />
                    </FormQualificationData>
                </FormQualification>
            </ModalFormBody>
            <ModalFormFooter style={{ justifyContent: "flex-end" }}>
                <div><FormButton style={{ width: "100px" }} onClick={handleSubmit}>Send</FormButton></div>
                <div style={{ marginLeft: "10px" }}><FormButton style={{ width: "100px" }} onClick={() => callback(false)}>Cancel</FormButton></div>
            </ModalFormFooter>
        </ModalForm>
    )
}