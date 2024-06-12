import { FormInput, FormSelect } from "../../components/portals/inputstyles";
import { bankAccountTypes} from "../../global/staticdata";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { useEffect } from "react";

export const AccountSetup4ACH = () => {
    const { handleChange, getValue,setValue,getError, buildControlsFromRecord } = useMultiFormContext("account-setup", "")

    useEffect(()=>{
        let defaults = {}
        const acc_rec = bankAccountTypes.find(r=>r.default)   
        if(!getValue("pay_accounttype")) defaults["pay_accounttype"] = acc_rec.value
        buildControlsFromRecord(defaults)
    },[])
    
    return (<>
        <FormInput
            id="pay_bankname"
            label="Bank Name *"
            mask="text"
            value={getValue("pay_bankname")}
            error={getError("pay_bankname")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
                <FormInput
                    id="pay_bankrouting"
                    label="Routing Number *"
                    mask="text"
                    value={getValue("pay_bankrouting")}
                    error={getError("pay_bankrouting")}
                    labelwidth="168px"
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormInput
                    id="pay_bankaccount"
                    label="Account Number *"
                    mask="text"
                    value={getValue("pay_bankaccount")}
                    error={getError("pay_bankaccount")}
                    labelwidth="168px"
                    onChange={handleChange}
                />
            </div>
        </div>
        <FormInput
            id="pay_nameonacct"
            label="Name On Account *"
            mask="text"
            value={getValue("pay_nameonacct")}
            error={getError("pay_nameonacct")}
            labelwidth="168px"
            onChange={handleChange}
        />

        <FormSelect
            id="pay_accounttype"
            label="Account Type *"
            options={bankAccountTypes}
            value={getValue("pay_accounttype")}
            error={getError("pay_accounttype")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="pay_checknumber"
            label="Check Number &nbsp;&nbsp;"
            mask="text"
            value={getValue("pay_checknumber")}
            error={getError("pay_checknumber")}
            labelwidth="168px"
            onChange={handleChange}
        />
    </>)
}