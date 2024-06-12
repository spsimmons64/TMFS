import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { userRankTypes } from "../../../global/staticdata";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, FormSelect, } from "../../../components/portals/inputstyles";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useGlobalContext } from "../../../global/contexts/globalcontext";
import { useFormHook } from "../../../global/hooks/formhook";

export const UsersForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const { globalState } = useGlobalContext()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const {
        formState,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("users-form", "users")

    const closePage = () => setPage(ps => ({ ...ps, page: 806, subpage: -1, record: {} }))

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${getValue("deleted") ? "Reactivate" : "Deactivate"} This User?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, getValue("deleted") ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        data.append("usertype", "resellers")
        data.append("usertypeid", globalState.master.recordid)
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => buildFormControls(assets.record), [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Administrative User Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Administrative User Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!getValue("recordid")
                                ? <span>New User</span>
                                : <span>{`Editing Administrative User ${getValue("firstname")} ${getValue("lastname")}`}</span>
                            }
                        </div>
                        <FormSelect
                            id="securitylevel"
                            value={getValue("securitylevel")}
                            error={getError("securitylevel")}
                            options={userRankTypes}
                            label="Security Level *"
                            labelwidth="170px"
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormInput
                            id="lastname"
                            mask="text"
                            value={getValue("lastname")}
                            error={getError("lastname")}
                            label="Last Name *"
                            labelwidth="170px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="firstname"
                            mask="text"
                            value={getValue("firstname")}
                            error={getError("firstname")}
                            label="First Name *"
                            labelwidth="170px"
                            onChange={handleChange}
                        />
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
                            id="telephone"
                            mask="telephone"
                            value={getValue("telephone")}
                            error={getError("telephone")}
                            label="Telephone Number *"
                            labelwidth="170px"
                            onChange={handleChange}

                        />
                        <FormInput
                            id="position"
                            mask="text"
                            value={getValue("position")}
                            error={getError("position")}
                            label="Position/Title *"
                            labelwidth="170px"
                            onChange={handleChange}
                        />
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1}}>
                    {getValue("recordid") &&
                        <FormButton
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