import styled from "styled-components";
import { ModalCardStyle, ModalCardWrapperStyle } from "./cardstyle";
import { FormButton } from "./buttonstyle";
import { useRef } from "react";
import { GridLoader } from './gridstyles';

const PDFWrapperStyle = styled.iframe`
width: 100%;
margin:10px 0px;
border: 2px solid #323639;
`
const LoadingWrapper = styled.div`
width: 100%;
margin:10px 0px;
border: 1px dotted #B6B6B6;
display:flex;
align-items:center;
justify-content:center;
height: ${props => props.height || "auto"}
`
export const PDFContainer = (props) => {
    const { source, busy, title, ...nprops } = props
    return (<>
        {!source
            ? <LoadingWrapper {...nprops}><GridLoader message="Loading Document..." /></LoadingWrapper>
            : <PDFWrapperStyle
                id="pdf-viewer"
                title={title}
                src={source}
                style={{ margin: 0, width: "100%", border: "none", borderBottom: "1px solid #323639" }}
                {...nprops}
            />
        }
    </>)
}
export const PDFModalContainer = (props) => {
    const { source, title, height, width, callback, busy, ...nprops } = props
    return (
        <ModalCardWrapperStyle>
            <ModalCardStyle style={{ width: width, height: height, padding: "0px 0px 50px 0px", backgroundColor: "#FFF" }}>
                <PDFWrapperStyle
                    id="pdf-viewer"
                    title={title}
                    src={source}
                    style={{ margin: 0, width: "100%", border: "none", borderBottom: "1px solid #323639", height: "100%" }}
                    {...nprops}
                />
                <div style={{ width: "100%", textAlign: "center", padding: "2px 10px 0px 0px" }}><FormButton onClick={callback}>Close Viewer</FormButton></div>
            </ModalCardStyle>
        </ModalCardWrapperStyle>
    )
}