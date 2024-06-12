import styled from "styled-components";
import { InputContainer, InputErrorStyle, InputLabelStyle, inputPallet, InputWrapper } from "./inputbase";
import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../../global/contexts/errorcontext";
import { useRestApi } from "../../../global/hooks/restapi";

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

export const FormDataSelect = (props) => {
    const { id, label, url, onFocus, onBlur, onChange, hideerror, width, flex, value, disabled, ...newProps } = props;
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [fielDataParams,setFieldDataParams] = useState({url:"",reset:""})
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

    const fieldData = useRestApi(fielDataParams.url, "GET", {}, fielDataParams.reset)

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
        setInputState(ps => ({ ...ps, value: e.target.value }));
        onChange && onChange(e)
    }

    const buildOptions = () => {
        return fieldData.data.map((r, ndx) => <OptionStyle theme={inputState.theme} key={ndx} value={r.value}>{r.text}</OptionStyle>)
    }

    useEffect(() => {
        const newError = errorState.hasOwnProperty(id) ? errorState[id] : ""
        setInputState(ps => ({ ...ps, error: newError }))
    }, [errorState])

    useEffect(()=>{setFieldDataParams({url:url,reset:!fielDataParams.reset})},[url])

    useEffect(() => {            
        if (fieldData.status === 200) {            
            if(!value){
                const rec = fieldData.data.find(r => r.default);
                setInputState(ps=>({...ps,value:rec ? rec["value"]: (fieldData.data.len ?fieldData.data[0].value : "")}))
            } else {
                setInputState(ps=>({...ps,value:value}))
            }
        }
    }, [fieldData]);


    useEffect(() => {
        const el = document.getElementById(`${id}-label`)
        const elWidth = el.clientWidth;
        setInputState(ps => ({ ...ps,value:value, labelwidth: `${elWidth}px` }))
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
                    {buildOptions()}
                </SelectStyle>
            </InputWrapper>
            {!hideerror && <InputErrorStyle {...inputState}>{inputState.error}</InputErrorStyle>}
        </InputContainer>
    )
}
