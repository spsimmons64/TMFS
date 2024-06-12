import { FormInput, FormSelect } from "../../components/portals/inputstyles";
import { countryTypes, monthTypes, statesArray, yearTypes } from "../../global/staticdata";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { useEffect } from "react";

export const AccountSetup4CC = () => {
    const { formControls,handleChange, getValue, getError, buildControlsFromRecord } = useMultiFormContext("account-setup", "")

    useEffect(()=>{
        buildControlsFromRecord({})
    },[])

    return (<>
        <FormInput
            id="pay_ccnumber"
            label="Card Number *"
            mask="text"
            value={getValue("pay_ccnumber")}
            error={getError("pay_ccnumber")}
            labelwidth="168px"
            onChange={handleChange}

        />

        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "350px", marginRight: "10px" }}>
                <FormSelect
                    id="pay_ccmonth"
                    label="Expiration *"
                    options={monthTypes}
                    value={getValue("pay_ccmonth")}
                    error={getError("pay_ccmonth")}
                    labelwidth="168px"
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "150px", paddingRight: "10px" }}>
                <FormSelect
                    id="pay_ccyear"
                    options={yearTypes()}
                    value={getValue("pay_ccyear")}
                    error={getError("pay_ccyear")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormInput
                    id="pay_cvv"
                    label="Security Code *"
                    mask="text"
                    value={getValue("pay_cvv")}
                    error={getError("pay_cvv")}
                    labelwidth="127px"
                    onChange={handleChange}
                />
            </div>
        </div>
        <FormInput
            id="pay_lastname"
            label="Last Name *"
            mask="text"
            value={getValue("pay_lastname")}
            error={getError("pay_lastname")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="pay_firstname"
            label="First Name *"
            mask="text"
            value={getValue("pay_firstname")}
            error={getError("pay_firstname")}
            labelwidth="168px"
            onChange={handleChange}
        />
        <FormInput
            id="pay_address"
            label="Billing Address *"
            mask="text"
            value={getValue("pay_address")}
            error={getError("pay_address")}
            labelwidth="168px"
            onChange={handleChange}
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
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "240px", paddingRight: "10px" }}>
                <FormSelect
                    id="pay_state"
                    label="State *"
                    options={statesArray}
                    value={getValue("pay_state")}
                    error={getError("pay_state")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "180px" }}>
                <FormInput
                    id="pay_zipcode"
                    label="Zip Code *"
                    mask="text"
                    value={getValue("pay_zipcode")}
                    error={getError("pay_zipcode")}
                    onChange={handleChange}
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
            onChange={handleChange}
        />
    </>
    )
}