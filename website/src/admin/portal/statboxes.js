import { PortalPlayGroundStatBoxBot, PortalPlayGroundStatBoxTop, PortalPlayGroundStatsBox, PortalPlayGroundStatsContainer } from "../../components/portals/newpanelstyles"
import { useGlobalContext } from "../../global/contexts/globalcontext"

export const StatBoxes = () => {
    const { globalState } = useGlobalContext()

    return (
        <PortalPlayGroundStatsContainer>
            <PortalPlayGroundStatsBox color="blue" style={{ marginLeft: "0px" }}>
                <PortalPlayGroundStatBoxTop color="blue">{globalState.reseller .new_applications}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="blue">
                    <div>New Applications</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Needing Review</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox >
            <PortalPlayGroundStatsBox color="red">
                <PortalPlayGroundStatBoxTop color="red">{globalState.reseller .expiring_licenses}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="red">
                    <div>Expiring Licenses</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="brown">
                <PortalPlayGroundStatBoxTop color="brown">{globalState.reseller .expiring_medical}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="brown">
                    <div>Expiring Medical Cards</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="grey">
                <PortalPlayGroundStatBoxTop color="grey">{globalState.reseller .expiring_clearinghouse}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="grey">
                    <div>Expiring Clearinghouse</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="purple">
                <PortalPlayGroundStatBoxTop color="purple">{globalState.reseller .annual_reviews}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="purple">
                    <div>Annual Record Reviews</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="green" style={{ marginRight: "0px" }}>
                <PortalPlayGroundStatBoxTop color="green">{globalState.reseller .current_balance}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="green">
                    <div>Current Balance</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>As Of Today</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
        </PortalPlayGroundStatsContainer>
    )
}