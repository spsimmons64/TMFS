import { GridAction, GridActionButton, GridActionColumn, GridColumnHeader, GridData, GridLoader, GridWrapper } from "../../../../../components/portals/gridstyles"
import { useGlobalContext } from "../../../../../global/contexts/globalcontext"
import { useGridHook } from "../../../../../global/hooks/gridhook"
import { useContext, useEffect, useState } from "react"
import { GridPager } from "../../../../../components/portals/gridpager"
import { CircleButton, FormButton } from "../../../../../components/portals/buttonstyle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileLines, faFlag, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FormInput } from "../../../../../components/portals/inputstyles"
import { TabContainer } from "../../../../../components/portals/tabcontainer"
import { PortalPlayGroundPageTitleStyle, PortalPlayGroundStatsContainer } from "../../../../../components/portals/newpanelstyles"
import { StatBoxes } from "../../../../../classes/statboxes"
import { DriversForm } from "../forms/driversform"
import { useRestApi } from "../../../../../global/hooks/apihook"
import { DriverContext } from "../contexts/drivercontext"
import styled from "styled-components"

const GridContainer = styled.div`
width: 100%;
flex:1;
display:flex;
flex-flow: column;
`
const GridHeaderContainer = styled.div`
display:flex;
padding: 10px 10px;
width: 100%;
align-items:center;
`
export const AllDriversGrid = () => {
    const { globalState } = useGlobalContext()
    const { fetchData } = useRestApi();
    const { setDriverRecord } = useContext(DriverContext)
    const { gridState, setGridUrl, setGridPage, setGridSort, setGridPageMax } = useGridHook()
    const [tabPage, setTabPage] = useState(0)    
    const [driverForm, setDriverForm] = useState(false)
    const tabOptions = [{ text: "Driver List", hidden: false }, { text: "Search", hidden: false }]

    const columns = [{
        id: "driverflags",
        width: "8%",
        header: "Notifications",
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) => {
            return (
                <div style={{ display: "flex", width: "80px", margin: "0 auto", justifyContent: "center" }}>
                    {gridState.data[ndx].flags &&
                        <div style={{ width: "40px", }} >
                            <CircleButton
                                style={{ border: "none", backgroundColor: "none", backgroundImage: "linear-gradient(to bottom, rgba(233,73,73,1) 0%,rgba(159,20,20,1) 100%)" }}
                                fontcolor="#FFF"
                                size="28px"
                                onClick={() => alert('HERE')}
                                title="Driver Has Flags">
                                <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFlag} />
                            </CircleButton>
                        </div>
                    }
                    {gridState.data[ndx].docreview &&
                        <div style={{ width: "40px", }} >
                            <CircleButton
                                style={{ border: "none", backgroundColor: "none", backgroundImage: "linear-gradient(to bottom, rgba(77,130,230,1) 0%,rgba(22,67,152,1) 100%)" }}
                                fontcolor="#FFF"
                                size="28px"
                                onClick={() => alert('HERE')}
                                title="Documents Need To Be Reviewed">
                                <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFileLines} />
                            </CircleButton>
                        </div>
                    }
                </div>
            )
        }
    }, {
        id: "drivername",
        width: "12.25%",
        header: "Driver Name",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => {
            let newStyle = {fontWeight:700, pointerEvents: "none"};
            if (gridState.data[ndx].status !== "Application" && gridState.data[ndx].status !== "Review"){
                Object.assign(newStyle,{textDecoration: "underline", color: "#164398"})
            }
            return (
                <div className="short" data-id={gridState.data[ndx].recordid} style={{ cursor: "pointer" }} onClick={handleDriverForm}>
                    <span style={newStyle}>{gridState.data[ndx].drivername}</span>
                </div>
            )
        }
    }, {
        id: "emailaddress",
        width: "10.25%",
        header: "Email Address",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].emailaddress}</div>
    }, {
        id: "telephone",
        width: "10.25%",
        header: "Telephone",
        cellStyle: {},
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].telephone}</div>
    }, {
        id: "annualreview",
        width: "10.25%",
        header: "Annual Review",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].annualreview}</div>
    }, {
        id: "clearinghouse",
        width: "10.25%",
        header: "CH Annual Query",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].clearinghouse}</div>
    }, {
        id: "licenseexpire",
        width: "10.25%",
        header: "License Expires",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].licenseexpires}</div>
    }, {
        id: "medcard",
        width: "10.25%",
        header: "Med Card Expires",
        cellStyle: { textAlign: "center" },
        hdrAlign: "center",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].medcardexpires}</div>
    }, {
        id: "status",
        width: "10.25%",
        header: "Status",
        cellStyle: {},
        hdrAlign: "",
        sortable: 1,
        render: (ndx) => <div className="short">{gridState.data[ndx].driverstatus}</div>
    }, {
        id: "action",
        width: "8%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="View Driver Profile" data-id={gridState.data[ndx].recordid} >
                    <GridActionButton
                        data-id={gridState.data[ndx].recordid}
                        style={{ width: "110px", color: "#FFF" }}
                        color="green"
                        disabled={gridState.data[ndx].status === "Application" || gridState.data[ndx].status === "Review"}
                        onClick={handleDriverForm}
                    >View Driver Profile
                    </GridActionButton>
                </GridAction>
            </GridActionColumn>
    }]

    const handleDriverForm = async({ target }) => {        
        const id = target.getAttribute("data-id")
        const response = await fetchData(`drivers?action=fetch&driverid=${id}&entity="account"`, "get")
        response.status == 200 && setDriverRecord(response.data)                
        setDriverForm(true)
    }

    const handleDriverFormCallBack = (resp) => {
        setDriverRecord({})
        setDriverForm(false)
    }

    useEffect(() => {
        if (globalState.account.recordid) {
            setGridPageMax(6, false)
            setGridUrl(`drivers?action=grid&parentid=${globalState.account.recordid}&route=all&entity=account`, false)
            setGridSort("added", "desc", true)
        }
    }, [globalState])

    return (
        <>
            {!driverForm
                ? <>
                    <PortalPlayGroundPageTitleStyle><h1>All Drivers</h1></PortalPlayGroundPageTitleStyle>
                    <PortalPlayGroundStatsContainer><StatBoxes /></PortalPlayGroundStatsContainer>
                    <div style={{ borderBottom: "1px dotted #B6B6B6" }}></div>
                    <TabContainer options={tabOptions} selected={tabPage} callback={setTabPage} />
                    <GridHeaderContainer>
                        <div style={{ flex: 1 }}><h2>Driver List</h2></div>
                        <div style={{ paddingRight: "10px" }}><strong>Quick Search:</strong></div>
                        <div style={{ width: "400px", textAlign: "right" }}>
                            <FormInput
                                id="grid_search"
                                mask="text"
                                //onChange={handleChange}
                                placeholder="Search Drivers..."
                                hideerror
                            />
                        </div>
                        <div style={{ justifyContent: "flex-end", marginLeft: "10px" }} >
                            <CircleButton size="34px" onClick={() => alert('HERE')} title="Generate Report"><FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faPrint} /></CircleButton>
                        </div>
                    </GridHeaderContainer>
                    <GridContainer>
                        <GridWrapper style={{ border: "none" }}>
                            <GridColumnHeader columns={columns} sortHandler={setGridSort} sortcol={gridState.sortcol} sortdir={gridState.sortdir}></GridColumnHeader>
                            {gridState.busy ? <GridLoader /> : <GridData columns={columns} data={gridState.data} />}
                        </GridWrapper>
                        <GridPager style={{ height: "32px", backgroundColor: "#F3F3F3", borderTop: "1px dotted #B6B6B6" }} page={gridState.page} count={gridState.count} limit={gridState.limit} callback={setGridPage}></GridPager>
                    </GridContainer>
                </>
                : <DriversForm callback={handleDriverFormCallBack} />
            }
        </>)
}
