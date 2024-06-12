import styled from "styled-components"

export const TabContainerStyle = styled.div`
display:flex;
align-items: flex-end;
width:100%;
max-height: 34px;
border-bottom: 1px dotted #808080;
padding: 0px 10px;
margin: 10px 0px 0px 0px;

`
export const TabItemStyle = styled.div`
height: 100%;
border: 1px dotted #808080;
border-radius: 5px;
border-bottom-left-radius: 0px;
border-bottom-right-radius: 0px;
border-bottom: 0px;
padding: 5px 8px;
margin-right: 2px;
font-size: 14px;
color: ${props => props.selected ? "#E0E0E0" : "#3A3A3A"};
background-image: ${props => props.selected
        ? "linear-gradient(to bottom, rgba(83,83,83,1) 0%,rgba(60,60,60,1) 100%)"
        : "linear-gradient(to bottom, rgba(244,244,244,1) 0%,rgba(224,224,224,1) 100%)"
    };
&:hover: ${props => props.selected
        ? "linear-gradient(to bottom, rgba(60,60,60,1) 100%,rgba(83,83,83,1) 0%)"
        : "linear-gradient(to bottom, rgba(224,224,224,1) 100%,rgba(244,244,244,1) 0%,)"
    };
cursor: pointer;
`

export const TabContainer = ({ options, selected, callback }) => {
    return (
        <TabContainerStyle>
            {options.map((r, ndx) => {
                if (!r.hidden) {
                    return (
                        <TabItemStyle selected={selected == ndx ? 1 : 0} key={ndx} onClick={() => callback(ndx)}>
                            <span style={{ userSelect: "none" }}>{r.text}</span>
                        </TabItemStyle>
                    )
                }
            })}
        </TabContainerStyle>
    )
}