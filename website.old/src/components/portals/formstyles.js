import styled from "styled-components";
import Preloader from "../../assets/images/preloader_128.gif";
import { ModalCard } from "./cardstyle";
import React, { useEffect, useState } from "react";



export const FormBoxStyle = styled.fieldset`
display: flex;
flex-flow: column;
height: 100%;
width: 100%;
padding: 0px 50px 0px 20px;
margin: 0;
outline: none;
border:none;
`

export const FormBoxRowStyle = styled.div`
display: flex;
align-items: center;
width: 100%;
margin-bottom: 15px;
`

export const FormBoxRowLeftStyle = styled.div`
width: 220px;
padding-right: 10px;
text-align: right;
background-color: green;
`

export const FormBoxRowRightStyle = styled.div`
flex:1;
`
export const FormTopLabel = styled.div`
font-size: 14px;
font-weight: 600;
padding-left:2px;

`
export const FormFlexRowStyle = styled.div`
display: flex;
align-items: center;
width:100%;
& > *{
    padding-left: 5px;
    padding-right:5px;
}
& > :first-child{
    padding-left: 0px;
}
& > :last-child{
    padding-right: 0px;
}
`








export const FormFooterContainer = (props) => {
    return (
        <div style={{ width: "100%", borderTop: "1px dotted #B6B6B6", opacity: props.busy ? ".5" : "1" }}>
            <fieldset style={{ display: "flex", alignItems: "center", outline: "none", padding: "10px", margin: 0, border: "none" }} disabled={props.busy}>
                {props.children}
            </fieldset>
        </div>

    )
}







export const ModalForm = (props) => {
    const { busy, title, width, height, style, id, children, ...nprops } = props;
    const newStyle = Object.assign({ width: width || "auto", height: height || "650px" }, style || {})
    const [footer, setFooter] = useState()
    const [body, setBody] = useState([])

    useEffect(() => {
        let newBody = []
        React.Children.forEach(children, child => { child.key == "formfooter" ? setFooter(child) : newBody.push(child) })
        setBody(newBody)
    }, [])

    return (
        <ModalCard id={id || ""} style={newStyle} {...nprops}>
            <div style={{ display: "flex", flexFlow: "column", width: "100%", height: "100%" }}>
                <div style={{ display: "flex", width: "100%", height: "54px", padding: "0px 10px", alignItems: "center", borderBottom: "1px dotted #B6B6B6" }}>
                    <div style={{ flex: 1 }}><h2>{title}</h2></div>
                    <div style={{ width: "38px", paddingTop: "12px" }}>
                        {busy ? <img src={Preloader} alt="Processing" style={{ height: "38px" }} /> : <></>}
                    </div>
                </div>
                <div style={{ display: "flex", flexFlow: "column", flex: 1 }}>
                    <div style={{ height: 0, flex: "1 1 auto", overflowY: "auto" }}>
                        <fieldset style={{ padding: 0, margin: 0, border: "none", outline: "none", padding: "10px 10px 0px 10px" }} disabled={busy}>{body}</fieldset>
                    </div>
                </div>
                {footer &&
                    <div style={{ width: "100%", borderTop: "1px dotted #B6B6B6", opacity: busy ? ".5" : "1" }}>
                        <fieldset style={{ display: "flex", alignItems: "center", outline: "none", padding: "10px", margin: 0, border: "none" }} disabled={busy}>
                            {footer.props.children}
                        </fieldset>
                    </div>
                }
            </div>
        </ModalCard>
    )









}