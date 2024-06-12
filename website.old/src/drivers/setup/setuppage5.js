import { useState, useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormInput } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { getApiUrl } from "../../global/globals";
import { PDFContainer } from "../../components/portals/pdfviewer";
import { useButtonContext } from "./buttoncontext";

export const SetupPage5 = () => {
    const { setValue, getValue, sendFormData, setFormBusy, getFormBusy } = useMultiFormContext()
    const [filefields, setFileFields] = useState({ front: { value: "", error: "" }, back: { value: "", error: "" } })
    const { setPrevVisible, setNextVisible,setNextDisable, setPrevDisable } = useButtonContext()
    const [pdfData, setPdfData] = useState({ open: false, fileid: "", filename: null, filedata: "" })

    const handleFileChange = ({ target }) => {
        if (target.files && target.files.length) {
            const filename = target.files[0].name
            if (target.id === "dl-front")
                setFileFields(ps => ({ ...ps, front: { ...ps.front, value: filename } }))
            else
                setFileFields(ps => ({ ...ps, back: { ...ps.back, value: filename } }))
        } else {
            if (target.id === "dl-front")
                setFileFields(ps => ({ ...ps, front: { ...ps.front, value: "" } }))
            else
                setFileFields(ps => ({ ...ps, back: { ...ps.back, value: "" } }))
        }
    }

    const handleDLChange = async () => {        
        const rec = getValue("drv_documents").find(r => r.doc_typecode === "16")
        if (rec) {
            var data = new FormData()
            data.append("doc_recordid", rec.doc_recordid)
            data.append("app_page", "98")
            const resp = await sendFormData("post", data, "fetchobj/driver/application")
            if (resp.status === 200) {
                const docList = [...getValue("drv_documents")]
                const ndx = docList.findIndex(r => r.doc_typecode === "16")
                if (ndx > -1) {
                    docList.splice(ndx, 1)
                    setValue("drv_documents", docList)
                    setFileFields({ front: { value: "", error: "" }, back: { value: "", error: "" } })
                    setPdfData({ fileid: "", filename: "", filedata: "" })
                    document.getElementById("dl-front").value = ""
                    document.getElementById("dl-back").value = ""
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
        const dlFront = document.getElementById("dl-front")
        const dlBack = document.getElementById("dl-back")
        const files = [dlFront.files[0], dlBack.files[0]]
        data.append("files[]", dlFront.files[0])
        data.append("files[]", dlBack.files[0])
        data.append("driverid", getValue("drv_recordid"))
        data.append("action", "upload")
        data.append("application", "true")
        data.append("typecode", "16")
        data.append("app_page", "99")
        const resp = await sendFormData("post", data, "driverdocs")
        resp.status === 200 && setValue("drv_documents", resp.data)        
    }

    useEffect(() => {
        const docList = getValue("drv_documents")
        const rec = docList.find(r => r.doc_typecode === "16")
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
        <input id="dl-front" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <input id="dl-back" type="file" data-ignore hidden onChange={handleFileChange} accept=".jpg, .jpeg, .png, .gif, .webp,.pdf"></input>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 20px 0px" }}>Upload A Copy Of Your Driver's License {getValue("drv_licenses")[0].lic_licensenumber} </div>
        {!pdfData.open
            ? <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please upload a copy of the drivers license specified above. (Supported Formats: .jpg, .png, .gif)</b></div>
                <div style={{ marginBottom: "20px" }}></div>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Copy Of The <b>Front</b> Of Your Driver's License</FormTopLabel>
                        <FormInput
                            id="license-front"
                            mask="text"
                            value={filefields.front.value}
                            error={filefields.front.error}
                            readOnly
                        />
                    </div>
                    <div >
                        <FormButton onClick={() => document.getElementById("dl-front").click()}>Select File</FormButton>
                    </div>
                </FormFlexRowStyle>
                <FormFlexRowStyle>
                    <div style={{ flex: 1 }}>
                        <FormTopLabel>Copy Of The <b>Back</b> Of Your Driver's License</FormTopLabel>
                        <FormInput
                            id="license-back"
                            mask="text"
                            value={filefields.back.value}
                            error={filefields.back.error}
                            readOnly
                        />
                    </div>
                    <div >
                        <FormButton onClick={() => document.getElementById("dl-back").click()}>Select File</FormButton>
                    </div>
                </FormFlexRowStyle>
                <div style={{ width: "100%", borderBottom: "1px dotted #B6B6B6", marginBottom: "8px" }} />
                <FormFlexRowStyle>
                    <div>
                        <FormButton
                            onClick={handleSubmit}
                            disabled={filefields.front.value == "" || filefields.back.value == ""}
                        >Upload Your Driver's License
                        </FormButton>
                    </div>
                    <div style={{ flex: 1, paddingLeft: "10px" }}>You can skip this step if you do not have this information available.</div>
                </FormFlexRowStyle>
            </>
            : <>
                <div style={{ margin: "5px 0px 20px 0px", color: "#76B66A" }}><b>You Have Uploaded A Copy Of Your License.</b></div>
                <FormButton style={{ marginBottom: "20px" }} disabled={!pdfData.filedata}onClick={handleDLChange}>Change</FormButton>
                <PDFContainer source={pdfData.filedata} title="Driver's License" height="700px" />
            </>
        }
    </>)
}