import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const ModalWrapperStyle = styled.div`
position: absolute;
top:0;
left:0;
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
background: rgba(0,0,0,50%);
`

const CardWrapperStyle = styled.div`
display: flex;
flex-flow: column;
width: ${(props) => props.width || "300px"};
height: ${(props) => props.height || "auto"};
background-color: #FFF;
border: 2px solid var(--card-border);
border-radius: 5px;
box-shadow: 4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77);
`
const CardHeaderStyle = styled.div`
display:flex;
align-items:center;
width: 100%;    
font-size: 24px;
padding: 8px;
background-color: var(--card-header)
`
const CardHeaderTextStyle = styled.div`
flex:1;
color:#E6E6E6;
display: -webkit-box;
-webkit-line-clamp: 1;
-webkit-box-orient: vertical;    
overflow: hidden;    
`
const CardHeaderIconStyle = styled.div`
width: 30px;
text-align:right;
color: var(--card-header-icon);
`
const CardContentStyle = styled.div`
flex:1;
display: flex;
flex-flow: column;
`
const CardContentScrollStyle = styled.div`
height:0;
flex:1 1 auto;
overflow-Y:auto;
`

const CardFooterStyle = styled.div`
display: flex;
align-items: center;
width: 100%;
background-color: var(--card-footer-background);
padding: 8px;
border-top: 1px solid var(--card-border);
`

const CardFormStyle = styled.fieldset`
width: 100%;
outline: none;
border: none;
margin: none;
padding: 20px 10px 0px 10px;
&:disabled{opacity: 60%;}
`
const CardRowStyle = styled.div`
width: 100%;
display:flex;
align-items:center;
`

export const CardToolBar = styled.div`
display: flex;
align-items:center;
background-color: var(--panel-header-background);
color: #737373;
padding: 8px;
width: 100%;
font-size: 28px;
font-weight: 500;
height: 60px;
border-bottom: 1px solid var(--panel-border);
`

export const CardModal = (props) => {
    const { id, width, height, children, ...nprops } = props;
    return (
        <ModalWrapperStyle>
            <CardWrapperStyle id={id} width={width} height={height} {...nprops}>
                {children}
            </CardWrapperStyle>
        </ModalWrapperStyle>
    )
}
export const CardNoModal = (props) => {
    const { id, width, height, children, ...nprops } = props;
    return (
        <CardWrapperStyle id={id} width={width} height={height} {...nprops}>
            {children}
        </CardWrapperStyle>
    )
}
export const CardHeader = (props) => {
    const { label, busy,children, ...nprops } = props;
    return (
        <CardHeaderStyle {...nprops}>
            <CardHeaderTextStyle>{label}</CardHeaderTextStyle>
            {busy &&
                <CardHeaderIconStyle>
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                </CardHeaderIconStyle>
            }
            {children}
        </CardHeaderStyle>
    )
}

export const CardContent = (props) => {
    const { children, ...nprops } = props;
    return (<CardContentStyle {...nprops}>{children}</CardContentStyle>)
}

export const CardScrollContent = (props) => {
    const { children, ...nprops } = props;
    return (
        <CardContentStyle>
            <CardContentScrollStyle>{children}</CardContentScrollStyle>
        </CardContentStyle>
    )
}

export const CardFooter = (props) => {
    const { children, ...nprops } = props;
    return (<CardFooterStyle {...nprops}>{children}</CardFooterStyle>)
}

export const CardForm = (props) => {
    const { id, busy, ...nprops } = props;
    return (<CardFormStyle id={id} disabled={busy} {...nprops} />)
}

export const CardRow = (props) => {
    const { children, ...nprops } = props;
    return (<CardRowStyle {...nprops}>{children}</CardRowStyle>)

}


























