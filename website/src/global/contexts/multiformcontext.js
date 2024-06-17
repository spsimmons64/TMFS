import { createContext, useContext, useEffect, useState } from "react";

import { MessageContext } from "../../administration/contexts/messageContext";
import { getApiUrl } from "../globals";

const MultiFormContext = createContext()

export const MultiFormContextProvider = ({ id, url, children }) => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [formState, setFormState] = useState({ id: id, url: url, verb: "", data: {}, busy: false, reset: false })
    const [formControls, setFormControls] = useState({})
    const [formErrors, setFormErrors] = useState({})    

    const sendFormData = async (verb, data, url = "") => {
        setFormState(ps => ({ ...ps, data: {}, busy: true }))
        let newUrl = `${getApiUrl()}/${url == "" ? formState.url : url}`
        let api = new URL(newUrl)
        const headers = { credentials: "include", method: verb.toLowerCase(), body: data }
        const resp = await fetch(api, { ...headers });
        const jsonResp = await resp.json();        
        if (jsonResp.message) {
            let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
            setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
        }
        if (jsonResp.errors.length) {
            let errors = {}
            jsonResp.errors.forEach(err => { errors[err.id] = err.text })
            setFormErrors(errors)
        }
        setFormState(ps => ({ ...ps, data: {}, busy: false }))
        return jsonResp
    }

    const getValue = (id) => {        
        const field = formControls[id]
        return field ? formControls[id] : ""
    }
    
    const setValue = (id, value, type = "input") => {  
        let newValue = value
        if (value=="true") newValue = true
        if (value=="false") newValue = false
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
        clearError(id)        
        setValue(id, type == "checkbox" ? checked : value, type)
    }

    const serializeFormData = () => {
        const formEl = document.getElementById(formState.id)        
        if (formEl) {            
            const inputEl = formEl.querySelectorAll('[id]')            
            
            inputEl.forEach(el => {(!el.getAttribute("data-ignore")) && setValue(el.id, el.value)})
        }
        let data = new FormData()
        for (let key in formControls) {
            const el = document.getElementById(key)
            if (el && el.getAttribute("data-ignore")) continue
            data.append(key, formControls[key] || "")
        }
        return (data)
    }

    const buildControlsFromRecord = (record) => {
        setFormState(ps => ({ ...ps, busy: true }))
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

    const buildFormControls = (record) => {
        let newControls = {}
        const el = document.getElementById(formState.id)
        let fields = el.querySelectorAll('[id]');
        Array.from(fields).forEach(field => {
            newControls[field.id] = record.hasOwnProperty(field.id) ? record[field.id] : "";
        })
        setFormControls({ ...newControls })
    }

    const setFormBusy = (toggle) => {        
        setFormState(ps=>({...ps,busy:toggle}))
    }

    const getFormBusy = () => formState.busy
    
    return (<MultiFormContext.Provider value={{
        formState,
        setFormState,
        setFormControls,
        setFormErrors,
        buildControlsFromRecord,
        formControls,
        formErrors,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        setValue,
        getError,
        clearError,
        sendFormData,
        setFormBusy,
        getFormBusy,
    }}>{children}</MultiFormContext.Provider>)
}

export const useMultiFormContext = () => {
    const context = useContext(MultiFormContext);
    return context;
}
