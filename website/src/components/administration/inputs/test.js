import styled from "styled-components"


const InputFieldStyle = styled.legend`
position:absolute;
top: -10px; /* Adjust the top position to visually hide the border */
left: 8px; /* Center the "legend" horizontally */

`

const InputFieldStyleContainer= styled.div`
position:relative;
border: 1px solid #ccc; /* Border color */
border-radius: 8px; /* Rounded corners */
padding: 10px; /* Padding inside the container */
margin: 20px; /* Margin around the container */
position: relative; /* Relative positioning for the container */
background-color: #f5f5f5; /* Background color for the container */
`

export const TestInput = () => {
    return(
        <InputFieldStyleContainer>
                <InputFieldStyle>This is a tes</InputFieldStyle>
        </InputFieldStyleContainer>

    )
}