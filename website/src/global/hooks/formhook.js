import { useContext, useState } from "react"
import { MessageContext } from "../../administration/contexts/messageContext";
import { getApiUrl } from "../globals";

export const useFormHook = (id, url) => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [formState, setFormState] = useState({ id: id, url: url, verb: "", data: {}, busy: false, reset: false })
    const [formControls, setFormControls] = useState({})
    const [formErrors, setFormErrors] = useState({})

    const sendFormData = async (verb, data, url=formState.url) => {
        setFormState(ps => ({ ...ps, data: {}, busy: true }))
        let newUrl = `${getApiUrl()}/${url}`
        let api = new URL(newUrl)
        const headers = { credentials: "include", method: verb.toLowerCase(), body: data }
        const resp = await fetch(api, { ...headers });
        const jsonResp = await resp.json();        
        if (jsonResp.message) {
            let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
            setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
        }        
        if (jsonResp.errors) {            
            let errors = {}            
            jsonResp.errors.forEach(err => { errors[err.id] = err.text })
            setFormErrors(errors)
        }        
        setFormState(ps => ({ ...ps, data: {}, busy: false }))
        return jsonResp
    }

    const getValue = (id) => {                
        return formControls[id]
    }

    const setValue = (id,value) => {                 
        setFormControls(ps => ({ ...ps, [id]: value }))        
    }

    const getError = (id) => {
        let field = formErrors[id]
        return field ? formErrors[id] : ""
    }

    const clearError = (id) => {               
        let newList = { ...formErrors }        
        newList[id] = ""                
        setFormErrors(newList)
    }

    const handleChange = (e) => {                          
        const { id, type, value, checked } = e.target;     
        const newValue = type == "checkbox" ? (checked ? "1" : "0") : value        
        clearError(id)
        setValue(id,newValue)
    }

    const serializeFormData = () => {        
        let data = new FormData()
        for (let key in formControls) {            
            const el = document.getElementById(key)            
            if(el && !el.getAttribute("data-ignore")) data.append(key, formControls[key] || "")
        }    
        return (data)
    }

    const buildFormControls = (record) => {        
        setFormState(ps => ({ ...ps, busy: false }))
        let newControls = {...formControls}
        for (let key in record) {newControls[key] = record[key]}
        const el = document.getElementById(formState.id)
        let fields = el.querySelectorAll('[id]');
        Array.from(fields).forEach(field => {
            if (!newControls.hasOwnProperty(field.id))
                newControls[field.id] = record.hasOwnProperty(field.id) ? record[field.id] : "";
        })
        setFormControls({ ...newControls })
        setFormState(ps => ({ ...ps, busy: false }))
    }

    const setFormBusy = (toggle) => {        
        setFormState(ps=>({...ps,busy:toggle}))
    }

    const getFormBusy = () => formState.busy

    return {
        formState,
        setFormState,
        setFormControls,        
        setFormErrors,
        formControls,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        setValue,
        getError,
        sendFormData,
        setFormBusy,
        getFormBusy
    }
}