import { useContext, useEffect, useState } from "react"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"
import { PortalFooterStyle, PortalHeaderStyle } from "../../components/portals/newpanelstyles"
import { FormButton } from "../../components/portals/buttonstyle"
import { SetupProgress } from "./setupprogress"
import { useRestApi } from "../../global/hooks/apihook"
import { useNavigate } from "react-router-dom"
import { SetupPage1 } from "./setuppage1"
import { SetupPage2 } from "./setuppage2"
import { SetupPage3 } from "./setuppage3"
import { SetupPage4 } from "./setuppage4"
import { SetupPage5 } from "./setuppage5"
import { SetupPage6 } from "./setuppage6"
import { SetupPage7 } from "./setuppage7"
import { SetupPage8 } from "./setuppage8"
import { SetupPage9 } from "./setuppage9"
import { SetupPage10 } from "./setuppage10"
import { SetupPage11 } from "./setuppage11"
import { SetupPage12 } from "./setuppage12"
import { SetupPage13 } from "./setuppage13"
import { SetupPage14 } from "./setuppage14"
import { SetupPage15 } from "./setuppage15"
import { SetupPage16 } from "./setuppage16"
import { useButtonContext } from "./buttoncontext"
import styled from "styled-components"
import { MessageContext } from "../../administration/contexts/messageContext"


const FrameFormContainer = styled.div`
width: 1400px;
height: 100%;
display: flex;
flex-flow: column;
margin: 0 auto;

`
const FrameFormScroller = styled.div`
height: 0;
flex: 1 1 auto;
overflow-y:scroll;
`
const FrameSplitContainer = styled.div`
display:flex;
width: 100%;
`
const FrameAppContainer = styled.div`
flex:1;
padding-right: 10px;
`
const FrameProgressContainer = styled.div`
width: 450px;
border-left: 1px dotted #B6B6B6;
background-color: rgba(230,230,230,.6);
padding-right: 10px;
`
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

