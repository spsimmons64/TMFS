import { useContext, useEffect } from "react"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { statesArray, timeZonesTypes } from "../../global/staticdata"
import { config } from "../../global/config";
import { MessageContext } from "../../administration/contexts/messageContext"
import { FormButton } from "../../components/portals/buttonstyle";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";

export const Demographics = ({ callback }) => {    
    const {buildFormControls,getValue,setValue,getError } = useMultiFormContext()    
    const [messageState, setMessageState] = useContext(MessageContext);

    const getLogoFile = async () => {
        let url = `${config.apiUrl}/resellers/logo?id=${getValue("res_recordid")}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
        const response = await fetch(url, headers);
        const json = await response.json();
        setValue("res_logo",json.data)        
    }

    const putLogoFile = async (e) => {
        const file = e.target.files[0]
        let data = new FormData()
        data.append("file", file)
        data.append("id", getValue("res_recordid"))
        let url = `${config.apiUrl}/resellers/logo`
        const headers = { credentials: "include", method: "POST", body: data }
        const response = await fetch(url, headers);
        const jsonResp = await response.json();
        jsonResp && await getLogoFile()
        if (jsonResp.message) {
            let newStatus = jsonResp.status == 200 ? "info" : (jsonResp.status == 400 ? "error" : "warning");
            setMessageState({ level: newStatus, message: jsonResp.message, timeout: 1500 });
        }
    }

    const handleLogoChange = () => { document.getElementById("uploader").click() }

    useEffect(()=>{getValue("res_recordid")==="" && buildFormControls({})},[])

    return (<>
        <input id="uploader" type="file" onChange={putLogoFile} accept="image/" style={{ width: "0px", height: "0px" }} />
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, paddingRight: "10px" }}>
                <FormInput
                    id="res_address1"
                    label="Address 1 *"
                    mask="text"
                    value={getValue("res_address1")}
                    error={getError("res_address1")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="res_address2"
                    label="Address 2 &nbsp;&nbsp;"
                    mask="text"
                    value={getValue("res_address2")}
                    error={getError("res_address2")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="res_city"
                    label="City *"
                    mask="text"
                    value={getValue("res_city")}
                    error={getError("res_city")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormSelect
                    id="res_state"
                    label="State *"
                    value={getValue("res_state")}
                    error={getError("res_state")}
                    options={statesArray}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="res_zipcode"
                    label="Zip Code *"
                    mask="text"
                    value={getValue("res_zipcode")}
                    error={getError("res_zipcode")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="res_telephone"
                    label="Telephone *"
                    mask="telephone"
                    value={getValue("res_telephone")}
                    error={getError("res_telephone")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormInput
                    id="res_ein"
                    label="Tax ID / EIN *"
                    mask="ein"
                    value={getValue("res_ein")}
                    error={getError("res_ein")}
                    labelwidth="200px"
                    onChange={callback}
                />
                <FormSelect
                    id="res_timezone"
                    label="Time Zone *"
                    value={getValue("res_timezone")}
                    error={getError("res_timezone")}
                    options={timeZonesTypes}
                    labelwidth="200px"
                    onChange={callback}
                />
            </div>
            <div style={{ width: "600px" }}>
                <div style={{ width: "100%", height: "420px", border: "1px solid #000", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getValue("res_recordid") && <img id="res_logo" src={`data:image/png;base64,${getValue("res_logo")}`} alt=" " />}
                </div>
                <div style={{ width: "100%", textAlign: "center", padding: "10px" }}>
                    <FormButton
                        onClick={handleLogoChange}
                    >Update Logo
                    </FormButton>
                </div>
            </div>
        </div>
    </>)
}