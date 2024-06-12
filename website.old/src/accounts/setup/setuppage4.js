import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormSelect } from "../../components/portals/inputstyles";
import { billingMethodTypes } from "../../global/staticdata";
import { AccountSetup4CC } from "./setuppage4cc";
import { AccountSetup4ACH } from "./setuppage4ach";

export const AccountSetup4 = () => {
    const { handleChange, getValue, getError, buildControlsFromRecord } = useMultiFormContext()
    const [page, setPage] = useState(0)
    const [billMethod, setBillMethod] = useState("cc")

    const handlePayMethodChange = (e) => {
        handleChange(e)
        setBillMethod(e.target.value)
        setPage(e.target.value == "cc" ? 0 : 1)
    }

    useEffect(() => {
        let defaults = {}
        const bil_rec = billingMethodTypes.find(r => r.default)
        const today = new Date()
        const month = today.getMonth() + 1
        const monthStr = month < 10 ? "0" + month.toString() : month.toString()
        const year = today.getFullYear().toString()
        if (!getValue("pay_paymenttype")) {
            defaults["pay_paymenttype"] = bil_rec.value
            setPage(bil_rec.value == "cc" ? 0 : 1)
        } else {
            setPage(getValue("pay_paymenttype") == "cc" ? 0 : 1)
        }
        if (!getValue("pay_ccmonth")) defaults["pay_ccmonth"] = monthStr
        if (!getValue("pay_ccyear")) defaults["pay_ccyear"] = year
        if (!getValue("pay_lastname")) defaults["pay_lastname"] = getValue("acc_contactlastname")
        if (!getValue("pay_firstname")) defaults["pay_firstname"] = getValue("acc_contactfirstname")
        if (!getValue("pay_nameonacct")) defaults["pay_nameonacct"] = `${getValue("acc_contactfirstname")} ${getValue("acc_contactlastname")}`
        if (!getValue("pay_address")) defaults["pay_address"] = getValue("acc_address1")
        if (!getValue("pay_city")) defaults["pay_city"] = getValue("acc_city")
        if (!getValue("pay_state")) defaults["pay_state"] = getValue("acc_state")
        if (!getValue("pay_zipcode")) defaults["pay_zipcode"] = getValue("acc_zipcode")
        if (!getValue("pay_country")) defaults["pay_country"] = getValue("acc_country")
        buildControlsFromRecord(defaults)

    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Step 4 of 5: Billing Profile</div>
        <div>Please complete the form below to setup the billing profile for your account.</div>
        <div><b>Make sure the address you enter matches the address associated with your card or account.</b></div>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Payment Method</div>
        <FormSelect
            id="pay_paymenttype"
            label="Payment Method *"
            options={billingMethodTypes}
            value={getValue("pay_paymenttype")}
            error={getError("pay_paymenttype")}
            labelwidth="168px"
            onChange={handlePayMethodChange}
        />
        {page == 0 && <AccountSetup4CC />}
        {page == 1 && <AccountSetup4ACH />}
    </>)
}