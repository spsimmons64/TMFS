import { useEffect, useState } from "react"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { bankAccountTypes, billingMethodTypes, countryTypes, monthTypes, statesArray, yearTypes, yesNoTypes } from "../../global/staticdata"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"


export const BillingSetup = ({ callback }) => {
    const {buildFormControls,getValue,setValue,getError } = useMultiFormContext()    
    const [combos, setCombos] = useState({
        echeck: { data: yesNoTypes},
        paytype: { data: billingMethodTypes },
    })

    const handlePayMethodChange = (e) => {
        callback(e)
        setCombos(ps => ({ ...ps, paytype: { ...ps.paytype, selected: e.target.value } }))
    }

    useEffect(() => {
        getValue("bil_allowecheck") == "false" && setValue(ps => ({ ...ps, paymethod: "cc" }))
    }, [getValue("bil_allowecheck")])

    useEffect(()=>{
        if (getValue("res_recordid")==="") buildFormControls({})
        const rec = billingMethodTypes.find(r => r.default === 1)            
        setValue("pay_paymenttype",rec ? rec.value : "")
        
    },[])

    return (<>
        <FormSelect
            id="pay_paymenttype"
            label="Payment Method *"
            options={combos.paytype.data}
            value={getValue("pay_paymenttype")}
            error={getError("pay_paymenttype")}
            disabled={getValue("bil_allowecheck") == "false"}
            labelwidth="168px"
            onChange={handlePayMethodChange}
        />
        {getValue("pay_paymenttype") == "cc"
            ? <>
                <FormInput
                    id="pay_firstname"
                    label="First Name On Card *"
                    mask="text"
                    value={getValue("pay_firstname")}
                    error={getError("pay_firstname")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <FormInput
                    id="pay_lastname"
                    label="Last Name On Card *"
                    mask="text"
                    value={getValue("pay_lastname")}
                    error={getError("pay_lastname")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pay_ccnumber"
                            label="Credit Card Number *"
                            mask="text"
                            value={getValue("pay_ccnumber")}
                            error={getError("pay_ccnumber")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ width: "400px", marginRight: "10px" }}>
                        <FormSelect
                            id="pay_ccmonth"
                            label="Credit Card Expires * "
                            options={monthTypes}
                            value={getValue("pay_ccmonth")}
                            error={getError("pay_ccmonth")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ width: "200px" }}>
                        <FormSelect
                            id="pay_ccyear"
                            options={yearTypes()}
                            value={getValue("pay_ccyear")}
                            error={getError("pay_ccyear")}
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormInput
                    id="pay_address"
                    label="Billing Address *"
                    mask="text"
                    value={getValue("pay_address")}
                    error={getError("pay_address")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <FormInput
                            id="pay_city"
                            label="Billing City *"
                            mask="text"
                            value={getValue("pay_city")}
                            error={getError("pay_city")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <FormSelect
                            id="pay_state"
                            label="State *"
                            options={statesArray}
                            value={getValue("pay_state")}
                            error={getError("pay_state")}
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pay_zipcode"
                            label="Zip Code *"
                            mask="text"
                            value={getValue("pay_zipcode")}
                            error={getError("pay_zipcode")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormSelect
                    id="pay_country"
                    label="Country *"
                    options={countryTypes}
                    value={getValue("pay_country")}
                    error={getError("pay_country")}
                    labelwidth="168px"
                    onChange={callback}
                />
            </>
            : <>
                <FormInput
                    id="pay_bankname"
                    label="Bank Name *"
                    mask="text"
                    value={getValue("pay_bankname")}
                    error={getError("pay_bankname")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pay_bankrouting"
                            label="Bank Routing Number *"
                            mask="text"
                            value={getValue("pay_bankrouting")}
                            error={getError("pay_bankrouting")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pay_bankaccount"
                            label="Bank Account Number *"
                            mask="text"
                            value={getValue("pay_bankaccount")}
                            error={getError("pay_bankaccount")}
                            labelwidth="168px"
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormSelect
                    id="pay_accounttype"
                    label="Account Type *"
                    options={bankAccountTypes}
                    value={getValue("pay_accounttype")}
                    error={getError("pay_accounttype")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <FormInput
                    id="pay_nameonacct"
                    label="Name On Account *"
                    mask="text"
                    value={getValue("pay_nameonacct")}
                    error={getError("pay_nameonacct")}
                    labelwidth="168px"
                    onChange={callback}
                />
                <FormInput
                    id="pay_checknumber"
                    label="Check Number *"
                    mask="text"
                    value={getValue("pay_checknumber")}
                    error={getError("pay_checknumber")}
                    labelwidth="168px"
                    onChange={callback}
                />
            </>
        }
    </>)
}