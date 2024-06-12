import { useContext, useEffect, useState } from "react";
import { CardRow } from "../../../components/administration/card"
import { FormInput } from "../../../components/administration/inputs/forminput"
import { PricingContext } from "./pricingcontext";

export const FlatRateForm = () => {
    const[feesList,setFeesList] = useContext(PricingContext)
    const[fields,setFields] = useState({price:0,cost:0})

    useEffect(()=>{
        const rec = feesList[0];        
        rec && setFields({price:rec.price,cost:rec.cost})
    },[])

    return (
        <CardRow>
            <div style={{ flex: 1, marginRight: "4px" }}>
                <FormInput id="flat-price" mask="currency" value={fields.price} label="Price" required />
            </div>
            <div style={{ flex: 1, marginLeft: "4px" }}>
                <FormInput id="flat-cost" mask="currency" value={fields.cost} label="Cost" />
            </div>
        </CardRow>
    )
}