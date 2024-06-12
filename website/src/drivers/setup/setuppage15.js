import { useEffect} from "react";
import { useButtonContext } from "./buttoncontext";

export const SetupPage15 = () => {
    const { setPrevVisible, setNextVisible } = useButtonContext()

    useEffect(() => {
        setNextVisible(false)
        setPrevVisible(false)
    },[])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>Your Application Is Complete</div>
        <p style={{ marginBottom: "20px" }}>Your application has been successfully completed and sent to the company for review!
            Please check the email address you provided for a copy of the company policies and other important information. If you
            do not receive an email, please contact the company using the information shown at the bottom of this page.</p>        
        <strong>Your application is complete and you may now close this window.</strong>
        
    </>)
}