import { useEffect, useRef } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { statesArray } from "../../../global/staticdata";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput } from "../../../components/portals/inputstyles";
import { useFormHook } from "../../../global/hooks/formhook";

export const MVRForm = ({ assets, setPage }) => {
    const {
        formState,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("mvr-form", "apiprofiles")

    const closePage = () => setPage(ps => ({ ...ps, page: 808, subpage: -1, record: {} }));

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"
        let pricing = []
        statesArray.forEach(r => {
            const price = document.getElementById(`${r.value}price`).value
            const cost = document.getElementById(`${r.value}cost`).value
            pricing.push({ state: r.value, price: price, cost: cost })
        })
        data.append("pricing", JSON.stringify(pricing))
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {
        let stateFields = {}
        assets.record.pricing.forEach(r => {
            stateFields[`${r.state}price`] = r.price || "$0.00";
            stateFields[`${r.state}cost`] = r.cost || "$0.00";
        })
        const newRecord = Object.assign(assets.record, stateFields)
        buildFormControls(newRecord)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; MVR API Profile Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>MVR API Profile Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <div style={{ padding: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            <span>{`Editing MVR Profile ${assets.record.apiname}`}</span>
                        </div>

                        <FormInput
                            id="apiname"
                            mask="text"
                            value={getValue("apiname")}
                            error={getError("apiname")}
                            label="API Name *"
                            labelwidth="225px"
                            onChange={handleChange}
                            autoFocus

                        />
                        <FormInput
                            id="companyname"
                            mask="text"
                            value={getValue("companyname")}
                            error={getError("companyname")}
                            label="API Vendor Name *"
                            labelwidth="225px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="supportemail"
                            mask="text"
                            value={getValue("supportemail")}
                            error={getError("supportemail")}
                            label="Support Email *"
                            labelwidth="225px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="supportphone"
                            mask="text"
                            value={getValue("supportphone")}
                            error={getError("supportphone")}
                            label="Support Telephone *"
                            labelwidth="225px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="account"
                            mask="text"
                            value={getValue("account")}
                            error={getError("account")}
                            label="Account ID *"
                            labelwidth="225px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="username"
                            mask="text"
                            value={getValue("username")}
                            error={getError("username")}
                            label="User ID *"
                            labelwidth="225px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="endpointa"
                            mask="text"
                            value={getValue("endpointa")}
                            error={getError("endpointa")}
                            label="API End-Point *"
                            labelwidth="225px"
                            onChange={handleChange}

                        />
                        {statesArray.map((r, ndx) => {
                            return (
                                <div style={{ display: "flex" }} key={ndx}>
                                    <div style={{ flex: 1}}>
                                        <FormInput
                                            id={`${r.value}price`}
                                            mask="currency"
                                            value={getValue(`${r.value}price`)}
                                            error={getError(`${r.value}price`)}
                                            label={`${r.text} Price *`}
                                            labelwidth="225px"
                                            onChange={handleChange}
                                            data-ignore
                                        />
                                    </div>
                                    <div style={{ flex: "1" }}>
                                        <FormInput
                                            id={`${r.value}cost`}
                                            mask="currency"
                                            value={getValue(`${r.value}cost`)}
                                            error={getError(`${r.value}cost`)}
                                            label="Cost *"
                                            labelwidth="85px"
                                            onChange={handleChange}
                                            data-ignore
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}></div>
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
                        style={{ width: "100px",marginRight:"14px" }}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
    </>)
}