import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton, FormButtonStyle } from "../../components/portals/buttonstyle"
import { useContext, useEffect, useState } from "react"
import { DriverContext } from "../portal/dashboard/drivers/contexts/drivercontext"
import { CircleBack, QualificationsContext } from "../portal/dashboard/drivers/classes/qualifications"
import { getBubbleColor, getBubbleIcon } from "../../global/globals"
import styled from "styled-components"
import { FormRouterContext } from "./formroutercontext"


const PendingContainerStyle = styled.div`
width: 100%;
display:flex;
padding: 10px;
background-color: #F2F2F2;
border: 1px dotted #B6B6B6;
height: 450px;
`
const PendingContainerLeftStyle = styled.div`
width:580px;
display: flex;
justify-content: center;

`
const PendingContainerRightStyle = styled.div`
width: 350px;
display: flex;
flex-flow: column;
justify-content: space-between;
`
const CheckListContainerStyle = styled.div`
display: flex;
flex-flow: column;
justify-content: center;
background: #FFF;
border: 1px dotted #B6B6B6;
border-radius: 5px;
margin-bottom: 10px;
height: 80px;
padding: 0px 10px;
`

const ReportWrapperStyle = styled.div`
display:flex;
width:100%;
align-items:center;
justify-content:space-between;
`

