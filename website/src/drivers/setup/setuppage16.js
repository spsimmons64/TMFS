import { useEffect } from "react";
import { useButtonContext } from "./buttoncontext";

export const SetupPage16 = ({ setpage }) => {
    const { setPrevVisible, setNextVisible } = useButtonContext()

    useEffect(() => {
        setNextVisible(false)
        setPrevVisible(false)
    }, [])

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 10px 0px" }}>Your Application Has Been Saved</div>
        <p style={{ marginBottom: "20px" }}>Your application for employment has been saved and will be waiting for you to return.
            It has not been sent to the employer and they cannot see any information you have added. When you're ready to finish your
            application, simply return to the url below and click <strong>Return To Application.</strong></p>
        <p><strong>Return URL: </strong><span style={{ cursor: "pointer", color: "#164398" }} onClick={() => setpage(1)}><u>{window.location.href}</u></span></p>
    </>)
}