import { FormSection } from "../../../../../../components/global/forms/forms"
import { CircleBack, QualificationsContext } from "../../classes/qualifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { FormButton } from "../../../../../../components/portals/buttonstyle"
import { DriverContext } from "../../contexts/drivercontext"
import { useContext, useState } from "react"
import { useGlobalContext } from "../../../../../../global/contexts/globalcontext"
import { QualApplicationForm } from "./applicationform"
import { getBubbleColor, getBubbleIcon } from "../../../../../../global/globals"
import styled from "styled-components"
import { DriverInquiryForm } from "./driverinquiryform"
import { GoodFaithForm } from "./goodfaithform"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import { RoadTestForm } from "./roadtestform"
import { RoadTestCertForm } from "./roadtestcertform"


const QualContainer = styled.div`
display: flex;
padding: 8px 0px;
border-bottom: 1px dotted #B6B6B6;
align-items:center;

`
const QualColumn1 = styled.div`
width: 60px;
`
const QualColumn2 = styled.div`
flex:1;
& span{font-size:14px;}
& a{color:#164398;}
`
const QualColumn3 = styled.div`
width: 300px;
`
const QualColumn4 = styled.div`
text-align: center;
width: 250px;
`
export const QualificationsForm = () => {
    const { globalState } = useGlobalContext()
    const { driverRecord, setDriverRecord } = useContext(DriverContext)
    const { qualifications } = useContext(QualificationsContext)
    const [form, setForm] = useState(-1)

    const handleFormCallback = (res) => {
        setForm(-1)
        res.status === 200 && setDriverRecord(res.data)
    }

    const getDrivingInquiryStatus = () => {
        let status = 1
        qualifications.drivinginquiry.forEach(r => { if (r.status == 0) status = 0; })
        return status
    }

    const getGoodFaithStatus = () => {
        let status = 1
        let mvr = true
        qualifications.mvrreport.forEach(r => { if (r.status === 0 || r.status === 3) mvr = false })
        if (mvr)
            status = 5
        else {
            qualifications.goodfaitheffort.forEach(r => {
                let mvr_rec = qualifications.mvrreport.find(q => q.licenseid === r.licenseid)
                if (mvr_rec && r.status === 0 && mvr_rec.status === 0) status = 0
            })
        }
        return status
    }
    const getRoadTestStatus = () => {
        let status = 0
        if (qualifications.roadtest.status==1 || qualifications.dlcopy.status==1) status = 1
        return status
    }

    return (<>
        <div style={{ padding: "10px" }}>
            <FormSection style={{ borderBottom: "none" }}>
                <h2>Driver Qualification File</h2>
            </FormSection>
            <QualContainer>
                <QualColumn1 />
                <QualColumn2><b>Checklist Item</b></QualColumn2>
                <QualColumn3><b>Current Status</b></QualColumn3>
                <QualColumn4><b>Action</b></QualColumn4>
            </QualContainer>
            <QualContainer>
                <QualColumn1>
                    <CircleBack color={getBubbleColor(qualifications.application.status)} size="40px">
                        <FontAwesomeIcon icon={getBubbleIcon(qualifications.application.status)} />
                    </CircleBack>
                </QualColumn1>
                <QualColumn2>
                    <div><b>Proper "DOT" Application</b></div>
                    <span>
                        <Link
                            to="https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-391/subpart-C/section-391.21"
                            target="_blank"
                        >FMCSA 49 CFR Part 391.21
                        </Link>
                    </span>
                </QualColumn2>
                <QualColumn3>{qualifications.application.text}</QualColumn3>
                <QualColumn4>
                    <FormButton style={{ width: "150px" }} onClick={() => setForm(0)}>View Details</FormButton>
                </QualColumn4>
            </QualContainer>
            <QualContainer>
                <QualColumn1>
                    <CircleBack color={getBubbleColor(getDrivingInquiryStatus())} size="40px">
                        <FontAwesomeIcon icon={getBubbleIcon(getDrivingInquiryStatus())} />
                    </CircleBack>
                </QualColumn1>
                <QualColumn2>
                    <div><b>{"Inquiry Into Driving Record (Preceding 3 Years)"}</b></div>
                    <span>
                        <Link
                            to="https://www.ecfr.gov/current/title-49/section-391.23"
                            target="_blank"
                        >FMCSA 49 CFR Part 391.23
                        </Link>
                    </span>
                </QualColumn2>
                <QualColumn3>{getDrivingInquiryStatus() === 0 ? "Incomplete" : "Complete For All Licenses"}</QualColumn3>
                <QualColumn4>
                    <FormButton style={{ width: "150px" }} onClick={() => setForm(1)}>View Details</FormButton>
                </QualColumn4>
            </QualContainer>
            <QualContainer>
                <QualColumn1>
                    {getGoodFaithStatus() == 5
                        ? <CircleBack color="blue" size="40px">
                            <FontAwesomeIcon icon={faMinus} />
                        </CircleBack>
                        : <CircleBack color={getBubbleColor(getGoodFaithStatus())} size="40px">
                            <FontAwesomeIcon icon={getBubbleIcon(getGoodFaithStatus())} />
                        </CircleBack>
                    }
                </QualColumn1>
                <QualColumn2>
                    <div><b>{"Good Faith Effort Document (When Required)"}</b></div>
                    <span>
                        <Link
                            to="https://www.ecfr.gov/current/title-49/section-391.23"
                            target="_blank"
                        >FMCSA 49 CFR Part 391.23
                        </Link>
                    </span>
                </QualColumn2>
                <QualColumn3>
                    {getGoodFaithStatus() === 0 && "Not Complete For All Licenses"}
                    {getGoodFaithStatus() === 1 && "Complete For All Licenses"}
                    {getGoodFaithStatus() === 5 && "Not Required"}
                </QualColumn3>
                <QualColumn4>
                    <FormButton style={{ width: "150px" }} onClick={() => setForm(2)}>View Details</FormButton>
                </QualColumn4>
            </QualContainer>

            <QualContainer>
                <QualColumn1>
                    <CircleBack color={getBubbleColor(getRoadTestStatus())} size="40px">
                        <FontAwesomeIcon icon={getBubbleIcon(getRoadTestStatus())} />
                    </CircleBack>
                </QualColumn1>
                <QualColumn2>
                    <div><b>{"Road Test Or Copy Of Driver's License In Lieu Of Road Test"}</b></div>
                    <span>
                        <Link
                            to="https://www.ecfr.gov/current/title-49/section-391.31"
                            target="_blank"
                        >FMCSA 49 CFR Part 391.31
                        </Link>
                        &nbsp;
                        &
                        &nbsp;
                        <Link
                            to="https://www.ecfr.gov/current/title-49/section-391.33"
                            target="_blank"
                        >FMCSA 49 CFR Part 391.33
                        </Link>
                    </span>
                </QualColumn2>
                <QualColumn3>
                    {getRoadTestStatus() === 0 && "Not In Compliance"}
                    {getRoadTestStatus() === 1 && "Complete"}
                </QualColumn3>
                <QualColumn4>
                    <FormButton style={{ width: "150px" }} onClick={() => setForm(3)}>View Details</FormButton>
                </QualColumn4>
            </QualContainer>

        </div>
        {form == 0 && <QualApplicationForm callback={handleFormCallback} />}
        {form == 1 && <DriverInquiryForm callback={handleFormCallback} />}
        {form == 2 && <GoodFaithForm callback={handleFormCallback} />}
        {form == 3 && <RoadTestForm callback={handleFormCallback} />}        
    </>)
}