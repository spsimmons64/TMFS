import { AdminPortal } from "./admin/portal/portal";
import { ResellersPortal } from "./resellers/portal/portal";
import { AccountsPortal } from "./accounts/portal/accountsportal";
import { useEffect, useState } from "react";
import { Page404 } from "./page404";
import { useNavigate } from "react-router-dom";
import { BreadCrumbContextProvider } from "./global/contexts/breadcrumbcontext";

export const PortalDirector = () => {
    const navigate = useNavigate()
    const [siteRoute, setSiteRoute] = useState()
    const entity = JSON.parse(localStorage.getItem("assets"))

    const gotoLogin = () => {        
        const path = window.location.pathname;
        let pathArray = path.split('/')
        pathArray[pathArray.length - 1] = "login"    
        navigate(pathArray.join("/"))
    }

    useEffect(() => {        
        let siteroute = ""        
        if (entity) {            
            window.location.pathname !== entity.href && gotoLogin()
            switch (entity.entity) {
                case "resellers":
                    siteroute = entity.entity === "Administrative"
                        ? <AdminPortal entityid={entity.entityid} userid={entity.userid} />
                        : <ResellersPortal entityid={entity.entityid} userid={entity.userid} />
                    break
                case "accounts":
                    siteroute = <AccountsPortal entity={entity.entitytype} entityid={entity.entityid} userid={entity.userid} />
                    break;
                case "consultants":
                    siteroute = ""
                    break;
                case "law":
                    siteroute = ""
                    break;
                default:
                    siteroute = <Page404 />
                    break;
            }                      
            setSiteRoute(siteroute)
        } else {
            gotoLogin()
        }
    }, [])    
    return (<><BreadCrumbContextProvider>{siteRoute}</BreadCrumbContextProvider></>)
}