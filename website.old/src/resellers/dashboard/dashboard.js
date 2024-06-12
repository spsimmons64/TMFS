import { useState } from "react";
import { TabContainer } from "../../components/portals/tabcontainer"
import { PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { PortalPlaygroundScroller } from "../../components/portals/panelstyles";
import styled from "styled-components";

import FMCSALogo from "../../assets/images/fmcsa_logo.png";
import { DocReviews } from "./docreviews";

const DashboardSplitGrid = styled.div`
width: 100%;
height: 100%;
display: flex;
`
const DashboardSplitLeft = styled.div`
display: flex;
flex-flow: column;
height: 100%;
flex:1;
`
const DashboardSplitRight = styled.div`
width: 460px;
padding-left: 10px;

`

export const Dashboard = () => {

    const [tabSelected, setTabSelected] = useState(0);
    const tabMenu = [
        { text: "Documents Needing Review", key: 100 },
        { text: `Driver Flags`, key: 101 },
        { text: `Recent Transactions`, key: 102 },
    ]

    return (<>
        <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
        <PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundScroller>
                <DashboardSplitGrid>
                    <DashboardSplitLeft>                        
                        <DashboardSplitLeft>
                            {tabSelected===0 && <DocReviews />}
                                
                        </DashboardSplitLeft>                        
                    </DashboardSplitLeft>
                    <DashboardSplitRight>
                        <div style={{ fontSize: "22px", fontWeight: "700",paddingTop:"2px" }}>Important Websites</div>
                        <div style={{ display: "flex", padding: "10px 0px" }}>
                            <div style={{ paddingRight: "10px" }}><img src={FMCSALogo} alt="FMCAS Logo" style={{ height: "40px" }} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "14px", fontWeight: 700 }}>FMCSA DOT Regulations</div>
                                <div style={{ fontSize: "14px" }}>
                                    <a href="http://www.fmcsa.dot.gov/regulations/title49/b/5/3" target="_blank" tabIndex={-1}>http://www.fmcsa.dot.gov/regulations/title49/b/5/3</a>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div style={{ fontSize: "22px", fontWeight: "700", padding: "10px 0px" }}>Important Contacts</div>
                        <div style={{ fontSize: "14px", fontWeight: "700" }}>Support Email:</div>
                        <div style={{ fontSize: "14px", paddingBottom: "10px" }}><a href="mailto:support@mail.mydriverfiles.com" tabIndex={-1}>support@mydriverfiles.com</a></div>
                        <div style={{ fontSize: "14px", fontWeight: "700" }}>Support Telephone:</div>
                        <div style={{ fontSize: "14px" }}>( 575) 268-3453</div>
                    </DashboardSplitRight>
                </DashboardSplitGrid>
            </PortalPlaygroundScroller>
        </PortalPlaygroundScrollContainerStyle>
    </>)
}