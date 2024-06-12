import { faCaretRight, faCirclePlay, faCirclePlus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { FormButton } from "../../components/portals/buttonstyle"
import { Disclosure } from "./disclosure"
import { CircleBack } from "../../accounts/portal/dashboard/drivers/classes/qualifications"


const Page1Wrapper = styled.div`
width: 1400px;
height: 100%;
margin: 0 auto;
display: flex;
flex-flow:column;
`
const Page1Container = styled.div`
flex:1;
display: flex;
flex-flow:column;
align-items: center;
justify-content:center;
`
const SelectContainerStyle = styled.div`
width: 640px;
margin: 0 auto;
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: 1fr 50px;
grid-column-gap: 0px;
grid-row-gap: 0px;
`
const IconStyle = styled(FontAwesomeIcon)`
color: #164398;
transition: color 0.2s ease;
filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.6)); // Adjust values as needed
cursor: pointer;
&:hover{color: #76B66A;}
`
export const SetupPage1 = ({ account, setpage }) => {
    return (
        <Page1Wrapper>
            <div style={{ textAlign: "center", paddingTop: "20px" }}><h2>New application or return to an existing application?</h2></div>
            <Page1Container>
                <SelectContainerStyle>
                    <div style={{ gridColumn: 1, gridRow: 1, padding: "30px", justifySelf: "center"}}>
                        <CircleBack color="green" size="96px" style={{cursor:"pointer"}} onClick={()=>setpage(2)}>
                            <FontAwesomeIcon icon={faPlus} color="#FFF" size="4x" />
                        </CircleBack>                        
                    </div>
                    <div style={{ gridColumn: 2, gridRow: 1, padding: "30px", justifySelf: "center" }}>
                        <CircleBack color="green" size="96px" style={{cursor:"pointer"}} onClick={()=>setpage(3)}>
                            <FontAwesomeIcon icon={faCaretRight} color="#FFF" size="4x" />
                        </CircleBack>                        

                    </div>
                    <div style={{ gridColumn: 1, gridRow: 2, textAlign: "center" }}>
                        <FormButton onClick={() => setpage(2)}>Start New Application</FormButton>
                    </div>
                    <div style={{ gridColumn: 2, gridRow: 2, textAlign: "center" }}>
                        <FormButton onClick={() => setpage(3)}>Return To Application</FormButton>
                    </div>
                </SelectContainerStyle>                
            </Page1Container>
            <div style={{ justifySelf: "flex-end", alignSelf: "center" }}> <Disclosure /></div>
        </Page1Wrapper>
    )
}