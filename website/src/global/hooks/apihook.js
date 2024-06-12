import { useContext, useState } from "react"
import { getApiUrl } from "../globals";
import { MessageContext } from "../../administration/contexts/messageContext";

export const useRestApi = () => {    
    const [messageState, setMessageState] = useContext(MessageContext); 

    const fetchData = async (url, verb, formData={}) => {
        if (url) {
            let api = new URL(`${getApiUrl()}/${url}`)
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
            if (verb.toLowerCase() !== "get") {
                headers = { credentials: "include", method: verb.toLowerCase(), body: formData }
            }
            const resp = await fetch(api, { ...headers });
            const jsonResp = await resp.json();
            if (jsonResp.message) {
                let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");                
                setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
            }
            return jsonResp            
        }
    }
    return { fetchData }
}