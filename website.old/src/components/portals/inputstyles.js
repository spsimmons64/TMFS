import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../global/contexts/errorcontext";
import styled from "styled-components";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { useRestApi } from "../../global/hooks/restapi";
import { FormButton } from "./buttonstyle";

export const InputContainerStyle = styled.div`
display: flex;
flex-flow:column;
`

export const InputRowStyle = styled.div`
display: flex;
align-items: center;
width: 100%;
`
export const InputLabelStyle = styled.div`
width: ${props => props.width || "auto"};
text-align: right;
padding-right: 10px;
`
export const InputFieldStyle = styled.div`
flex:1;
`
export const InputErrorContainerStyle = styled.div`
flex:1;
padding-left: ${props => props.wdth ? `calc(${props.width} + 8px)` : "3px"};
min-height: 20px;
font-size: 12px;
color: #FF6666;
`
export const InputStyle = styled(MaskedInput)`
width: 100%;
height: 36px;
outline: none;
border-width: 1px;
border-style: dotted;
border-color:${props => props.error ? "#FF6666" : "#D1D1D1"} ;
border-radius: 5px;
padding: 7px 8px;
height: ${props => props.height || "35px"};
background-color: ${props => props.error ? "#FFE6E6" : "#E9E9E9"};
font-family: inherit;
font-size: 14px;
&::placeholder{
    font-size: 12px;
    font-style: italic;
}
&:focus{border:2px solid #000;}
`
export const InputDateStyle = styled.input`
width: 100%;
height: 36px;
outline: none;
border-width: 1px;
border-style: dotted;
border-color:${props => props.error ? "#FF6666" : "#D1D1D1"} ;
border-radius: 5px;
padding: 7px 8px;
height: ${props => props.height || "35px"};
background-color: ${props => props.error ? "#FFE6E6" : "#E9E9E9"};
font-family: inherit;
font-size: 14px;
&::placeholder{
    font-size: 12px;
    font-style: italic;
}
&:focus{border:2px solid #000;}
`
export const InputTextStyle = styled.textarea`
width: 100%;
outline: none;
border-width: 1px;
border-style: dotted;
border-color:${props => props.error ? "#FF6666" : "#D1D1D1"} ;
border-radius: 5px;
padding: 7px 8px;
font: inherit;
font-size: 14px;
height: ${props => props.height || "100px"};
background-color: ${props => props.error ? "#FFE6E6" : "#E9E9E9"};
resize:none;
&:focus{border:2px solid #000;}
`

export const SelectStyle = styled.select`
width: 100%;
height: 36px;
border: 1px dotted #D1D1D1;
outline: none;
border-radius: 5px;
padding: 0px 8px;
height: ${props => props.height || "35px"};
background-color:#E9E9E9;
font-family: inherit;
font-size: 14px;
&:focus{border:2px solid #000;}
`

export const LoginInputStyle = styled(MaskedInput)`
width: 100%;
outline: none;
padding: 16px 15px 14px 15px;
border-width: 1px;
border-style: dotted;
background-color: ${props => props.error ? "#FFE6E6" : "#E9E9E9"};
border-color:${props => props.error ? "#FF6666" : "#D1D1D1"} ;
border-radius: 4px;
height: ${props => props.height || "54px"};
font-size: 20px;
color: #3A3A3A;
&::placeholder{
    color: #9E9E9E;
    font-size:  ${props => props.bigph ? "30px" : "20px"}
}
`

export const LoginLinkStyle = styled.span`
font-size: 14px;
color: #1A1A1A;
user-select: none;
cursor: pointer;
&:hover{text-decoration: underline}
`

export const GridSearchContainerStyle = styled.div`
width: 100%;
display: flex;
align-items: center;
`

export const GridSearchLabelStyle = styled.div`
font-size: 16px;
font-weight: 700;
margin-right: 10px;
`

