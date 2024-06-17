import { useContext, useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../components/portals/formstyles"
import { FormDate, FormInput, FormSelect } from "../components/portals/inputstyles"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { checkDate, toSimpleDate } from "../global/globals"
import { useGlobalContext } from "../global/contexts/globalcontext"
import { CircleBack } from "../accounts/portal/dashboard/drivers/classes/qualifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { FormSection, ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../components/global/forms/forms"
import styled from "styled-components"
import { PDFContainer } from "../components/portals/pdfviewer"
import { DriverContext } from "../accounts/portal/dashboard/drivers/contexts/drivercontext"



const WarningStyle = styled.div`
width:100%;
background-color: #FFF8C4;
border: 1px dotted #F2C779;
padding: 10px;
border-radius:5px;
display: flex;
align-items:center;
`

export const UploadFileForm = ({ params, callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, getValue, getError, buildFormControls, handleChange, formState, setFormErrors } = useFormHook("uploader-form")
    const [filefields, setFileFields] = useState("")

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            setFileFields(filename)
        }
    }

    const validate = () => {
        let errors = {}
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (validate()) {
            console.log(params)
            var data = new FormData()
            data.append("action", "upload")
            data.append("driverid", driverRecord.recordid)
            data.append("licenseid", params.licenseid)
            data.append("files[]", document.getElementById("uploadfile").files[0])
            data.append("description", getValue("description"))
            data.append("filedate", getValue("filedate"))
            data.append("typecode", params.typecode)
            const response = await sendFormData("POST", data, "driverdocs");
            if (response.status === 200) {
                setDriverRecord(response.data)
                callback()
            }
        }
    }

    useEffect(() => {
        const defaults = {
            description: params.description,
            additional: params.additional,
            filedate: toSimpleDate(new Date()),
        }
        buildFormControls(defaults)
    }, [])

    return (<>
        <input id="uploadfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <ModalForm width="900px">
            <ModalFormHeader title='Document Uploader' busy={formState.busy} />
            <ModalFormBody id={formState.id} busy={formState.busy}>
                <FormSection style={{ paddingTop: "0px" }}>
                    <WarningStyle>
                        <div style={{ width: "50px" }}>
                            <CircleBack color="gold" size="40px" style={{ paddingLeft: "2px" }}>
                                <FontAwesomeIcon icon={faExclamation} style={{ fontSize: "18px" }}></FontAwesomeIcon>
                            </CircleBack>
                        </div>
                        <div style={{ flex: 1 }}><b>WARNING!</b> You cannot edit, change or delete a file after it has been added
                            to a driver. Please triple check all information for accuracy.
                        </div>
                    </WarningStyle>
                </FormSection>
                <FormSection style={{ borderBottom: "0px" }}>
                    <FormTopLabel>Document Description</FormTopLabel>
                    <FormInput
                        id="description"
                        mask="text"
                        value={getValue("description")}
                        error={getError("description")}
                        onChange={handleChange}
                        autoFocus
                    />
                    <FormTopLabel>Additional Information</FormTopLabel>
                    <FormInput
                        id="additional"
                        mask="text"
                        value={getValue("additional")}
                        readOnly
                    />
                    <FormFlexRowStyle>
                        <div style={{ width: "150px" }}>
                            <FormTopLabel>Document Date</FormTopLabel>
                            <FormDate
                                id="filedate"
                                value={getValue("filedate") || " "}
                                error={getError("filedate")}
                                onChange={handleChange}
                            ></FormDate>
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Document Filename</FormTopLabel>
                            <FormInput
                                id="filename"
                                value={filefields}
                                disabled
                            ></FormInput>
                        </div>
                        <div><FormButton onClick={() => document.getElementById("uploadfile").click()}>Select Document</FormButton></div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBody>
            <ModalFormFooter busy={formState.busy}>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }} >
                    <div><FormButton disabled={filefields == ""} onClick={handleSubmit}>Upload Your Document</FormButton></div>
                    <div><FormButton onClick={callback}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalForm>
    </>)
}    