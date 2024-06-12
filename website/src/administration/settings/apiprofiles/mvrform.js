import { CardRow } from "../../../components/administration/card"
import { FormInput } from "../../../components/administration/inputs/forminput"

export const MVRForm = ({ record }) => {
    return (<>
        <FormInput id="apiprofiles_apiname" label="API Profile" mask="text" value={record.apiprofiles_apiname} disabled />
        <CardRow>
            <div style={{ flex: 1, marginRight: "4px" }}>
                <FormInput id="apiprofiles_account" label="Account ID" value={record.apiprofiles_account} required autoFocus />
            </div>
            <div style={{ flex: 1, marginLeft: "4px" }}>
                <FormInput id="apiprofiles_userid" label="User ID" value={record.apiprofiles_userid} required />
            </div>
        </CardRow>
        <FormInput id="apiprofiles_endpointa" label="API End-Point" value={record.apiprofiles_endpointa} required />
    </>)
}