`
const SetupContent = styled.div`
flex:1;
justify-content: center;
align-items:center;
`
export const DriverSetup = () => {
    const [messageState, setMessageState] = useContext(MessageContext);
    const nav = useNavigate()
    const [gapTrack, setGapTrack] = useState([])
    const { formControls, sendFormData, getValue, setFormErrors, setFormBusy } = useMultiFormContext("")
    const { buttonState } = useButtonContext();
    const [topPage, setTopPage] = useState();
    const [page, setPage] = useState(0);
    const [accountData, setAccountData] = useState({})
    const { fetchData } = useRestApi()

    const [processSteps, setProcessSteps] = useState([
        { page: 1, header: "Application For Employment", text: "Your general application information", status: -1 },
        { page: 2, header: "Upload Driver's License Copy", text: "Provide a photo copy of your driver's license", status: -1 },
        { page: 3, header: "Upload Medical Card Copy", text: "Provider a photo copy of your medical card", status: -1 },
        { page: 4, header: "Upload Forfeiture Documents", text: "Provide forfeiture documents (if applicable)", status: -1 },
        { page: 5, header: "Alcohol & Drug Test Statement", text: "Your alcohol and drug testing history statement", status: -1 },
        { page: 6, header: "Safety Performance History Investigation", text: "Previous employer investigation agreement", status: -1 },
        { page: 7, header: "PSP Driver Authorization", text: "Authorization to run DOT PSP report", status: -1 },
        { page: 8, header: "Drug And Alcohol Clearinghouse Consent", text: "Authorization for Drug & Alcohol Clearinghouse", status: -1 },
        { page: 9, header: "Alcohol And Drug Testing Policy", text: "Review employer's alcohol & drug testing policy", status: -1 },
        { page: 10, header: "General Work Policy", text: "Review employer's general work policy", status: -1 },
        { page: 11, header: "Fair Credit Report Authoization", text: "Authorization for release for the Fair Credit Report", status: -1 },
    ])

    const validateForm = () => {
        let errors = {}
        if (page == 4) {
            let newList = [...gapTrack]
            if (!getValue("drv_firstname")) errors["drv_firstname"] = "The First Name Is Required"
            if (!getValue("drv_lastname")) errors["drv_lastname"] = "The Last Name Is Required"
            if (!getValue("drv_birthdate")) errors["drv_birthdate"] = "The Birth Date Is Required"
            if (!getValue("drv_telephone1")) errors["drv_telephone1"] = "The Telephone Is Required"
            if (!getValue("drv_emailaddress")) errors["drv_emailaddress"] = "The Email Address Is Required"
            if (!getValue("drv_address")) errors["drv_address"] = "The Address Is Required"
            if (!getValue("drv_city")) errors["drv_city"] = "The City Is Required"
            if (!getValue("drv_zipcode")) errors["drv_zipcode"] = "The Zip Code Is Required"
            if (!getValue("dat_medcardexpires")) errors["dat_medcardexpires"] = "The Medical Card Expire Is Required"
            if (getValue("drv_licenses").length == 0) errors["drv_licenses"] = true
            if (getValue("app_beendenied") == "Y" || getValue("app_beenrevoked") == "Y") {
                if (!getValue("app_forfeituredetails")) errors["app_forfeituredetails"] = "Circumstances Are Required"
            }
            if (getValue("exp_bus") == "N" &&
                getValue("exp_dbltrp") == "N" &&
                getValue("exp_flatbed") == "N" &&
                getValue("exp_other") == "N" &&
                getValue("exp_semtrl") == "N" &&
                getValue("exp_strtrk") == "N" &&
                getValue("exp_trktrc")) errors["exp_experience"] = true
            newList.forEach((r, ndx) => {
                if (document.getElementById(`gapreason-${r.ndx}`).value == "") {
                    newList[ndx].error = 1
                    errors["emp_gapreason"] = true
                }
            })
            setGapTrack(newList)
        }
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            setMessageState({ level: "error", message: "Please Address The Errors On Your Application." })
            setFormErrors(errors)
            let el = document.getElementById("scrollback")
            if (el) el.scrollIntoView({ top: 0, behavior: "smooth" });
            return false
        } else {
            return true
        }
    }

    const getUrlParams = async () => {
        const urlString = window.location.pathname.split("/")
        const response = await fetchData(`fetchobj/account?siteroute=${urlString[urlString.length - 2]}`, 'GET')
        response.status === 200 ? setAccountData(response.data) : nav(`${process.env.REACT_PUBLIC_URL}/page404`, { replace: true })
    }

    const setupPageStatus = () => {
        let newList = [...processSteps]
        const docList = getValue("drv_documents")
        newList.forEach((r, rndx) => {
            if (r.page < topPage) {
                newList[rndx].status = 1
                if (r.page === 2) {
                    const rec = docList.find(r => r.doc_typecode === "16")
                    if (!rec) newList[rndx].status = 3
                }
                if (r.page === 3) {
                    const rec = docList.find(r => r.doc_typecode === "17")
                    if (!rec) newList[rndx].status = 3
                }
                if (r.page === 4) {
                    if (getValue("app_beendenied") == "N" && getValue("app_beenrevoked") == "N") {
                        newList[rndx].status = 2
                    } else {
                        const rec = docList.find(r => r.doc_typecode === "1")
                        if (!rec) newList[rndx].status = 3
                    }
                }
            }
        })
        setProcessSteps(newList)
    }

    const setPrevious = () => {
        if (page == 8 && (getValue("app_beendenied") == "N" && getValue("app_beenrevoked") == "N"))
            setPage(6)
        else
            setPage(page - 1)
    }

    const sanitizeEmployers = () => {
        let newList = [...getValue("drv_employers")]
        if (page == 4) {
            newList.forEach((r, rndx) => {
                let elId = `gapreason-${rndx}`
                const req = gapTrack.find(r => r.ndx === rndx)
                newList[rndx].emp_reasongap = req ? document.getElementById(elId).value : ""
            })
        }
        return (newList)
    }

    const prepFormData = () => {
        const sectionList = ["licenses", "documents", "crashes", "violations", "addresses", "forfeitures", "signatures", "employers"]
        let account = {}, application = {}, driver = {}, licenses = [], experience = {}, dates = {}
        let crashes = [], violations = [], addresses = [], signatures = [], employers = []
        let data = new FormData()
        Object.keys(formControls).forEach(key => {
            const splitKey = key.split("_")
            if (splitKey[0] == "acc") account[splitKey[1]] = getValue(key)
            if (splitKey[0] == "app") application[splitKey[1]] = getValue(key)
            if (splitKey[0] == "exp") experience[splitKey[1]] = getValue(key)
            if (splitKey[0] == "dat") dates[splitKey[1]] = getValue(key)
            if (splitKey[0] == "drv") {
                if (splitKey[1] !== "esignature") {
                    if (sectionList.includes(splitKey[1])) {
                        if (splitKey[1] == "licenses") licenses = getValue(key)
                        if (splitKey[1] == "crashes") crashes = getValue(key)
                        if (splitKey[1] == "violations") violations = getValue(key)
                        if (splitKey[1] == "addresses") addresses = getValue(key)
                        if (splitKey[1] == "signatures") signatures = getValue(key)
                        if (splitKey[1] == "employers") employers = sanitizeEmployers()
                    } else {
                        driver[splitKey[1]] = getValue(key)
                    }
                }
            }
        });

        data.append("account", JSON.stringify(account))
        data.append("application", JSON.stringify(application))
        data.append("driver", JSON.stringify(driver))
        data.append("experience", JSON.stringify(experience))
        data.append("licenses", JSON.stringify(licenses))
        data.append("crashes", JSON.stringify(crashes))
        data.append("violations", JSON.stringify(violations))
        data.append("addresses", JSON.stringify(addresses))
        data.append("signatures", JSON.stringify(signatures))
        data.append("employers", JSON.stringify(employers))
        data.append("dates", JSON.stringify(dates))
        data.append("app_page", page)
        return (data)
    }

    const handleSubmit = async (e, delflag = false) => {
        if (validateForm()) {
            setFormBusy(true)
            setFormErrors({})
            let data = prepFormData()
            let resp = await sendFormData("post", data, "fetchobj/driver/application")
            if (resp.status === 200) {
                let newPage = page + 1
                if ((newPage - 3) > topPage) setTopPage(newPage - 3)
                if (newPage == 7 && (getValue("app_beendenied") == "N" && getValue("app_beenrevoked") == "N")) newPage = 8
                setPage(newPage)
            }
            setFormBusy(false)
        }
    }

    useEffect(() => { setupPageStatus() }, [topPage])

    useEffect(() => { setTopPage(getValue("app_applicationstep")) }, [getValue("app_applicationstep")])

    useEffect(() => { setPage(1) }, [accountData])

    useEffect(() => {
        let el = document.getElementById("driver-form-scroller")
        if (el) el.scrollTo({ top: 0, behavior: "instant" });
        setupPageStatus()
    }, [page])

    useEffect(() => { getUrlParams() }, [])

    return (
        <SetupWrapper>
            <PortalHeaderStyle>
                <div style={{ flex: 1 }}>{accountData.companyname}</div>
                <div style={{ flex: 1, textAlign: "right" }}>Cambiar al Español</div>
            </PortalHeaderStyle>
            <FrameHeader>
                {accountData.id && <>
                    <div style={{ flex: 1, marginTop: "12px" }}><img src={`data:image/png;base64,${accountData.logo}`} alt="Logo" /></div>
                </>}
                <div style={{ flex: 1, fontSize: "36px", fontWeight: 700, textAlign: "right" }}>Driver Application</div>
            </FrameHeader>
            <FrameHR />
            <SetupContent id="driver-setup">
                {page === 0 && <span>Loading...</span>}
                {page > 0 && page < 4 && <>
                    {page == 1 && <SetupPage1 accountData={accountData} setpage={setPage} />}
                    {page == 2 && <SetupPage2 accountData={accountData} setpage={setPage} />}
                    {page == 3 && <SetupPage3 accountData={accountData} setpage={setPage} />}
                </>}
                {page > 3 &&
                    <FrameFormContainer>
                        <FrameFormScroller id="driver-form-scroller">
                            <FrameSplitContainer>
                                <FrameAppContainer>
                                    {page == 4 && <SetupPage4 gapTrack={gapTrack} setGapTrack={setGapTrack} />}
                                    {page == 5 && <SetupPage5 />}
                                    {page == 6 && <SetupPage6 />}
                                    {page == 7 && <SetupPage7 />}
                                    {page == 8 && <SetupPage8 />}
                                    {page == 9 && <SetupPage9 />}
                                    {page == 10 && <SetupPage10 accountData={accountData} />}
                                    {page == 11 && <SetupPage11 accountData={accountData} />}
                                    {page == 12 && <SetupPage12 accountData={accountData} />}
                                    {page == 13 && <SetupPage13 accountData={accountData} />}
                                    {page == 14 && <SetupPage14 submit={handleSubmit} accountData={accountData} />}
                                    {page == 15 && <SetupPage15 />}
                                    {page == 16 && <SetupPage16 setpage={setPage} />}
                                </FrameAppContainer>
                                <FrameProgressContainer>
                                    <SetupProgress steps={processSteps} setpage={setPage} page={page} />
                                </FrameProgressContainer>
                            </FrameSplitContainer>
                        </FrameFormScroller>
                    </FrameFormContainer>
                }
            </SetupContent>
            <FrameHR />
            <FrameFooter>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                    <div style={{ textAlign: "left", width: "200px" }}>
                        {buttonState.prev.visible && <>
                            {page > 0 && <FormButton style={{ width: "100px" }} disabled={buttonState.prev.disabled} onClick={setPrevious}>Previous</FormButton>}
                        </>}
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <b>Need Help:</b> Call {accountData.phone} or email us at <a href={`mailto:${accountData.email}`}>{accountData.email}</a>
                    </div>

                    <div style={{ textAlign: "right", width: "200px" }}>
                        {buttonState.next.visible &&
                            <FormButton style={{ width: "100px" }} disabled={buttonState.next.disabled} onClick={handleSubmit}>Next</FormButton>
                        }
                    </div>
                </div>
            </FrameFooter>
            <PortalFooterStyle>
                <div style={{ flex: 1 }}>&copy; {accountData.resellerroute} Powered By {accountData.resellername}</div>
                <div>Web Application Design By Arrowleaf Technologies, LLC</div>
            </PortalFooterStyle>
        </SetupWrapper>
    )
}