import { useContext, useEffect, useState } from "react"
import { MessageContext } from "../../administration/contexts/messageContext";
import { getApiUrl } from "../globals";

export const useRestApi = (url, verb, formData, toggle) => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [response, setResponse] = useState({ status: "", message: "", errors: {}, data: [], count: 0, total: 0, busy: true });

    const fetchData = async () => {
        if (url) {            
            let api = new URL(`${getApiUrl()}/${url}`)
            let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
            if (verb.toLowerCase() !== "get") {
                headers = { credentials: "include", method: verb.toLowerCase(), body: formData }
            }                        
            const resp = await fetch(api, { ...headers });
            const jsonResp = await resp.json();
            if (jsonResp) {
                setResponse({
                    status: jsonResp.status,
                    message: jsonResp.message || "",
                    errors: jsonResp.errors || [],
                    data: jsonResp.data || [],
                    count: jsonResp.count || 0,
                    total: jsonResp.total,
                });
                if (jsonResp.message) {
                    let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
                    setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
                }
            }
        }
    }
    useEffect(() => { fetchData(); }, [toggle]);
    return response;
}