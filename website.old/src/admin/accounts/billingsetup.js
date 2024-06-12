import { useEffect, useState } from "react"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { bankAccountTypes, billingDayTypes, billingMethodTypes, countryTypes, domains, monthTypes, statesArray, yearTypes, yesNoTypes } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"

export const BillingSetup = ({ record, callback, setData }) => {
    const [combos, setCombos] = useState({
        pricing: { data: [] },
        echeck: { data: yesNoTypes, selected: "" },
        paytype: { data: billingMethodTypes, selected: "" },
    })
    const pricingData = useRestApi("combos/pricing", "GET", {}, true)

    const handlePayMethodChange = (e) => {
        callback(e)
        setCombos(ps => ({ ...ps, paytype: { ...ps.paytype, selected: e.target.value } }))
    }

    useEffect(() => { pricingData.status === 200 && setCombos(ps => ({ ...ps, pricing: { ...ps.pricing, data: pricingData.data } })) }, [pricingData])

    useEffect(() => {
        record.allowecheck.value == "false" && setData(ps => ({ ...ps, paymethod: { ...ps.paymethod, value: "cc" } }))
    }, [record.allowecheck.value])

    useEffect(() => { setCombos(ps => ({ ...ps, paytype: { ...ps.paytype, selected: record.pp_paymenttype.value } })) }, [])

    return (<>
        <FormSelect
            id="pricingid"
            options={combos.pricing.data}
            label="Billing Profile * "
            value={record.pricingid.value}
            error={record.pricingid.error}
            labelwidth="200px"
            onChange={callback}
        />
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 ,paddingRight:"10px"}}>
                <FormSelect
                    id="billingdom"
                    label="Billing Day * "
                    options={billingDayTypes}
                    value={record.billingdom.value}
                    error={record.billingdom.error}
                    labelwidth="200px"
                    onChange={callback}
                />
            </div>
            <div style={{ flex: 1, marginRight: "10px" }}>
                <FormInput
                    id="reloadlevel"
                    label="Minimum Balance *"
                    mask="currency"
                    value={record.reloadlevel.value}
                    error={record.reloadlevel.error}

                    onChange={callback}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormInput
                    id="reloaddeposit"
                    label="Auto Deposit Amount *"
                    mask="currency"
                    value={record.reloaddeposit.value}
                    error={record.reloaddeposit.error}
                    labelwidth="200px"
                    onChange={callback}
                />
            </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
                <FormSelect
                    id="allowecheck"
                    label="Allow E-Checks * "
                    options={combos.echeck.data}
                    value={record.allowecheck.value}
                    error={record.allowecheck.error}
                    labelwidth="200px"
                    onChange={callback}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormSelect
                    id="pp_paymenttype"
                    label="Payment Method *"
                    options={combos.paytype.data}
                    value={record.pp_paymenttype.value}
                    error={record.pp_paymenttype.error}
                    disabled={record.allowecheck.value == "false"}
                    labelwidth="200px"
                    onChange={handlePayMethodChange}
                />
            </div>
        </div>

        {combos.paytype.selected == "cc"
            ? <>
                <FormInput
                    id="pp_firstname"
                    label="First Name On Card *"
                    mask="text"
                    value={record.pp_firstname.value}
                    error={record.pp_firstname.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="pp_lastname"
                    label="Last Name On Card *"
                    mask="text"
                    value={record.pp_lastname.value}
                    error={record.pp_lastname.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pp_ccnumber"
                            label="Credit Card Number *"
                            mask="text"
                            value={record.pp_ccnumber.value}
                            error={record.pp_ccnumber.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ width: "400px", marginRight: "10px" }}>
                        <FormSelect
                            id="pp_ccmonth"
                            label="Credit Card Expires * "
                            options={monthTypes}
                            value={record.pp_ccmonth.value}
                            error={record.pp_ccmonth.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ width: "200px" }}>
                        <FormSelect
                            id="pp_ccyear"
                            options={yearTypes()}
                            value={record.pp_ccyear.value}
                            error={record.pp_ccyear.error}
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormInput
                    id="pp_address"
                    label="Billing Address *"
                    mask="text"
                    value={record.pp_address.value}
                    error={record.pp_address.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <FormInput
                            id="pp_city"
                            label="Billing City *"
                            mask="text"
                            value={record.pp_city.value}
                            error={record.pp_city.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <FormSelect
                            id="pp_state"
                            label="State *"
                            options={statesArray}
                            value={record.pp_state.value}
                            error={record.pp_state.error}
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pp_zipcode"
                            label="Zip Code *"
                            mask="text"
                            value={record.pp_zipcode.value}
                            error={record.pp_zipcode.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormSelect
                    id="pp_country"
                    label="Country *"
                    options={countryTypes}
                    value={record.pp_country.value}
                    error={record.pp_country.error}
                    labelwidth="200px"
                    onChange={callback}
                />
            </>
            : <>
                <FormInput
                    id="pp_bankname"
                    label="Bank Name *"
                    mask="text"
                    value={record.pp_bankname.value}
                    error={record.pp_bankname.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pp_bankrouting"
                            label="Bank Routing Number *"
                            mask="text"
                            value={record.pp_bankrouting.value}
                            error={record.pp_bankrouting.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="pp_bankaccount"
                            label="Bank Account Number *"
                            mask="text"
                            value={record.pp_bankaccount.value}
                            error={record.pp_bankaccount.error}
                            labelwidth="200px"
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormSelect
                    id="pp_accounttype"
                    label="Account Type *"
                    options={bankAccountTypes}
                    value={record.pp_accounttype.value}
                    error={record.pp_accounttype.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="pp_nameonacct"
                    label="Name On Account *"
                    mask="text"
                    value={record.pp_nameonacct.value}
                    error={record.pp_nameonacct.error}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="pp_checknumber"
                    label="Check Number *"
                    mask="text"
                    value={record.pp_checknumber.value}
                    error={record.pp_checknumber.error}
                    labelwidth="200px"
                    onChange={callback}
                />
            </>
        }
    </>)
}