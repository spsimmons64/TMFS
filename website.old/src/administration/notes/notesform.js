import { useContext, useEffect, useState } from "react";
import { entityTypes, initFormState } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow } from "../../components/administration/card";
import { CardButton } from "../../components/administration/button";
import { serializeForm } from "../../global/globals";
import { YesNo, initYesNoState } from "../../components/administration/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { FormStaticSelect } from "../../components/administration/inputs/formstaticselect";
import { ErrorContext } from "../../global/contexts/errorcontext";
import { FormDataSelect } from "../../components/administration/inputs/formdataselect";
import { FormText } from "../../components/administration/inputs/formtext";
import { useUserAction } from "../../global/contexts/useractioncontext";

export const NotesForm = ({ record, parentid, parent, company, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("faqs-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const [editorData, setEditorData] = useState()
    const [entityUrl, setEntityUrl] = useState("")
    const { reportUserAction } = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("notes_recordid", record.notes_recordid || "")
        data.append("notes_note", editorData)
        if (parentid) {
            data.set("notes_notetype", parent)
            data.set("notes_notetypeid", parentid)
        }
        const verb = !record.notes_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "notes", data: data, reset: !formState.reset }))
    }

    const updateEntityUrl = (value) => setEntityUrl(`combos/${value.toLowerCase()}`) 

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.notes_deleted ? "Reactivate" : "Deactivate"} This Note?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        if (resp) { submitForm(null, !record.notes_deleted); }
    }

    useEffect(() => {
        let entity = company
        if (formData.status === 200) {            
            if (!record.notes_recordid) {         
                if(!company){                
                    let selected = document.getElementById("notes_notetypeid").selectedIndex
                    entity = document.getElementById("notes_notetypeid").options[selected];                    
                }
                reportUserAction(`Created A New Note For ${entity}`)
            } else {
                reportUserAction(`Updated A Note For ${record.notes_companyname}`)
            }
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => {
        setEditorData(record.notes_note);
        record.notes_recordid && reportUserAction(`Viewed A Note For ${record.notes_companyname}`)        
        record.notes_recordid && setEntityUrl(`combos/${record.notes_notetype.toLowerCase()}`)
        return () => setErrorState([]);
    }, [])

    return (<>
        <CardModal width="600px" >
            <CardHeader label="Notes Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                {(!parent && !parentid)
                    ? <CardRow>
                        <div style={{ width: "120px", marginRight: "4px" }}>
                            <FormStaticSelect
                                id="notes_notetype"
                                label="Entity"
                                options={entityTypes}
                                value={record.notes_notetype}
                                onChange={updateEntityUrl}
                                disabled={record.notes_recordid || (parentid && parent)}
                            />
                        </div>
                        <div style={{ flex: 1, marginLeft: "4px" }}>
                            <FormDataSelect
                                id="notes_notetypeid"
                                label="Company"
                                url={entityUrl}
                                value={record.notes_notetypeid}
                                disabled={record.notes_recordid || (parentid && parent)}
                            />
                        </div>
                    </CardRow>
                    : <div style={{ paddingBottom: "10px", fontSize: "20px", color: "#1A1A1A" }}>{company}</div>
                }
                <FormText id="notes_note" label="Notes" height="300px" value={record.notes_note} required />
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.notes_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.notes_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton id="pricing-form-save" style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}