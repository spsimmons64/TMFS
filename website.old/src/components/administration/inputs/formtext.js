import styled from "styled-components";
import { InputContainer, InputErrorStyle, InputLabelStyle, inputPallet, InputWrapper } from "./inputbase";
import { useContext, useEffect, useState } from "react";
import {ErrorContext} from "../../../global/contexts/errorcontext";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const InputStyle = styled.textarea`
border: none;
outline: none;
background-color: ${props => props.theme.field_background};
width: 100%;
height: ${props => props.height || "80px" };
font-size: 14px;
font-family: inherit;
padding: 10px 8px;
margin-right: 2px;
overflow: auto;
resize: none;
color:  ${props => {
        if (props.error) return props.theme.text_error
        if (props.focus) return props.theme.text_focus        
        return props.theme.text_normal;
    }};
`
export const FormText = (props) => {
    const { id, label, mask, onFocus, onBlur,onChange, hideerror, width, flex,value,disabled,height,...newProps } = props;
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [inputValue,setInputValue] = useState("")
    const [inputState, setInputState] = useState({
        error: "",
        focus: 0,
        disabled: 0,
        label: label,
        width: width,
        flex: flex,
        labelwidth: "0px",
        height: height,
        theme: inputPallet
    })

    const setChange = (e) => {
        setInputValue(e.target.value);
        onChange && onChange(e);
    }
    
    const setFocus = (e) => {              
        let oldList = [...errorState] 
        const ndx = oldList.findIndex(r=>r.id===id)
        if(ndx > -1) oldList.splice(ndx,1)
        setErrorState(oldList)
        onFocus && onFocus(e)
    }

    const setBlur = () => {
        setInputState(ps => ({ ...ps, focus: 0 }))
        onBlur && onBlur()
    }


    useEffect(() => {                  
        const err = errorState.find(r=>r.id===id)
        err && setInputState(ps=>({...ps,error:err.text}))
    }, [errorState])

    useEffect(() => {        
        setInputState(ps => ({ ...ps, disabled: disabled }))
    }, [disabled])

    useEffect(()=>{setInputValue(value)},[value])

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
                    spellCheck = {false}
                    onBlur={setBlur}
                    onFocus={setFocus}
                    onChange={setChange}
                >
                </InputStyle>
            </InputWrapper>
            {!hideerror && <InputErrorStyle {...inputState}>{inputState.error}</InputErrorStyle>}
        </InputContainer>
    )
}
