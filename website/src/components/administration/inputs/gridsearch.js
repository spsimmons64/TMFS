import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";

const InputWrapperStyle = styled.fieldset`
display: flex;
align-items: center;
padding: 0px 5px;
outline: none;
margin:0;
width: 100%;
height: ${(props) => props.label ? "44px" : "38px"};
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
const InputFieldStyle = styled.input`
flex:1;
outline: none;
border: none;
padding: 0px 5px;
font-family: inherit;
font-size: 14px;
color: var(--input-text);
line-height: 2em;
background-color:var(--input-background);
&::placeholder{
    color: var(--input-placeholder-text);
    font-size:12px;
    font-style: italic;
}
`
const InputSearchIconStyle = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 24px;
font-size: 18px;
cursor: pointer;
`

export const GridSearchInput = (props) => {
    const [focus, setFocus] = useState(0)
    const { id, busy,onFocus,onBlur,searchHandler,clearHandler,width,style,callback,...nprops } = props;
    const newStyle = Object.assign({width:width || "100%"},style || {});

    const handleInputBlur = () => {
        setFocus(0)
        onFocus && onFocus()
    }

    const handleInputFocus = () => {
        setFocus(1)
        onBlur && onBlur()
    }

    const handleSearch = () => {
        const el = document.getElementById(id)
        callback(el.value)
    }

    const handleClear = () =>{
        const el = document.getElementById(id)
        el.value = ""
        callback(el.value)
    }

    const handleKeyDown = (e) => { e.key==="Enter" && handleSearch()}

    return (
        <InputWrapperStyle id={`wrapper-${id}`} focused={focus} style={newStyle}>
            <InputFieldStyle {...nprops} id={id} name={id} disabled={busy} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown}/>
            <InputSearchIconStyle onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} color="var(--input-search-glass-icon)"/></InputSearchIconStyle>
            <InputSearchIconStyle onClick={handleClear}><FontAwesomeIcon icon={faCircleXmark} color="var(--input-search-clear-icon"/></InputSearchIconStyle>
        </InputWrapperStyle>
    )
}