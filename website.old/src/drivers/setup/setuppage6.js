import { useState, useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormInput } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { getApiUrl } from "../../global/globals";
import { PDFContainer } from "../../components/portals/pdfviewer";
import { GridLoader } from "../../components/portals/gridstyles";
import { useButtonContext } from "./buttoncontext";

export const SetupPage6 = () => {
    const { setValue, getValue, sendFormData, getFormBusy, setFormBusy } = useMultiFormContext()
    const [filefields, setFileFields] = useState("")
    const [pdfData, setPdfData] = useState({ open: false,fileid: "", filename: "", filedata: ""})
    const { setPrevVisible, setNextVisible,setNextDisable, setPrevDisable } = useButtonContext()

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            setFileFields(filename)
        }
    }

    const handleSelectedChange = async () => {
        const rec = getValue("drv_documents").find(r => r.doc_typecode === "17")
        if (rec) {
            var data = new FormData()
            data.append("doc_recordid", rec.doc_recordid)
            data.append("app_page", "98")
            const resp = await sendFormData("post", data, "fetchobj/driver/application")
            if (resp.status === 200) {
                const docList = [...getValue("drv_documents")]
                const ndx = docList.findIndex(r => r.doc_typecode === "17")
                if (ndx > -1) {
                    docList.splice(ndx, 1)
                    setValue("drv_documents", docList)
                    setFileFields({ front: { value: "", error: "" }, back: { value: "", error: "" } })
                    setPdfData({ fileid: "", filename: "", filedata: "" })
                    document.getElementById("medcard-input").value = ""
                    setFileFields("")
                }
            }
        }
    }

    const getPdfFile = async (fileid) => {
        let url = `${getApiUrl()}/driverdocs/fetch?id=${fileid}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfData(ps => ({ ...ps, filedata: `${pdfUrl}#zoom=100` }))
    }

    const handleSubmit = async () => {
        setPdfData(ps => ({ ...ps, open: true, filedata: null }))
        var data = new FormData()
        const medcard = document.getElementById("medcard-input")
        data.append("files[]", medcard.files[0])
        data.append("driverid", getValue("drv_recordid"))
        data.append("action", "upload")
        data.append("application", "true")
        data.append("typecode", "17")
        data.append("app_page", "99")
        const resp = await sendFormData("post", data, "driverdocs")
        resp.status === 200 && setValue("drv_documents", resp.data)
        setPdfData(ps => ({ ...ps, busy: true }))
    }

    useEffect(() => {
        const docList = getValue("drv_documents")
        const rec = docList.find(r => r.doc_typecode === "17")
        if (rec) {
            setPdfData(ps => ({ ...ps, fileid: rec.doc_recordid, filename: rec.doc_filename,open:true }))
            getPdfFile(rec.doc_recordid)
        }
    }, [getValue("drv_documents")])

    useEffect(()=>{
        setPrevDisable(pdfData.open && !pdfData.filedata)
        setNextDisable(pdfData.open && !pdfData.filedata)
    },[pdfData])


    useEffect(() => {
        setPrevVisible(true)
        setNextVisible(true)        
    }, [])

    return (<>
        <input id="medcard-input" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp, .pdf"></input>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Upload A Copy Of Your Medical Certificate</div>
        {!pdfData.open
            ? <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please upload a copy of your Medical Certificate. (Supported Formats: .jpg, .png, .gif, .webp)</b></div>
                {!getFormBusy()
                    ? <>
                        <FormFlexRowStyle>
                            <div style={{ flex: 1 }}>
                                <FormTopLabel>Copy Of Your Medical Certificate</FormTopLabel>
                                <FormInput
                                    id="medcard"
                                    mask="text"
                                    value={filefields}
                                    readOnly
                                />
                            </div>
                            <div >
                                <FormButton onClick={() => document.getElementById("medcard-input").click()}>Select File</FormButton>
                            </div>
                        </FormFlexRowStyle>
                        <div style={{ width: "100%", borderBottom: "1px dotted #B6B6B6", marginBottom: "8px" }} />
                        <FormFlexRowStyle>
                            <div>
                                <FormButton
                                    onClick={handleSubmit}
                                    disabled={filefields === ""}
                                >Upload Your Medical Certificate
                                </FormButton>
                            </div>
                            <div style={{ flex: 1, paddingLeft: "10px" }}>You can skip this step if you do not have this information available.</div>
                        </FormFlexRowStyle>
                    </>
                    : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "350px" }}>
                        <GridLoader message="Uploading...This may take a some time based on file sizes." />
                    </div>
                }
            </>
            : <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#76B66A" }}><b>You Have Uploaded A Copy Of Your Medical Certificate.</b></div>
                <FormButton style={{ marginBottom: "20px" }} disabled={!pdfData.filedata} onClick={handleSelectedChange}>Change</FormButton>
                <PDFContainer source={pdfData.filedata} title="Medical Certificate" height="700px" />
            </>
        }
    </>)
}