import { useEffect } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput } from "../../../components/portals/inputstyles";
import { useFormHook } from "../../../global/hooks/formhook";

export const PSPForm = ({ assets, setPage }) => {
    const {
        formState,
        handleChange,
        buildFormControls,
        serializeFormData,
        getValue,
        getError,
        sendFormData
    } = useFormHook("psp-form", "apiprofiles")

    const closePage = () => setPage(ps => ({ ...ps, page: 808, subpage: -1, record: {} }))

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        let verb = assets.record.recordid ? (delflag ? "DELETE" : "PUT") : "POST"
        let price = document.getElementById("price").value
        let cost = document.getElementById("cost").value
        data.append("pricing", JSON.stringify([{ "state": "XX", price: price, cost: cost }]))
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {
        let priceFields = {}
        assets.record.pricing.forEach(r => {
            priceFields['price'] = r.price || "$0.00";
            priceFields['cost'] = r.cost || "$0.00";
        })
        const newRecord = Object.assign(assets.record, priceFields)
        buildFormControls(newRecord)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; PSP API Profile Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>PSP API Profile Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <div style={{ padding: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            <span>{`Editing PSP Profile ${assets.record.apiname}`}</span>
                        </div>
                        <FormInput
                            id="apiname"
                            mask="text"
                            value={getValue("apiname")}
                            error={getError("apiname")}
                            label="API Name *"
                            labelwidth="200px"
                            onChange={handleChange}

                        />
                        <FormInput
                            id="companyname"
                            mask="text"
                            value={getValue("companyname")}
                            error={getError("companyname")}
                            label="API Vendor Name *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="supportemail"
                            mask="text"
                            value={getValue("supportemail")}
                            error={getError("supportemail")}
                            label="Support Email *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="supportphone"
                            mask="text"
                            value={getValue("supportphone")}
                            error={getError("supportphone")}
                            label="Support Telephone *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="account"
                            mask="text"
                            value={getValue("account")}
                            error={getError("account")}
                            label="Account ID *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="endpointa"
                            mask="text"
                            value={getValue("endpointa")}
                            error={getError("endpointa")}
                            label="API End-Point *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="endpointb"
                            mask="text"
                            value={getValue("endpointb")}
                            error={getError("endpointb")}
                            label="API End-Point For PDFs *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="apitoken"
                            mask="text"
                            value={getValue("apitoken")}
                            error={getError("apitoken")}
                            label="API Token *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="passwordexpire"
                            mask="number"
                            value={getValue("passwordexpire")}
                            error={getError("passwordexpire")}
                            label="Token Expires (Days) *"
                            labelwidth="200px"
                            onChange={handleChange}
                        />
                        <FormInput
                            id="passwordlastchange"
                            mask="text"
                            value={getValue("passwordlastchange")}
                            label="Last Token Change &nbsp;&nbsp;"
                            labelwidth="200px"
                            disabled
                        />
                        <FormInput
                            id="passwordexpiredate"
                            mask="text"
                            value={getValue("passwordexpiredate")}
                            label="Next Token Change &nbsp;&nbsp;"
                            labelwidth="200px"
                            disabled
                        />
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 1, marginRight: "5px" }}>
                                <FormInput
                                    id="price"
                                    mask="currency"
                                    value={getValue("price")}
                                    error={getError("price")}
                                    label="Price Per Report *"
                                    labelwidth="200px"
                                    data-ignore
                                />
                            </div>
                            <div style={{ flex: 1, marginLeft: "5px" }}>
                                <FormInput
                                    id="cost"
                                    mask="currency"
                                    value={getValue("cost")}
                                    error={getError("cost")}
                                    label="Cost Per Report *"
                                    labelwidth="150px"
                                    data-ignore
                                />
                            </div>
                        </div>
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
                        style={{ width: "100px"}}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
    </>)
}