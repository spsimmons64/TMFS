import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

import Preloader from "../../assets/images/preloader_128.gif";

const PanelWrapper = styled.div`
display:flex;
flex-flow:column;
width: 100%;
height: 100%;
background-color: var(--panel-background);
`

const PanelHeaderWrapper = styled.div`
background-color: var(--panel-header-background);
color: #737373;
padding: 8px;
width: 100%;
font-size: 28px;
font-weight: 500;
height: 60px;
border-bottom: 1px solid var(--panel-border);
`
const PanelFooterWrapper = styled.div`
background-color: var(--panel-header-background);
padding: 8px;
width: 100%;
font-size: 14px;
font-weight: 500;
height: 40px;
border-top: 1px solid var(--panel-border);
`
const PanelContentWrapper = styled.div`
flex:1;
`
export const PanelScrollerContainer = styled.div`
flex:1;
display: flex;
flex-flow: column;
`
export const PanelScrollerContent = styled.div`
height:0;
flex: 1 1 auto;
overflow-Y: auto;
`

export const Panel = (props) => {
    const { children, ...nprops } = props;
    return (<PanelWrapper {...nprops}>{children}</PanelWrapper>)
}

export const PanelContent = (props) => {
    const { children, ...nprops } = props;
    return (<PanelContentWrapper {...nprops}>{children}</PanelContentWrapper>)
}

export const PanelHeader = (props) => {
    const { children, ...nprops } = props;
    return (<PanelHeaderWrapper {...nprops}>{children}</PanelHeaderWrapper>)
}
export const PanelFooter = (props) => {
    const { children, ...nprops } = props;
    return (<PanelFooterWrapper {...nprops}>{children}</PanelFooterWrapper>)
}
export const PanelScroll = (props) => {
    const { children, ...nprops } = props;
    return(
        <PanelScrollerContainer>
            <PanelScrollerContent>
                {children}
            </PanelScrollerContent>
        </PanelScrollerContainer>
    )

}