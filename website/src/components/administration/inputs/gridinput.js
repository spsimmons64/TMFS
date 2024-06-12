import styled from "styled-components";
import { InputContainer, InputErrorStyle, InputLabelStyle, inputPallet } from "./inputbase";
import { useContext, useEffect, useState } from "react";
import {ErrorContext} from "../../../global/contexts/errorcontext";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const InputWrapper = styled.div`
position: relative;
display: flex;
align-items: center;
border-width: 1px;
border-style: solid;
border-radius: 5px;
width: 100%;
height: 26px;
border-color: ${
    props => {
        if (props.error) return props.theme.border_error
        if (props.focus) return props.theme.border_focus
        return props.theme.border_normal;
    }
};
background-color: ${
    props => {
        if (props.error != "") return props.theme.background_error
        if (props.focus) return props.theme.background_focus
        return props.theme.background_normal;
    }
};
color:  ${
    props => {
        if (props.error) return props.theme.text_error
        if (props.focus) return props.theme.text_focus
        return props.theme.text_normal;
    }
};
&::before{
    content: "";
    position: absolute;
    top: -1px;
    left: 4px;
    width: ${ props => props.label ? props.labelwidth : "0px" };
    height: 1px;
    background-color: ${
        props => {
            if (props.error != "") return props.theme.background_error
            if (props.focus) return props.theme.background_focus
            return props.theme.background_normal;
        }
    };
}
`
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
        default: return false;
    }
}

export const GridInput = (props) => {
    const { id, label, mask, onFocus, onBlur,onChange, hideerror, width, flex,value,disabled,...newProps } = props;
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
        const newError = errorState.hasOwnProperty(id) ? errorState[id] : ""
        newError && setErrorState(ps => ({ ...ps, [id]: "" }))
        setInputState(ps => ({ ...ps, focus: 1 }))
        onFocus && onFocus(e)
    }

    const setBlur = (e) => {
        setInputState(ps => ({ ...ps, focus: 0 }))
        onBlur && onBlur(e)
    }

    const setChange = (e) => {
        setInputValue(e.target.value)
        onChange && onChange(e)
    }

    useEffect(() => {        
        setInputValue(value ? value : "")
    }, [value])

    useEffect(() => {        
        const newError = errorState.hasOwnProperty(id) ? errorState[id] : ""
        setInputState(ps => ({ ...ps, error: newError }))
    }, [errorState])

    useEffect(() => {        
        setInputState(ps => ({ ...ps, disabled: disabled }))
    }, [disabled])

    useEffect(() => {
        const el = document.getElementById(`${id}-label`)
        const elWidth = el.clientWidth+5;
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
                    data-label = {label}
                    mask={getMask(mask)}
                    guide={false}
                    showMask={false}
                    spellCheck = {false}
                    onBlur={setBlur}
                    onFocus={setFocus}
                    onChange={setChange}
                    {...numberLimit}
                >
                </InputStyle>
            </InputWrapper>            
        </InputContainer>
    )
}
