import { useContext, useEffect, useState } from "react"
import { PortalSplitPlaygroundContainer, PortalSplitPlaygroundLeftContainer, PortalSplitPlaygroundRightContainer } from "../../../../../../components/portals/newpanelstyles"
import { PDFContainer } from "../../../../../../components/portals/pdfviewer"
import { getApiUrl } from "../../../../../../global/globals"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { PendingForm } from "../pendingform"
import { DiscardForm } from "../discardform"
import { RejectForm } from "../rejectform"
import styled from "styled-components"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { DriverContext } from "../../contexts/drivercontext"
import { useDriverFlagsContext } from "../../classes/driverflags"


const ActionDiv = styled.div`
position: relative;
padding: 5px 0px;
border-bottom: 1px dotted #B6B6B6;
max-height: 190px;
overflow:hidden;
transition: max-height .2s ease-in-out;
text-align:center;
`

const CorrectionsContainer = styled.div`
width: 100%;
height: 340px;
border: 1px dotted #B6B6B6;
display: flex;
flex-flow: column;
`

const CorrectionsScroller = styled.div`
height:0;
flex: 1 1 auto;
overflow: auto;
`

const CorrectionsRow = styled.div`
padding: 5px;
border-bottom:1px dotted #B6B6B6;
font-size: 14px;
`
export const OverviewNew = ({ callback }) => {
    const [pdfData, setPdfData] = useState({ busy: true, data: "" })
    const { driverRecord} = useContext(DriverContext)
    const [subForms, setSubForms] = useState({ pending: false, discard: false, reject: false, policy: false, flag: false })
    const { globalState, fetchProfile } = useGlobalContext();    

    const handleFormCallback = (res) => {
        setSubForms({ record: {}, pending: false, discard: false, reject: false, policy: false, flag: false });
        if (res.status === 200) {
            fetchProfile("accounts", globalState.account.recordid, globalState.user.recordid)
            callback()
        }
    }

    const getPdfFile = async () => {
        let rec = driverRecord.documents.find(r=>r.typecode==="11")
        if(rec){
            let url = `${getApiUrl()}/driverdocs/fetch?id=${rec["recordid"]}`
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
            const response = await fetch(url, headers);
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setPdfData({ busy: false, data: pdfUrl })
        }
    }

    const setForm = (formType) => {
        setSubForms({
            pending: formType === "pending" ? true : false,
            discard: formType === "discard" ? true : false,
            reject: formType === "reject" ? true : false,
        })
    }

    useEffect(() => { getPdfFile() }, [])
    
    return (<>
        <PortalSplitPlaygroundContainer >
            <PortalSplitPlaygroundLeftContainer style={{ borderRight: "1px dotted #B6B6B6" }}>
                <h2>Application For Employment</h2>
                <p style={{ paddingTop: "10px" }}>
                    Shown below is the driver's application for employment. Please review the application and decide if this applicant
                    is one you wish to pursue for employment. If so, please select the action from the right to move the applicant to the
                    Pending Employment status. Once they are pending, you can run a PSP report, MVR, CDLIS and further investigate for employment.</p>
                <p style={{ padding: "10px 0px" }}>If this applicant is not a fit for your company, please select the Discard action. </p>
                <PDFContainer busy={pdfData.busy} source={pdfData.data} title="Driver's License" height="700px" />
            </PortalSplitPlaygroundLeftContainer>
            <PortalSplitPlaygroundRightContainer>
                <div style={{ borderBottom: "1px dotted #B6B6B6" }}><h2>Actions...</h2></div>
                <ActionDiv>
                    <div style={{ width: "100%", padding: "10px 0px", textAlign: "center" }}>
                        <FormButton color="green" style={{ width: "240px", height: "42px" }} onClick={() => setForm("pending")}>Move To Pending Employment</FormButton>
                    </div>
                    <p style={{ padding: "10px 0px" }}><strong>Consider This Driver For Employment.</strong></p>
                    Once considered you can run PSP, MVR, CDLIS for further investigation.
                </ActionDiv>
                <ActionDiv>
                    <div style={{ width: "100%", padding: "10px 0px", textAlign: "center" }}>
                        <FormButton color="red" style={{ width: "240px", height: "42px" }} onClick={() => setForm("discard")}>Discard This Application</FormButton>
                    </div>
                    <p style={{ padding: "10px" }}><strong>DO NOT Consider This Driver For Employment.</strong></p>
                    This driver will not be hired at this time.
                </ActionDiv>
                <ActionDiv>
                    <div style={{ width: "100%", padding: "10px 0px", textAlign: "center" }}>
                        <FormButton color="gold" style={{ width: "240px", height: "42px" }} onClick={() => setForm("reject")}>Send Back For Correction</FormButton>
                    </div>
                    <p style={{ padding: "10px 0px" }}><strong>Send Back For Correction.</strong></p>
                    <p>Send the application back for incomplete or errors on the. You'll provide a reason and the applicant can fix and resubmit.</p>
                </ActionDiv>
                <div style={{ padding: "10px 0px" }}><h2>Previous Corrections...</h2></div>
                <CorrectionsContainer>
                    <CorrectionsScroller>
                        {driverRecord.corrections.map(r => {
                            return (
                                <CorrectionsRow key={r.recordid}>
                                    <div><strong>{r.sentdate}</strong></div>
                                    <div>{r.reason}</div>
                                </CorrectionsRow>
                            )
                        })}
                    </CorrectionsScroller>
                </CorrectionsContainer>
            </PortalSplitPlaygroundRightContainer>
        </PortalSplitPlaygroundContainer>
        {subForms.pending && <PendingForm callback={handleFormCallback} />}
        {subForms.discard && <DiscardForm callback={handleFormCallback} />}
        {subForms.reject && <RejectForm callback={handleFormCallback} />}

    </>)
}