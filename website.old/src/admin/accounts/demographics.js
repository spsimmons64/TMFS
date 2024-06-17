import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { countryTypes, statesArray, timeZonesTypes } from "../../global/staticdata"

export const Demographics = ({ record, callback }) => {

    console.log(record)

    return (<>
        {/* <FormInput
            id="companyname"
            label="Company Name *"
            mask="text"
            value={record.res_companyname.value}
            error={record.res_companyname.error}
            labelwidth="168px"
            onChange={callback}
            autoFocus
        />
        <FormInput
            id="contactlastname"
            label="Contact Last Name *"
            mask="text"
            value={record.res_contactlastname.value}
            error={record.res_contactlastname.error}
            labelwidth="168px"
            onChange={callback}
        />
        <FormInput
            id="contactfirstname"
            label="Contact First Name *"
            mask="text"
            value={record.res_contactfirstname.value}
            error={record.res_contactfirstname.error}
            labelwidth="168px"
            onChange={callback}
        />
        <FormInput
            id="emailgeneral"
            label="Email Address *"
            mask="text"
            value={record.eml_emailcontact.value}
            error={record.eml_emailcontact.error}
            labelwidth="168px"
            onChange={callback}
        />
        <FormInput
            id="address1"
            label="Address 1 *"
            mask="text"
            value={record.res_address1.value}
            error={record.res_address1.error}
            labelwidth="168px"
            onChange={callback}
        />
        <FormInput
            id="address2"
            label="Address 2 &nbsp;&nbsp;"
            mask="text"
            value={record.res_address2.value}
            error={record.res_address2.error}
            labelwidth="168px"
            onChange={callback}
        />
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
                <FormInput
                    id="city"
                    label="City *"
                    mask="text"
                    value={record.res_city.value}
                    error={record.res_city.error}
                    labelwidth="168px"
                    onChange={callback}
                />
            </div>
            <div style={{ width: "300px", marginRight: "10px" }}>
                <FormSelect
                    id="state"
                    label="State *"
                    value={record.res_state.value}
                    error={record.res_state.error}
                    options={statesArray}
                    onChange={callback}
                />
            </div>
            <div style={{ width: "300px"}}>
                <FormInput
                    id="zipcode"
                    label="Zip Code *"
                    mask="text"
                    value={record.res_zipcode.value}
                    error={record.res_zipcode.error}
                    onChange={callback}
                />
            </div>
        </div>
        <FormSelect
            id="country"
            label="Country *"
            value={record.res_country.value}
            error={record.res_country.error}
            options={countryTypes}
            onChange={callback}
            labelwidth="168px"
        />

        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
                <FormInput
                    id="telephone"
                    label="Telephone *"
                    mask="telephone"
                    value={record.res_telephone.value}
                    error={record.res_telephone.error}
                    labelwidth="168px"
                    onChange={callback}
                />
            </div>
            <div style={{ flex: 1, marginRight: "10px" }}>
                <FormInput
                    id="fax"
                    label="Fax Number &nbsp;&nbsp;"
                    mask="telephone"
                    value={record.res_fax.value}
                    error={record.res_fax.error}
                    onChange={callback}
                />
            </div>

            <div style={{ flex: 1 }}>
                <FormInput
                    id="ein"
                    label="Tax ID / EIN *"
                    mask="ein"
                    value={record.res_ein.value}
                    error={record.res_ein.error}                    
                    onChange={callback}
                />
            </div>
        </div>
        <FormSelect
            id="timezone"
            label="Time Zone *"
            value={record.res_ein.value}
            error={record.res_ein.error}
            options={timeZonesTypes}
            labelwidth="168px"
            onChange={callback}
        /> */}
    </>)
}