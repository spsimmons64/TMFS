import styled from "styled-components";
import { InputContainer, InputErrorStyle, InputLabelStyle, inputPallet, InputWrapper } from "./inputbase";
import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../../global/contexts/errorcontext";


export const SelectStyle = styled.select`
border: none;
outline: none;
background-color: ${props => props.theme.field_background};
width: 100%;
font-size: 14px;
font-family: inherit;
height: 100%;
margin-top: 2px;
padding: 0px 5px;
color:  ${props => {
        if (props.error) return props.theme.text_error
        if (props.focus) return props.theme.text_focus
        return props.theme.text_normal;
    }};
`
export const OptionStyle = styled.option`
color: ${props => props.theme.text_normal};
`

export const FormStaticSelect = (props) => {
    const { id, label, options, onFocus, onBlur, onChange, hideerror, width, flex, value, disabled, ...newProps } = props;
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [inputState, setInputState] = useState({
        value: "",
        error: "",
        focus: 0,
        disabled: 0,
        label: label,
        width: width,
        flex: flex,
        labelwidth: "0px",
        theme: inputPallet
    })

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

    const makeTheChange= (val) => {
        setInputState(ps => ({ ...ps, value: val }));
        onChange && onChange(val)
    }

    const setChange = (e) => {
        makeTheChange(e.target.value);                
    }

    const buildOptions = () => {
        return options.map((r, ndx) => <OptionStyle theme={inputState.theme} key={ndx} value={r.value}>{r.text}</OptionStyle>)
    }

    useEffect(() => {
        const newError = errorState.hasOwnProperty(id) ? errorState[id] : ""
        setInputState(ps => ({ ...ps, error: newError }))
    }, [errorState])

    useEffect(() => {        
        let newValue = value;        
        if (!newValue) {            
            const rec = options.find(r => r.default);            
            newValue = rec ? rec.value : (options.length && options[0]);
        }
        makeTheChange(newValue)
    }, [value]);

    useEffect(() => {                
        const el = document.getElementById(`${id}-label`)
        const elWidth = el.clientWidth;
        setInputState(ps => ({ ...ps, labelwidth: `${elWidth}px` }))
    }, [])

    return (
        <InputContainer {...inputState}>
            <InputWrapper {...inputState}>
                <InputLabelStyle id={`${id}-label`} {...inputState}>{label}</InputLabelStyle>
                <SelectStyle
                    {...inputState}
                    {...newProps}
                    id={id}
                    value={inputState.value}
                    disabled={disabled}
                    onBlur={setBlur}
                    onFocus={setFocus}
                    onChange={setChange}
                >
                    <option value="" hidden disabled></option>
                    {buildOptions()}
                </SelectStyle>
            </InputWrapper>
            {!hideerror && <InputErrorStyle {...inputState}>{inputState.error}</InputErrorStyle>}
        </InputContainer>
    )
}
