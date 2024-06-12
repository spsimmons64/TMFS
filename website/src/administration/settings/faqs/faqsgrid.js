import { useContext, useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../../components/administration/panel"
import { faCircleQuestion, faPenToSquare, faSquareCaretDown, faSquareCaretUp, faTags } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../../components/administration/button"
import { GridColumnHeader, GridContainer, GridLoader, GridScrollContainer, buildGridColumnHeaders, buildGridRows, GridActionCell, GridAction } from "../../../components/administration/grid/grid"
import { initFormState, initGridState } from "../../../global/staticdata"
import { useRestApi } from "../../../global/hooks/restapi"
import { FormCheck } from "../../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../../components/administration/inputs/gridsearch"
import { GridPager } from "../../../components/administration/grid/gridpager"
import { FaqsForm } from "./faqsform"
import { useUserAction } from "../../../global/contexts/useractioncontext"
import { toProperCase } from "../../../global/globals"

export const FaqsGrid = () => {
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)
    const [position, setPosition] = useState({ ...initFormState })
    const posData = useRestApi(position.url, "POST", position.data, position.reset)
    const { reportUserAction } = useUserAction()

    const columns = [{
        id: "position",
        width: "8%",
        header: "Position",
        cellStyle: { textAlign: "center", marginTop: "4px" },
        hdrStyle: { textAlign: "center" },
        sortable: 0,
        render: (ndx) => gridData.data[ndx].faqarticles_position
    }, {
        id: "question",
        width: "30%",
        header: "Question",
        cellStyle: { marginTop: "4px" },
        hdrStyle: {},
        render: (ndx) => <div className="short">{gridData.data[ndx].faqarticles_question}</div>
    }, {
        id: "feetype",
        width: "48%",
        header: "Answer",
        cellStyle: { marginTop: "4px" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short">{gridData.data[ndx].faqarticles_answer}</div>
    }, {
        id: "action",
        width: "14%",
        header: "Actions",
        hdrStyle: { textAlign: "center" },
        cellStyle: { marginTop: "4px" },
        sortable: 0,
        render: (ndx) => (
            <GridActionCell>
                <GridAction title="Edit This Record" data-id={gridData.data[ndx].faqarticles_recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ fontSize: "24px", pointerEvents: "none" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="Reposition Up" data-id={gridData.data[ndx].faqarticles_recordid} onClick={(e) => handlePosition(e, gridData.data[ndx].faqarticles_deleted, "up")} disabled={gridData.data[ndx].faqarticles_deleted}>
                    <FontAwesomeIcon style={{ fontSize: "24px", pointerEvents: "none" }} icon={faSquareCaretUp} color="var(--grid-action-move)" />
                </GridAction>
                <GridAction title="Reposition Down" data-id={gridData.data[ndx].faqarticles_recordid} onClick={(e) => handlePosition(e, gridData.data[ndx].faqarticles_deleted, "down")} disabled={gridData.data[ndx].faqarticles_deleted}>
                    <FontAwesomeIcon style={{ fontSize: "24px", pointerEvents: "none" }} icon={faSquareCaretDown} color="var(--grid-action-move)" />
                </GridAction>
            </GridActionCell>
        )
    }]

    const getUrl = () => {
        const url = "faqs"
        const params = {
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleUpdate = ({ target }) => {
        const rec = gridData.data.find(r => r.faqarticles_recordid === target.getAttribute("data-id"))
        setGridState(ps => ({ ...ps, rowEdit: { editor: true, record: rec || {} } }))
    }

    const updateCallBack = (resp) => {
        setGridState(ps => ({ ...ps, rowEdit: { editor: false, record: {} } }))
        resp && setGridReset(!gridReset)
    }

    const handleSearch = (val) => {
        setGridState(ps => ({ ...ps, search: val }))
        setGridReset(!gridReset)
    }

    const handleSort = (id) => {
        const dir = (id === gridState.sortcol) ? (gridState.sortdir === "asc" ? "desc" : "asc") : "asc";
        setGridState(ps => ({ ...ps, sortcol: id, sortdir: dir }))
        setGridReset(!gridReset)
    }

    const handleDeactivated = (e) => {
        setGridState(ps => ({ ...ps, inactive: e.target.checked }))
        setGridReset(!gridReset)
    }

    const handlePosition = (e, disabled, dir) => {
        if (!disabled) {
            const rec = gridData.data.find(r => r.faqarticles_recordid === e.target.getAttribute("data-id"))
            if (rec) {
                reportUserAction(`Moved FAQ Article ${rec.faqarticles_question} ${toProperCase(dir)}`)
                let data = new FormData()
                data.append("recordid", e.target.getAttribute("data-id"))
                data.append("direction", dir)
                setPosition(ps => ({...ps,  url: "faqs/move", data: data, reset: !position.reset }))
            }
        }
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    useEffect(() => {
        reportUserAction("Viewed TMFS Administrative FAQ Articles")
        setGridReset(!gridReset)
    }, [])

    useEffect(() => { posData.status == 200 && setGridReset(!gridReset) }, [posData])

    useEffect(() => { setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset })) }, [gridReset])

    useEffect(() => { gridData.status === 200 && setGridState(ps => ({ ...ps, busy: false, count: gridData.count })) }, [gridData])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faCircleQuestion} /></div>
                    <div style={{ flex: 1 }}>FAQ Articles</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="faqs-search"
                        placeholder="Search All Articles..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "110px", marginLeft: "10px" }} label="New FAQ" onClick={handleUpdate} />
                </div>
            </PanelHeader>
            <PanelContent>
                <GridContainer>
                    <GridColumnHeader >{buildGridColumnHeaders(columns, handleSort, gridState.sortcol, gridState.sortdir)} </GridColumnHeader>
                    <GridScrollContainer>
                        {gridState.busy
                            ? <GridLoader />
                            : buildGridRows(columns, gridData.data)
                        }
                    </GridScrollContainer>
                </GridContainer>
            </PanelContent>
            <PanelFooter>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </PanelFooter>
        </Panel >
        {gridState.rowEdit.editor && <FaqsForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}