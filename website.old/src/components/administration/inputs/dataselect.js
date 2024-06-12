import { useEffect, useState } from "react";
import styled from "styled-components";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const InputWrapperStyle = styled.fieldset`
padding: 0px 5px;
outline: none;
margin:0;
width: 100%;
height: ${(props) => props.label ? "40px" : "34px"};
background-color: ${(props) => {
        if (props.focused) return "var(--input-background-focus);"
        if (props.disabled) return "var(--input-background-disabled);"
        return "var(--input-background)"
    }};
border-width: 1px;
border-style: solid;
border-radius: 5px;
border-color: ${(props) => {
        if (props.focused) return "var(--input-border-focus)"
        return "var(--input-border)"
    }};
opacity: ${(props) => props.disabled ? "60%" : "100%"};
&.error{
    background-color: var(--input-background-error);
    border-color: var(--input-border-error);
}
`
const InputLabelStyle = styled.legend`
font-size: 12px;
font-weight: 500;
margin-left: 5px;
color: ${(props) => {
        if (props.focused) return "var(--input-border-focus)"
        return "var(--input-border)"
    }};    
pointer-events: none;
&.error{    
    color: var(--input-border-error);
}
`
const InputFieldStyle = styled(MaskedInput)`
width: 100%;
outline: none;
border: none;
padding: 0px 5px;
font-family: inherit;
font-size: 14px;
color: var(--input-text);
line-height: 1.7em;
background-color:var(--input-background);
`
const InputErrorStyle = styled.div`
height:18px;
font-size: 10px;
color: var(--input-text-error);
padding: 2px 8px;
`
const SelectFieldStyle = styled.select`
width: 100%;
height: 100%;
border:none;
outline: none;
background-color:transparent;
color: var(--input-text);
font-size: 14px;
margin-top:-1px;
`

export const DataSelect = (props) => {
    const { id, mask, label, disabled, value, onBlur, onFocus, hideError, data, ...nprops } = props;    
    const [focus, setFocus] = useState(0)

    const handleInputBlur = () => {
        setFocus(0)
        onBlur && onFocus()
    }

    const handleInputFocus = () => {
        let el = document.getElementById(`wrapper-${id}`)
        if (el) el.classList.remove("error")
        el = document.getElementById(`label-${id}`)
        if (el) el.classList.remove("error")
        el = document.getElementById(`error-${id}`)
        if (el) el.innerHTML = ""
        setFocus(1)
        onFocus && onFocus()
    }

    const buildOptions = () => {
        return data.map((r, ndx) => {
            return (<option key={ndx} value = {r.value}>{r.text}</option>)
        })
    } 

    return (<>
        <InputWrapperStyle id={`wrapper-${id}`} disabled={disabled} label={label} focused={focus}>
            {label && <InputLabelStyle id={`label-${id}`} focused={focus}>{label}</InputLabelStyle>}
            <SelectFieldStyle 
                {...nprops}
                id={id} 
                onFocus={handleInputFocus} 
                onBlur={handleInputBlur} 
                value = {value}                
            > {buildOptions()}</SelectFieldStyle>
        </InputWrapperStyle>
        {!hideError && <InputErrorStyle id={`error-${id}`} />}
    </>)
}