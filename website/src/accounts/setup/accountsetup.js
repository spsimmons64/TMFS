import styled from "styled-components"
import { AccountSetup1 } from "./setuppage1"
import { AccountSetup2 } from "./setuppage2"
import { AccountSetup3 } from "./setuppage3"
import { AccountSetup4 } from "./setuppage4"
import { AccountSetup5 } from "./setuppage5"
import { useEffect, useState } from "react"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"
import { PortalFooterStyle, PortalHeaderStyle } from "../../components/portals/newpanelstyles"
import { useRestApi } from "../../global/hooks/restapi"
import { FormButton } from "../../components/portals/buttonstyle"
import { SetupProgress } from "./setupprogress"
import { AccountSetup6 } from "./setuppage6"

const FrameHeader = styled.div`
display: flex;
align-items: center;
height: 100px;
width: 1400px;
margin: 0 auto;
`
const FrameFooter = styled.div`
display: flex;
align-items: center;
height: 74px;
width: 1400px;
margin: 0 auto;
`
const FrameHR = styled.hr`
width: 1400px;
margin: 0px auto;
`
const SetupWrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-flow: column;
color: #595959;
background-color:
`
const SetupContent = styled.div`
flex:1;
width: 1400px;
display: flex;
margin: 0 auto;
`
const SetupAppContainer = styled.div`
flex:1;
display:flex;
flex-flow:column;
`
const SetupAppScrollerContainer = styled.div`
height:0px;
flex: 1 1 auto;
overflow-y:scroll;
padding: 10px;
`
const SetupProgressContainer = styled.div`
width:550px;
background-color: #F0F0F0;
`

export const AccountSetup = () => {
    const { formControls, formState, serializeFormData, sendFormData, setValue, getValue, getError, buildControlsFromRecord } = useMultiFormContext("")
    const [page, setPage] = useState(0);
    const [pageButtons, setPageButtons] = useState({
        prevbutton: { disabled: false, visible: true },
        nextbutton: { disabled: false, visible: true },
    })
    const [setupStatus, setSetupStatus] = useState(false)
    const [pageStatus, setPageStatus] = useState([])
    const [reseller, setReseller] = useState({ data: {}, url: "", reset: false });
    const resellerData = useRestApi(reseller.url, "GET", {}, reseller.reset);

    const getUrlParams = () => {
        const urlString = window.location.hostname.split(".")
        setReseller({ url: `fetchobj/reseller?siteroute=${urlString[0]}`, reset: !reseller.reset })
    }

    const updatePageStatus = (page, val) => {
        let newList = [...pageStatus]
        const rec = newList.findIndex(r => r.page === page)
        if (rec > -1) {
            newList[rec].status = val
        } else {
            newList.push({ page: page, status: val })
        }
        setPageStatus(newList)
    }
    const handleSubmit = async (e, delflag = false) => {
        let data = serializeFormData()
        data.append("set_setupstep", page)
        let resp = await sendFormData("post", data, "fetchobj/account/validate")
        if (resp.status === 200) {
            page == 0 && setValue("acc_recordid", resp.data.id)
            page == 0 && setValue("acc_siteroute",(getValue("acc_companyname").toLowerCase().replace(/[^a-z0-9]/g,"_")))
            updatePageStatus(page, "ok")
            if ((page + 1) == 5) {
                setSetupStatus(true)
                setPageButtons({ prevbutton: { disabled: false, visible: false }, nextbutton: { disabled: true, visible: false } })
            }
            setPage(page + 1)
        } else {
            updatePageStatus(page, "error")
            if ((page + 1) == 5) {
                setSetupStatus(false)
                setPageButtons({ prevbutton: { disabled: false, visible: true }, nextbutton: { disabled: true, visible: false } })
                setPage(page + 1)
            }
        }
    }    
    useEffect(() => {
        if (page === 4) {
            let toggle = (getValue("set_tosagreement") && getValue("set_billingagreement"))
            setPageButtons(ps => ({ ...ps, nextbutton: { ...ps.nextbutton, disabled: !toggle, visible: true } }))
        } else if (page === 5) {
            setPageButtons(ps => ({ ...ps, nextbutton: { ...ps.nextbutton, disabled: true, visible: false } }))
        } else {
            setPageButtons(ps => ({ ...ps, nextbutton: { ...ps.nextbutton, disabled: false, visible: true } }))
        }
    }, [page, formControls])

    useEffect(() => { resellerData.status === 200 && setReseller(resellerData.data) }, [resellerData])

    useEffect(() => { getUrlParams() }, [])

    return (
        <SetupWrapper>
            <PortalHeaderStyle>
                <div style={{ flex: 1 }}>TMFS Corporation</div>
                <div style={{ flex: 1, textAlign: "right" }}>Cambiar al Español</div>
            </PortalHeaderStyle>
            <FrameHeader>
                {reseller.id && <>
                    <div style={{ flex: 1 }}><img src={`data:image/png;base64,${reseller.logo}`} alt="Logo" /></div>
                </>}
                <div style={{ flex: 1, fontSize: "36px", fontWeight: 700, textAlign: "right" }}>Account Setup</div>
            </FrameHeader>
            <FrameHR />
            <SetupContent>
                <SetupAppContainer id="account-setup">
                    <SetupAppScrollerContainer>
                        {page == 0 && <AccountSetup1 reseller={reseller} />}
                        {page == 1 && <AccountSetup2 reseller={reseller} />}
                        {page == 2 && <AccountSetup3 />}
                        {page == 3 && <AccountSetup4 />}
                        {page == 4 && <AccountSetup5 />}
                        {page == 5 && <AccountSetup6 reseller={reseller} status={setupStatus} />}
                    </SetupAppScrollerContainer>
                </SetupAppContainer>
                <SetupProgressContainer>
                    <SetupProgress page={page} status={pageStatus} />
                </SetupProgressContainer>
            </SetupContent>
            <FrameHR />
            <FrameFooter>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                    <div style={{ textAlign: "left", width: "200px" }}>
                        {pageButtons.prevbutton.visible && <>
                            {page > 0 && <FormButton style={{ width: "100px" }} onClick={() => setPage(page - 1)}>Previous</FormButton>}
                        </>}
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <b>Need Help:</b> Call {reseller.telephone} {reseller.email}
                    </div>
                    <div style={{ textAlign: "right", width: "200px" }}>
                        {pageButtons.nextbutton.visible &&
                            <FormButton style={{ width: "100px" }} disabled={pageButtons.nextbutton.disabled} onClick={handleSubmit}>Next</FormButton>
                        }
                    </div>
                </div>
            </FrameFooter>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>©2024 MyDriverFiles.com, Powered by TMFS Corporation</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </SetupWrapper >
    )
}