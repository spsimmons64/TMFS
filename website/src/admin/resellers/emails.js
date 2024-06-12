import { useEffect } from "react"
import { FormInput} from "../../components/portals/inputstyles"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"


export const Emails = ({ callback }) => {
    const {buildFormControls,getValue,getError } = useMultiFormContext()    

    useEffect(()=>{getValue("res_recordid")==="" && buildFormControls({})},[])

    return (<>
        <FormInput
            id="res_emailgeneral"
            label="General Email *"
            mask="text"
            value={getValue("res_emailgeneral")}
            error={getError("res_emailgeneral")}
            labelwidth="200px"
            placeholder = "Separate Multiple Emails With A Comma..."
            onChange={callback}
        />
        <FormInput
            id="res_emailsupport"
            label="Support Email *"
            mask="text"
            value={getValue("res_emailsupport")}
            error={getError("res_emailsupport")}
            labelwidth="200px"
            placeholder = "Separate Multiple Emails With A Comma..."
            onChange={callback}
        />        
        <FormInput
            id="res_emailbilling"
            label="Billing Email *"
            mask="text"
            value={getValue("res_emailbilling")}
            error={getError("res_emailbilling")}
            labelwidth="200px"
            placeholder = "Separate Multiple Emails With A Comma..."
            onChange={callback}
        />        
    </>)
}