import { CardRow } from "../../../components/administration/card"
import { FormInput } from "../../../components/administration/inputs/forminput"

export const PSPForm = ({ record }) => {
    return (<>
        <CardRow>
            <div style={{ flex: 1, marginRight: "4px" }}>
                <FormInput id="apiprofiles_apiname" label="API Profile" mask="text" value={record.apiprofiles_apiname} disabled />
            </div>
            <div style={{ width: "100px", marginLeft: "4px" }}>
                <FormInput id="apiprofiles_account" label="Account ID" value={record.apiprofiles_account} required autoFocus />
            </div>
        </CardRow>
        <FormInput id="apiprofiles_endpointa" label="API End-Point" value={record.apiprofiles_endpointa} required />
        <FormInput id="apiprofiles_endpointb" label="API End-Point For PDF's" value={record.apiprofiles_endpointb} required />
        <FormInput id="apiprofiles_apitoken" label="API Token" value={record.apiprofiles_apitoken} required />
        <CardRow>
            <div style={{ width: "110px", marginRight: "4px" }}>
                <FormInput id="apiprofiles_passwordexpires" value={record.apiprofiles_passwordexpire} label="Expires (Days)" required />
            </div>
            <div style={{ flex: 1, margin: "0px 4px" }}>
                <FormInput id="apiprofiles_passwordlastchange" label="Last Password Change" value={record.apiprofiles_passwordlastchange} disabled required />
            </div>
            <div style={{ flex: 1, marginLeft: "4px" }}>
                <FormInput id="apiprofiles_passwordexpiredate" label="Last Password Change" value={record.apiprofiles_passwordexpiredate} disabled required />
            </div>
        </CardRow>
    </>)
}