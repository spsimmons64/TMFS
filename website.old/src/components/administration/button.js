import styled from "styled-components"

const CardButtonStyle = styled.button`
outline: none;
background-color: var(--card-button-background);
border: 1px solid var(--card-button-border);
border-radius: 5px;
font-size: 14px;
font-weight: 500;
height: 38px;
padding: 0px 10px;
cursor:pointer;
color: var(--card-button-text);
transition: all .1s ease;
user-select: none;
&:active{
    background-color: var(--card-button-active);
}
&:disabled{
    background-color: var(--card-button-background);
    opacity: 70%;
    cursor: default;
}
`
const LinkButtonStyle = styled.span`
font-size: inherit;
color: var(--link-button-text);
text-decoration: underline;
cursor: pointer;
font-size: 14px;
`

export const CardButton = (props) => {
    const {children,...nprops} = props;
    return(
        <CardButtonStyle {...nprops}>{children}</CardButtonStyle>
    )
}
export const FormButton = (props) => {    
    const{label,style,...nprops} = props    
    let newStyle = Object.assign({width:"80px"},style || {})
    return <CardButton style={newStyle} {...nprops}>{label}</CardButton>
}

export const LinkButton = (props) => {
    const {children,...nprops} = props;
    return(
        <LinkButtonStyle {...nprops}>{children}</LinkButtonStyle>
    )
}