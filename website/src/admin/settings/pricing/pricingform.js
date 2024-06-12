import { useContext, useEffect, useState } from "react";
import { serializeForm } from "../../../global/globals";
import { PortalPlayGroundBreadCrumbStyle, PortalPlayGroundHeaderStyle, PortalPlayGroundPageTitleStyle, PortalPlayGroundScrollerStyle, PortalPlayGroundStyle, PortalPlaygroundFooterStyle, PortalPlaygroundScrollContainerStyle } from "../../../components/portals/newpanelstyles";
import { FormButton } from "../../../components/portals/buttonstyle";
import { initFormState, priceByType, pricingFeeTypes, pricingFrequency, yesNoTypes } from "../../../global/staticdata";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useRestApi } from "../../../global/hooks/restapi";
import { useUserAction } from "../../../global/contexts/useractioncontext";
import { FormBoxStyle } from "../../../components/portals/formstyles";
import { FormInput, FormSelect, } from "../../../components/portals/inputstyles";
import { YesNo, initYesNoState } from "../../../components/portals/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { useGlobalContext } from "../../../global/contexts/globalcontext";
import { PricingFlatForm } from "./flatform";
import { PricingDriverForm } from "./driverform";
import { useFormHook } from "../../../global/hooks/formhook";


export const PricingForm = ({ assets, setPage }) => {
    const mousePos = useMousePosition()
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [combos, setCombos] = useState({ priceby: { data: priceByType, selected: "" } })
    const [feesList, setFeesList] = useState([])
    const { formState,formControls,handleChange, buildFormControls, serializeFormData, getValue, getError, sendFormData } = useFormHook("pricing-form", "pricing")

    const closePage = () => setPage(ps => ({ ...ps, page: 805, subpage: -1, record: {} }))

    const handleDeactivate = () => {
        setYnRequest({
            message: `Do You Wish To ${assets.record.deleted ? "Reactivate" : "Deactivate"} This Package?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom"
        })
    }

    const handleDeactivateResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && handleSubmit(null, assets.record.deleted ? false : true);
    }

    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        let verb = getValue("recordid") ? (delflag ? "DELETE" : "PUT") : "POST"        
        if(combos.priceby.selected=="flat"){            
            data.append("fees",JSON.stringify([{price:feesList[0].price,cost:feesList[0].cost,state:"XX"}]))
        } else {
            data.append("fees",JSON.stringify(feesList))
        }
        await sendFormData(verb, data) && closePage();
    }

    const handlePriceByChange = (e) => {
        handleChange(e)
        setFeesList([])
        setCombos(ps => ({ ...ps, priceby: { ...ps.priceby, selected: e.target.value } }))
    }

    useEffect(() => {        
        let newRecord = {}
        const priceByTypeData=priceByType.find(r => r.default === 1)
        const pricingFeeTypesData=pricingFeeTypes.find(r => r.default === 1)
        const pricingFrequencyData=pricingFrequency.find(r => r.default === 1)             
        setCombos(ps => ({ ...ps, priceby: { ...ps.priceby, selected: assets.record.recordid ? assets.record.priceby : priceByTypeData.value } }))
        setFeesList(assets.record.recordid ? assets.record.fees : [])
        if(!assets.record.recordid){
            newRecord = {
                priceby: priceByTypeData.value || "",
                frequency: pricingFrequencyData.value || "",
                packagetype: pricingFeeTypesData.value || "",
                isdefault: false
            }
        }
        buildFormControls(assets.record.recordid ? assets.record : newRecord)
    }, [])

    return (<>
        <PortalPlayGroundStyle>
            <PortalPlayGroundHeaderStyle>
                <PortalPlayGroundBreadCrumbStyle>TMFS Administration &gt; Pricing Package Editor</PortalPlayGroundBreadCrumbStyle>
                <PortalPlayGroundPageTitleStyle>Pricing Package Editor</PortalPlayGroundPageTitleStyle>
            </PortalPlayGroundHeaderStyle>
            <PortalPlaygroundScrollContainerStyle>
                <PortalPlayGroundScrollerStyle>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <input id="recordid" type="hidden" />
                        <input id="deleted" type="hidden" />
                        <div style={{ margin: "10px 0px", fontSize: "22px", fontWeight: 600 }}>
                            {!assets.record.recordid
                                ? <span>New Package</span>
                                : <span>{`Editing Pricing Package ${getValue("packagename")}`}</span>
                            }
                        </div>
                        <FormInput
                            id="packagename"
                            mask="text"
                            value={getValue("packagename")}
                            error={getError("packagename")}
                            label="Package Name *"
                            labelwidth="135px"
                            onChange={handleChange}
                            autoFocus
                        />
                        <FormSelect
                            id="packagetype"
                            value={getValue("packagetype")}
                            error={getError("packagetype")}
                            options={pricingFeeTypes}
                            label="Package Type *"
                            labelwidth="135px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="frequency"
                            value={getValue("frequency")}
                            error={getError("frequency")}
                            options={pricingFrequency}
                            label="Frequency *"
                            labelwidth="135px"
                            onChange={handleChange}
                        />
                        <FormSelect
                            id="priceby"
                            value={getValue("priceby")}
                            error={getError("priceby")}
                            options={combos.priceby.data}
                            label="Price By *"
                            labelwidth="135px"
                            onChange={handlePriceByChange}
                        />
                        <FormSelect
                            id="isdefault"
                            value={getValue("isdefault")}
                            error={getError("isdefault")}
                            options={yesNoTypes}
                            label="Set As Default *"
                            labelwidth="135px"
                            onChange={handleChange}
                        />
                        <div style={{ paddingLeft: "145px", marginTop: "-26px", paddingBottom: "5px" }}>
                            <span style={{ fontSize: "10px" }}>Set This Profile As The Default For Selected Type And Frequency</span>
                        </div>
                        {combos.priceby.selected === "flat"
                            ? <PricingFlatForm feeList={feesList} callBack={setFeesList} />
                            : <PricingDriverForm feeList={feesList} callBack={setFeesList} />
                        }
                    </FormBoxStyle>
                </PortalPlayGroundScrollerStyle>
            </PortalPlaygroundScrollContainerStyle>
            <PortalPlaygroundFooterStyle>
                <div style={{ flex: 1 }}>
                    {assets.record.recordid &&
                        <FormButton
                            id="pricing-deactivate"
                            style={{ width: "100px" }}
                            color={assets.record.deleted ? "purple" : "red"}
                            onClick={handleDeactivate}>
                            {assets.record.deleted ? "Reactivate" : "Deactivate"}
                        </FormButton>
                    }
                </div>
                <div style={{ marginRight: "10px" }}>
                    <FormButton
                        id="pricing-form-save"
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