import { useEffect, useState } from "react";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../components/portals/newpanelstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { transMethodTypes } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { FormBoxStyle } from "../../components/portals/formstyles";
import { FormInput, FormSelect } from "../../components/portals/inputstyles";
import { useFormHook } from "../../global/hooks/formhook";
import { toProperCase } from "../../global/globals";

export const TransactionsForm = ({ assets, setPage }) => {
    const [combos, setCombos] = useState({ packages: [] })    
    const packageData = useRestApi(`/combos/pricing?packagetype=${assets.entity}s&frequency=ondemand&priceby=flat`, "GET", {}, false)
    const { formState, setFormControls,handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("transactions-form", "transactions")

    const closePage = () => {
        setPage(ps => ({ ...ps, page: 3, subpage: 2, record: {} }))
    }

    const handlePackageComboChange = (e) => {
        handleChange(e)
        let rec = combos.packages.find(r => r.value == e.target.value)
        setFormControls(ps=>({...ps,
            transamount:{...ps.transamount,value:rec["price"] || "$0.00"},
            description:{...ps.description,value:rec["text"] || ""},
        }))
    }

    const handleSubmit = async (e) => {
        let data = serializeFormData()
        let verb = getValue("recordid") ? "PUT" : "POST"
        data.append("quantity", 1)
        data.append("resourceid",assets.entityRecord.recordid)
        await sendFormData(verb, data) && closePage();
    }

    useEffect(() => {
        if (packageData.status === 200) {
            setCombos({ packages: packageData.data })
            let rec = packageData.data.find(r => r.default === 1)
            if (!rec) rec = packageData.data.length ? packageData.data[0] : {}
            let method = transMethodTypes.find(r=>r.default==1)
            setFormControls(ps=>({...ps,
                packageid:{...ps.packageid,value:rec["value"] || ""},
                transmethod:{...ps.transmethod,value:method["value"]},
                transamount:{...ps.transamount,value:rec["price"] || "$0.00"},
                description:{...ps.description,value:rec["text"] || ""},
            }))                        
        }
    }, [packageData])

    useEffect(() => {
        buildFormControls(assets.record)
    }, [])

    return (
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>
                    {assets.entityRecord.recordid
                        ? <span>{`TMFS Administration > ${toProperCase(assets.entity)}s > ${assets.entityRecord.companyname} > Transaction Editor`}</span>
                        : <span>{`TMFS Administration > Transaction Editor`}</span>
                    }
                </PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>{`${toProperCase(assets.entity)} Transaction Editor`}</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <span style={{ margin: "10px 0px 20px 10px", fontSize: "18px", fontWeight: 600 }}>New Transaction For {assets.entityRecord.companyname}</span>
                <FormBoxStyle disabled={formState.busy} id={formState.id}>
                    <FormSelect
                        id="packageid"
                        value={getValue("packageid")}
                        error={getError("packageid")}
                        options={combos.packages}
                        label="Pricing Package *"
                        labelwidth="200px"
                        onChange={handlePackageComboChange}
                    />
                    <FormSelect
                        id="transmethod"
                        value={getValue("transmethod")}
                        error={getError("transmethod")}
                        options={transMethodTypes}
                        label="Transaction Type *"
                        labelwidth="200px"
                        onChange={handleChange}
                    />
                    <FormInput
                        id="transamount"
                        mask="currency"
                        value={getValue("transamount")}
                        error={getError("transamount")}
                        label="Transaction Amount *"
                        labelwidth="200px"
                        onChange={handleChange}
                    />
                    <FormInput
                        id="description"
                        mask="text"
                        value={getValue("description")}
                        error={getError("description")}
                        label="Description *"
                        labelwidth="200px"
                        onChange={handleChange}
                    />
                </FormBoxStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}></div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green" onClick={handleSubmit}
                    >Save
                    </FormButton>
                </div>
                <div>
                    <FormButton
                        style={{ width: "100px" }}
                        color="green"
                        onClick={closePage}
                    >Cancel
                    </FormButton>
                </div>
            </PortalPlaygroundFooterStyle>
        </PortalPlayGroundStyle>
    )
}