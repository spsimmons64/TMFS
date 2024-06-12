import { useContext, useEffect, useState } from "react"
import { TabContainer } from "../../components/portals/tabcontainer"
import { FormBoxStyle } from "../../components/portals/formstyles"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { initFormState, languageTypes, timeZonesTypes } from "../../global/staticdata"
import { ErrorContext } from "../../global/contexts/errorcontext"
import { FormButton } from "../../components/portals/buttonstyle"
import { useRestApi } from "../../global/hooks/restapi"
import { serializeForm } from "../../global/globals"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { PanelContainerStyle, PanelHeaderStyle, PanelScrollContainerStyle, PanelScroller } from "../../components/portals/panelstyles"
import { useUserAction } from "../../global/contexts/useractioncontext"

export const ConsultantForm = () => {
    const { globalState, fetchGlobalData } = useGlobalContext()
    const [formState, setFormState] = useState(initFormState("consultant-form"))
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [tabSelected, setTabSelected] = useState(0)
    const formData = useRestApi(formState.url, "PUT", formState.data, formState.reset)
    const tabMenu = [{ text: `Details`, key: 0 }]
    const {reportUserAction} = useUserAction()

    const sumbitForm = (e) => {
        let data = serializeForm(formState.id)
        data.append("consultants_recordid", globalState.consultant.recordid || "")
        setFormState(ps => ({ ...ps, busy: true, verb: "PUT", url: "consultants", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if(formData.status === 200){
            reportUserAction(`Updated Consultant Record For ${globalState.consultant.companyname}`);
            fetchGlobalData("consultant", globalState.consultant.recordid)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { 
        reportUserAction("Viewed Consultant Settings")
        return () => setErrorState([]) 
    }, [])

    return (
        <PanelContainerStyle>
            <PanelHeaderStyle>
                <div>Consultants &gt; Portal &gt; Settings</div>
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>Settings</div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            <PanelScrollContainerStyle>
                <PanelScroller>
                    <div style={{ paddingLeft: "8px", fontSize: "21px", fontWeight: 700, marginBottom: "19px" }}>Edit Details</div>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <FormInput id="consultants_lookupcode" mask="text" value={globalState.consultant.lookupcode} label="Lookup Code *" labelwidth="200px" readOnly />
                        <FormSelect id="consultants_language" value={globalState.consultant.language} options={languageTypes} label="Language *" labelwidth="200px" />
                        <FormInput id="consultants_companyname" mask="text" value={globalState.consultant.companyname} label="Company Name *" labelwidth="200px" />
                        <FormInput id="consultants_telephone" mask="telephone" value={globalState.consultant.telephone} label="Telephone Number *" labelwidth="200px" />
                        <FormInput autoComplete="on" id="consultants_emailgeneral" mask="text" value={globalState.consultant.emailgeneral} label="Email Address *" labelwidth="200px" />
                        <FormSelect id="consultants_timezone" value={globalState.consultant.timezone} options={timeZonesTypes} label="Time Zone *" labelwidth="200px" />
                        <div style={{ marginLeft: "213px", marginTop: "-20px", fontSize: "11px", fontWeight: 500, color: "#8E8E8E" }}>
                            The time zone in which to convert local times.
                        </div>
                        <div style={{ marginLeft: "200px", marginTop: "20px" }}><FormButton style={{width:"100px", height:"36px"}} color="green" onClick={sumbitForm}>Save</FormButton> </div>
                    </FormBoxStyle>
                </PanelScroller>
            </PanelScrollContainerStyle>
        </PanelContainerStyle>
    )
}