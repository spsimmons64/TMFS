import styled from "styled-components";
import { InputContainer, InputErrorStyle, InputLabelStyle, inputPallet, InputWrapper } from "./inputbase";
import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const InputStyle = styled(MaskedInput)`
border: none;
outline: none;
background-color: ${props => props.theme.field_background};
width: 100%;
font-size: 14px;
font-family: inherit;
height: 30px;
padding: 2px 8px 0px 8px;
color:  ${props => {
        if (props.error) return props.theme.text_error
        if (props.focus) return props.theme.text_focus
        return props.theme.text_normal;
    }};
`
const getMask = (mask) => {
    switch (mask) {
        case "text": return false
        case "ssn": return [/\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
        case "ein": return [/\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        case "telephone": return ["(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]
        case "cvv": return [/\d/, /\d/, /\d/, /\d/,]
        case "ccdate": return [/\d/, /\d/, "/", /\d/, /\d/,]
        case "currency": return createNumberMask({
            prefix: "$",
            allowDecimal: true,
            decimalLimit: 2,
            allowNegative: false,
            thousandsSeparatorSymbol: ",",
            decimalSymbol: ".",
        })
        case "number": return createNumberMask({
            prefix: "",
            allowDecimal: true,
            allowNegative: true,
            thousandsSeparatorSymbol: ",",
            decimalSymbol: ".",
        })
        case "percent": return createNumberMask({
            prefix: "",
            allowDecimal: true,
            allowNegative: true,
            thousandsSeparatorSymbol: ",",
            decimalSymbol: ".",
        })
        default: return [];
    }
}

export const FormInput = (props) => {
    const { id, label, mask, onFocus, onBlur, onChange,autoComplete, hideerror, width, flex, value, disabled, ...newProps } = props;
    const [errorState, setErrorState] = useContext(ErrorContext)    
    const [inputValue, setInputValue] = useState()
    const [inputState, setInputState] = useState({
        error: "",
        focus: 0,
        disabled: 0,
        label: label,
        width: width,
        flex: flex,
        labelwidth: "0px",
        theme: inputPallet
    })
    const numberLimit = Object.assign(mask == "percent" ? { min: 0, max: 100 } : {}, {});

    const setFocus = (e) => {              
        let oldList = [...errorState] 
        const ndx = oldList.findIndex(r=>r.id===id)
        if(ndx > -1) oldList.splice(ndx,1)
        setErrorState(oldList)
        onFocus && onFocus(e)
    }

    const setBlur = (e) => {
        setInputState(ps => ({ ...ps, focus: 0 }))
        onBlur && onBlur(e)
    }

    const setChange = (e) => {        
        setInputValue(e.target.value);
        onChange && onChange(e);
    }

    useEffect(() => {                  
        const err = errorState.find(r=>r.id===id)
        err && setInputState(ps=>({...ps,error:err.text}))
    }, [errorState])

    useEffect(() => {
        setInputState(ps => ({ ...ps, disabled: disabled }))
    }, [disabled])

    useEffect(() => {setInputValue(value)}, [value])

    useEffect(() => {
        const el = document.getElementById(`${id}-label`)
        const elWidth = el.clientWidth + 4;
        setInputState(ps => ({ ...ps, labelwidth: `${elWidth}px` }))        
    }, [])

    return (
        <InputContainer {...inputState}>
            <InputWrapper {...inputState}>
                <InputLabelStyle id={`${id}-label`} {...inputState}>{label}</InputLabelStyle>
                <InputStyle
                    {...inputState}
                    {...newProps}
                    id={id}
                    value={inputValue}
                    disabled={disabled}
                    data-label={label}
                    mask={getMask(mask)}
                    guide={false}
                    showMask={false}
                    spellCheck={false}
                    autoComplete = {autoComplete || "off"}
                    onBlur={setBlur}
                    onFocus={setFocus}
                    onChange={setChange}
                    {...numberLimit}
                >
                </InputStyle>
            </InputWrapper>
            {!hideerror && <InputErrorStyle {...inputState}>{inputState.error}</InputErrorStyle>}
        </InputContainer>
    )
}
