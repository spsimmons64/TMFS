import styled from "styled-components"

const LogoWrapperStyle = styled.div`
display: flex;
width: 100%;
height: 120px;
border-bottom: 1px solid #B3B3B3;
padding: 10px;
`
const LogoContainerStyle = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
border: 1px solid #B3B3B3;
border-radius: 4px;
background-color: #FFFFFF;
box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`
export const LogoContainer = ({logo}) => {    
    return (
        <LogoWrapperStyle>
            <LogoContainerStyle>
                {logo && <img src={`data:image/png;base64,${logo}`}  alt=" " />}
            </LogoContainerStyle>
        </LogoWrapperStyle>
    )
}