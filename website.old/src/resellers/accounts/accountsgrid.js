import { useEffect, useState } from "react"
import { GridActionButton, GridActionColumn, GridColumnHeader, GridData, GridFooterContainer, GridLoader, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { GridSearchInput } from "../../components/portals/inputstyles";
import { useGlobalContext } from "../../global/contexts/globalcontext";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { YesNo, initYesNoState } from "../../components/portals/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { useRestApi } from "../../global/hooks/restapi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faFlag } from "@fortawesome/free-solid-svg-icons";
import { ModalDropCard, ModalDropContentRow } from "../../components/portals/cardstyle";
import { useNavigate } from "react-router-dom";
import { TabContainer } from "../../components/portals/tabcontainer";


export const AccountsGrid = ({ status, setCounts, setPage }) => {
    const nav = useNavigate();
    const mousePos = useMousePosition();
    const { globalState } = useGlobalContext();
    const { gridState, updateGridData, fetchGridData } = useGridContext();
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [update, setUpdate] = useState({ url: "", verb: "POST", data: {}, reset: false });
    const [toggles, setToggles] = useState({ flags: 0, documents: 0 });
    const updateData = useRestApi(update.url, update.verb, update.data, update.reset);
    const { reportUserAction } = useUserAction();
    const [tabSelected, setTabSelected] = useState(0);
    const tabMenu = [
        { text: `Accounts`, key: 0 },
        { text: `New Account`, key: 1 }
    ]


    const columns = [{
        id: "flags",
        width: "5%",
        cellStyle: { textAlign: "center" },
        hdrStyle: {},
        sortable: 0,
        render: (ndx) => {
            return (
                <div style={{ display: "flex", alignItems: "center", width: "100%", fontSize: "19px" }}>
                    <div style={{ position: "relative", flex: 1 }}
                        onMouseEnter={() => setToggles({ flags: 1, documents: 0 })}
                        onMouseLeave={() => setToggles({ flags: 0, documents: 0 })}
                    >
                        {gridState.data[ndx].accounts_accountflags.count && <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFlag} color="red" />}
                        <ModalDropCard width="450px" top="10px" left="20px" toggled={toggles.flags} height="200px">
                            {gridState.data[ndx].accounts_accountflags.data.map((r, ndx) => {
                                return (
                                    <ModalDropContentRow key={ndx}>
                                        <div style={{ width: "130px", fontWeight: 600 }}>{r.date}</div>
                                        <div className="short" style={{ flex: 1 }}>{r.text}</div>
                                    </ModalDropContentRow>
                                )
                            })}
                        </ModalDropCard>
                    </div>
                    <div style={{ flex: 1 }} title={`${gridState.data[ndx].accounts_documents.count} Unread Document(s)`}>
                        {gridState.data[ndx].accounts_documents.count && <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFileLines} color="#164398" />}
                    </div>
                </div>
            )
        }
    }, {
        id: "companyname",
        width: status === "linked" ? "27.75%" : "37.75%",
        header: "Company Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].accounts_companyname}</div>
    }, {
        id: "active",
        width: "7.25%",
        header: "Active Drivers",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "pending",
        width: "7.25%",
        header: "Pending Drivers",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "newapps",
        width: "7.25%",
        header: "New Applicants",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "explicense",
        width: "7.25%",
        header: "Expiring Licenses",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "expmedcard",
        width: "8%",
        header: "Expiring Med Cards",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "expclearinghouse",
        width: "7.75%",
        header: "Expiring Clearinghouse",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "New",
        width: "7.25%",
        header: "New Applicants",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "annual",
        width: "7.25%",
        header: "Annual Reviews",
        cellStyle: { textAlign: "center" },
        hdrStyle: { textAlign: "center" },
        sortable: 1,
        render: (ndx) => 0
    }, {
        id: "action",
        width: status === "linked" ? "14%" : "9%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) => {
            if (status == "linked") {
                return (
                    <GridActionColumn>
                        <GridActionButton color="green" data-id={gridState.data[ndx].accounts_recordid} onClick={handleLaunch}>Launch</GridActionButton>
                        <GridActionButton color="purple" data-id={gridState.data[ndx].accounts_recordid} onClick={handleFlag}>Flag</GridActionButton>
                        {globalState.user.ismaster == "1" && <GridActionButton color="red" data-id={gridState.data[ndx].accounts_recordid} onClick={handleDelete}>Delete</GridActionButton>}
                    </GridActionColumn>
                )
            } else {
                return (
                    <GridActionColumn>
                        <GridActionButton color="green" data-id={gridState.data[ndx].accounts_recordid} onClick={handleAccept}>Accept</GridActionButton>
                        <GridActionButton color="red" data-id={gridState.data[ndx].accounts_recordid} onClick={handleReject}>Reject</GridActionButton>
                    </GridActionColumn>
                )
            }
        }
    }]

    const handleLaunch = ({ target }) => {
        const rec = gridState.data.find(r => r.accounts_recordid == target.getAttribute("data-id"))
        if (rec) {
            reportUserAction(`Logged Into Account Portal For ${rec.accounts_companyname}`)
            let url = `/accounts/portal/${target.getAttribute("data-id")}`
            nav(url)
        }
    }

    const handleFlag = ({ target }) => {
        const rec = gridState.data.find(r => r.accounts_recordid === target.getAttribute("data-id"))
        setPage({ page: 6, record: rec })
    }

    const handleDelete = ({ target }) => {
        const id = target.getAttribute("data-id");
        setYnRequest({ message: "Remove This Account, Are You Sure", left: mousePos.x, top: mousePos.y, halign: "left", entity: "delete", recordid: id });
    }

    const handleAccept = ({ target }) => {
        const id = target.getAttribute("data-id");
        setYnRequest({ message: "Accept This Account?", left: mousePos.x, top: mousePos.y, halign: "left", entity: "accept", recordid: id });
    }

    const handleReject = ({ target }) => {
        const id = target.getAttribute("data-id");
        setYnRequest({ message: "Reject This Account?", left: mousePos.x, top: mousePos.y, halign: "left", entity: "reject", recordid: id });
    }

    const yesNoCallBack = (resp, respData) => {
        if (resp) {
            let data = new FormData()
            data.append("accounts_recordid", respData.recordid)
            switch (respData.entity) {
                case "accept":
                    data.append("accounts_consultantaccepted", new Date().toISOString())
                    break;
                case "reject":
                    data.append("accounts_consultantid", null)
                    break;
                case "delete":
                    data.append("accounts_consultantaccepted", null)
                    data.append("accounts_consultantid", null)
                    break;
            }
            setUpdate({ url: "accounts", verb: "PUT", data: data, reset: !update.reset })
            fetchGridData()
        }
        setYnRequest({ ...initYesNoState })
    }

    const handleSearch = (val) => updateGridData({ search: val, page: 1 })

    const handlePageChange = (val) => updateGridData({ page: val })

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        updateGridData({ sortcol: id, page: 1, sortdir: dir })
    }

    useEffect(() => {
        updateGridData({
            url: "accounts/consultants",
            parentid: globalState.consultant.recordid,
            sortcol: "companyname",
            sortdir: "asc"
        })
    }, [updateData, status, globalState.consultant.recordid])

    useEffect(() => {
        if (gridState.status === 200) {
            let linked = 0;
            let pending = 0;
            gridState.data.forEach(r => { r.accounts_consultantaccepted !== null ? linked += 1 : pending += 1 })
        }
    }, [gridState.data])

    return (<>
        <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />        
        <div style={{ display: "flex", alignItems: "center",justifyContent:"flex-end", marginBottom: "20px" }}>            
            <div style={{ fontSize: "21px", fontWeight: 700, flex:1}}>Accounts List</div>
            <div style={{ width: "400px" }}><GridSearchInput id="search-accounts" callback={handleSearch} /></div>
        </div>
        <GridWrapper>
            <GridColumnHeader columns={columns} sortHandler={handleSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir} />
            {gridState.busy
                ? <GridLoader />
                : <GridData
                    columns={columns}
                    data={gridState.data.filter(r => (status == "pending" && r.accounts_consultantaccepted == null) || status == "linked" && r.accounts_consultantaccepted != null)}
                />
            }
            <GridFooterContainer>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </GridFooterContainer>
        </GridWrapper>
        {ynRequest.message && <YesNo {...ynRequest} callback={yesNoCallBack} />}
    </>)
}