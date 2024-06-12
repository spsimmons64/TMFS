import { useEffect, useState } from "react"
import { ModalForm, ModalFormBody, ModalFormFooter, ModalFormHeader } from "../../../../../components/global/forms/forms"
import { Editor } from "@tinymce/tinymce-react"
import { useRestApi } from "../../../../../global/hooks/apihook"
import { FormButton } from "../../../../../components/portals/buttonstyle"


export const KBViewer = ({ id,callback }) => {
    const [kbData, setKbData] = useState({ title: "", data: "<b>View Initialized</b>", busy: false })
    const {fetchData} = useRestApi()


    const getKbArticle = async() => {
        const res = await fetchData(`kbarticles?action=fetchbykey&key=${id}`, "GET")
        if (res.status === 200) {setKbData({title:res.data.title,data:res.data.articletext})}
    }

    useEffect(() => { getKbArticle() }, [])

    return (
        <ModalForm width="1000px" height="808px">
            <ModalFormHeader title={`KB Article ${kbData.title}`} busy={kbData.busy} />
            <ModalFormBody id="kb-viewer" style={{padding:"0px"}}>
                <Editor
                    initialValue={kbData.data}
                    
                    init={{
                        height: "700px",
                        menubar: false,
                        toolbar: false,
                        branding: false,
                        readonly: 1,
                        statusbar: false,
                        setup: (editor) => {
                            editor.on('init', () => {
                                editor.getContainer().style.border = 'none';
                            });
                        }
                    }}
                />
            </ModalFormBody>
            <ModalFormFooter>
                <div style={{textAlign:"right",width:"100%"}}>
                    <FormButton onClick={()=>callback()}>Close This Article</FormButton>
                </div>                
            </ModalFormFooter>
        </ModalForm>
    )
}