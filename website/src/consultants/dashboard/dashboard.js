import { useState } from "react"

import { TabContainer } from "../../components/portals/tabcontainer"
import { AccountsGrid } from "./accountsgrid"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { PanelContainerStyle, PanelHeaderStyle } from "../../components/portals/panelstyles"

export const Dashboard = ({setPage}) => {
    const { globalState } = useGlobalContext();
    const [tabSelected, setTabSelected] = useState(0);
    const [counts,setCounts] = useState({linked:9,pending:12});

    const tabMenu = [
        { text: `Linked Accounts (${counts.linked})`, key: 0 },
        { text: `Pending Invitations (${counts.pending})`, key: 1 }
    ]

    return (
        <PanelContainerStyle>
            <PanelHeaderStyle>
                <div>Consultants &gt; Portal &gt; Dashboard</div>
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>
                    Dashboard For {globalState.consultant.companyname}
                </div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            {<AccountsGrid setPage={setPage} parentid={globalState.consultant.recordid} status={tabSelected == 0 ? "linked" : "pending"} setCounts={setCounts}/>}
        </PanelContainerStyle>)
}