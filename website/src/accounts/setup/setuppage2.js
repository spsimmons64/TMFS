import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import {  languageTypes} from "../../global/staticdata";
import { FormInput, FormSelect } from "../../components/portals/inputstyles";

export const AccountSetup2 = ({ reseller }) => {
    const { handleChange, getValue, setValue ,getError, buildControlsFromRecord } = useMultiFormContext()
    const [siteUrl, setSiteUrl] = useState("")

    const handleSiteChange = (e) => {
        handleChange(e)
        setSiteUrl(`${reseller.siteroute}/${e.target.value}`)
    }

    useEffect(() => { setSiteUrl(`${reseller.siteroute}/${getValue("acc_siteroute")}`) }, [reseller])

    useEffect(() => {
        const defaults = {}
        const lan_rec = languageTypes.find(r => r.default == true)
        if (!getValue("usr_language")) defaults["usr_language"] = lan_rec.value        
        buildControlsFromRecord(defaults)
        
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Step 2 of 5: Login Information And Friendly URL</div>
        <div style={{ padding: "0px 0px 10px 0px" }}>Please complete the form below to create your login information and friendly URL.</div>
        <FormInput
            id="acc_contactlastname"
            label="Contact Last Name *"
            mask="text"
            value={getValue("acc_contactlastname")}
            error={getError("acc_contactlastname")}
            labelwidth="200px"
            onChange={handleChange}
            autoFocus
        />
        <FormInput
            id="acc_contactfirstname"
            label="Contact First Name *"
            mask="text"
            value={getValue("acc_contactfirstname")}
            error={getError("acc_contactfirstname")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormInput
            id="usr_position"
            label="Position *"
            mask="text"
            value={getValue("usr_position")}
            error={getError("usr_position")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormInput
            id="eml_emailcontact"
            label="Email Address *"
            mask="text"
            value={getValue("eml_emailcontact")}
            error={getError("eml_emailcontact")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormInput
            id="pwd_password"
            type="password"
            label="Account Password *"
            mask="text"
            value={getValue("pwd_password")}
            error={getError("pwd_password")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormInput
            id="pwd_pwconfirm"
            type="password"
            label="Password Confirmation *"
            mask="text"
            value={getValue("pwd_pwconfirm")}
            error={getError("pwd_pwconfirm")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormSelect
            id="usr_language"
            label="Preferred Language *"
            options={languageTypes}
            value={getValue("usr_language")}
            error={getError("usr_language")}
            labelwidth="200px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_siteroute"
            label="Friendly URL *"
            mask="text"
            value={getValue("acc_siteroute")}
            error={getError("acc_siteroute")}
            labelwidth="200px"
            onChange={handleSiteChange}
        />
        <FormInput
            label="Your URL &nbsp;&nbsp;"
            mask="text"
            value={siteUrl}
            labelwidth="200px"
            onChange={handleChange}
            readOnly
            tabIndex={-1}
            style={{ fontWeight: 600, color: "green" }}
        />
        <p style={{ textAlign: "center" }}>The Friendly URL is the portion of the web url that will identifiy your company.  Do not enter the "https://"
            prefix or any part of the domain. Valid characters include A-Z, 0-9 and a hyphen (-).  No spaces are allowed.
        </p>
        <p style={{ textAlign: "center", paddingTop: "20px", fontSize: "14px", color: "#ff4d4d" }}>
            <strong>BE SURE THE GREEN "YOUR URL" ABOVE LOOKS CORRECT BEFORE PROCEEDING. THIS CANNOT BE CHANGED LATER.</strong>
        </p>
    </>)
}