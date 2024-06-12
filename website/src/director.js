import { useEffect} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRestApi } from "./global/hooks/restapi"

export const Director = () => {    
    const { id } = useParams()
    const nav = useNavigate()    
    const urlString = window.location.hostname.split(".")
    const resellerData = useRestApi(`fetchobj/reseller?siteroute=${urlString[0]}`, "GET", {}, true);
    useEffect(() => {        
        if (resellerData.status === 200) {   
            let url = ""                        
            if(resellerData.data.ismaster && !id){                
                url = `${process.env.REACT_APP_PUBLIC_URL}/admin/portal`            
            } else {
                url = `${process.env.REACT_APP_PUBLIC_URL}${id ? `/${id}/portal` : '/portal'}`            
            }                            
            nav(url,{replace:true});                
        }        
    }, [resellerData])
}