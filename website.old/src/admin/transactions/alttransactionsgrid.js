import { useEffect, useState } from "react"
import { GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridToolBox, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { GridSearchInput } from "../../components/portals/inputstyles";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { FormButton } from "../../components/portals/buttonstyle";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { formatMoney, toProperCase } from "../../global/globals";

export const AltTransactionsGrid = ({ assets, setPage }) => {
    const { gridState, updateGridData } = useGridContext();    
    const [parent, setParent] = useState({ parent: "", id: "", name: "", balance: 0, balance_color: "green" })
    const [totals, setTotals] = useState(0)

    const columns = [{
        id: "added",
        width: "10%",
        header: "Transaction Date",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].added}
            </div>
        )
    }, {
        id: "status",
        width: "6%",
        header: "Status",
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].errorstatus ? "Success" : "Error"}
            </div>
        )
    }, {
        id: "companyname",
        width: "28%",
        header: "Account Name",
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].companyname}
            </div>
        )

    }, {
        id: "description",
        width: "28%",
        header: "Transaction Description",
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].description}
            </div>
        )
    }, {
        id: "type",
        width: "8%",
        header: "Type",
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].transmethod == "1" ? "Deposit" : "Withdrawal"}
            </div>
        )
    }, {
        id: "transamount",
        width: "8%",
        header: "Amount",
        cellStyle: { textAlign: "right"},
        hdrAlign: "right",
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {formatMoney(gridState.data[ndx].transamount)}
            </div>
        )
    }, {
        id: "username",
        width: "12%",
        header: "Invoked By",
        cellStyle: {},        
        sortable: 1,
        render: (ndx) => (
            <div className="short" style={{ color: !gridState.data[ndx].errorstatus && "red" }}>
                {gridState.data[ndx].username}
            </div>
        )        
    }]

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 3, subpage: 5, entity: assets.entity, entityRecord: assets.entityRecord, record: rec || {} })
    }

    const handleReturnButton = () => {
        if (assets.entity === "reseller") setPage({ page: 3, subpage: -1, record: {} })
        if (assets.entity === "account") setPage({ page: 2, subpage: -1, record: {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, sortdir: dir })
    }

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => {
        let new_parent = toProperCase(assets.entity);
        let new_url = ""
        let new_id = ""
        let new_name = ""
        let new_balance = 0
        let new_level = 0
        let new_color = ""
        switch (assets.entity) {
            case "reseller":
                new_url = "transactions/resellers"
                new_id = assets.entityRecord.recordid
                new_name = assets.entityRecord.companyname
                new_balance = parseFloat(assets.entityRecord.balance)
                new_level = parseFloat(assets.entityRecord.balance)
                break;
            case "account":
                new_url = "transactions/accounts"
                new_id = assets.entityRecord.recordid
                new_name = assets.entityRecord.companyname
                new_balance = parseFloat(assets.entityRecord.balance)
                new_level = parseFloat(assets.entityRecord.balance)
                break;
            default:
                new_url = ""
                new_id = ""
        }
        new_color = (new_balance <= new_level ? "#76B66A" : "red")
        setParent({ parent: new_parent, id: new_id, name: new_name, balance: formatMoney(new_balance), balance_color: new_color })
        updateGridData({ url: new_url, parentid: new_id, sortcol: "added", sortdir: "desc" })
    }, [])

    useEffect(() => {
        let totals = 0;
        gridState.data.forEach(r => { totals += r.transamount })
        setTotals(totals)
    }, [gridState.data])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <PortalPlayGroundBreadCrumbStyle>
                        {`TMFS Administration > ${parent.parent} > ${parent.name} > Billing History`}
                    </PortalPlayGroundBreadCrumbStyle>
                    <PortalPlayGroundPageTitleStyle>{`${parent.parent} Billing History`}</PortalPlayGroundPageTitleStyle>
                </div>
                <div style={{ border: "1px solid #B3B3B3", borderRadius: "3px", width: "282px", marginTop: "-6px" }}>
                    <div style={{ backgroundColor: "#3A3A3A", textAlign: "center", color: "#E0E0E0", fontSize: "14px", fontWeight: 600 }}>Current Balance</div>
                    <div style={{ textAlign: "center", fontSize: "18px", padding: "8px 0px", fontWeight:700 }}>
                        <span style={{ color: parent.balance_color }}>{parent.balance}</span>
                    </div>
                </div>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>{`${parent.parent} Transaction Listing For ${parent.name}`}</div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Transactions..." id="search-transactions" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleReturnButton}>{`Back To ${parent.parent}s`}</FormButton>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>New Transaction</FormButton>
                    </div>
                </GridToolBox>
                <GridWrapper>
                    <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
                    {gridState.busy
                        ? <GridLoader />
                        : <GridData columns={columns} data={gridState.data}
                        />
                    }
                    <GridFooterContainer>
                        <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
                    </GridFooterContainer>
                </GridWrapper>
            </PortalPlaygroundScrollContainerStyle>
        </PortalPlayGroundStyle>
    )
}