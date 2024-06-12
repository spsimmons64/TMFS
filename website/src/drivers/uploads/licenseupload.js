import styled from "styled-components"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormCheck, FormDate, FormInput, FormSelect } from "../../components/portals/inputstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { Disclosure } from "../setup/disclosure"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GridLoader } from "../../components/portals/gridstyles"
import { checkDate } from "../../global/globals"
import { LocationWarningStyle } from "../../components/portals/newpanelstyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { countryTypes, dlClassTypes, statesArray } from "../../global/staticdata"


const ContentContainer = styled.div`
width:710px;
margin: 0 auto;
display:flex;
flex-flow:column;
margin-top:20px;
`

const EndorsementBoxStyle = styled.div`
width: 100%;
background-color: #E9E9E9;
border: 1px solid #D1D1D1;
border-radius: 4px;
padding: 5px;
margin-bottom: 20px;
`

export const LicenseUpload = ({ siteid, driverid }) => {
    const nav = useNavigate()
    const { serializeFormData, sendFormData, getValue, setValue, getError, handleChange, setFormErrors, setFormBusy, getFormBusy } = useFormHook("license-form")
    const [filefields, setFileFields] = useState({ front: { value: "", error: "" }, back: { value: "", error: "" } })
    const [endorsements, setEndorsements] = useState(["0", "0", "0", "0", "0", "0"])

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            if (target.id === "dlfrontfile")
                setFileFields(ps => ({ ...ps, front: { ...ps.front, value: filename } }))
            else
                setFileFields(ps => ({ ...ps, back: { ...ps.back, value: filename } }))
        } else {
            if (target.id === "dlfrontfile")
                setFileFields(ps => ({ ...ps, front: { ...ps.front, value: "" } }))
            else
                setFileFields(ps => ({ ...ps, back: { ...ps.back, value: "" } }))
        }
    }

    const validateForm = () => {
        var errors = {}
        if (!getValue("firstname")) errors["firstname"] = "First Name is Required!"
        if (!getValue("lastname")) errors["lastname"] = "Last Name Is Required!"
        if (!getValue("issued")) errors["issued"] = "Issue Date Is Required!"
        if (!getValue("expires")) errors["expires"] = "Expires Date Is Required!"
        if (!getValue("licensenumber")) errors["licensenumber"] = "License Number Is Required!"
        if (!getValue("clicensenumber")) errors["clicensenumber"] = "Confirmation License Number Is Required!"
        if (!filefields.front.value)
            setFileFields(ps => ({ ...ps, front: { ...ps.front, error: "Copy Of The Front Of Your License Is Required!" } }))
        if (!filefields.front.value)
            setFileFields(ps => ({ ...ps, back: { ...ps.front, error: "Copy Of The Back Of Your License Is Required!" } }))
        if (getValue("licensenumber") !== getValue("clicensenumber")) {
            errors["licensenumber"] = "License Number And Conformation Do Not Match!"
            errors["clicensenumber"] = "License Number And Conformation Do Not Match!"
        }
        if (!checkDate(getValue("issued"))) errors["issued"] = "Invalid Date Field"
        if (!checkDate(getValue("expires"))) errors["expired"] = "Invalid Date Field"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
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

    const handleSubmit = async (e, delflag = false) => {
        if (validateForm()) {
            setFormErrors({})
            let data = serializeFormData()
            const dlfront = document.getElementById("dlfrontfile")
            const dlback = document.getElementById("dlbackfile")
            data.append("action", "upload")
            data.append("route", "license")
            data.append("files[]", dlfront.files[0])
            data.append("files[]", dlback.files[0])
            data.append("driverid", driverid)
            data.append("endorsements", getValue("endorsements"))
            let resp = await sendFormData("post", data, "drivers")
            if (resp.status === 200) {
                const url = `${process.env.REACT_APP_PUBLIC_URL}/${siteid}/upload/complete/${driverid}`
                nav(url, { replace: true })
            }
        }
    }

    useEffect(() => {
        const dlState = statesArray.find(r => r.default)
        const dlCountry = countryTypes.find(r => r.default)
        const dlClass = dlClassTypes.find(r => r.default)
        setValue("state", dlState.value || "")
        setValue("country", dlCountry.value || "")
        setValue("class", dlClass.value || "")
        setValue("endorsements", "000000")
    }, [])

    return (
        <ContentContainer id="license-form">
            {getFormBusy() ? <GridLoader message="Uploading Your Document...Please Wait" /> : <>
                <input id="dlfrontfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
                <input id="dlbackfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
                <LocationWarningStyle style={{ width: "100%", backgroundColor: "#FFF8C4", borderColor: "#F2C779", marginBottom: "10px" }}>
                    <div style={{ padding: "0px 10px", color: "#164398", fontSize: "20px" }}>
                        <FontAwesomeIcon icon={faTriangleExclamation} color="#FFCE44" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <strong>WARNING!</strong> <u>Triple check the license information for accuracy.</u> If you enter the wrong information,
                        all documents relating to your license will have to be discarded and completed again. <strong> License data and/or files
                            referencing licenses cannot be altered after completion!</strong>
                    </div>
                </LocationWarningStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>First Name</FormTopLabel>
                        <FormInput
                            id="firstname"
                            mask="text"
                            value={getValue("firstname")}
                            error={getError("firstname")}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Last Name</FormTopLabel>
                        <FormInput
                            id="lastname"
                            mask="text"
                            value={getValue("lastname")}
                            error={getError("lastname")}
                            onChange={handleChange}
                        />
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>License Number</FormTopLabel>
                        <FormInput
                            id="licensenumber"
                            mask="text"
                            value={getValue("licensenumber")}
                            error={getError("licensenumber")}
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
                        />
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Classification</FormTopLabel>
                        <FormSelect
                            id="class"
                            options={dlClassTypes}
                            value={getValue("class")}
                            error={getError("class")}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ width: "160px" }}>
                        <FormTopLabel>Issue Date</FormTopLabel>
                        <FormDate
                            id="issued"
                            value={getValue("issued")}
                            error={getError("issued")}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ width: "160px" }}>
                        <FormTopLabel>Expire Date</FormTopLabel>
                        <FormDate
                            id="expires"
                            value={getValue("expires")}
                            error={getError("expires")}
                            onChange={handleChange}
                        />
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ width: "300px" }}>
                        <FormTopLabel>State Issued</FormTopLabel>
                        <FormSelect
                            id="state"
                            options={statesArray}
                            value={getValue("state")}
                            error={getError("state")}
                            onChange={handleChange}
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
                        />
                    </div>
                </FormFlexRowStyle>
                <FormTopLabel>Endorsements</FormTopLabel>
                {endorsements.length &&
                    <EndorsementBoxStyle>
                        <FormFlexRowStyle style={{ marginBottom: "5px" }}>
                            <div style={{ flex: 1 }}>
                                <FormCheck
                                    id={`H`}
                                    label="H - Placarded Hazmat"
                                    value={getValue("endorsements")[0]}
                                    checked={getValue("endorsements")[0] == "1"}
                                    data-ignore
                                    onChange={handleEndorsements}

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
                                />
                            </div>
                        </FormFlexRowStyle>
                    </EndorsementBoxStyle>
                }
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Copy Of The <b>Front</b> Of Your Driver's License</FormTopLabel>
                        <FormInput
                            id="license-front"
                            mask="text"
                            value={filefields.front.value}
                            error={filefields.front.error}
                            readOnly
                        />
                    </div>
                    <div >
                        <FormButton onClick={() => document.getElementById("dlfrontfile").click()}>Select File</FormButton>
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Copy Of The <b>Back</b> Of Your Driver's License</FormTopLabel>
                        <FormInput
                            id="license-back"
                            mask="text"
                            value={filefields.back.value}
                            error={filefields.back.error}
                            readOnly
                        />
                    </div>
                    <div >
                        <FormButton onClick={() => document.getElementById("dlbackfile").click()}>Select File</FormButton>
                    </div>
                </FormFlexRowStyle>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <FormButton height="42px" style={{ marginTop: "20px" }} onClick={handleSubmit}>Upload Document</FormButton>
                </div>
                <div style={{ marginTop: "50px" }}><Disclosure /></div>
            </>
            }

        </ContentContainer >
    )
}



