import React, { useEffect, useState } from "react"
import { StatBoxes } from "../../../classes/statboxes"
import { DocReviews } from "./docreview"
import { DriverFlags } from "./driverflags"
import { RecentTrx } from "./recentrx"
import { PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStatsContainer, PortalPlaygroundScrollContainerStyle, PortalSplitPlaygroundContainer, PortalSplitPlaygroundLeftContainer, PortalSplitPlaygroundRightContainer } from "../../../components/portals/newpanelstyles"
import { Link } from "react-router-dom"
import { useRestApi } from "../../../global/hooks/apihook";
import { useGlobalContext } from "../../../global/contexts/globalcontext"
import { useBreadCrumb } from "../../../global/contexts/breadcrumbcontext"
import { DQDriversSmallGrid } from "./dqdriverssmallgrid"
import FDOTLogo from "../../../assets/images/fmcsa_logo.png";
import styled from "styled-components"


const AdBoxStyle = styled.div`
width: 100%;
height: 140px;
border: 1px dotted #B6B6B6;
border-radius: 3px;
display: flex;
align-items:center;
justify-content:center;
margin-bottom: 20px;
`

export const Dashboard = () => {
    const { updateBreadCrumb } = useBreadCrumb()
    const { globalState } = useGlobalContext();
    const { fetchData } = useRestApi()
    const [thirdParty, setThirdParty] = useState([])
    const [support, setSupport] = useState({ phone: "", email: "" })

    const getUrlPaths = (endpoint) => {
        let urlParts = window.location.href.split("/")
        urlParts[urlParts.length - 1] = endpoint
        return urlParts.join("/")
    }
    const getThirdPartyAds = async () => {
        const data = await fetchData("thirdpartyads?sortcol=title&sortdir=asc", "GET")
        data.status === 200 && setThirdParty(data.data)
    }

    useEffect(() => {
        if (globalState.reseller.hasOwnProperty("emails"))
            setSupport({ email: globalState.reseller.emails.eml_emailsupport, phone: globalState.reseller.telephone })
    }, [globalState])

    useEffect(() => {
        updateBreadCrumb("Portal > Dashboard")
        getThirdPartyAds()
    }, [])

    return (<>
        <PortalPlayGroundPageTitleStyle><h1>Dashboard</h1></PortalPlayGroundPageTitleStyle>
        <PortalPlayGroundStatsContainer><StatBoxes entity="account" /></PortalPlayGroundStatsContainer>
        <div style={{ borderBottom: "1px dotted #B6B6B6" }}></div>
        <PortalPlaygroundScrollContainerStyle>
            <PortalPlayGroundScrollerStyle>
                <PortalSplitPlaygroundContainer>
                    <PortalSplitPlaygroundLeftContainer>
                        <DQDriversSmallGrid />
                        <DocReviews />
                        <DriverFlags />
                        <RecentTrx />
                    </PortalSplitPlaygroundLeftContainer>
                    <PortalSplitPlaygroundRightContainer>
                        <h2 style={{ fontSize: "21px", marginBottom: "12px" }}>Important URLs</h2>
                        <div><span style={{ backgroundColor: "yellow", fontWeight: "700" }}>Online Driver Application</span></div>
                        <div style={{ fontSize: "12px", marginBottom: "12px" }}><Link to={getUrlPaths("apply")}>{getUrlPaths("apply")}</Link></div>
                        <div><span style={{ backgroundColor: "yellow", fontWeight: "700" }}>Law Enforcement Login</span></div>
                        <div style={{ fontSize: "12px", marginBottom: "12px" }}><Link to={getUrlPaths("law")}>{getUrlPaths("law")}</Link></div>
                        <div style={{ display: "flex", marginBottom: "12px" }}>
                            <div style={{ width: "40px" }}><img src={FDOTLogo} alt="FDOT Logo" style={{ height: "40px" }} /></div>
                            <div style={{ paddingLeft: "10px" }}>
                                <div><span style={{ fontWeight: "700" }}>FMCSA DOT Regulations</span></div>
                                <div style={{ fontSize: "12px" }}>
                                    <Link
                                        to="http://www.fmcsa.dot.gov/regulations/title49/b/5/3">
                                        {`http://www.fmcsa.dot.gov/regulations/title49/b/5/3`}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", paddingBottom: "12px", borderBottom: "1px dotted #B6B6B6" }}>
                            <div style={{ width: "40px" }}><img src={FDOTLogo} alt="FDOT Logo" style={{ height: "40px" }} /></div>
                            <div style={{ paddingLeft: "10px" }}>
                                <div><span style={{ fontWeight: "700" }}>FMCSA Drug & Alcohol Clearinghouse</span></div>
                                <div style={{ fontSize: "12px" }}>
                                    <Link to="https://clearinghouse.fmcsa.dot.gov/">{`https://clearinghouse.fmcsa.dot.gov/`}</Link>
                                </div>
                            </div>
                        </div>
                        <h2 style={{ fontSize: "21px", marginBottom: "12px" }}>Important Contacts</h2>
                        <div style={{ fontWeight: "700" }}>Support Email</div>
                        <div style={{ fontSize: "12px", marginBottom: "12px" }}>
                            <a href={`mailto:${support.email}`}>{support.email}</a>
                        </div>
                        <div style={{ fontWeight: "700" }}>Support Telephone</div>
                        <div style={{ fontSize: "12px", paddingBottom: "12px", borderBottom: "1px dotted #B6B6B6" }}>{support.phone}</div>
                        {thirdParty.length && <>
                            <h2 style={{ fontSize: "21px", marginBottom: "12px" }}>Recommended 3rd Party Services</h2>
                            {thirdParty.map((r, ndx) => {
                                return (<React.Fragment key={ndx}>
                                    <div style={{ fontWeight: "700" }}>{r.title}</div>
                                    <AdBoxStyle>
                                        <Link to={r.link}>
                                            <img src={`data:image/png;base64,${r.logo}`} alt={`${r.title} Logo`} />
                                        </Link>
                                    </AdBoxStyle>
                                </React.Fragment>)
                            })}
                        </>}
                    </PortalSplitPlaygroundRightContainer>
                </PortalSplitPlaygroundContainer>
            </PortalPlayGroundScrollerStyle>
        </PortalPlaygroundScrollContainerStyle>
    </>)
}