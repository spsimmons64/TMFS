import { useEffect, useState } from "react"
import { GridAction, GridActionColumn, GridCellStyle, GridFooterContainer, GridLoader, GridRowStyle, GridScrollContainer, GridScroller, GridToolBox, GridWrapper } from "../../components/portals/gridstyles";
import { GridPager } from "../../components/portals/gridpager";
import { GridSearchInput } from "../../components/portals/inputstyles";
import { useUserAction } from "../../global/contexts/useractioncontext";
import { useGridContext } from "../../global/contexts/gridcontext";
import { FormButton } from "../../components/portals/buttonstyle";
import { useNavigate } from "react-router-dom";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { toProperCase } from "../../global/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Editor } from '@tinymce/tinymce-react';
import { config } from '../../global/config';
import "../../assets/css/editor.css"


const NoteViewer = (props) => {
    const { id, value, height, ...nprops } = props;
    return (
        <Editor
            apiKey={config.tinyMCE}
            tinymceScriptSrc={process.env.REACT_APP_PUBLIC_URL + '/tinymce/tinymce.min.js'}
            value={value}
            init={{
                height: height,
                menubar: false,
                statusbar: false,
                toolbar: false,
                readonly: true,
                content_style: 'body { background-color: #e6f2a2; }'
            }}
        />
    )
}

export const AltNotesGrid = ({ assets, setPage }) => {
    const nav = useNavigate()
    const { gridState, updateGridData } = useGridContext();
    const [parent, setParent] = useState({ parent: "", id: "", name: "" })
    const [selectedNote, setSelectedNote] = useState({ selected: -1, note: "" })
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "notedetail",
        width: "95%",
        header: "",
        cellStyle: { pointerEvents: "none" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) =>
            <div>
                <div className="short" style={{ fontSize: "18px", fontWeight: 600 }}>{gridState.data[ndx].companyname}</div>
                <div className="short">{`${gridState.data[ndx].added} by ${gridState.data[ndx].username}`}</div>
                <div className="short">{`Note Type: ${toProperCase(gridState.data[ndx].notetype)}`}</div>
            </div>
    }, {
        id: "action",
        width: "14%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This Note" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
            </GridActionColumn>
    }]

    const buildGridRows = () => {
        return gridState.data.map((r, rndx) => {
            return (
                <GridRowStyle
                    onClick={handleSelected}
                    key={rndx}
                    style={{ backgroundColor: selectedNote.selected == r.recordid && "#e9effc" }}
                    data-key={r.recordid}
                >
                    {columns.map((c, cndx) => {
                        return (
                            <GridCellStyle style={c.cellStyle} width={c.width} key={`${r.recordid}-${cndx}`}>
                                {c.render(rndx)}
                            </GridCellStyle>
                        )
                    })}
                </GridRowStyle>
            )
        })
    }

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        if(assets){
            setPage({ page: 3, subpage: 4, entity: assets.entity, entityRecord: assets.entityRecord, record: rec || {} })
        }else{
            setPage({ page: 3, subpage: 4, entity:"", entityRecord: {}, record: rec || {} })
        }
    }

    const handleSelected = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-key"))
        rec && setSelectedNote({ selected: rec.recordid, note: rec.note })
    }

    const handleReturnButton = () => {
        if (assets.entity === "reseller") setPage({ page: 3, subpage: -1, record: {} })
        if (assets.entity === "account") setPage({ page: 2, subpage: -1, record: {} })
        if (assets.entity === "consultant") setPage({ page: 4, subpage: -1, record: {} })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handlePageChange = (val) => updateGridData({ page: val });

    useEffect(() => {
        if (gridState.data.length && selectedNote.note == "") {
            setSelectedNote({ selected: gridState.data[0].recordid, note: gridState.data[0].note })
        }
    }, [gridState.data])

    useEffect(() => {
        let new_url = "notes"
        let new_id = ""
        if (assets) {
            let new_parent = toProperCase(assets.entity);
            new_id = assets.entityRecord.recordid
            let new_name = assets.entityRecord.companyname
            new_url = `${new_url}/${assets.entity}s`
            setParent({ parent: new_parent, id: new_id, name: new_name })
        }
        updateGridData({ url: new_url, parentid: new_id, sortcol: "added", sortdir: "desc" })
    }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>
                    {assets
                        ? `TMFS Administration > ${parent.parent} > ${parent.name} > Notes Listing`
                        : `TMFS Administration > Notes Listing`
                    }
                </PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>
                    {assets
                        ? `${parent.parent} Notes`
                        : `Notes`
                    }
                </PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>
                        {assets
                            ? `${parent.parent} Notes Listing For ${parent.name}`
                            : `Notes Listing`
                        }
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search Notes..." id="search-notes" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        {assets
                            ? <FormButton style={{ height: "34px" }} onClick={handleReturnButton}>{`Back To ${parent.parent}s`}</FormButton>
                            : <></>
                        }
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>{`New Note`}</FormButton>
                    </div>
                </GridToolBox>
                <div style={{ display: "flex", width: "100%", flex: 1, }}>
                    <div style={{ display: "flex", flexFlow: "column", width: "500px", backgroundColor: "pink" }}>
                        <GridWrapper>
                            {gridState.busy
                                ? <GridLoader />
                                : <GridScrollContainer><GridScroller>{buildGridRows()}</GridScroller></GridScrollContainer>
                            }
                            <GridFooterContainer>
                                <GridPager page={gridState.page} limit={gridState.limit} count={gridState.count} callback={(handlePageChange)} />
                            </GridFooterContainer>
                        </GridWrapper>
                    </div>
                    <div style={{ flex: 1, border: "1px solid #808080", backgroundColor: "#e6f2a2" }}>
                        <NoteViewer id="altnotes-viewer" value={selectedNote.note} height="100%"></NoteViewer>
                    </div>
                </div>
            </PortalPlaygroundScrollContainerStyle>
        </PortalPlayGroundStyle>
    )
}