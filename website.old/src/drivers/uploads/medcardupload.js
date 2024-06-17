import styled from "styled-components"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormDate, FormInput } from "../../components/portals/inputstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { useFormHook } from "../../global/hooks/formhook"
import { Disclosure } from "../setup/disclosure"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GridLoader } from "../../components/portals/gridstyles"
import { checkDate } from "../../global/globals"


const ContentContainer = styled.div`
width:640px;
margin: 0 auto;
display:flex;
flex-flow:column;
margin-top:50px;
`

export const MedCardUpload = ({ siteid, driverid }) => {
    const nav = useNavigate()
    const { formControls, sendFormData, getValue, getError, handleChange, setFormErrors, setFormBusy, getFormBusy } = useFormHook("driver-setup")
    const [filefields, setFileFields] = useState("")

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            setFileFields(filename)
        }
    }

    const validateForm = () => {
        let errors = {}
        const today = new Date().setHours(0,0,0,0)        
        if(!checkDate(getValue("medcard"))) errors["medcard"] = "Please Enter Your Medical Certificate Expire Date"        
        if (checkDate < today) errors["medcard"] = "The Date Cannot Be In The Past"
        if (!filefields) errors["medcardfile"] = "The Copy Of Your Certificate Is Required"
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return false
        }
        return true
    }

    const handleSubmit = async (e, delflag = false) => {        
        if (validateForm()) {            
            setFormErrors({})
            let data = new FormData()
            const medcard = document.getElementById("uploadfile")
            data.append("action", "upload")
            data.append("route", "medcard")
            data.append("files[]", medcard.files[0])
            data.append("driverid", driverid)
            data.append("medcard", getValue("medcard"))
            let resp = await sendFormData("post", data, "drivers")
            if (resp.status === 200) {
                const url = `${process.env.REACT_APP_PUBLIC_URL}/${siteid}/upload/complete/${driverid}`                
                nav(url, { replace: true })
            }            
        }        
    }

    return (
        <ContentContainer>
            {getFormBusy() ? <GridLoader message="Uploading Your Document...Please Wait"/> : <>
                <input id="uploadfile" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp, .pdf"></input>
                <FormTopLabel>Medical Certificate Expire Date</FormTopLabel>
                <FormDate
                    id="medcard"
                    value={getValue("medcard")}
                    error={getError("medcard")}
                    onChange={handleChange}
                />
                <div style={{ margin: "10px" }} />
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Copy Of Your Medical Certificate</FormTopLabel>
                        <FormInput
                            id="medcardfile"
                            error={getError("medcardfile")}
                            mask="text"
                            value={filefields}
                            readOnly
                        />
                    </div>
                    <div >
                        <FormButton onClick={() => document.getElementById("uploadfile").click()}>Select File</FormButton>
                    </div>
                </FormFlexRowStyle>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <FormButton height="42px" style={{ marginTop: "20px" }} onClick={handleSubmit}>Upload Document</FormButton>
                </div>
                <div style={{ marginTop: "50px" }}><Disclosure /></div>
            </>
            }
        </ContentContainer>)
}



