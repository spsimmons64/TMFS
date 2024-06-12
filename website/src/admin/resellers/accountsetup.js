import { useEffect, useState } from "react"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { useRestApi } from "../../global/hooks/restapi"
import { billingDayTypes, domains, yesNoTypes } from "../../global/staticdata"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"
import { FormButton } from "../../components/portals/buttonstyle"

export const AccountSetup = ({ callback }) => {
    const { buildFormControls, getValue, setValue, getError } = useMultiFormContext()
    const [combos, setCombos] = useState({ smtpprofiles: { data: [] }, pricing: { data: [] } });
    const [siteUrl, setSiteUrl] = useState("")
    const [inviteState, setInviteState] = useState({ url: "", reset: false })
    const smtpData = useRestApi("combos/smtpprofiles", "GET", {}, true)
    const pricingData = useRestApi("combos/pricing?packagetype=resellers&frequency=monthly", "GET", {}, true)
    const inviteData = useRestApi(inviteState.url, "GET", {}, inviteState.reset)

    const handleSiteUrl = () => {
        const rec = domains.find(r => r.value == getValue("res_sitedomain"))
        setSiteUrl(`https://${getValue("res_siteroute")}.${rec ? rec.text : ""}`)
    }

    const handleInvite = () => {
        setInviteState(ps => ({ ...ps, url: `resellers/invite?id=${getValue("res_recordid")}`, reset: !inviteState.reset }))
    }

    useEffect(() => {
        if (inviteData.status == 200) {
            console.log(inviteData.data)
            setValue("set_invitationsent", inviteData.data.invitationsent)
            setValue("set_temppassword","")
        }
    }, [inviteData])

    useEffect(() => {
        if (smtpData.status === 200) {
            let def_rec = smtpData.data.find(r => r.default === 1)
            def_rec && setValue("res_smtpprofileid", def_rec.value)
            setCombos(ps => ({ ...ps, smtpprofiles: { data: smtpData.data } }))
        }
    }, [smtpData])

    useEffect(() => {
        if (pricingData.status === 200) {
            let def_rec = pricingData.data.find(r => r.default === 1)
            def_rec && setValue("bil_pricingid", def_rec.value)
            setCombos(ps => ({ ...ps, pricing: { data: pricingData.data } }))
        }
    }, [pricingData])

    useEffect(() => { handleSiteUrl() }, [getValue("res_siteroute"), getValue("res_sitedomain")])

    useEffect(() => { getValue("res_recordid") === "" && buildFormControls({}) }, [])

    return (<>
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, paddingRight: "10px" }}>
                <FormInput
                    id="res_companyname"
                    label="Company Name *"
                    mask="text"
                    value={getValue("res_companyname")}
                    error={getError("res_companyname")}
                    labelwidth="214px"
                    onChange={callback}
                    autoFocus
                />
                <FormInput
                    id="res_contactlastname"
                    label="Contact Last Name *"
                    mask="text"
                    value={getValue("res_contactlastname")}
                    error={getError("res_contactlastname")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="res_contactfirstname"
                    label="Contact First Name *"
                    mask="text"
                    value={getValue("res_contactfirstname")}
                    error={getError("res_contactfirstname")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="eml_emailcontact"
                    label="Email Address *"
                    mask="text"
                    value={getValue("eml_emailcontact")}
                    error={getError("eml_emailcontact")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="res_telephone"
                    label="Telephone *"
                    mask="telephone"
                    value={getValue("res_telephone")}
                    error={getError("res_telephone")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormSelect
                    id="res_smtpprofileid"
                    label="Mail Domain * "
                    value={getValue("res_smtpprofileid")}
                    error={getError("res_smtpprofileid")}
                    options={combos.smtpprofiles.data}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="res_siteroute"
                    label="Site Route *"
                    mask="text"
                    value={getValue("res_siteroute")}
                    error={getError("res_siteroute")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormSelect
                    id="res_sitedomain"
                    label="Domain *"
                    value={getValue("res_sitedomain")}
                    error={getError("res_sitedomain")}
                    options={domains}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="siteUrl"
                    label="Friendly URL &nbsp;&nbsp;"
                    mask="text"
                    value={siteUrl}
                    readOnly
                    tabIndex={-1}
                    data-ignore
                    labelwidth="214px"
                    style={{ fontWeight: 600, color: "green" }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormSelect
                    id="bil_pricingid"
                    label="Monthly Pricing * "
                    value={getValue("bil_pricingid")}
                    error={getError("bil_pricingid")}
                    options={combos.pricing.data}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="bil_setupfee"
                    label="Setup Fee *"
                    mask="currency"
                    value={getValue("bil_setupfee")}
                    error={getError("bil_setupfee")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="bil_setuppayments"
                    label="Setup Monthly Payment  &nbsp;&nbsp;"
                    mask="currency"
                    value={getValue("bil_setuppayments")}
                    error={getError("bil_setuppayments")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormSelect
                    id="bil_billingdom"
                    label="Billing Day * "
                    value={getValue("bil_billingdom")}
                    error={getError("bil_billingdom")}
                    options={billingDayTypes}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormSelect
                    id="bil_allowecheck"
                    label="Allow E Checks * "
                    value={getValue("bil_allowecheck")}
                    error={getError("bil_allowecheck")}
                    labelwidth="214px"
                    options={yesNoTypes}
                    onChange={callback}
                />
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <FormInput
                            id="bil_reloadlevel"
                            label="Minimum Balance *"
                            mask="currency"
                            value={getValue("bil_reloadlevel")}
                            error={getError("bil_reloadlevel")}
                            labelwidth="214px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="bil_autodeposit"
                            label="Auto Deposit *"
                            mask="currency"
                            value={getValue("bil_autodeposit")}
                            error={getError("bil_autodeposit")}
                            labelwidth="214px"
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormInput
                    id="bil_pspdiscount"
                    label="PSP Discount &nbsp;&nbsp;"
                    mask="currency"
                    value={getValue("bil_pspdiscount")}
                    error={getError("bil_pspdiscount")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="bil_mvrdiscount"
                    label="MVR Discount &nbsp;&nbsp;"
                    mask="currency"
                    value={getValue("bil_mvrdiscount")}
                    error={getError("bil_mvrdiscount")}
                    labelwidth="214px"
                    onChange={callback}
                />
                <FormInput
                    id="bil_cdlisdiscount"
                    label="CDLIS Discount &nbsp;&nbsp;"
                    mask="currency"
                    value={getValue("bil_cdlisdiscount")}
                    error={getError("bil_cdlisdiscount")}
                    labelwidth="214px"
                    onChange={callback}
                />
            </div>
        </div >
        {getValue("res_recordid") !== "" && <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",paddingTop:"20px" }}>
                <FormButton color="purple" style={{ width: "200px", height: "50px" }} onClick={handleInvite}>Send User Invitation</FormButton>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ paddingTop: "10px", fontSize: "14px", fontWeight: "600" }}>{getValue("set_invitationsent")}</span>
            </div>
            {getValue("set_temppassword")
                ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ paddingTop: "10px", fontSize: "14px", fontWeight: "600" }}>
                        Temporary Password: <span style={{color:"#164398",textDecoration:"underline"}}>{getValue("set_temppassword")}</span></span>
                  </div>
                : <></>
            }
        </>}
    </>)
}