import { useEffect } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../components/portals/formstyles"
import { FormDate, FormInput} from "../components/portals/inputstyles"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { FormSection, ModalFormBody, ModalFormFooter, ModalFormHeader, ModalForm } from "../components/global/forms/forms"
import { toSimpleDate } from "../global/globals"

export const EmailForm = ({ params, callback }) => {
    const { sendFormData, getValue, getError, buildFormControls, handleChange, formState, setFormErrors, setValue, serializeFormData } = useFormHook("uploader-form")

    const validate = () => {
        var errors = {}
        if (!getValue("emailaddress")) errors["emailaddress"] = "The Email Address Is Required"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return (false)
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            let data = serializeFormData()
            data.append("driverid",params.driverid)
            data.append("typecode",params.typecode)
            data.append("subject",params.subject)
            const response = await sendFormData("POST", data, "sendrequest");
            if (response.status === 200) callback()            
        }
    }

    useEffect(() => {
        buildFormControls({})
    }, [])

    return (<>
        <ModalForm width="600px" >
            <ModalFormHeader title='Email Request For Completion' busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    <div>{params.description}</div>
                </FormSection>
                <FormSection style={{ borderBottom: "none" }}>
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Date</FormTopLabel>
                            <FormDate value={toSimpleDate(new Date()) || " "} readOnly />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Driver Name</FormTopLabel>
                            <FormInput value={params.driver} readOnly />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Subject</FormTopLabel>
                    <FormInput value={[params.subject]} readOnly />
                    <FormTopLabel>Recipient Name</FormTopLabel>
                    <FormInput
                        id="recipname"
                        value={getValue("recipname")}
                        error={getError("recipname")}
                        onChange={handleChange}
                        autoFocus
                    />

                    <FormTopLabel>Email Address</FormTopLabel>
                    <FormInput
                        id="emailaddress"
                        value={getValue("emailaddress")}
                        error={getError("emailaddress")}
                        onChange={handleChange}
                    
                    />
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter busy={formState.busy}>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }} >
                    <div><FormButton onClick={handleSubmit}>Email Request</FormButton></div>
                    <div><FormButton onClick={callback}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalForm >
    </>)
}    