const InfoContainerStyle = styled.div`
flex:1;
display: flex;
flex-flow:column;
align-items:center;
justify-content:center;
background: #F2F2F2;
border: 1px dotted #B6B6B6;
border-radius: 5px;
padding: 20px;
`
export const OverviewPending = ({ callback, settab }) => {
    const { openForm, closeForm } = useContext(FormRouterContext);
    const { driverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const [formLoaded, setFormLoaded] = useState(false)    

    const setForm = (formId) => {openForm(formId,{},formCallback)}

    const formCallback = (resp) => {
        closeForm()        
        resp && callback()
    }

    const getMVRStatus = ()  => {   
        let status = 1     
        qualifications.mvrreport.forEach(r=>{if (r.status==0) status = 0;})   
        return status
    }

    useEffect(() => { qualifications && setFormLoaded(true) }, [qualifications])

    return (<>
        {formLoaded &&
            <div style={{ padding: "10px" }}>
                <PendingContainerStyle>
                    <PendingContainerLeftStyle >
                        <div style={{ width: "93%" }}>
                            <h2 style={{ marginBottom: "20px" }}>What To Do Next?</h2>
                            <p style={{ marginBottom: "20px" }}>The driver is currently in the Pending status, meaning they are being reviewed for employment but have not
                                yet been hired and/or qualified to drive.</p>
                            <p style={{ marginBottom: "20px" }}>Now you need to decide if you are going to hire the driver by reviewing their full driver file, running a DOT
                                Pre-Employment Screening Program (PSP) Report and a state Motor Vehicle Report (MVR).</p>
                            <p style={{ marginBottom: "20px" }}>You also need to complete the Qualification Checklist to ensure you have properly qualified the driver by DOT
                                regulations. Failure to complete the qualification will result in a failed audit.</p>
                            <p><strong>Reminder:</strong> if the driver is not hired within 45 days the driver will be automatically placed
                                in the inactive file and purged 30 days later. </p>
                        </div>
                    </PendingContainerLeftStyle>
                    <PendingContainerRightStyle style={{ marginRight: "5px", flex: 1 }}>
                        <CheckListContainerStyle style={{ paddingLeft: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "70px" }}>
                                <CircleBack color={getBubbleColor(qualifications.clearinghouse.status)} size="50px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.clearinghouse.status)} style={{ fontSize: "24px" }} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>D&A Clearinghouse Query</strong>
                                <div>{qualifications.clearinghouse.text}</div>
                            </div>
                            <FormButton style={{ width: "190px" }} onClick={() => setForm(8)}>View Clearinghouse</FormButton>
                        </div>
                    </CheckListContainerStyle>
                        <CheckListContainerStyle style={{ paddingLeft: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "70px" }}>
                                <CircleBack color={getBubbleColor(qualifications.pspreport.status)} size="50px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.pspreport.status)} style={{ fontSize: "24px" }} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>DOT PSP Report</strong>
                                <div>{qualifications.pspreport.text}</div>
                            </div>
                            <FormButton style={{ width: "190px" }} onClick={() => setForm(9)}>Run PSP Report</FormButton>
                        </div>
                    </CheckListContainerStyle>
                    <CheckListContainerStyle style={{ paddingLeft: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "70px" }}>
                                <CircleBack
                                    color={getBubbleColor(qualifications.mvrreport[0].status)} size="50px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.mvrreport[0].status)} style={{ fontSize: "24px" }} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>Motor Vehicle Report</strong>
                                {getMVRStatus() == 0
                                ? <div>Not All Licenses Have An MVR Report</div>
                                : <div>{qualifications.mvrreport[0].text}</div>
                                }                                
                            </div>
                            <FormButton style={{ width: "190px" }} onClick={()=>setForm(10)}>Run MVR Report</FormButton>
                        </div>
                    </CheckListContainerStyle>
                    <CheckListContainerStyle style={{ paddingLeft: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "70px" }}>
                                <CircleBack color={getBubbleColor(qualifications.cdlisreport.status)} size="50px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.cdlisreport.status)} style={{ fontSize: "24px" }} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>CDLIS Report</strong>
                                <div>{qualifications.cdlisreport.text}</div>
                            </div>
                            <FormButton style={{ width: "190px" }} onClick={()=>{setForm(11)}}>Run CDLIS Report</FormButton>
                        </div>
                    </CheckListContainerStyle>
                    <CheckListContainerStyle style={{ paddingLeft: "5px", marginBottom: "0px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "70px" }}>
                                <CircleBack color={getBubbleColor(qualifications.qualificationlist.status)} size="50px">
                                    <FontAwesomeIcon icon={getBubbleIcon(qualifications.qualificationlist.status)} style={{ fontSize: "24px" }} />
                                </CircleBack>
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong>Driver Qualification</strong>
                                <div>{qualifications.qualificationlist.text}</div>
                            </div>
                            <FormButton onClick={()=>settab(2)} style={{ width: "190px" }}>Qualifications Checklist</FormButton>
                        </div>
                    </CheckListContainerStyle>
                    </PendingContainerRightStyle>
                    <PendingContainerRightStyle style={{ marginLeft: "5px" }}>
                        <CheckListContainerStyle style={{ width: "none", flex: "1", alignItems: "center" }}>
                            <CircleBack color="green" size="80px">
                                <FontAwesomeIcon icon={faPlus} size="3x" />
                            </CircleBack>
                            <FormButtonStyle onClick={() => setForm("hire")} style={{ width: "200px", marginTop: "20px" }}> Hire This Applicant</FormButtonStyle>
                        </CheckListContainerStyle>
                        <CheckListContainerStyle style={{ width: "none", flex: "1", marginBottom: "0px", alignItems: "center" }}>
                            <CircleBack color="red" size="80px">
                                <FontAwesomeIcon icon={faXmark} size="3x" />
                            </CircleBack>
                            <FormButtonStyle onClick={() => setForm(6)} style={{ width: "200px", marginTop: "20px" }}>Do Not Hire</FormButtonStyle>
                        </CheckListContainerStyle>
                    </PendingContainerRightStyle>
                </PendingContainerStyle>
                <div style={{ borderBottom: "1px dotted #B6B6B6", width: "100%", margin: "10px 0px" }}></div>
                <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}><h2>Driver Overview</h2></div>
                <ReportWrapperStyle>
                    <InfoContainerStyle style={{ marginRight: "5px" }}>
                        <div>{driverRecord.firstname} {driverRecord.lastname}</div>
                        <div><strong>Full Name</strong></div>
                    </InfoContainerStyle>
                    <InfoContainerStyle style={{ margin: "0px 5px" }}>
                        <div>{driverRecord.emailaddress}</div>
                        <div><strong>Email Address</strong></div>
                    </InfoContainerStyle>
                    <InfoContainerStyle style={{ marginLeft: "5px" }}>
                        <div>{driverRecord.telephone1}</div>
                        <div><strong>Phone Number</strong></div>
                    </InfoContainerStyle>
                </ReportWrapperStyle>
                <ReportWrapperStyle style={{ margin: "10px 0px" }}>
                    <InfoContainerStyle style={{ marginRight: "5px" }}>
                        <div>{driverRecord.license[0].licensenumber}</div>
                        <div><strong>{driverRecord.license[0].state} State License Number</strong></div>
                    </InfoContainerStyle>
                    <InfoContainerStyle style={{ margin: "0px 5px" }}>
                        <div>{driverRecord.license[0].expires}</div>
                        <div><strong>License Expires</strong></div>
                    </InfoContainerStyle>
                    <InfoContainerStyle style={{ marginLeft: "5px" }}>
                        <div>{driverRecord.dates.medcardexpires || "N/A"}</div>
                        <div><strong>Medical Certificate Expires</strong></div>
                    </InfoContainerStyle>
                </ReportWrapperStyle>
                <div style={{ width: "100%", textAlign: "center", margin: "20px 0px" }}>
                    <FormButton onClick={()=>settab(1)}>Edit Driver Information</FormButton>
                </div>
            </div >
        }
    </>)
}
