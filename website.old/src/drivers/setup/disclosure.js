import styled from "styled-components"
import SecurityShield from "../../assets/images/encrypted_2592317.png"

const DisclosureContainerStyle = styled.div`
width: 640px;
margin: 0 auto;
display: flex;
background-color: #F0F0F0;
border: 1px solid #E2E2E2;
border-radius: 3px;
margin-bottom: 40px;
padding:20px;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`
const DisclosureIconContainerStyle = styled.div`
width: 50px;
display: flex;
align-items: center;
justify-content: center;
`

const DisclosureTextContainerStyle = styled.div`
flex:1;
padding-left: 20px;
font-size: 12px;
color:#8E8E8E;
`

export const Disclosure = () => {
    return (
        <DisclosureContainerStyle>
            <DisclosureIconContainerStyle>
                <img src={SecurityShield} alt="Shield" style={{ width: "50px" }} />
            </DisclosureIconContainerStyle>
            <DisclosureTextContainerStyle>
                <b>This website uses the highest security standards on all levels.</b> Our security includes the
                transfer of information from your computer to our servers utilizing SSL encryption technology, monthly server
                and application vulnerability scanning by 3rd party security companies, sensitive data encryption storage and physical
                network security in a world class tier-4 data center. You can use our service in confidence knowing that your
                information is safe.
            </DisclosureTextContainerStyle>
        </DisclosureContainerStyle>
    )
}