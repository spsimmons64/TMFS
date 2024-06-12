import React, { useEffect, useState } from "react"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"
import { FormInput } from "../../components/portals/inputstyles"
import styled from "styled-components"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { LocationWarningStyle } from "../../components/portals/newpanelstyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { Disclosure } from "./disclosure"

const Page3Wrapper = styled.div`
width: 1400px;
height: 100%;
margin: 0 auto;
display: flex;
flex-flow:column;
`

const Page3Container = styled.div`
flex:1;
display: flex;
flex-flow:column;
align-items: center;
justify-content:center;
`

const ErrorContainer = styled.div`
width: 640px;
text-align:center;
color: #ff4d4d;
font-size: 14px;
height: 50px;
margin-top:30px;
`

export const SetupPage3 = ({ accountData, setpage }) => {
    const { handleChange, getValue, getError, buildControlsFromRecord, serializeFormData, sendFormData } = useMultiFormContext()
    const [error, setError] = useState("")

    const handleSumbit = async () => {
        let data = serializeFormData()
        data.append("acc_recordid", accountData.id)
        data.append("app_page", 3)
        let resp = await sendFormData("post", data, "fetchobj/driver/application")
        if (resp.status === 200) {
            buildControlsFromRecord(resp.data)
            setpage(resp.data.drv_applicationstep + 4)
        } else {
            resp.data && setError(resp.data)
        }
    }
    return (
        <Page3Wrapper>
            <div style={{ textAlign: "center", margin: "20px 0px 0px 0px" }}><h2>Return To Existing Application</h2></div>
            <div style={{ textAlign: "center", margin: "10px 0px 0px 0px" }}>Please complete the fields below so we may lookup your previous application</div>
            <LocationWarningStyle style={{ width: "640px", margin: "20px auto" }}>
                <div style={{ padding: "0px 10px", color: "#164398", fontSize: "20px" }}><FontAwesomeIcon icon={faCircleInfo} /></div>
                <b>Note, two devices/people cannot be active on the same application at the same time</b>
            </LocationWarningStyle>
            <Page3Container>
                <FormFlexRowStyle style={{ width: "640px" }}>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Social Security Number *</FormTopLabel>
                        <FormInput
                            id="drv_socialsecurity"
                            mask="ssn"
                            value={getValue("drv_socialsecurity")}
                            error={getError("drv_socialsecurity")}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Re-Enter Social Security Number *</FormTopLabel>
                        <FormInput
                            id="drv_csocialsecurity"
                            mask="ssn"
                            value={getValue("drv_csocialsecurity")}
                            error={getError("drv_csocialsecurity")}
                            nopaste
                            onChange={handleChange}
                        />
                    </div>
                </FormFlexRowStyle>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, padding: "16px" }}>
                        <FormButton style={{ width: "164px" }} onClick={() => setpage(1)}>Go Back</FormButton>
                    </div>
                    <div style={{ flex: 1, padding: "16px", textAlign: "right" }}>
                        <FormButton style={{ width: "164px" }} onClick={handleSumbit}>Continue Application</FormButton>
                    </div>
                </div>
                <ErrorContainer dangerouslySetInnerHTML={{ __html: error }} />
            </Page3Container>
            <div style={{ justifySelf: "flex-end", alignSelf: "center" }}> <Disclosure /></div>
        </Page3Wrapper>
    )
}