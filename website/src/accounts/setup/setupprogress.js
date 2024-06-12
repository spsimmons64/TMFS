import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleCheck, faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { CircleBack } from "../portal/dashboard/drivers/classes/qualifications";


const SetupProgressContainer = styled.div`
width: 100%;
padding: 10px 10px 0px 20px;
`
const SetupStepContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
margin: 10px 0px 20px 0px;
`
const SetupStepIconContainer = styled.div`
display: flex;
width: 60px;
font-size: 36px;
align-items:center;
justify-content: center;
`
const SetupStepTextContainer = styled.div`
flex:1;
font-size:14px;
`
export const SetupProgress = ({ page, status }) => {

    const getPageStatus = (page) => {
        const rec = status.find(r => r.page === page)
        if (rec) {
            console.log(rec)
            if (rec.status == "ok") {                
                return { color: "green", icon: faCheck }
            } else {
                return { color: "red", icon: faXmark }
            }
        } else {
            return { color: "grey", icon: faQuestion }
        }
    }
    return (
        <SetupProgressContainer>
            <span style={{ fontSize: "24px", fontWeight: 700 }}>Setup Process</span>
            <SetupStepContainer>
                <SetupStepIconContainer>
                    <CircleBack color={getPageStatus(0).color} size="38px" style={{ fontSize: "18px", paddingLeft: "4px" }}>
                        <FontAwesomeIcon icon={getPageStatus(0).icon} color="#FFF" />
                    </CircleBack>
                </SetupStepIconContainer>
                <SetupStepTextContainer>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>Step 1: General Account Information</div>
                    <div>Enter Your General Account Information</div>
                </SetupStepTextContainer>
            </SetupStepContainer>
            <SetupStepContainer>
                <SetupStepIconContainer>
                    <CircleBack color={getPageStatus(1).color} size="38px" style={{ fontSize: "18px", paddingLeft: "4px" }}>
                        <FontAwesomeIcon icon={getPageStatus(1).icon} color="#FFF" />
                    </CircleBack>
                </SetupStepIconContainer>
                <SetupStepTextContainer>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>Step 2: Login Information And Friendly URL</div>
                    <div>Setup Your Login and Friendly URL</div>
                </SetupStepTextContainer>
            </SetupStepContainer>
            <SetupStepContainer>
                <SetupStepIconContainer>
                    <CircleBack color={getPageStatus(2).color} size="38px" style={{ fontSize: "18px", paddingLeft: "4px" }}>
                        <FontAwesomeIcon icon={getPageStatus(1).icon} color="#FFF" />
                    </CircleBack>

                </SetupStepIconContainer>
                <SetupStepTextContainer>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>Step 3: Initial Deposit And Reload Settings</div>
                    <div>Calculate your initial deposit and configure auto deposit settings.</div>
                </SetupStepTextContainer>
            </SetupStepContainer>
            <SetupStepContainer>
                <SetupStepIconContainer>
                    <CircleBack color={getPageStatus(1).color} size="38px" style={{ fontSize: "18px", paddingLeft: "4px" }}>
                        <FontAwesomeIcon icon={getPageStatus(3).icon} color="#FFF" />
                    </CircleBack>

                </SetupStepIconContainer>
                <SetupStepTextContainer>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>Step 4: Billing Profile</div>
                    <div>Add your credit, debit or eCheck to use when depositing funds.</div>
                </SetupStepTextContainer>
            </SetupStepContainer>
            <SetupStepContainer>
                <SetupStepIconContainer>
                    <CircleBack color={getPageStatus(1).color} size="38px" style={{ fontSize: "18px", paddingLeft: "4px" }}>
                        <FontAwesomeIcon icon={getPageStatus(4).icon} color="#FFF" />
                    </CircleBack>
                </SetupStepIconContainer>
                <SetupStepTextContainer>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>Step 5: Confirmations And Agreements</div>
                    <div>Confirm your deposit/billing settings and Term Agreements.</div>
                </SetupStepTextContainer>
            </SetupStepContainer>
            <hr />
            {(page > 1 && page < 5) && <>
                <div style={{ fontSize: "24px", fontWeight: 700, margin: "10px 0px" }}>Finish Later</div>
                <p style={{ fontSize: "14px" }}>Need to finish the setup process later for any reason? No problem! You've been sent an email with a
                    link that you can use to return to this setup wizard. Your information is saved after each step so you won't lose what you've
                    already done!</p>
                <hr style={{ margin: "20px 0px 10px 0px" }} />
            </>}
            {page < 5 && <>
                <div style={{ fontSize: "24px", fontWeight: 700, margin: "10px 0px" }}>Important Note</div>
                <p style={{ fontSize: "14px" }}>All information entered on this setup wizard can be changed later through your account Control panel with
                    the exception of your <b>Friendly URL.</b></p>
            </>}
        </SetupProgressContainer>
    )
}