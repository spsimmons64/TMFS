import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormButton } from "../../components/portals/buttonstyle";
import { useNavigate } from "react-router-dom";

export const AccountSetup6 = ({ status, reseller }) => {
    const nav = useNavigate()
    const { handleChange, setValue, getValue, getError, buildControlsFromRecord, formControls } = useMultiFormContext()

    const handleLogin = () => {
        let urlString = `/${getValue("acc_siteroute")}`
        nav(urlString, { replace: true })
    }

    return (<>
        {status == true && <>
            <div style={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
                <h2 style={{ color: "#76B66A", fontSize: "28px" }}>You Are All Set Up!</h2>
                <div style={{ width: "100%", marginTop: "40px", fontWeight: 500, lineHeight: "2.0em" }}>
                    <p>Welcome to {reseller.companyname}!  Your account has been created.  Please check your
                        email for important information and links relative to your account.  As usual, if you have any questions
                        please contact us at {reseller.telephone} {reseller.email}</p>
                    <p>Now if you are ready to dive in, click the button below to be launched to your Account Portal.</p>
                </div>
                <div style={{ width: "100%", textAlign: "center", margin: "50px 0px" }}>
                    <FormButton style={{ height: "50px" }} onClick={handleLogin}>Login To My Account</FormButton>
                </div>
            </div>
        </>}
        {status == false && <>
            <div style={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
                <h2 style={{ color: "#ff4d4d", fontSize: "28px" }}>Oops.  We Have An Issue!</h2>
                <div style={{ width: "100%", marginTop: "40px", fontWeight: 500, lineHeight: "2.0em" }}>
                    <p>The Credit Card or Bank Information you provided will not allow us to process your payment. Please
                        Click The Previous Button to Step 4: Billing Profile and check your entries.</p>
                    <p>If your feel this to be an error, please contact us at {reseller.telephone} {reseller.email}.</p>
                </div>
            </div>
        </>}
    </>)
}