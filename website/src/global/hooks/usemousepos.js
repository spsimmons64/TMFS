import { useEffect, useState } from "react"

export const useMousePosition = () => {
    const[mousePosition,setMousePosition] = useState({x:0,y:0});
    useEffect(()=>{
        const updateMousePosition =(e) => setMousePosition({x:e.clientX,y:e.clientY})
        window.addEventListener("mousedown",updateMousePosition,false);
        return ()=> window.removeEventListener("mousedown",updateMousePosition,false);
    },[])
    return mousePosition;
}