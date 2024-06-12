import { useContext, useEffect, useState } from "react"
import { TabContainer } from "../../components/portals/tabcontainer"
import { FormBoxStyle } from "../../components/portals/formstyles"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { initFormState, languageTypes, yesNoTypes } from "../../global/staticdata"
import { ErrorContext } from "../../global/contexts/errorcontext"
import { FormButton } from "../../components/portals/buttonstyle"
import { useRestApi } from "../../global/hooks/restapi"
import { serializeForm } from "../../global/globals"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { PanelContainerStyle, PanelHeaderStyle, PanelScrollContainerStyle, PanelScroller } from "../../components/portals/panelstyles"

export const FlagAccount = ({ record, setPage }) => {
    const { globalState, fetchGlobalData } = useGlobalContext()
    const [formState, setFormState] = useState(initFormState("consultant-form"))
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [tabSelected, setTabSelected] = useState(0)
    const formData = useRestApi(formState.url, "POST", formState.data, formState.reset)
    const tabMenu = [{ text: `Flag Account`, key: 0 }]
    const { reportUserAction } = useUserAction()

    const sumbitForm = (e) => {
        let data = serializeForm(formState.id)
        data.append("accountflags_recordid","")
        data.append("accountflags_consultantcreated", globalState.consultant.recordid)        
        data.append("accountflags_accountid",record.accounts_recordid)
        setFormState(ps => ({ ...ps, busy: true, url: "accountflags", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if (formData.status === 200) {
            reportUserAction(`Added Account Flag To ${record.accounts_companyname}`)
            setPage({ page: 0, record: {} })
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => {return () => setErrorState([])}, [])

    return (
        <PanelContainerStyle>
            <PanelHeaderStyle>
                <div>Consultants &gt; Portal &gt; Flag</div>
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>Flag Account</div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            <PanelScrollContainerStyle>
                <PanelScroller>
                    <div style={{ fontSize: "21px", fontWeight: 700, marginBottom: "19px" }}>Flag Account</div>
                    <div>{record.accounts_companyname}</div>
                    <div>{record.accounts_address}</div>                    
                    <div>{record.accounts_city}, {record.accounts_state} {record.accounts_zipcode}</div>
                    <div>{record.accounts_telephone}</div>
                    <div style={{margin:"19px 0px"}}>Flagging an account is internal only. Please provide the reason for the flag.</div>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>                        
                        <FormInput id="accountflags_flagreason" mask="text" value="" label="" labelwidth="0px" style={{width: "600px"}} autoFocus/>
                        <div style={{ display: "flex", alignItems: "center", marginTop:"10px" }}>
                            <FormButton onClick={sumbitForm} color="green" style={{ width: "74px" }}>Save </FormButton>
                            <FormButton onClick={() => setPage({ page: 0, record: {} })} color="red" style={{ marginLeft: "10px", width: "74px" }}>Cancel</FormButton>
                        </div>
                    </FormBoxStyle>
                </PanelScroller>
            </PanelScrollContainerStyle>
        </PanelContainerStyle>
    )
}