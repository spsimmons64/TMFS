import { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { DriverContext } from "../contexts/drivercontext";
import { faCheck, faHourglassEmpty, faMinus, faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export const CircleBack = styled.div`
display:flex;
height: ${props => props.size};
width: ${props => props.size};
filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.5));
background-image:${props => {
        if (props.color == "green") return "linear-gradient(to bottom, rgba(129,238,119,1) 0%,rgba(20,145,0,1) 100%)"
        if (props.color == "red") return "linear-gradient(to bottom, rgba(242,141,141,1) 0%,rgba(145,0,0,1) 100%)"
        if (props.color == "grey") return "linear-gradient(to bottom, rgba(191,191,191,1) 0%,rgba(140,140,140,1) 100%)"
        if (props.color == "gold") return "linear-gradient(#CCAD00,#998200)"
        if (props.color == "blue") return "linear-gradient(#8fb1ef,#164398)"
        if (props.color == "purple") return "linear-gradient(#ff99ff,#800080)"        
        

        return "linear-gradient(to bottom, rgba(83,83,83,1) 1%,rgba(51,51,51,1) 100%);"
    }};
align-items:center;
justify-content: center;
border-radius: 50%;
font-weight:600;
color:#F2F2F2;
padding-left: 1px;

`
export const QualificationsContext = createContext()

export const QualificationsContextProvider = ({ children }) => {
    const { driverRecord } = useContext(DriverContext)
    const [qualifications,setQualifications] = useState({})
    
    useEffect(() => setQualifications(driverRecord.qualifications),[driverRecord])

    return <QualificationsContext.Provider value={{ qualifications,setQualifications }}>{children}</QualificationsContext.Provider>
}