import { useEffect, useState } from "react"
import { FormInput } from "../../../components/portals/inputstyles"

export const PricingFlatForm = ({ feeList, callBack }) => {

    const handleChange = ({target}) => {
        let newList = [...feeList]
        if (!newList.length) newList.push({cost:"$0.00",price:"$0.00"})
        newList[0][target.id] = target.value
        callBack(newList)                
    }

    return (<>
        <FormInput 
            id="price" 
            data-ignore={true} 
            mask="currency" 
            value={feeList.length ? feeList[0].price : "$0.00"} 
            label="Price *" 
            labelwidth="135px" 
            onChange={handleChange}
        />
        <FormInput 
            id="cost" 
            data-ignore={true} 
            mask="currency" 
            value={feeList.length ? feeList[0].cost : "$0.00"} 
            label="Cost &nbsp;&nbsp;" 
            labelwidth="135px" 
            onChange={handleChange}
        />
    </>)

}