import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { countryTypes, statesArray, timeZonesTypes } from "../../global/staticdata";
import { FormInput, FormSelect } from "../../components/portals/inputstyles";

export const AccountSetup1 = ({ reseller }) => {
    const { handleChange, setValue, getValue, getError, buildControlsFromRecord, formControls } = useMultiFormContext()

    const handleRadio = ({ target }) => {
        setValue("bil_accounttype", target.value)
    }

    useEffect(() => {
        if (reseller.id && getValue("acc_resellerid") == "") {
            let defaults = {}
            const state_rec = statesArray.find(r => r.default)
            const country_rec = countryTypes.find(r => r.default)
            const timezone_rec = timeZonesTypes.find(r => r.default)
            defaults = {
                acc_recordid: "",
                acc_resellerid: reseller.id,
                acc_state: state_rec ? state_rec.value : "",
                acc_country: country_rec ? country_rec.value : "",
                acc_timezone: timezone_rec ? timezone_rec.value : "",
                bil_accounttype: "full",
            }
            buildControlsFromRecord(defaults)
        }
    }, [reseller])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Step 1 of 5: General Account Information</div>
        <div>Please complete the form below to create your account.</div>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Account Type</div>
        <div>
            <label>
                <input
                    type="radio"
                    name="accountapp"
                    onChange={handleRadio}
                    value="full"
                    checked={getValue("bil_accounttype") == "full"}
                    data-ignore
                    style={{ margin: "8px 5px" }}
                />
                <span style={{ fontWeight: 600 }}>Full Account:</span>&nbsp;Access to all features and documents. Fees based on active drivers.
            </label>
        </div>
        <div>
            <label style={{ paddingRight: "10px" }}>
                <input
                    type="radio"
                    name="accountapp"
                    onChange={handleRadio}
                    value="app-only"
                    checked={getValue("bil_accounttype") == "app-only"}
                    data-ignore
                    style={{ margin: "8px 5px" }}
                />
                <span style={{ fontWeight: 600 }}>Application Only:</span>&nbsp;Access to online application only. Fees based on submitted applications.
            </label>
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "30px 0px 5px 0px" }}>Company Information</div>
        <FormInput
            id="acc_dot"
            label="DOT # *"
            mask="text"
            value={getValue("acc_dot")}
            error={getError("acc_dot")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_companyname"
            label="Company Name *"
            mask="text"
            value={getValue("acc_companyname")}
            error={getError("acc_companyname")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_address1"
            label="Address 1 *"
            mask="text"
            value={getValue("acc_address1")}
            error={getError("acc_address1")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_address2"
            label="Address 2 *"
            mask="text"
            value={getValue("acc_address2")}
            error={getError("acc_address2")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_city"
            label="City *"
            mask="text"
            value={getValue("acc_city")}
            error={getError("acc_city")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormSelect
            id="acc_state"
            label="State *"
            options={statesArray}
            value={getValue("acc_state")}
            error={getError("acc_state")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_zipcode"
            label="Zip Code *"
            mask="text"
            value={getValue("acc_zipcode")}
            error={getError("acc_zipcode")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormSelect
            id="acc_country"
            label="Country *"
            options={countryTypes}
            value={getValue("acc_country")}
            error={getError("acc_country")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="acc_telephone"
            label="Telephone *"
            mask="telephone"
            value={getValue("acc_telephone")}
            error={getError("acc_telephone")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormSelect
            id="acc_timezone"
            label="Time Zone *"
            options={timeZonesTypes}
            value={getValue("acc_timezone")}
            error={getError("acc_timezone")}
            labelwidth="168px"
            onChange={handleChange}
        />
    </>)
}