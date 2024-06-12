import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { config } from "../../global/config";
import { FormButton } from "../../components/portals/buttonstyle";
import { MessageContext } from "../../administration/contexts/messageContext";
import { YesNo, initYesNoState } from "../../components/portals/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { getApiUrl } from "../../global/globals";

const PoliciesContainerStyle = styled.div`
flex:1;
width: 100%;
display:flex;
margin-bottom: 10px;
`
const PolicyDocumentContainerStyle = styled.div`
display: flex;
flex-flow: column;
flex:1;
`
const PolicyDocumentStyle = styled.iframe`
width: 100%;
height: 100%;
border: 2px solid #323639;
`
export const Policies = () => {
    const mousePos = useMousePosition()
    const {buildFormControls,getValue,setValue,getError } = useMultiFormContext()    
    const [messageState, setMessageState] = useContext(MessageContext);
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [workPolicy, setWorkPolicy] = useState("")
    const [drugPolicy, setDrugPolicy] = useState("")
    const [pType, setPType] = useState("")

    const handleRemoveRequest = (policytype) => {
        setPType(policytype)
        setYnRequest({
            message: `Do You Wish To Remove This Policy?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "left",
            valign: "bottom"
        })
    }

    const processRemoveRequest = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && putPdfFile("", "delete")
    }

    const getPdfFile = async (policytype) => {
        let url = `${getApiUrl()}/resellers/policies?id=${getValue("res_recordid")}&ptype=${policytype}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        return (pdfUrl);
    }

    const putPdfFile = async (file, action) => {
        let data = new FormData()
        data.append("file", file)
        data.append("id", getValue("res_recordid"))
        data.append("ptype", pType)
        let url = `${getApiUrl()}/resellers/policies`
        const headers = { credentials: "include", method: action, body: data }
        const response = await fetch(url, headers);
        const jsonResp = await response.json();
        if (jsonResp) {
            let new_data = await getPdfFile(pType)            
            pType === "w" ? setWorkPolicy(new_data) : setDrugPolicy(new_data)
            if(action === "delete")
                pType === "w" ? setValue("res_hasworkpolicy",0) : setValue("res_hasdrugpolicy",0)
            else
                pType === "w" ? setValue("res_hasworkpolicy",1) : setValue("res_hasdrugpolicy",1)
        }
        if (jsonResp.message) {
            let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
            setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
        }
    }

    const uploadFile = (policytype) => {
        setPType(policytype)
        document.getElementById("uploader").click()
    }

    const processUpload = (e) => {
        const file = e.target.files[0]
        putPdfFile(file, "post")
        document.getElementById("uploader").value = ""
    }

    const getPolicy = async (policytype) => {
        const data = await (getPdfFile(policytype))
        if (data) policytype == "w" ? setWorkPolicy(data) : setDrugPolicy(data)
    }

    useEffect(() => {
        getPolicy("w");
        getPolicy("d");
    }, [])    

    return (<>
        <input id="uploader" type="file" onChange={processUpload} accept=".pdf,.doc,.docx,.odt" style={{ width: "0px", height: "0px" }} />
        <PoliciesContainerStyle>
            <PolicyDocumentContainerStyle style={{ paddingRight: "10px" }}>
                <span style={{ fontSize: "18px", fontWeight: 600, paddingBottom: "3px" }}>Workplace Policy</span>
                <PolicyDocumentStyle src={workPolicy ? `${workPolicy}#zoom=92` : ""} width="100%" height="100%" title="Work Policy"></PolicyDocumentStyle>
                <div style={{ display: "flex", width: "100%", textAlign: "center", padding: "10px 0px" }}>
                    <div style={{ paddingRight: "10px" }}>
                        <FormButton
                            style={{ width: "200px", paddingRight: "10px" }}
                            onClick={() => uploadFile("w")}
                        >Update Workplace Policy
                        </FormButton>
                    </div>
                    {getValue("res_hasworkpolicy")&&
                        <FormButton
                            style={{ width: "200px" }}
                            onClick={() => handleRemoveRequest("w")}
                        >Remove Workplace Policy
                        </FormButton>
                    }
                </div>
            </PolicyDocumentContainerStyle>
            <PolicyDocumentContainerStyle style={{ paddingLeft: "10px" }}>
                <span style={{ fontSize: "18px", fontWeight: 600, paddingBottom: "3px" }}>Drug Policy</span>
                <PolicyDocumentStyle src={drugPolicy ? `${drugPolicy}#zoom=92` : ""} width="100%" height="100%" title="Drug Policy"></PolicyDocumentStyle>
                <div style={{ display: "flex", width: "100%", textAlign: "center", padding: "10px 0px" }}>
                    <div style={{ paddingRight: "10px" }}>
                        <FormButton
                            style={{ width: "200px" }}
                            onClick={() => uploadFile("d")}
                        >Update Drug Policy
                        </FormButton>
                    </div>
                    {getValue("res_hasdrugpolicy") &&
                        <FormButton
                            style={{ width: "200px" }}
                            onClick={() => handleRemoveRequest("d")}
                        >Remove Drug Policy
                        </FormButton>
                    }
                </div>
            </PolicyDocumentContainerStyle>
        </PoliciesContainerStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={processRemoveRequest} />}
    </>)
}