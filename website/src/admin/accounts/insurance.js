import { FormInput, FormSelect, FormText } from "../../components/portals/inputstyles"
import { countryTypes, statesArray, timeZonesTypes } from "../../global/staticdata"

export const Insurance = ({ record, callback }) => {
    return (<>
        <FormInput
            id="inscompany"
            label="Insurance Company Name &nbsp;&nbsp;"
            mask="text"
            value={record.inscompany.value}
            error={record.inscompany.error}
            labelwidth="224px"
            onChange={callback}
            autoFocus
        />
        <FormInput
            id="inspolicy"
            label="Policy Number &nbsp;&nbsp;"
            mask="text"
            value={record.inspolicy.value}
            error={record.inspolicy.error}
            labelwidth="224px"
            onChange={callback}
        />
        <FormText            
            id="contactinsliabilitiesfirstname"
            label="Limits / Liabilities &nbsp;&nbsp;"
            mask="text"
            value={record.insliabilities.value}
            error={record.insliabilities.error}
            labelwidth="224px"
            style={{resize:"vertical",height:"200px"}}
            onChange={callback}
        />
    </>)
}