import {  useEffect, useState } from "react";
import { toProperCase } from "../../global/globals";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { HTMLEditor } from "../../components/administration/htmleditor/htmleditor";
import { FormButton } from "../../components/portals/buttonstyle";
import { entityTypes, initGridState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { FormBoxStyle } from "../../components/portals/formstyles";
import { FormSelect, InputErrorContainerStyle } from "../../components/portals/inputstyles";
import { useFormHook } from "../../global/hooks/formhook";


export const NotesForm = ({ assets, setPage }) => {
    const [editorData, setEditorData] = useState()
    const [combos, setCombos] = useState({
        notetype: { data: entityTypes, selected: "" },
        entity: { data: [], selected: "" }
    })
    const [entityList, setEntityList] = useState({ ...initGridState })
    const entityData = useRestApi(entityList.url, "GET", {}, entityList.reset)
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("notes-form", "notes")

    const closePage = () => {
        if (assets.entity)
            setPage(ps => ({ ...ps, page: 3, subpage: 3, record: {} }))
        else
            setPage(ps => ({ ...ps, page: 7, subpage: -1, record: {} }))
    }

    const handleSubmit = async (e) => {        
        let data = serializeFormData()
        let verb = getValue("recordid") ? "PUT" : "POST"
        if (assets.entity) {
            data.append("notetype", `${assets.entity}s`)
            data.append("notetypeid", assets.entityRecord.recordid)
        } else {
            data.append("notetype", combos.notetype.selected)
            data.append("notetypeid", combos.entity.selected)
        }
        data.append("note", editorData)
        await sendFormData(verb, data) && closePage();
    }

    const handleNoteTypeChange = (e) => {
        handleChange(e)
        setCombos(ps => ({ ...ps, notetype: { ...ps.notetype, selected: e.target.value } }))
    }

    const handleEntityChange = (e) => {
        handleChange(e)
        setCombos(ps => ({ ...ps, entity: { ...ps.entity, selected: e.target.value } }))
    }

    useEffect(() => {
        combos.notetype.selected && setEntityList(ps => ({ ...ps, url: `combos/${combos.notetype.selected}`, reset: !entityList.reset }))
    }, [combos.notetype.selected])

    useEffect(() => {
        entityData.status === 200 && setCombos(ps => ({ ...ps, entity: { ...ps.entity, data: entityData.data } }))
    }, [entityData])

    useEffect(() => {
        let def = entityTypes.find(r => r.default === 1)
        setCombos(ps => ({ ...ps, 
            notetype: { ...ps.notetype, selected: assets.record.recordid ? assets.record.notetype : def.value },
            entity: { ...ps.entity, selected: assets.record.recordid ? assets.record.notetypeid : "" }
         }))
        setEditorData(assets.record.note)
        buildFormControls(assets.record)
    }, [])
    
    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>
                    {assets.entityRecord.recordid
                        ? <span>{`TMFS Administration > ${toProperCase(assets.entity)}s > ${assets.entityRecord.companyname} > Notes Editor`}</span>
                        : <span>{`TMFS Administration > Notes Editor`}</span>
                    }
                </PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>{`${toProperCase(assets.entity)} Note Editor`}</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <div style={{ padding: "10px 0px" }}>
                            {assets.entityRecord.recordid
                                ? <span style={{ fontSize: "18px", fontWeight: 600 }}>{assets.record.recordid ? "Editing" : "New"} Note For {assets.entityRecord.companyname}</span>
                                : <>{assets.record.recordid
                                    ? `Editing Note For ${assets.record.companyname}`
                                    : <div style={{ display: "flex" }}>
                                        <div style={{ flex: 1 }}>
                                            <FormSelect
                                                id="notetype"
                                                data-ignore
                                                value={getValue("notetype")}
                                                options={entityTypes}
                                                label="Select Entity Type"
                                                labelwidth= "145px"
                                                hideerror
                                                onChange={handleNoteTypeChange}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <FormSelect
                                                id="notetypeid"
                                                data-ignore
                                                value={combos.selected}
                                                options={combos.entity.data}
                                                label="Select Entity:"
                                                labelwidth= "145px"
                                                hideerror
                                                onChange={handleEntityChange}
                                            />
                                        </div>
                                    </div>
                                }
                                </>
                            }
                        </div>
                        <div style={{ flex: 1, marginTop:"4px"}}>
                            <HTMLEditor
                                id="notes"
                                value={editorData}
                                height="100%"
                                callback={(val) => setEditorData(ps => (val))}
                            />
                        </div>
                        <InputErrorContainerStyle data-ignore id="note" style={{ flex: "none", height: "20px", padding: "0px 0px 10px 2px" }}>
                            {getError("note")}
                        </InputErrorContainerStyle>

                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}></div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
                <div>
                    <FormButton
                        style={{ width: "100px"}}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
    )
}