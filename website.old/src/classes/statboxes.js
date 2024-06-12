import { useEffect, useState } from "react"
import { PortalPlayGroundStatBoxBot, PortalPlayGroundStatBoxTop, PortalPlayGroundStatsBox, PortalPlayGroundStatsContainer } from "../components/portals/newpanelstyles"
import { useGlobalContext } from "../global/contexts/globalcontext"
import { useMenuContext } from "../accounts/portal/menucontext"

export const StatBoxes = ({entity}) => {
    const { menuSelected, setTheMenu } = useMenuContext()
    const { globalState } = useGlobalContext()
    const [balance, setBalance] = useState("$0.00")

    



    useEffect(() => {
        if ("accountbalance" in globalState.tallies)
            setBalance(parseFloat(globalState.tallies.accountbalance).toLocaleString('en-US', { style: 'currency', currency: "USD" }))
    }, [globalState])

    return (
        <PortalPlayGroundStatsContainer>            
            <PortalPlayGroundStatsBox 
                color="blue" 
                style={{ marginLeft: "0px" }}
                onClick = {()=>entity=="account" && setTheMenu("newdrivers","drivers")}
                >
                <PortalPlayGroundStatBoxTop color="blue">{globalState.tallies.newapps}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="blue">
                    <div>New Applications</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Needing Review</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox >



            <PortalPlayGroundStatsBox color="red">
                <PortalPlayGroundStatBoxTop color="red">{globalState.tallies.expiringlicense}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="red">
                    <div>Expiring Licenses</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="brown">
                <PortalPlayGroundStatBoxTop color="brown">{globalState.tallies.expiringmedcard}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="brown">
                    <div>Expiring Medical Cards</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="grey">
                <PortalPlayGroundStatBoxTop color="grey">{globalState.tallies.expiringclearinghouse}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="grey">
                    <div>Expiring Clearinghouse</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="purple">
                <PortalPlayGroundStatBoxTop color="purple">{globalState.tallies.expiringannual}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="purple">
                    <div>Annual Record Reviews</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>Within 30 Days</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
            <PortalPlayGroundStatsBox color="green" style={{ marginRight: "0px" }}>
                <PortalPlayGroundStatBoxTop color="green">{balance}</PortalPlayGroundStatBoxTop>
                <PortalPlayGroundStatBoxBot color="green">
                    <div>Current Balance</div>
                    <div style={{ fontSize: "10px", fontStyle: "italic" }}>As Of Today</div>
                </PortalPlayGroundStatBoxBot>
            </PortalPlayGroundStatsBox>
        </PortalPlayGroundStatsContainer>
    )
}