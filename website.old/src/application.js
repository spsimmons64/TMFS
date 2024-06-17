import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { AccountSetup } from "./accounts/setup/accountsetup";
import { MultiFormContextProvider } from "./global/contexts/multiformcontext";
import { Director } from "./director";
import { PortalDirector } from "./portaldirector";
import { Page404 } from "./page404";
import { DriverSetup } from "./drivers/setup/driversetup";
import { LoginPage } from "./login/loginpage";
import { LoginForgot } from "./login/loginforgot";
import { LoginReset } from "./login/loginreset";
import { LoginLayout } from "./login/loginlayout";
import { MenuContextProvider } from "./accounts/portal/menucontext";
import { ButtonContextProvider } from "./drivers/setup/buttoncontext";
import { DriverUploads } from "./drivers/uploads/driveruploads";

const basename = process.env.REACT_APP_RUN_MODE === "development" ? "" : `/${process.env.REACT_APP_PUBLIC_URL}`

const router = createBrowserRouter(
    createRoutesFromElements(<>                        
        <Route path={`/:siteid/`} element={< LoginLayout />}></Route>
        <Route path={`:route?/login/forgotpwd/`} element={< LoginForgot />} />
        <Route path={`:route?/login/resetpwd/:id/`} element={< LoginReset />} />
        <Route path={`:route?/login/`} element={<LoginPage />} />        





        <Route path={`/:siteid/portal`} element=
            {<MenuContextProvider>< PortalDirector /></MenuContextProvider>} />
        <Route path={`/:siteid/apply/`} element=
            {
                <MultiFormContextProvider id="driver-setup" url="drivers">
                    <ButtonContextProvider>
                        <DriverSetup />
                    </ButtonContextProvider>
                </MultiFormContextProvider >
            }
        />
        < Route path={`/:siteid/upload/:route/:id`} element= {<DriverUploads />} />
        < Route path={`/accounts/setup`} element=
            {< MultiFormContextProvider id="account-setup" url="accounts" > <AccountSetup /></MultiFormContextProvider >}
        />
        

        < Route path={`/:id`} element={< Director />} />
        {/* < Route path={`/page404`} element={< Page404 />} />         */}
    </>)
,{basename:basename})

export const Application = () => {
    return (<RouterProvider router={router} />)
}