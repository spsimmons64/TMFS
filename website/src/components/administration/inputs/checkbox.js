import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { InputContainer, InputErrorStyle, InputLabelStyle, InputWrapper, inputPallet } from "./inputbase";
import styled from "styled-components";

const FormCheckContainer = styled.div`
display: flex;
align-items: center;
margin-bottom: ${props=>props.hideerror ? "0px" : "26px"};
`

const FormCheckStyle = styled.input`
margin-right: 8px;
width: 24px;
height: 24px;
accent-color: #164398;
`
const FormCheckLabel = styled.label`
margin-top:2px;
font-size: 16px;
`

export const FormCheck = (props) => {
    const { id, label, width, flex, value, hideerror, disabled,onChange, ...newProps } = props;
    const [internalValue, setInternalValue] = useState(false)
    const [inputState, setInputState] = useState({
        error: "",
        focus: 0,
        disabled: 0,
        label: label,
        width: width,
        flex: flex,
        hideerror: hideerror,
        theme: inputPallet
    })

    const setChange = (e) => {        
        setInternalValue(e.target.checked)
        onChange && onChange(e)
    }

    useEffect(() => {          
        if (value !== undefined) setInternalValue(value) 
    }, [value])


    return (
        <FormCheckContainer {...inputState}>
            <FormCheckStyle {...inputState} {...newProps} type="checkbox" id={id} checked={internalValue} onChange={setChange}disabled={disabled} data-label={label}  />
            <FormCheckLabel>{label}</FormCheckLabel>
        </FormCheckContainer>
    )
}