import { useEffect, useState } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormInput } from "../../components/portals/inputstyles";
import { FormButton } from "../../components/portals/buttonstyle";
import { useRestApi } from "../../global/hooks/restapi";

export const AccountSetup3 = () => {
    const { serializeFormData, handleChange, setValue, getValue, getError, setFormErrors, buildControlsFromRecord } = useMultiFormContext()
    const [calcState, setCalcState] = useState({
        url: "",
        reset: false,
        data: {},
        buttontoggle: false,
        iscalced: false,
        initialDeposit: "$0.00",
        reloadLevel: "$0.00",
        autoDeposit: "$0.00"
    })

    const calcData = useRestApi(calcState.url, "POST", calcState.data, calcState.reset)

    const handleDriverCount = (e) => {
        handleChange(e)
        setCalcState(ps => ({ ...ps, buttontoggle: e.target.value == "" ? false : true, iscalced: e.target.value == "" ? false : calcState.iscalced }))
    }

    const handleCalculate = (e) => {
        let data = serializeFormData()
        setCalcState(ps => ({ ...ps, url: "/fetchobj/account/calculate", data: data, reset: !calcState.reset }))
    }

    useEffect(() => {
        if (calcData.status === 200) {
            setValue("set_initialdeposit", calcData.data["initialdeposit"])
            setValue("bil_reloadlevel", calcData.data["reloadlevel"])
            setValue("bil_autodeposit", calcData.data["autodeposit"])
            setCalcState(ps => ({
                ...ps,
                initialDeposit: calcData.data["initialdeposit"],
                reloadLevel: calcData.data["reloadlevel"],
                autoDeposit: calcData.data["autodeposit"],
                iscalced: true
            }))
            setFormErrors(ps => ({ ...ps, set_initialdeposit: "", bil_reloadlevel: "", bil_autodeposit: "" }))
        }
    }, [calcData])

    useEffect(() => {
        let newToggle = getValue("set_estimateddrivers") != ""
        let newCalced = (getValue("set_estimateddrivers") != "" && getValue("bil_reloadlevel") != "")
        newToggle && handleCalculate()
        setCalcState(ps => ({ ...ps, buttontoggle: newToggle, iscalced: newCalced }))
        buildControlsFromRecord({})
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Step 3 of 5: Initial Deposit And Reload Settings</div>
        <div>Please complete the form below to calculate your initial deposit and configure your automated reload deposit settings</div>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>How many drivers do you employ?</div>
        <p style={{ paddingBottom: "10px" }}>The amount you need to deposit will depend on how many drivers you employ.  Please enther how many drivers you
            employ and we will calculate your minumum depost amount.</p>
        <FormInput
            id="set_estimateddrivers"
            mask="number"
            value={getValue("set_estimateddrivers")}
            error={getError("set_estimateddrivers")}
            onChange={handleDriverCount}
            autoFocus
        />
        <div style={{ width: "100%", textAlign: "center" }}>
            <FormButton onClick={handleCalculate} disabled={!calcState.buttontoggle}>Calculate Initial Deposit</FormButton>
        </div>
        {calcState.iscalced && <>
            <div style={{borderBottom:"1px dotted #B6B6B6", paddingBottom:"10px"}} />
            <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Initial Deposit Amount</div>
            <p style={{ paddingBottom: "10px" }}>
                Based on the number of drivers you employ, your minimum deposit amount is <b>{calcState.initialDeposit}</b>. You may
                deposit more if you wish, but must be at least <b>{calcState.initialDeposit}</b>
            </p>
            <FormInput
                id="set_initialdeposit"
                mask="currency"
                value={getValue("set_initialdeposit")}
                error={getError("set_initialdeposit")}
                onChange={handleChange}
            />
            <div style={{borderBottom:"1px dotted #B6B6B6", paddingBottom:"10px"}} />
            <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Minimum Balance</div>
            <p style={{ paddingBottom: "10px" }}>
                Once your account balance drops to the minimum balance, the system will automatically deposit funds into your account.
                Your minimum balance is <b>{calcState.reloadLevel}</b>. You may set a higher minimum balance if you wish,
                but must be at least <b>{calcState.reloadLevel}</b>.  Your Minimum Balance is based on the number of drivers you have
                and will update when you add or remove drivers.
            </p>
            <div style={{borderBottom:"1px dotted #B6B6B6", paddingBottom:"10px"}} />
            <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Auto Deposit Amount</div>
            <p style={{ paddingBottom: "10px" }}>
                Once your account balance drops to the minimum balance, the system will automatically deposit funds into your account.
                Your minimum auto deposit amount is <b>{calcState.autoDeposit}</b>. You may set a higher auto deposit amount if you wish, but must be at
                least <b>{calcState.autoDeposit}</b>. Your Auto Deposit Ammount is based on the number of drivers you have and will update when you add
                or remove drivers.
            </p>
            <FormInput
                id="bil_autodeposit"
                mask="currency"
                value={getValue("bil_autodeposit")}
                error={getError("bil_autodeposit")}
                onChange={handleChange}
            />
        </>}
    </>)
}