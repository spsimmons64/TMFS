import { useContext, useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormCheck, FormDate, FormInput, FormSelect } from "../../components/portals/inputstyles"
import { useFormHook } from "../../global/hooks/formhook"
import { FormButton } from "../../components/portals/buttonstyle"
import { checkDate, toSimpleDate } from "../../global/globals"
import { CircleBack } from "../../accounts/portal/dashboard/drivers/classes/qualifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll, serializeFormData } from "../../components/global/forms/forms"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import styled from "styled-components"
import { FormRouterContext } from "./formroutercontext"


const WarningStyle = styled.div`
width:100%;
background-color: #FFF8C4;
border: 1px dotted #F2C779;
padding: 10px;
border-radius:5px;
display: flex;
align-items:center;
`

const EndorsementBoxStyle = styled.div`
width: 100%;
background-color: #E9E9E9;
border: 1px solid #D1D1D1;
border-radius: 4px;
padding: 5px;
margin-bottom: 10px;
`

export const UploadFileForm = ({ params }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { openForm, closeForm } = useContext(FormRouterContext);
    const { sendFormData, getValue, getError, buildFormControls, handleChange, formControls, formState, setFormErrors, setValue, serializeFormData } = useFormHook("uploader-form")

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            target.id === "uploadfile1" && setValue("filename1", target.files[0].name)
            target.id === "uploadfile2" && setValue("filename2", target.files[0].name)
        }
    }

    const validate = () => {
        var errors = {}
        if (!getValue("filename1")) errors["filename1"] = "Please Select A File To Upload"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return (false)
        }
        return true
    }

    const closeWindow = () => openForm(params.callbackid,params.callbackparams,params.callback)

    const handleSubmit = async () => {
        if (validate()) {
            let data = serializeFormData()
            data.append("action", "upload")
            data.append("driverid", driverRecord.recordid)
            data.append("licenseid", params.licenseid || "")
            data.append("files[]", document.getElementById("uploadfile1").files[0] || "")
            data.append("files[]", document.getElementById("uploadfile2").files[0] || "")
            data.append("description", getValue("description"))
            data.append("filedate", getValue("filedate"))
            data.append("typecode", params.typecode)
            const response = await sendFormData("POST", data, "driverdocs");
            if (response.status === 200) {                
                setDriverRecord(response.data)
                closeWindow()
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
        <input id="uploadfile1" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <input id="uploadfile2" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <ModalFormScroll width="900px" height="448px">
            <ModalFormHeader title='Document Uploader' busy={formState.busy} />
            <ModalFormBodyScroll id={formState.id} busy={formState.busy}>
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
                            <FormTopLabel>Document Description</FormTopLabel>
                            <FormInput
                                id="description"
                                mask="text"
                                value={getValue("description")}
                                error={getError("description")}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                    </FormFlexRowStyle>
                    <FormTopLabel>Additional Information</FormTopLabel>
                    <FormInput
                        id="additional"
                        mask="text"
                        value={getValue("additional")}
                        readOnly
                    />
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Document Filename</FormTopLabel>
                            <FormInput
                                id="filename1"
                                value={getValue("filename1")}
                                error={getError("filename1")}
                                data-ignore
                                disabled
                            ></FormInput>
                        </div>
                        <div><FormButton onClick={() => document.getElementById("uploadfile1").click()}>Select Document</FormButton></div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBodyScroll>
            <ModalFormFooter busy={formState.busy}>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }} >
                    <div><FormButton onClick={handleSubmit}>Upload Your Document</FormButton></div>
                    <div><FormButton onClick={closeWindow}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalFormScroll >
    </>)
}    