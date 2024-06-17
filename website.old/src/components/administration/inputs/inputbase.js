import styled from "styled-components"

export const inputPallet = {
    border_normal: "#808080",
    border_focus: "#0073E6",
    border_error: "#FF6666",
    label_normal: "#164398",
    label_focus: "#0073E6",
    label_error: "#FF6666",
    background_normal: "#FFFFFF",
    background_focus: "#E6F2FF",
    background_error: "#FFE6E6",
    text_normal: "#1A1A1A",
    text_focus: "#1A1A1A",
    text_error: "#FF6666",
    field_background: "transparent",
    error_text: "#FF6666",
    check_icon: "#1A1A1A",
    check_text: "#1A1A1A",
}

export const InputContainer = styled.div`
width: ${props => props.width || "auto"};    
flex: ${props => props.flex || "none"}; 
opacity: ${props => props.disabled ? "50%" : "1"};
`
export const InputWrapper = styled.div`
position: relative;
display: flex;
align-items: center;
border-width: 1px;
border-style: solid;
border-radius: 5px;
width: 100%;
height: ${props => props.height || "34px" };
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
export const InputLabelStyle = styled.legend`
position: absolute;
left: 7px;
top: -8px;
font-size: 12px;
font-weight: 600;
margin: padding: 0px 10px;
color:  ${
    props => {
        if (props.error) return props.theme.label_error
        if (props.focus) return props.theme.label_focus
        return props.theme.label_normal;
    }
};
`

export const InputErrorStyle = styled.div`
font-size: 10px;
font-weight: 500;
padding: 1px 10px;
height: 26px;
color: ${ props => props.theme.error_text };
`