export const GridSearchInputStyle = styled.div`
flex:1;
`
const FormCheckContainer = styled.div`
display: flex;
align-items: center;
margin-bottom: ${props => props.hideerror ? "0px" : "26px"};
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
const noSpaceMask = (value) => {
    return value.split('').map((char) => {
        if (char === ' ') {
            return ""; // Reject spaces
        }
        return /./; // Accept all other characters
    });
};

const getMask = (mask) => {
    switch (mask) {
        case "text": return false
        case "nospace": return noSpaceMask
        case "ssn": return [/\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]
        case "ein": return [/\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        case "telephone": return ["(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]
        case "cvv": return [/\d/, /\d/, /\d/, /\d/,]
        case "ccdate": return [/\d/, /\d/, "/", /\d/, /\d/,]
        case "date": return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
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

export const FormInput = (props) => {
    const { id, height, label, labelwidth, onFocus, onBlur, onChange, autoComplete, mask, nopaste, error, hideerror, ...nprops } = props;
    const numberLimit = Object.assign(mask == "percent" ? { min: 0, max: 100 } : {}, {});
    const useFocus = (e) => {
        e.target.select()
        onFocus && onFocus(e)
    }
    return (
        <InputContainerStyle>
            <InputRowStyle>
                {label && <InputLabelStyle width={labelwidth} error={error}>{label}</InputLabelStyle>}
                <InputFieldStyle>
                    <InputStyle
                        {...nprops}
                        id={id}
                        mask={getMask(mask)}
                        guide={false}
                        showMask={false}
                        spellCheck={false}
                        autoComplete={autoComplete || "off"}
                        onFocus={useFocus}
                        onChange={onChange}
                        onBlur={onChange}
                        error={error}
                        onPaste = {(e)=>{nopaste && e.preventDefault()}}
                        {...numberLimit}
                    />
                </InputFieldStyle>
            </InputRowStyle>
            {!hideerror && <InputErrorContainerStyle width={labelwidth}>{error}</InputErrorContainerStyle>}
        </InputContainerStyle>
    )
}

export const FormDate = (props) => {
    const { id, height, label, labelwidth, onFocus, autoComplete, mask, error, hideerror, ...nprops } = props;
    const useFocus = (e) => {
        e.target.select()
        onFocus && onFocus(e)
    }
    return (
        <InputContainerStyle>
            <InputRowStyle>
                {label && <InputLabelStyle width={labelwidth} error={error}>{label}</InputLabelStyle>}
                <InputFieldStyle>
                    <InputDateStyle
                        {...nprops}
                        id={id}
                        type="date"
                        autoComplete={autoComplete || "off"}
                        onFocus={useFocus}
                        error={error}
                    />
                </InputFieldStyle>
            </InputRowStyle>
            {!hideerror && <InputErrorContainerStyle width={labelwidth}>{error}</InputErrorContainerStyle>}
        </InputContainerStyle>
    )
}

export const FormText = (props) => {
    const { id, height, label, labelwidth, onFocus, autoComplete, mask, error, hideerror, ...nprops } = props;
    const useFocus = (e) => {
        e.target.select()
        onFocus && onFocus(e)
    }
    return (
        <InputContainerStyle>
            <InputRowStyle style={{ alignItems: "flex-start" }}>
                {label && <InputLabelStyle width={labelwidth} error={error} style={{ marginTop: "5px" }}>{label}</InputLabelStyle>}
                <InputFieldStyle>
                    <InputTextStyle
                        {...nprops}
                        id={id}
                        spellCheck={false}
                        height={height}
                        autoComplete={autoComplete || "off"}
                        onFocus={useFocus}
                        error={error}

                    />
                </InputFieldStyle>
            </InputRowStyle>
            {!hideerror && <InputErrorContainerStyle width={labelwidth}>{error}</InputErrorContainerStyle>}
        </InputContainerStyle>
    )
}

export const FormSelect = (props) => {
    const { id, height, value, label, labelwidth, onChange, onFocus, url, options, disabled, hideerror, ...nprops } = props;
    const [errorState, setErrorState] = useContext(ErrorContext);
    const [internalOptions, setInternalOptions] = useState([])
    const [errorValue, setErrorValue] = useState("")
    const [internalValue, setInternalValue] = useState();
    const urlData = useRestApi(url, "GET", {}, false)

    const useFocus = (e) => {
        let oldList = [...errorState]
        const ndx = oldList.findIndex(r => r.id === id)
        if (ndx > -1) oldList.splice(ndx, 1)
        setErrorState(oldList)
        onFocus && onFocus(e)
    }

    const useChange = (e) => {
        setInternalValue(e.target.value);
        onChange && onChange(e);
    }

    const buildOptions = () => {
        return internalOptions.map((r, rndx) => {
            return (<option key={rndx} value={r.value}>{r.text}</option>)
        })
    }
    useEffect(() => {
        const err = errorState.find(r => r.id === id)
        err && setErrorValue(err.text)
    }, [errorState])

    useEffect(() => {
        if (options) {
            if (!internalValue && options.length) {
                const rec = options.find(r => r.default === 1)
                rec && setInternalValue(rec.value)
            }
            setInternalOptions(options)
        }
    }, [options])

    useEffect(() => { urlData.status === 200 && setInternalOptions(urlData) }, [urlData])

    useEffect(() => { setInternalValue(value); }, [internalOptions])

    useEffect(() => { setInternalValue(value); }, [value])

    return (
        <InputContainerStyle>
            <InputRowStyle>
                {label && <InputLabelStyle width={labelwidth} error={errorValue}>{label}</InputLabelStyle>}
                <InputFieldStyle>
                    <SelectStyle
                        {...nprops}
                        id={id}
                        value={internalValue}
                        onChange={useChange}
                        onFocus={useFocus}
                        disabled={disabled}
                    >
                        {buildOptions()}
                    </SelectStyle>
                </InputFieldStyle>
            </InputRowStyle>
            {!hideerror && <InputErrorContainerStyle width={labelwidth}>{errorValue}</InputErrorContainerStyle>}
        </InputContainerStyle>
    )
}

export const LoginFormInput = (props) => {
    const { id, height, value, label, labelwidth, onChange, onFocus, mask, disabled, ...nprops } = props;
    const [errorState, setErrorState] = useContext(ErrorContext);
    const [errorValue, setErrorValue] = useState("")
    const [inputValue, setInputValue] = useState()
    const numberLimit = Object.assign(mask == "percent" ? { min: 0, max: 100 } : {}, {});

    const useFocus = (e) => {
        setErrorValue("")
        onFocus && onFocus(e)
    }

    const useChange = (e) => {
        setInputValue(e.target.value);
        onChange && onChange(e);
    }

    useEffect(() => { setInputValue(value) }, [value])

    useEffect(() => {
        const err = errorState.find(r => r.id === id)
        err && setErrorValue(err.text)
    }, [errorState])

    return (
        <InputContainerStyle>
            <InputRowStyle>
                {label && <InputLabelStyle width={labelwidth} error={errorValue}>{label}</InputLabelStyle>}
                <InputFieldStyle>
                    <LoginInputStyle
                        {...nprops}
                        id={id}
                        value={inputValue}
                        disabled={disabled}
                        data-label={label}
                        mask={getMask(mask)}
                        guide={false}
                        showMask={false}
                        spellCheck={false}
                        onFocus={useFocus}
                        onChange={useChange}
                        error={errorValue}
                        {...numberLimit}
                    />
                </InputFieldStyle>
            </InputRowStyle>
            <InputErrorContainerStyle width={labelwidth}>{errorValue}</InputErrorContainerStyle>
        </InputContainerStyle>
    )
}

export const GridSearchInput = (props) => {
    const { id, callback, onBlur, ...nprops } = props;

    const handleBlur = (e) => {
        const val = document.getElementById(id).value;
        callback(val)
        onBlur && onBlur(e)
    }

    return (
        <GridSearchContainerStyle>
            {props.label && <GridSearchLabelStyle>{props.label}</GridSearchLabelStyle>}
            <GridSearchInputStyle>
                <InputStyle
                    {...nprops}
                    style={{ paddingTop: "10px" }}
                    id={id}
                    mask={false}
                    guide={false}
                    showMask={false}
                    spellCheck={false}
                    hideerror="true"
                    onBlur={handleBlur}
                />
            </GridSearchInputStyle>
        </GridSearchContainerStyle>
    )
}


export const FormCheck = (props) => {
    const { id, label, width, flex, disabled, ...newProps } = props;
    return (
        <FormCheckContainer hideerror="true">
            <FormCheckStyle type="checkbox" id={id} disabled={disabled} {...newProps} />
            <FormCheckLabel htmlFor={id} {...newProps}>{label}</FormCheckLabel>
        </FormCheckContainer>
    )
}
