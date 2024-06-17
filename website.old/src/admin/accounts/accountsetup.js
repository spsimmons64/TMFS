import { useContext, useEffect, useState } from "react"
import { FormCheck, FormInput, FormSelect } from "../../components/portals/inputstyles"
import { domains, statesArray, yesNoTypes } from "../../global/staticdata"
import { useRestApi } from "../../global/hooks/restapi"
import { FormButton } from "../../components/portals/buttonstyle"
import { config } from "../../global/config";
import { MessageContext } from "../../administration/contexts/messageContext"

export const AccountSetup = ({ record, callback, setData }) => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const [accountStates, setAccountStates] = useState([])

    const updateAccountStates = ({ target }) => {
        const state = target.id.split('-')
        let newList = [...accountStates]
        let ndx = accountStates.findIndex(r => r === state[1])
        ndx > -1 ? newList.splice(ndx, 1) : newList.push(state[1])
        setAccountStates(newList)
        setData(ps => ({ ...ps, publishstates: { ...ps.publishstates, value: newList.join(",") } }))
    }

    const getLogoFile = async () => {
        let url = `${config.apiUrl}/resellers/logo?id=${record.recordid.value}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
        const response = await fetch(url, headers);
        const json = await response.json();
        setData(ps => ({ ...ps, logo: { ...ps, value: json.data } }))
    }

    const putLogoFile = async (e) => {
        const file = e.target.files[0]
        let data = new FormData()
        data.append("file", file)
        data.append("id", record.recordid.value)
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

    useEffect(() => {        
        let states = record.publishstates.value.split(",")                
        setAccountStates(states)
    }, [])
    
    return (<>
        <input id="uploader" type="file" onChange={putLogoFile} accept="image/" style={{ width: "0px", height: "0px" }} />
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, paddingRight: "10px" }}>
                <FormInput
                    id="siteroute"
                    label="Friendly URL *"
                    mask="text"
                    value={record.siteroute.value}
                    error={record.siteroute.error}
                    labelwidth="230px"
                    onChange={callback}
                />
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                        <FormInput
                            id="dot"
                            label="DOT Number *"
                            mask="text"
                            value={record.dot.value}
                            error={record.dot.error}
                            labelwidth="230px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="mc"
                            label="Motor Carrier Number *"
                            mask="text"
                            value={record.mc.value}
                            error={record.mc.error}
                            onChange={callback}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                        <FormInput
                            id="utorigid"
                            label="Utah Org ID &nbsp;&nbsp;"
                            mask="text"
                            value={record.utorigid.value}
                            error={record.utorigid.error}
                            labelwidth="230px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormInput
                            id="paaaccesscode"
                            label="PA Access Number *"
                            mask="text"
                            value={record.paaaccesscode.value}
                            error={record.paaaccesscode.error}
                            onChange={callback}
                        />
                    </div>
                </div>
                <FormInput
                    id="divison"
                    label="Division / Terminal"
                    mask="text"
                    value={record.division.value}
                    error={record.division.error}
                    labelwidth="230px"
                    onChange={callback}
                />
                <FormInput
                    id="emaildriver"
                    label="Driver Notice Recipients *"
                    mask="text"
                    value={record.emaildriver.value}
                    error={record.emaildriver.error}
                    labelwidth="230px"
                    onChange={callback}
                />
                <FormInput
                    id="emailbilling"
                    label="Billing Notice Recipients *"
                    mask="text"
                    value={record.emailbilling.value}
                    error={record.emailbilling.error}
                    labelwidth="230px"
                    onChange={callback}
                />
                <FormInput
                    id="emailgeneral"
                    label="General Notice Recipients *"
                    mask="text"
                    value={record.emailgeneral.value}
                    error={record.emailgeneral.error}
                    labelwidth="230px"
                    onChange={callback}
                />
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                        <FormSelect
                            id="autoannualmvr"
                            label="Auto Annual Review MVRs *"
                            options={yesNoTypes}
                            value={record.autoannualmvr.value}
                            error={record.autoannualmvr.error}
                            labelwidth="230px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormSelect
                            id="showdisciplinary"
                            label="Show Disciplinary To Law *"
                            options={yesNoTypes}
                            value={record.showdisciplinary.value}
                            error={record.showdisciplinary.error}
                            onChange={callback}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                        <FormSelect
                            id="newapplications"
                            label="Accepting New Applications *"
                            options={yesNoTypes}
                            value={record.autoannualmvr.value}
                            error={record.autoannualmvr.error}
                            labelwidth="230px"
                            onChange={callback}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormSelect
                            id="publishapplications"
                            label="Publish Applications Publicly *"
                            options={yesNoTypes}
                            value={record.showdisciplinary.value}
                            error={record.showdisciplinary.error}
                            onChange={callback}
                        />
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "230px" }}>States To Publish Application</div>
                    <div style={{ flex: 1, border: "1px dotted #D1D1D1", borderRadius: "5px", backgroundColor: "#E9E9E9", height: "150px", display: "flex", flexFlow: "column" }}>
                        <div style={{ height: 0, flex: "1 1 auto", overflowY: "auto" }}>
                            {statesArray.map((_, ndx) => {
                                if (ndx % 3 === 0) {
                                    const lastIndex = Math.min(ndx + 2, statesArray.length - 1);
                                    return (
                                        <div style={{ display: "flex" }} key={`outer-${ndx}`}>
                                            {statesArray.slice(ndx, lastIndex + 1).map((item, idx) => {                                                
                                                return (
                                                    <div style={{ width: "239px" }} key={idx}>
                                                        <FormCheck
                                                            id={`account-${item.value}`}
                                                            label={item.text}
                                                            hideerror="true"
                                                            data-ignore
                                                            style={{ margin: "3px" }}
                                                            checked={accountStates.indexOf(item.value) !== -1}
                                                            onChange={updateAccountStates}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }
                            })}
                        </div >
                    </div>
                </div>
            </div>
            <div style={{ width: "600px" }}>
                <div style={{ width: "100%", height: "607px", border: "1px solid #000", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {record.logo.value && <img src={`data:image/png;base64,${record.logo.value}`} alt=" " />}
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