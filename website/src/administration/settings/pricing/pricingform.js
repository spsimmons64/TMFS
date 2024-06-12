import { useContext, useEffect, useState } from "react";
import { initFormState, priceByData, pricingFeeTypes, pricingFrequency } from "../../../global/staticdata";
import { useRestApi } from "../../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow} from "../../../components/administration/card";
import { FormInput } from "../../../components/administration/inputs/forminput";
import { CardButton } from "../../../components/administration/button";
import { serializeForm } from "../../../global/globals";
import { FlatRateForm } from "./flatrateform";
import { StatesForm } from "./statesform";
import { FormCheck } from "../../../components/administration/inputs/checkbox";
import { DriversForm } from "./driversform";
import { YesNo, initYesNoState } from "../../../components/administration/yesno";
import { useMousePosition } from "../../../global/hooks/usemousepos";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { FormStaticSelect } from "../../../components/administration/inputs/formstaticselect";
import { PricingContext } from "./pricingcontext";
import { useUserAction } from "../../../global/contexts/useractioncontext";

export const PricingForm = ({ record, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [feesList, setFeesList] = useContext(PricingContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("pricing-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const [priceBy, setPriceBy] = useState("")
    const {reportUserAction} = useUserAction()


    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        if (priceBy === "flat") {
            const driverFlat = document.getElementById("flat-price").value
            const driverCost = document.getElementById("flat-cost").value
            data.append("fees", JSON.stringify([{ price: driverFlat, cost: driverCost, flatfee: true }]));
        } else {
            let newFees = []
            feesList.forEach(r => {
                newFees.push({
                    state: r.state || "XX",
                    price: r.price || 0,
                    cost: r.cost || 0,
                    driverstart: r.driverstart || 0,
                    driverend: r.driverend || 0,
                    flatfee: r.flatfee ? "1" : "0"
                })
            })
            data.append("fees", JSON.stringify(newFees))
        }
        data.append("recordid", record.pricing_recordid || "")
        const verb = !record.pricing_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "pricing", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.pricing_deleted ? "Reactivate" : "Deactivate"} This Pricing Package?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        if (resp) { submitForm(null, !record.pricing_deleted); }
    }

    useEffect(() => {
        setFormState(ps => ({ ...ps, busy: false }))
        if(formData.status === 200){
            let action = record.pricing_recordid ? "Updated" : "Created" 
            reportUserAction(`${action} Pricing Package ${document.getElementById("pricing_packagename").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
    }, [formData])


    useEffect(() => {
        record.pricing_recordid &&  reportUserAction(`Viewed Pricing Package ${record.pricing_packagename}`)
        setFeesList(record.pricing_recordid ? record.pricing_fees : []);
        setPriceBy(record.pricing_priceby)
        return () => { setErrorState([]); }
    }, [])

    console.log(priceBy)

    return (<>
        <CardModal width="550px">
            <CardHeader label="Pricing Package Editor" busy={formState.busy}></CardHeader>
            <CardForm id={formState.id} busy={formState.busy}>
                <FormInput id="pricing_packagename" label="Package Name" mask="text" value={record.pricing_packagename || ""} required autoFocus></FormInput>
                <CardRow>
                    <div style={{ flex: 1, marginRight: "8px" }}>
                        <FormStaticSelect
                            id="pricing_packagetype"
                            label="Package Type"
                            height="80px"
                            options={pricingFeeTypes}
                            value={record.pricing_packagetype}
                        />
                    </div>
                    <div style={{ flex: 1, marginRight: "8px" }}>
                        <FormStaticSelect
                            id="pricing_frequency"
                            label="Frequency"
                            height="80px"
                            options={pricingFrequency}
                            value={record.pricing_frequency}
                        />
                    </div>
                    <div style={{ flex: 1, marginLeft: "4px" }}>
                        <FormStaticSelect
                            id="pricing_priceby"
                            label="Structure"
                            options={priceByData}
                            value={record.pricing_priceby}
                            onChange={(val) => { setPriceBy(val) }}
                        />
                    </div>
                </CardRow>
                {(priceBy === "flat") && <FlatRateForm />}
                {(priceBy === "driver") && <DriversForm />}
                {(priceBy === "state") && <StatesForm />}
                <CardRow style={{ justifyContent: "center" }}>
                    <FormCheck
                        id="pricing_isdefault"
                        label="Set As Default For This Fee Type"
                        value={record.pricing_isdefault}
                    />
                </CardRow>
            </CardForm>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.pricing_recordid && !record.pricing_isdefault) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.pricing_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton id="pricing-form-save" style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal>
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}