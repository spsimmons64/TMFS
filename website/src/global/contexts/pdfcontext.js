import { createContext, useState } from "react";
import { getApiUrl } from "../globals";
import styled from "styled-components";
import { ModalCardStyle, ModalCardWrapperStyle } from "../../components/portals/cardstyle";
import { GridLoader } from "../../components/portals/gridstyles";
import { FormButton } from "../../components/portals/buttonstyle";

const PDFWrapperStyle = styled.iframe`
width: 100%;
margin:10px 0px;
border: 2px solid #323639;
`
const LoadingWrapper = styled.div`
width: 100%;
margin:10px 0px;

display:flex;
align-items:center;
justify-content:center;
height: ${props => props.height || "auto"}
`
export const PDFContext = createContext();

const PDFInitParams = {
    title: "",
    open: false,
    busy: true,
    width: "1000px",
    height: "800px",
    data: null
}

export const PDFContextProvider = ({ children }) => {
    const [pdfCard, setPdfCard] = useState(PDFInitParams)

    const viewDocument = async (docid, title, width = "1000px", height = "800px") => {
        setPdfCard({ title: title, width: width, height: height, open: true, busy: true })
        let url = `${getApiUrl()}/driverdocs/fetch?id=${docid}`
        let headers = { credentials: "include", method: "get", headers: { 'Content-Type': "application/pdf" } }
        const response = await fetch(url, headers);
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setPdfCard(ps => ({ ...ps, data: `${pdfUrl}#view=Fit`, busy: false }))
    }

    const contextValue = { viewDocument };
    
    return (
        <PDFContext.Provider value={contextValue}>
            {children}
            {pdfCard.open &&
                <ModalCardWrapperStyle>
                    <ModalCardStyle style={{ width: pdfCard.width, height: pdfCard.height, padding: "0px 0px 50px 0px", backgroundColor: "#FFF" }}>
                        {pdfCard.busy
                            ? <LoadingWrapper height={pdfCard.height}><GridLoader message="Loading The Document. Please Wait" /></LoadingWrapper>
                            : <><PDFWrapperStyle
                                id="pdf-viewer"
                                title={pdfCard.title}
                                src={pdfCard.data}
                                style={{ margin: 0, width: "100%", border: "none", borderBottom: "1px solid #323639", height: "100%" }}
                            />
                                <div style={{ width: "100%", textAlign: "center", padding: "2px 10px 0px 0px" }}>
                                    <FormButton onClick={() => setPdfCard(PDFInitParams)}>
                                        Close Viewer
                                    </FormButton>
                                </div>
                            </>
                        }
                    </ModalCardStyle>
                </ModalCardWrapperStyle >
            }
        </PDFContext.Provider>
    )
}
