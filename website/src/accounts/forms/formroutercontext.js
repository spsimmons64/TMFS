import { createContext, useState } from "react";
import { SendPoliciesForm } from "./sendpoliciesform";
import { FlagDriverForm } from "./flagdriverform";
import { DriverMemoForm } from "./drivermemoform";
import { UploadRequestForm } from "./uploadrequestform";
import { PendingForm } from "./pendingform";
import { DiscardForm } from "./discardform";
import { RejectForm } from "./rejectform";
import { ClearFlagForm } from "./clearflagform";

export const FormRouterContext = createContext()

export const FormRouterContextProvider = ({ children }) => {
    const initialState = {id: -1,params: {},callback: null}
    const [currForm, setCurrForm] = useState({...initialState})    
    const formMenu = [
        {id:0,component:SendPoliciesForm},
        {id:1,component:DriverMemoForm},
        {id:2,component:UploadRequestForm},
        {id:3,component:FlagDriverForm},
        {id:4,component:ClearFlagForm},
        {id:5,component:PendingForm},
        {id:6,component:DiscardForm},
        {id:7,component:RejectForm},    
    ]

    const openForm = (formid,params,callback) => setCurrForm({id:formid,params:params,callback:callback})

    const closeForm = () => setCurrForm({...initialState})

    const fetchForm = (id) => {        
        if(id===-1) return <></>
        const item = formMenu.find(r=>r.id===id)
        if(item) return <item.component params={currForm.params} callback={currForm.callback} />
        return(<></>)
    }

    return (
        <FormRouterContext.Provider value={{ openForm,closeForm }}>
            {children}
            {fetchForm(currForm.id)}        
        </FormRouterContext.Provider>
    )
}