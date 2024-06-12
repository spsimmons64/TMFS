import { useEffect, useState } from "react"
import { GridAction, GridActionColumn, GridCellStyle, GridFooterContainer, GridLoader, GridRowStyle, GridScrollContainer, GridScroller, GridToolBox, GridWrapper } from "../../../components/portals/gridstyles";
import { GridPager } from "../../../components/portals/gridpager";
import { FormCheck, GridSearchInput } from "../../../components/portals/inputstyles";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { useGridContext } from "../../../global/contexts/gridcontext";
import { FormButton } from "../../../components/portals/buttonstyle";
import { useNavigate } from "react-router-dom";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { Editor } from '@tinymce/tinymce-react';
import { config } from '../../../global/config';
import "../../../assets/css/editor.css"
import { toProperCase } from "../../../global/globals";
import { initFormState } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";

const ArticleViewer = (props) => {
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
            }}
        />
    )
}

export const KBArticlesGrid = ({ assets, setPage }) => {
    const nav = useNavigate()
    const { gridState, updateGridData } = useGridContext();
    const [parent, setParent] = useState({ parent: "", id: "", name: "" })
    const [selected, setSelected] = useState({ index: -1, text: "" })
    const [position, setPosition] = useState({...initFormState})
    const posData = useRestApi(position.url, "POST", position.data, position.reset)    
    const { reportUserAction } = useUserAction();

    const columns = [{
        id: "position",
        width: "8%",
        header: "",
        cellStyle: { pointerEvents: "none" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <div className="short" >{gridState.data[ndx].position}</div>
    }, {
        id: "title",
        width: "68%",
        header: "",
        cellStyle: { pointerEvents: "none" },
        hdrStyle: {},
        sortable: 1,
        render: (ndx) => <>
            <div className="short" style={{ fontSize: "14px", fontWeight: 600 }}>{gridState.data[ndx].title}</div>
            <div className="short" >Article Type: {gridState.data[ndx].articletype}</div>
        </>

    }, {
        id: "action",
        width: "24%",
        header: "Actions",
        hdrStyle: {},
        hdrAlign: "center",
        sortable: 0,
        render: (ndx) =>
            <GridActionColumn>
                <GridAction title="Edit This Article" data-id={gridState.data[ndx].recordid} onClick={handleUpdate}>
                    <FontAwesomeIcon style={{ pointerEvents: "none", fontSize: "24px" }} icon={faPenToSquare} color="var(--grid-action-edit)" />
                </GridAction>
                <GridAction title="Reposition Up" data-id={gridState.data[ndx].recordid} onClick={(e) => handlePosition(e, gridState.data[ndx].deleted, "up")} disabled={gridState.data[ndx].deleted}>
                    <FontAwesomeIcon style={{ fontSize: "24px", pointerEvents: "none", marginTop:"2px" }} icon={faSquareCaretUp} color="var(--grid-action-move)" />
                </GridAction>
                <GridAction title="Reposition Down" data-id={gridState.data[ndx].recordid} onClick={(e) => handlePosition(e, gridState.data[ndx].deleted, "down")} disabled={gridState.data[ndx].deleted}>
                    <FontAwesomeIcon style={{ fontSize: "24px", pointerEvents: "none", marginTop:"2px"  }} icon={faSquareCaretDown} color="var(--grid-action-move)" />
                </GridAction>
            </GridActionColumn>
    }]

    const buildGridRows = () => {
        return gridState.data.map((r, rndx) => {
            return (
                <GridRowStyle
                    onClick={handleSelected}
                    key={rndx}
                    style={{ backgroundColor: selected.index == r.recordid && "#e9effc" }}
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

    const handleDeactivated = ({ target }) => updateGridData({ page: 1, inactive: target.checked });

    const handleUpdate = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-id"))
        setPage({ page: 803, subpage: 1, entity: "", entityRecord: {}, record: rec || {} })
    }

    const handleSelected = ({ target }) => {
        let rec = gridState.data.find(r => r.recordid === target.getAttribute("data-key"))
        rec && setSelected({ index: rec.recordid, text: rec.articletext })
    }

    const handleSearch = (val) => updateGridData({ search: val })

    const handlePageChange = (val) => updateGridData({ page: val });

    const handlePosition = (e, disabled, dir) => {        
        if (!disabled) {            
            const rec = gridState.data.find(r => r.recordid === e.target.getAttribute("data-id"))
            if (rec) {                
                reportUserAction(`Moved KB Article ${rec.title} ${toProperCase(dir)}`)
                let data = new FormData()
                data.append("recordid", e.target.getAttribute("data-id"))
                data.append("direction", dir)
                setPosition(ps => ({...ps, url: "kbarticles/move", data: data, reset: !position.reset }))
            }
        }
    }    

    useEffect(() => {
        if (gridState.data.length && selected.text == "") {
            setSelected({ index: gridState.data[0].recordid, text: gridState.data[0].articletext })
        }
    }, [gridState.data])

    useEffect(() => { posData.status == 200 && updateGridData() }, [posData])

    useEffect(() => { updateGridData({ url: "kbarticles", sortcol: "position", sortdir: "asc" }) }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Knowledge Base Articles</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Knowledge Base Articles</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <GridToolBox>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: "18px" }}>Knowledge Base Articles Listing</div>
                    <div style={{ marginRight: "20px" }}>
                        <FormCheck style={{ color: "#737373" }} label="Include Deactivated" onChange={handleDeactivated} hideerror={1} />
                    </div>
                    <div style={{ width: "400px" }}><GridSearchInput placeholder="Search KB Articles..." id="search-articles" callback={handleSearch} /></div>
                    <div style={{ marginLeft: "10px" }}>
                        <FormButton style={{ height: "34px" }} onClick={handleUpdate}>{`New Article`}</FormButton>
                    </div>
                </GridToolBox>
                <div style={{ display: "flex", width: "100%", flex: 1, }}>
                    <div style={{ display: "flex", flexFlow: "column", width: "550px", backgroundColor: "pink" }}>
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
                        <ArticleViewer id="article-viewer" value={selected.text} height="100%"></ArticleViewer>
                    </div>
                </div>
            </PortalPlaygroundScrollContainerStyle>
        </PortalPlayGroundStyle>
    )
}