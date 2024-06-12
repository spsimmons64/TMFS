import { useNavigate } from "react-router-dom"
import Page404Image from "./assets/images/page404.webp"
import { FormButton } from "./components/portals/buttonstyle"

export const Page404 = () => {
    const navigate = useNavigate()
    return(
        <div style={{display:"flex",width:"100%",height:"100%",justifyContent:"center"}}>
            <div style={{width:"800px",textAlign:"center",marginTop:"50px"}}>
                <h2 style={{color:"#ff4d4d",marginBottom:"50px"}}>Your Page Link Is Lost (404)!</h2>
                <img 
                    src={Page404Image} 
                    alt="Page 404 Image" 
                    style={{width:"306px",opacity:".5", borderRadius:"5px",boxShadow: "4.1px 8.2px 8.2px hsl(0deg 0% 0% / 0.77)"}} 
                />
                <div style={{marginTop:"50px",lineHeight:"2em"}}>
                    <p>It appears that you have stumbled on an outdated link or a typo on the page you were trying to reach.</p>
                    <p><b>Our Apologies</b></p>
                    <p style={{marginBottom:"50px"}}>To get you back on track, please return to the main page by clicking the button below.</p>                    
                    <FormButton
                        onClick={()=>window.location.href = "https://www.driversfilesonline.com"}
                    >Return To Main Page
                    </FormButton>
                </div>
            </div>
        </div>
    )
}