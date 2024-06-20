import { useContext, useEffect, useState } from "react"
import { FormFlexRowStyle, FormTopLabel } from "../components/portals/formstyles"
import { FormCheck, FormDate, FormInput, FormSelect } from "../components/portals/inputstyles"
import { useFormHook } from "../global/hooks/formhook"
import { FormButton } from "../components/portals/buttonstyle"
import { calcDaysBetweenDates, checkDate, convertToIsoDate, toSimpleDate } from "../global/globals"
import { CircleBack } from "../accounts/portal/dashboard/drivers/classes/qualifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { FormSection, ModalFormBodyScroll, ModalFormFooter, ModalFormHeader, ModalFormScroll, serializeFormData } from "../components/global/forms/forms"
import styled from "styled-components"

import { DriverContext } from "../accounts/portal/dashboard/drivers/contexts/drivercontext"
import { countryTypes, dlClassTypes, statesArray } from "../global/staticdata"

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

export const UploadLicenseForm = ({ params, callback }) => {
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { sendFormData, getValue, getError, buildFormControls, handleChange, formControls, formState, setFormErrors, setValue, serializeFormData } = useFormHook("uploader-form")
    const [windowHeight, setWindowHeight] = useState("448px")
    const [uploadType, setUploadType] = useState([])

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            target.id === "uploadfile1" && setValue("filename1", target.files[0].name)
            target.id === "uploadfile2" && setValue("filename2", target.files[0].name)
        }
    }

    const validate = () => {
        var errors = {}
        if (driverRecord.license.length) {
            const issDate = convertToIsoDate(driverRecord.license[0].issued);
            const expDate = convertToIsoDate(driverRecord.license[0].expires);
            if (["2", "5"].includes(getValue("uploadtype"))) {
                if (calcDaysBetweenDates(issDate, getValue("issued")) < 0) errors["issued"] = "This Date Is Prior To The Issue Date On The Current Active License."
                if (calcDaysBetweenDates(expDate, getValue("expires")) <= 0) errors["expires"] = "This Date Is Prior To The Expire Date On The Current Active License."
            }
            if (["3", "4"].includes(getValue("uploadtype"))) {
                if (calcDaysBetweenDates(issDate, getValue("issued")) < 0) errors["issued"] = "This Date Is Prior To The Issue Date On The Current Active License."                
            }
        }
        if (!getValue("filename1")) errors["filename1"] = "Please Select A File To Upload"
        if (!getValue("filename2")) errors["filename2"] = "Please Select A File To Upload"
        if(getValue("uploadtype") !=="1"){        
            if (!checkDate(getValue("issued"))) errors["issued"] = "Invalid Date Field"
            if (!checkDate(getValue("expires"))) errors["expired"] = "Invalid Date Field"
            if (!getValue("firstname")) errors["firstname"] = "First Name is Required!"
            if (!getValue("lastname")) errors["lastname"] = "Last Name Is Required!"
            if (!getValue("issued")) errors["issued"] = "Issue Date Is Required!"
            if (!getValue("expires")) errors["expires"] = "Expires Date Is Required!"
            if (!getValue("licensenumber")) errors["licensenumber"] = "License Number Is Required!"
            if (!getValue("clicensenumber")) errors["clicensenumber"] = "Confirmation License Number Is Required!"
            if (getValue("licensenumber") !== getValue("clicensenumber")) {
                errors["licensenumber"] = "License Number And Conformation Do Not Match!"
                errors["clicensenumber"] = "License Number And Conformation Do Not Match!"
            }
        }
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return (false)
        }
        return true
    }

    const handleEndorsements = ({ target }) => {
        const checkStr = "HNPTSX"
        const pos = checkStr.indexOf(target.id)
        let endStr = getValue("endorsements")
        let newFlag = target.checked ? "1" : "0"
        let newStr = endStr.substring(0, pos) + newFlag + endStr.substring(pos + 1)
        setValue("endorsements", newStr)
    }

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
                callback()
            }
        }
    }

    useEffect(() => {
        if (["1", "3", "4"].includes(getValue("uploadtype"))) {
            setValue("issued", " ")
            setValue("expires", " ")
            setValue("class", dlClassTypes.find(r => r.default).value)
            setValue("state", statesArray.find(r => r.default).value)
            setValue("country", countryTypes.find(r => r.default).value)
            setValue("endorsements", "000000")
            setValue("licensenumber", "")
            setValue("clicensenumber", "")
        } else {
            setValue("issued", convertToIsoDate(driverRecord.license[0].issued))
            setValue("expires", convertToIsoDate(driverRecord.license[0].expires))
            setValue("class", driverRecord.license[0].class)
            setValue("state", driverRecord.license[0].rawstate)
            setValue("country", driverRecord.license[0].country)
            setValue("endorsements", driverRecord.license[0].endorsements)
            setValue("licensenumber", driverRecord.license[0].licensenumber)
            setValue("clicensenumber", driverRecord.license[0].licensenumber)
        }
        const newHeight = getValue("uploadtype") == "1" ? "596px" : "800px"
        setWindowHeight(newHeight)
    }, [getValue("uploadtype")])

    useEffect(() => {
        const defaults = {
            description: params.description,
            additional: params.additional,
            filedate: toSimpleDate(new Date()),
            firstname: driverRecord.firstname,
            lastname: driverRecord.lastname,
            uploadtype: "1",
        }
        let options = [
            { value: "1", text: "Upload Only" },
            { value: "3", text: "New License" },
            { value: "4", text: "Temporary License" },
        ]
        if (driverRecord.license.length !== 0) {
            options.push({ value: "2", text: "Renewal" }, { value: "5", text: "Extension" })
        }
        setUploadType(options.sort((a, b) => a.value.localeCompare(b.value)))
        buildFormControls(defaults)
    }, [])

    return (<>
        <input id="uploadfile1" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <input id="uploadfile2" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <ModalFormScroll width="900px" height={windowHeight}>
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
                        <div style={{ width: "200px" }}>
                            <FormTopLabel>Upload Type</FormTopLabel>
                            <FormSelect
                                id="uploadtype"
                                options={uploadType}
                                value={getValue("uploadtype")}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>First Name</FormTopLabel>
                            <FormInput
                                id="firstname"
                                mask="text"
                                value={getValue("firstname")}
                                error={getError("firstname")}
                                disabled = {getValue("uploadtype")=="5"}
                                onChange={handleChange}                            
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Last Name</FormTopLabel>
                            <FormInput
                                id="lastname"
                                mask="text"
                                value={getValue("lastname")}
                                error={getError("lastname")}
                                disabled = {getValue("uploadtype")=="5"}
                                onChange={handleChange}

                            />
                        </div>
                    </FormFlexRowStyle>
                    {getValue("uploadtype") !== "1" && <>
                        <FormFlexRowStyle>
                            <div style={{ flex: 1 }}>
                                <FormTopLabel>License Number</FormTopLabel>
                                <FormInput
                                    id="licensenumber"
                                    mask="text"
                                    value={getValue("licensenumber")}
                                    error={getError("licensenumber")}
                                    disabled = {getValue("uploadtype")=="5"}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormTopLabel>Confirm License Number</FormTopLabel>
                                <FormInput
                                    id="clicensenumber"
                                    mask="text"
                                    value={getValue("clicensenumber")}
                                    error={getError("clicensenumber")}
                                    onChange={handleChange}
                                    disabled = {getValue("uploadtype")=="5"}
                                    nopaste
                                />
                            </div>
                        </FormFlexRowStyle>
                        <FormTopLabel>Classification</FormTopLabel>
                        <FormSelect
                            id="class"
                            options={dlClassTypes}
                            value={getValue("class")}
                            error={getError("class")}
                            disabled = {getValue("uploadtype")=="5"}
                            onChange={handleChange}
                        />
                        <FormTopLabel>Issue Date</FormTopLabel>
                        <FormDate
                            id="issued"
                            value={getValue("issued") || ""}
                            error={getError("issued")}
                            disabled = {getValue("uploadtype")=="5"}
                            onChange={handleChange}
                        />
                        <FormTopLabel>Expire Date</FormTopLabel>
                        <FormDate
                            id="expires"
                            value={getValue("expires") || ""}
                            error={getError("expires")}
                            onChange={handleChange}
                        />
                        <FormFlexRowStyle>
                            <div style={{ width: "300px" }}>
                                <FormTopLabel>State Issued</FormTopLabel>
                                <FormSelect
                                    id="state"
                                    options={statesArray}
                                    value={getValue("state")}
                                    error={getError("state")}
                                    onChange={handleChange}
                                    disabled = {getValue("uploadtype")=="5"}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormTopLabel>Country Issued</FormTopLabel>
                                <FormSelect
                                    id="country"
                                    options={countryTypes}
                                    value={getValue("country")}
                                    error={getError("country")}
                                    onChange={handleChange}
                                    disabled = {getValue("uploadtype")=="5"}
                                />
                            </div>
                        </FormFlexRowStyle>
                        <FormTopLabel>Endorsements</FormTopLabel>
                        {getValue("endorsements") &&
                            < EndorsementBoxStyle >
                                <FormFlexRowStyle style={{ marginBottom: "5px" }}>
                                    <div style={{ flex: 1 }}>
                                        <input hidden id="endorsements" value={getValue("endorsements")} readOnly />
                                        <FormCheck
                                            id={`H`}
                                            label="H - Placarded Hazmat"
                                            value={getValue("endorsements")[0]}
                                            checked={getValue("endorsements")[0] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}

                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FormCheck
                                            id={`T`}
                                            label="T - Double/Triple Trailers"
                                            value={getValue("endorsements")[3]}
                                            checked={getValue("endorsements")[3] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}
                                        />
                                    </div>
                                </FormFlexRowStyle>
                                <FormFlexRowStyle style={{ marginBottom: "5px" }}>
                                    <div style={{ flex: 1 }}>
                                        <FormCheck
                                            id={`N`}
                                            label="N - Tank Vehicles"
                                            value={getValue("endorsements")[1]}
                                            checked={getValue("endorsements")[1] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FormCheck
                                            id={`S`}
                                            label="S - School Bus"
                                            value={getValue("endorsements")[4]}
                                            checked={getValue("endorsements")[4] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}
                                        />
                                    </div>
                                </FormFlexRowStyle>
                                <FormFlexRowStyle>
                                    <div style={{ flex: 1 }}>
                                        <FormCheck
                                            id={`P`}
                                            label="P-Passengers"
                                            value={getValue("endorsements")[2]}
                                            checked={getValue("endorsements")[2] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FormCheck
                                            id={`X`}
                                            label="X - Placarded Hazmat & Tank Vehicles"
                                            value={getValue("endorsements")[5]}
                                            checked={getValue("endorsements")[5] == "1"}
                                            data-ignore
                                            onChange={handleEndorsements}
                                            disabled = {getValue("uploadtype")=="5"}
                                        />
                                    </div>
                                </FormFlexRowStyle>
                            </EndorsementBoxStyle>
                        }
                    </>}
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Front Of License</FormTopLabel>
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
                    <FormFlexRowStyle>
                        <div style={{ flex: 1 }}>
                            <FormTopLabel>Back Of License</FormTopLabel>
                            <FormInput
                                id="filename2"
                                value={getValue("filename2")}
                                error={getError("filename2")}
                                data-ignore
                                disabled
                            ></FormInput>
                        </div>
                        <div><FormButton onClick={() => document.getElementById("uploadfile2").click()}>Select Document</FormButton></div>
                    </FormFlexRowStyle>
                </FormSection>
            </ModalFormBodyScroll>
            <ModalFormFooter busy={formState.busy}>
                <FormFlexRowStyle style={{ justifyContent: "flex-end" }} >
                    <div><FormButton onClick={handleSubmit}>Upload Your Document</FormButton></div>
                    <div><FormButton onClick={callback}>Cancel</FormButton></div>
                </FormFlexRowStyle>
            </ModalFormFooter>
        </ModalFormScroll >
    </>)
}    