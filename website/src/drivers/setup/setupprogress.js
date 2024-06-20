import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleCheck, faCircleMinus, faCircleQuestion, faMinus, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FormButton } from "../../components/portals/buttonstyle";
import { CircleBack } from "../../accounts/portal/dashboard/drivers/classes/qualifications";


const SetupProgressContainer = styled.div`
width: 100%;
padding: 10px 10px;
font-size: 13px;

`
const SetupStepContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
margin: 10px 0px 24px 0px;
`
const SetupStepIconContainer = styled.div`
display: flex;
width: 50px;
font-size: 36px;
align-items:center;
justify-content: center;
padding-right: 10px;
`
const SetupStepTextContainer = styled.div`
flex:1;
`
export const SetupProgress = ({ steps, setpage, page }) => {
    return (
        <SetupProgressContainer>
            <span style={{ fontSize: "24px", fontWeight: 700 }}>Application Process</span>
            {steps.map((r, rndx) => {
                let icon = r.status == 2 ? faMinus : (r.status == 1 ? faCheck : faQuestion)
                let color = r.status == -1 ? "grey" : (r.status == 0 ? "red" : "green")
                if (r.status == 2) color = "grey"
                if (r.status == 3) color = "gold"
                return (
                    <SetupStepContainer key={rndx}>
                        <SetupStepIconContainer>
                            <CircleBack color = {color} size="38px" style={{fontSize:"18px",paddingLeft:"4px"}}>
                                <FontAwesomeIcon icon={icon} color="#FFF" />
                            </CircleBack>                            
                        </SetupStepIconContainer>
                        <SetupStepTextContainer>
                            <div style={{ fontSize: "16px", fontWeight: 700 }}>{r.header}</div>
                            <div>{r.text}</div>
                        </SetupStepTextContainer>
                    </SetupStepContainer>
                )
            })}
            {page < 15 && <>
                <hr style={{ marginBottom: "10px" }} />
                <span style={{ fontSize: "18px", fontWeight: 700 }}>Save And Finish Later</span>
                <p>Your application is not sent or visible to the employer until it is 100% complete.</p>
                <div style={{ width: "100%", textAlign: "center", paddingTop: "20px" }}>
                    <FormButton onClick={() => setpage(16)}>Save And Finish Later</FormButton>
                </div>
            </>}
        </SetupProgressContainer>
    )
}