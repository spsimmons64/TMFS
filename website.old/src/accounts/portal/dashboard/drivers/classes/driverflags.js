import { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CircleButton } from "../../../../../components/portals/buttonstyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { ClearFlagForm } from "../forms/clearflagform";

export const DriverFlagContext = createContext()

export const DriverFlagContextProvider = ({ children }) => {
    const [flagList, setFlagList] = useState([])

    return (<DriverFlagContext.Provider value={{ flagList, setFlagList }}>{children}</DriverFlagContext.Provider>)
}

export const useDriverFlagsContext = () => {
    const context = useContext(DriverFlagContext);
    return context;
}

const DriverFlagContainerStyle = styled.div`
display: flex;
align-items:center;
width: 100%;
padding: 0px;
border: none;
background-color: #FFE6E6;
border-radius: 4px;
font-size: 13px;
font-weight: 600;
margin-bottom: 0px;
max-height: 0px;
opacity: 0;
transition: max-height .15s ease,  opacity .9s ease;
&.flagopen{
    max-height: 36px;
    padding:5px;
    border: 1px solid #FF6666;
    margin-bottom: 5px;
    opacity: 1;
}
`
const DriverFlagContainerIconStyle = styled.div`
width: 36px;
color: #FFF;
`
const DriverFlagContainerDateStyle = styled.div`
width: 100px;
`
const DriverFlagContainerTextStyle = styled.div`
flex:1;
`
const DriverFlagContainerClearStyle = styled.div`
width: 100px;
text-decoration: underline;
color:#164398;
`
export const DriverFlagsList = () => {
    const { flagList} = useDriverFlagsContext()
    const [formOpen,setFormOpen] = useState({open:false,ndx:-1,record:{}})

    const handleRecordEdit = ({target}) => {
        const id= target.getAttribute("data-id")
        const ndx = flagList.findIndex(r=>r.recordid===id)
        ndx > -1 && setFormOpen({open:true,record:flagList[ndx],ndx:ndx})
    }

    const handleEditCallback = (resp) => {
        const ndx = formOpen.ndx;
        setFormOpen({open:false,record:{},ndx:-1})
        if(resp.status===200){
            let newList = [...flagList]
            newList.splice(ndx,1)            
        }
    }

    useEffect(()=>{                
        flagList.forEach(flag=>{
            setTimeout(()=>{const el = document.getElementById(`flag-${flag.recordid}`).classList.add("flagopen")},200)})
        },[flagList])

    return (
        <>
            {flagList.map(r => {
                return (
                    <DriverFlagContainerStyle id={`flag-${r.recordid}`} key={r.recordid} open={r.open}>
                        <DriverFlagContainerIconStyle >
                            < CircleButton
                                size="24px"
                                style={{
                                    color: "#FFF",
                                    border: "none",
                                    backgroundImage: "linear-gradient(to bottom, rgba(233,73,73,1) 0%,rgba(159,20,20,1) 100%)"
                                }}><FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faFlag} />
                            </CircleButton>
                        </DriverFlagContainerIconStyle>
                        <DriverFlagContainerDateStyle  >{r.flagdate}</DriverFlagContainerDateStyle>
                        <DriverFlagContainerTextStyle  >{r.flagreason}</DriverFlagContainerTextStyle>
                        <DriverFlagContainerClearStyle data-id={r.recordid} onClick={handleRecordEdit} style={{cursor:"pointer"}}>
                            <span style={{pointerEvents:"none",userSelect:"none"}}>CLEAR FLAG</span>
                        </DriverFlagContainerClearStyle>
                    </DriverFlagContainerStyle>
                )
            })}
            {formOpen.open && <ClearFlagForm record={formOpen.record} callback={handleEditCallback} />}
        </>
    )
}