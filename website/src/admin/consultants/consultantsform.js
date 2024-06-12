import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../components/portals/formstyles";
import { FormInput, } from "../../components/portals/inputstyles";
import { YesNo, initYesNoState } from "../../components/portals/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";
import { FormSelect } from "../../components/portals/inputstyles";
import { statesArray, timeZonesTypes } from "../../global/staticdata";
import { useFormHook } from "../../global/hooks/formhook";
import { TabContainer } from "../../components/portals/tabcontainer";


export const ConsultantsForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const { formState, handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("consultant-form", "consultants")
    const [tabSelected, setTabSelected] = useState(0)
    const tabMenu = [{ text: `Consultant Setup`, key: 1 }]


    const closePage = () => setPage(ps => ({ ...ps, page: 4, subpage: -1, record: {} }));

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${getValue("deleted") ? "Reactivate" : "Deactivate"} This Consultant?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "left",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, getValue("deleted") ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {buildFormControls(assets.record)},[])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Consultant Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Consultant Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <TabContainer options={tabMenu} selected={tabSelected} callback={setTabSelected} />
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ marginBottom: "10px ", fontSize: "22px", fontWeight: 600 }}>
                            {!getValue("recordid")
                                ? <span>New Consultant</span>
                                : <span>{`Editing Consultant ${getValue("companyname")}`}</span>
                            }
                        </div>
                        <FormInput
                            id="lookupcode"
                            mask="text"
                            value={getValue("lookupcode")}
                            error={getError("lookupcode")}
                            label="Lookup Code *"
                            labelwidth="168px"
                            onChange={handleChange}
                            autoFocus
                        />

                        <FormInput
                            id="companyname"
                            mask="text"
                            value={getValue("companyname")}
                            error={getError("companyname")}
                            label="Company Name *"
                            labelwidth="168px"
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormInput
                            id="contactlastname"
                            mask="text"
                            value={getValue("contactlastname")}
                            error={getError("contactlastname")}
                            label="Contact Last Name *"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="contactfirstname"
                            mask="text"
                            value={getValue("contactfirstname")}
                            error={getError("contactfirstname")}
                            label="Contact First Name *"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="emailgeneral"
                            mask="text"
                            value={getValue("emailgeneral")}
                            error={getError("emailgeneral")}
                            label="Email Address *"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="address1"
                            mask="text"
                            value={getValue("address1")}
                            error={getError("address1")}
                            label="Address 1 &nbsp; &nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="address2"
                            mask="text"
                            value={getValue("address2")}
                            error={getError("address2")}
                            label="Address 2 &nbsp; &nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="city"
                            mask="text"
                            value={getValue("city")}
                            error={getError("city")}
                            label="City &nbsp; &nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="state"
                            value={getValue("state")}
                            error={getError("state")}
                            label="State &nbsp; &nbsp;"
                            options={statesArray}
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="zipcode"
                            mask="text"
                            value={getValue("zipcode")}
                            error={getError("zipcode")}
                            label="Zip Code &nbsp; &nbsp;"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="telephone"
                            mask="telephone"
                            value={getValue("telephone")}
                            error={getError("telephone")}
                            label="Telephone *"
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="timezone"
                            value={getValue("timezone")}
                            error={getError("timezone")}
                            label="Time Zone *"
                            options={timeZonesTypes}
                            labelwidth="168px"
                            onChange={handleChange}
                        />
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}>
                    {getValue("recordid") &&
                        <FormButton
                            tabIndex={-1}
                            style={{ width: "100px" }}
                            color={getValue("deleted") ? "purple" : "red"}
                            onClick={handleDeactivate}>
                            {getValue("deleted") ? "Reactivate" : "Deactivate"}
                        </FormButton>
                    }
                </div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
                <div>
                    <FormButton
                        style={{ width: "100px"}}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
        {ynRequest.message && <YesNo {...ynRequest} callback={handleDeactivateResponse} />}
    </>)
}