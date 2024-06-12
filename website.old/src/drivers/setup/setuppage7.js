import { useState, useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { useRestApi } from "../../global/hooks/apihook";
import { getApiUrl } from "../../global/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { PDFContainer } from "../../components/portals/pdfviewer";
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import { GridLoader } from "../../components/portals/gridstyles";
import { useButtonContext } from "./buttoncontext";

const DocListContainer = styled.div`
width:100%;
height: 350px;
border: 1px dotted #B6B6B6;
display: flex;
flex-flow: column;
background-color: #E9E9E9;
margin-bottom: 20px;
`

const DocListSrollContainer = styled.div`
width:100%;
flex:1;
display: flex;
flex-flow:column;
`

const DocListScroller = styled.div`
height: 0;
flex:1 1 auto;
overflow-y: auto;
`

const DocRowContainer = styled.div`
width: 100%;
padding: 10px;
display: flex;
align-items: center;
border-bottom: 1px dotted #B6B6B6;
`

export const SetupPage7 = () => {
    const { setValue, getValue, sendFormData, setFormBusy, getFormBusy } = useMultiFormContext()
    const [documents, setDocuments] = useState([])
    const [pdfData, setPdfData] = useState({ open: false, fileid: "", filename: "", filedata: "" })
    const { setPrevVisible, setNextVisible, setNextDisable } = useButtonContext()

    const handleFileChange = ({ target }) => {
        let newList = [...documents]
        if (target.files && target.files.length) {
            Array.from(target.files).forEach(file => { newList.push({ recordid: uuidv4().toString(), file: file, filename: file.name }) })
        }
        setDocuments(newList)
    }

    const handleSelectedChange = async () => {
        setFormBusy(true)
        const rec = getValue("drv_documents").find(r => r.doc_typecode === "1")
        if (rec) {
            var data = new FormData()
            data.append("doc_recordid", rec.doc_recordid)
            data.append("app_page", "98")
            const resp = await sendFormData("post", data, "fetchobj/driver/application")
            if (resp.status === 200) {
                const docList = [...getValue("drv_documents")]
                const ndx = docList.findIndex(r => r.doc_typecode === "1")
                if (ndx > -1) {
                    docList.splice(ndx, 1)
                    setValue("drv_documents", docList)
                    setPdfData({ fileid: "", filename: "", filedata: "" })
                }
            }
        }
        setFormBusy(false)
    }

    const getPdfFile = async (fileid) => {
        let url = `${getApiUrl()}/driverdocs/fetch?id=${fileid}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfData(ps => ({ ...ps, filedata: `${pdfUrl}#zoom=100` }))
    }

    const handleRemove = async ({ target }) => {
        let newList = [...documents]
        const ndx = newList.findIndex(r => r.recordid === target.getAttribute("data-id"))
        ndx > -1 && newList.splice(ndx, 1)
        setDocuments(newList)
    }

    const handleSubmit = async () => {
        setPdfData(ps => ({ ...ps, open: true, filedata: null }))
        var data = new FormData()
        documents.forEach(r => { data.append("files[]", r.file) })
        data.append("driverid", getValue("drv_recordid"))
        data.append("action", "upload")
        data.append("application", "true")
        data.append("typecode", "1")
        data.append("app_page", "99")
        const resp = await sendFormData("post", data, "driverdocs")
        resp.status === 200 && setValue("drv_documents", resp.data)
    }

    useEffect(() => {
        const docList = getValue("drv_documents")
        const rec = docList.find(r => r.doc_typecode === "1")
        if (rec) {
            setPdfData(ps => ({ ...ps, fileid: rec.doc_recordid, filename: rec.doc_filename, open: true }))
            getPdfFile(rec.doc_recordid)
        }
    }, [getValue("drv_documents")])

    useEffect(() => {
        setNextVisible(true)
        setPrevVisible(true)
        setNextDisable(false)
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Upload Forfeiture Documents</div>
        {!pdfData.open
            ? <>
                <input id="dl-forfeiture" type="file" data-ignore hidden onChange={handleFileChange} multiple accept=".jpg, .jpeg, .png, .gif, .webp, .pdf"></input>
                <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>You indicated that you have been denied and/or been revoked of your license,
                    permit or privileges to operate a motor vehicle. Please upload a statement setting forth the facts and circumstances.
                    <br />(Supported Formats: .jpg, .png, .gif, .webp, .pdf)</b></div>
                <FormFlexRowStyle>
                    <div ><FormButton onClick={() => { document.getElementById("dl-forfeiture").click() }}>Add Your Document</FormButton></div>
                    <div style={{ flex: 1 }}>Make sure you click the <strong>Upload Documents</strong> below to send your files.</div>
                </FormFlexRowStyle>
                <FormTopLabel style={{ marginTop: "20px" }}>{pdfData.busy ? 'Uploading Your Documents...' : "Documents Ready To Be Uploaded"}</FormTopLabel>
                <DocListContainer>
                    <DocListSrollContainer>
                        <DocListScroller>
                            {documents.map((r, ndx) => {
                                return (
                                    <DocRowContainer key={r.recordid}>
                                        <div style={{ width: "40px" }}>
                                            <FontAwesomeIcon icon={faFileLines} size="2x" color="#164398" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="short">
                                                <span style={{ color: "#164398", cursor: "pointer" }}>
                                                    <u style={{ pointerEvents: "none" }}>{r.filename}</u>
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ width: "80px" }}>
                                            <FormButton data-id={r.recordid} onClick={handleRemove}>Remove</FormButton>
                                        </div>
                                    </DocRowContainer>
                                )
                            })}
                        </DocListScroller>
                    </DocListSrollContainer>
                </DocListContainer>
                <FormButton disabled={documents.length == 0} onClick={handleSubmit}>Upload Documents</FormButton>
            </>
            : <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#76B66A" }}><b>You Have Uploaded Your Forfeiture Documents.</b></div>
                <FormButton style={{ marginBottom: "20px" }} disabled={!pdfData.filedata} onClick={handleSelectedChange}>Change</FormButton>
                <PDFContainer source={pdfData.filedata} title="Forfeiture Documents" height="700px" />
            </>
        }
    </>)
}