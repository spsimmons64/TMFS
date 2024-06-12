import { useContext, useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { statesArray, timeZonesTypes } from "../../../global/staticdata";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, FormSelect, } from "../../../components/portals/inputstyles";
import { useGlobalContext } from "../../../global/contexts/globalcontext";
import { useFormHook } from "../../../global/hooks/formhook";
import { config } from "../../../global/config";
import { MessageContext } from "../../../administration/contexts/messageContext";

export const ProfileForm = ({ setData }) => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const { globalState, fetchGlobalData } = useGlobalContext()
    const [logo,setLogo] = useState()
    const {
        formState,  
        setFormControls,      
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("profile-form", "resellers")

    const getLogoFile = async () => {
        let url = `${config.apiUrl}/resellers/logo?id=${globalState.master.recordid}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/json" } }
        const response = await fetch(url, headers);
        const json = await response.json();
        setLogo(json.data)
        fetchGlobalData()
    }

    const putLogoFile = async (e) => {
        const file = e.target.files[0]
        let data = new FormData()
        data.append("file", file)
        data.append("id", globalState.master.recordid)
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

    const handleSubmit = async (e, delflag = false) => {        
        let data = serializeFormData()
        data.append("usertype", "resellers")
        data.append("usertypeid", globalState.master.recordid)
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && fetchGlobalData();
    }

    useEffect(() => {
        buildFormControls(globalState.master)
        setLogo(globalState.master.logo)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Administrative Profile Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Administrative Profile Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <input id="uploader" type="file" onChange={putLogoFile} accept="image/" style={{ width: "0px", height: "0px" }} />
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>Editing Administrative Profile</div>
                        <div style={{ display: "flex", width: "100%" }}>
                            <div style={{ flex: 1, paddingRight: "10px" }}>
                                <FormInput
                                    id="companyname"
                                    mask="text"
                                    value={getValue("companyname")}
                                    error={getError("companyname")}
                                    label="Company Name *"
                                    labelwidth="170px"
                                    onChange={handleChange}
                                />
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1, paddingRight: "10px" }}>
                                        <FormInput
                                            id="contactlastname"
                                            mask="text"
                                            value={getValue("contactlastname")}
                                            error={getError("contactlastname")}
                                            label="Contact Last Name *"
                                            labelwidth="170px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FormInput
                                            id="contactfirstname"
                                            mask="text"
                                            value={getValue("contactfirstname")}
                                            error={getError("contactfirstname")}
                                            label="Contact First Name *"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <FormInput
                                    id="emailaddress"
                                    mask="text"
                                    value={getValue("emailaddress")}
                                    error={getError("emailaddress")}
                                    label="Email Address *"
                                    labelwidth="170px"
                                    onChange={handleChange}
                                />
                                <FormInput
                                    id="address1"
                                    mask="text"
                                    value={getValue("address1")}
                                    error={getError("address1")}
                                    label="Address 1 *"
                                    labelwidth="170px"
                                    onChange={handleChange}
                                />
                                <FormInput
                                    id="address2"
                                    mask="text"
                                    value={getValue("address2")}
                                    error={getError("address2")}
                                    label="Address 2 &nbsp;&nbsp;"
                                    labelwidth="170px"
                                    onChange={handleChange}
                                />
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1, paddingRight: "10px" }}>
                                        <FormInput
                                            id="city"
                                            mask="text"
                                            value={getValue("city")}
                                            error={getError("city")}
                                            label="City *"
                                            labelwidth="170px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ width: "350px" }}>
                                        <FormSelect
                                            id="state"
                                            value={getValue("state")}
                                            error={getError("state")}
                                            options={statesArray}
                                            label="State *"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1, paddingRight: "10px" }}>
                                        <FormInput
                                            id="zipcode"
                                            mask="text"
                                            value={getValue("zipcode")}
                                            error={getError("zipcode")}
                                            label="Zip Code *"
                                            labelwidth="170px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ flex: 1}}>
                                        <FormSelect
                                            id="timezone"
                                            value={getValue("timezone")}
                                            error={getError("timezone")}
                                            options={timeZonesTypes}
                                            label="Time Zone *"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div style={{ flex: 1, paddingRight: "10px" }}>
                                        <FormInput
                                            id="telephone"
                                            mask="telephone"
                                            value={getValue("telephone")}
                                            error={getError("telephone")}
                                            label="Telephone *"
                                            labelwidth="170px"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FormInput
                                            id="ein"
                                            mask="ein"
                                            value={getValue("ein")}
                                            error={getError("ein")}
                                            label="EIN / Tax ID *"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "600px" }}>
                                <div style={{ width: "100%", height: "420px", border: "1px solid #000", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {logo && <img src={`data:image/png;base64,${logo}`} alt=" " />}
                                </div>
                                <div style={{ width: "100%", textAlign: "center", padding: "10px" }}>
                                    <FormButton
                                        onClick={handleLogoChange}
                                    >Update Logo
                                    </FormButton>
                                </div>
                            </div>
                        </div>
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}></div>
                <div>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle >
    </>)
}