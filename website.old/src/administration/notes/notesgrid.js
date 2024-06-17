import { useEffect, useState } from "react"
import { Panel, PanelContent, PanelFooter, PanelHeader } from "../../components/administration/panel"
import { faCommentDots, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton} from "../../components/administration/button"
import { GridContainer, GridLoader, GridScrollContainer} from "../../components/administration/grid/grid"
import { initGridState } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { FormCheck } from "../../components/administration/inputs/checkbox"
import { GridSearchInput } from "../../components/administration/inputs/gridsearch"
import { GridPager } from "../../components/administration/grid/gridpager"
import { toProperCase } from "../../global/globals"
import { NotesForm } from "./notesform"
import styled from "styled-components"

const NotesGridStyle = styled.div`
display: flex;
width: 100%;
height: 100%;
`
const NotesDetailColumnStyle = styled.div`
display: flex;
flex-flow: column;
width: 40%;
`
const NotesDetailCellStyle = styled.div`
display:flex;
align-items: center;
background-color: ${props => props.selected ? "#e9effc" : "#FFF"};
padding: 8px;
border-bottom: 1px dotted var(--panel-border);
color: #404040;
cursor: pointer;
`
const NotesDetailCellTextStyle = styled.div`
flex:1;
pointer-events: none;
`
const NotesDetailCellEditStyle = styled.div`
width: 30px;
font-size: 24px;
color: var(--grid-action-edit);
pointer-events: all;
`
const NotesDetailCellTitle = styled.div`
width: 100%;
font-size: 16px;
font-weight: 600;
padding-bottom: 3px;
pointer-events: none;
`
const NotesDetailCellText = styled.div`
width: 100%;
font-size: 12px;
padding-bottom: 3px;
pointer-events: none;
`
const NotesContainerStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
width:100%;
height: 100%;
background-color: #eff7ee;
border-left: 2px solid var(--panel-border);
`
const NotesContainerTextStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
color: #404040;
`
const NotesContainerTextScrollerStyle = styled.div`
height: 0;
flex: 1 1 auto;
overflow-y:auto;
padding: 12px;
line-height: 1.25em;
`
export const NotesGrid = () => {
    const [gridState, setGridState] = useState({ ...initGridState })
    const [gridReset, setGridReset] = useState(false)
    const [holdSelected, setHoldSelected] = useState([])
    const gridData = useRestApi(gridState.url, "GET", {}, gridState.reset)

    const getUrl = () => {
        const url = "notes"
        const params = {
            parentid: "",
            inactive: gridState.inactive,
            page: gridState.page || "",
            limit: gridState.limit || "",
            sortcol: gridState.sortcol || "",
            sortdir: gridState.sortdir || "",
            search: gridState.search || ""
        };
        return url + "?" + Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    }

    const handleSelectNote = ({ target }) => {
        const id = target.getAttribute("data-id")
        setGridState(ps => ({ ...ps, selected: [id] }))
    }

    const handleUpdate = ({ target }) => {
        const id = target.getAttribute("data-id")
        const rec = gridData.data.find(r => r.notes_recordid === id)
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

    const handleDeactivated = (e) => {        
        setGridState(ps => ({ ...ps, inactive: e.target.checked }))
        setGridReset(!gridReset)
    }

    const handlePageChange = (val) => {
        setGridState(ps => ({ ...ps, page: val }))
        setGridReset(!gridReset)
    }

    const buildNoteGrid = (columns, data, rowstyle = {}) => {
        return gridData.data.map((r, rndx) => {
            return (
                <NotesDetailCellStyle key={rndx} data-id={r.notes_recordid} onClick={handleSelectNote} selected={gridState.selected.includes(r.notes_recordid)}>
                    <NotesDetailCellTextStyle>
                        <NotesDetailCellTitle>
                            <div className="short">{r.notes_companyname}</div>
                        </NotesDetailCellTitle>
                        <NotesDetailCellText>
                            <div className="short">{`${r.notes_added} By ${r.notes_username}`}</div>
                        </NotesDetailCellText>
                        <NotesDetailCellText>
                            <div className="short">{`Note Type: ${toProperCase(r.notes_notetype)}`}</div>
                        </NotesDetailCellText>
                    </NotesDetailCellTextStyle >
                    <NotesDetailCellEditStyle data-id={r.notes_recordid} onClick={handleUpdate}>
                        <FontAwesomeIcon icon={faPenToSquare} style={{ pointerEvents: "none" }} />
                    </NotesDetailCellEditStyle>
                </NotesDetailCellStyle>
            )
        })
    }

    useEffect(() => {
        setHoldSelected(gridState.selected)
        setGridState(ps => ({ ...ps, url: getUrl(), busy: true, reset: gridReset, selected: [] }))
    }, [gridReset])

    useEffect(() => {
        if (gridData.status === 200) {
            let newSelected = holdSelected;
            if (newSelected.length == 0 && (gridData.data.length > 0)) newSelected = [gridData.data[0].notes_recordid]
            setGridState(ps => ({ ...ps, busy: false, count: gridData.count, selected: newSelected }))
        }
    }, [gridData])

    useEffect(() => {
        if (gridData.data.length > 0) {
            const rec = gridData.data.find(r => r.notes_recordid == gridState.selected[0])
            if (rec) { document.getElementById("notes-text-scroller").innerHTML = rec.notes_note }
        }
    }, [gridState.selected])

    useEffect(() => {
        setGridState(ps => ({ ...ps, sortcol: "added", sortdir: "desc" }))
        setGridReset(!gridReset)
    }, [])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faCommentDots} /></div>
                    <div style={{ flex: 1 }}>Notes</div>
                    <div style={{ marginRight: "10px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <GridSearchInput
                        width="300px"
                        id="notes-search"
                        placeholder="Search All Notes..."
                        busy={gridState.busy}
                        callback={handleSearch}
                    />
                    <FormButton style={{ width: "122px", marginLeft: "10px" }} label="New Note" onClick={handleUpdate} />
                </div>
            </PanelHeader>
            <PanelContent>
                <NotesGridStyle>
                    <NotesDetailColumnStyle>
                        <GridContainer>
                            <GridScrollContainer>
                                {gridState.busy
                                    ? <GridLoader />
                                    : buildNoteGrid()
                                }
                            </GridScrollContainer>
                        </GridContainer>
                    </NotesDetailColumnStyle>
                    {gridState.selected.length > 0 &&
                        <NotesContainerStyle>
                            <NotesContainerTextStyle>
                                <NotesContainerTextScrollerStyle id="notes-text-scroller" />                                
                            </NotesContainerTextStyle>
                        </NotesContainerStyle>
                    }
                </NotesGridStyle>
            </PanelContent>
            <PanelFooter>
                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
            </PanelFooter>
        </Panel >
        {gridState.rowEdit.editor && <NotesForm record={gridState.rowEdit.record} parent="" callBack={updateCallBack} />}
    </>)
}