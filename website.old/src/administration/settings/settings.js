import { useContext, useEffect, useState } from "react"
import { Panel, PanelContent, PanelHeader, PanelScroll, PanelScroller, PanelScrollerContainer } from "../../components/administration/panel"
import { faBuilding } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormButton } from "../../components/administration/button"
import { useRestApi } from "../../global/hooks/restapi"
import { initFormState, statesArray } from "../../global/staticdata"
import { ErrorContext } from "../../global/contexts/errorcontext"
import { serializeForm } from "../../global/globals"
import { FormInput } from "../../components/administration/inputs/forminput"
import { CardForm, CardRow } from "../../components/administration/card"
import { FormStaticSelect } from "../../components/administration/inputs/formstaticselect"
import { useGlobalContext } from "../../global/contexts/globalcontext"

import styled from "styled-components"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { GridScrollContainer } from "../../components/administration/grid/grid"

const FieldSetStyle = styled.fieldset`
width: 100%;
border: 1px solid #808080;
border-radius: 5px;
padding: 8px;
width: 600px;
margin: 20px auto;
`
const FieldSetLegendStyle = styled.legend`
font-size:18px;
font-weight: 500;
margin-left: 10px;
color: #164398;
`
export const Settings = () => {
    const [errorState, setErrorState] = useContext(ErrorContext)
    const { globalState, fetchGlobalData } = useGlobalContext()
    const [formState, setFormState] = useState(initFormState("settings-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const { reportUserAction } = useUserAction();

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("resellers_recordid", globalState.reseller.recordid || "")
        setFormState(ps => ({ ...ps, busy: true, verb: "PUT", url: "settings", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if (formData.status === 200) {
            reportUserAction("Updated The TMFS Company Profile")
            fetchGlobalData("reseller", globalState.reseller.recordid)

        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { reportUserAction("Viewed The TMFS Company Profile") }, [])

    return (<>
        <Panel>
            <PanelHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <div style={{ width: "44px" }}><FontAwesomeIcon icon={faBuilding} /></div>
                    <div style={{ flex: 1 }}>Company Profile</div>
                </div>
            </PanelHeader>
            <PanelContent style={{ display: "flex", flexFlow: "column" }}>
                <PanelScroll>
                    <FieldSetStyle>
                        <FieldSetLegendStyle>{globalState.reseller.companyname} Profile</FieldSetLegendStyle>
                        <CardForm id={formState.id} busy={formState.busy} style={{ width: "600px", margin: "0 auto" }}>
                            <FormInput id="resellers_companyname" label="Company Name *" mask="text" value={globalState.reseller.companyname}  autoFocus />
                            <CardRow>
                                <div style={{ flex: 1, marginRight: "4px" }}>
                                    <FormInput id="resellers_contactfirstname" label="Contact First Name *" mask="text" value={globalState.reseller.contactfirstname}  />
                                </div>
                                <div style={{ flex: 1, marginLeft: "4px" }}>
                                    <FormInput id="resellers_contactlastname" label="Contact Last Name *" mask="text" value={globalState.reseller.contactlastname}  />
                                </div>
                            </CardRow>
                            <FormInput id="resellers_emailgeneral" mask="text" label="Email Address *" value={globalState.reseller.emailgeneral}  />
                            <CardRow>
                                <div style={{ flex: 1, marginRight: "4px" }}>
                                    <FormInput id="resellers_address1" mask="text" label="Address 1 *" value={globalState.reseller.address1}  />
                                </div>
                                <div style={{ flex: 1, marginLeft: "4px" }}>
                                    <FormInput id="resellers_address2" mask="text" label="Address 2" value={globalState.reseller.address2} />
                                </div>
                            </CardRow>
                            <CardRow>
                                <div style={{ flex: 1, marginRight: "4px" }}>
                                    <FormInput id="resellers_city" mask="text" label="City *" value={globalState.reseller.city}  />
                                </div>
                                <div style={{ width: "140px", margin: "0px 4px" }}>
                                    <FormStaticSelect
                                        id="resellers_state"
                                        label="State *"
                                        options={statesArray}
                                        value={globalState.reseller.state}
                                    />
                                </div>
                                <div style={{ width: "130px", marginLeft: "4px" }}>
                                    <FormInput id="resellers_zipcode" mask="text" label="Zip Code *" value={globalState.reseller.zipcode}  />
                                </div>
                            </CardRow>
                            <CardRow>
                                <div style={{ flex: 1, marginRight: "4px" }}>
                                    <FormInput id="resellers_telephone" label="Telephone *" mask="telephone" value={globalState.reseller.telephone}  />
                                </div>
                                <div style={{ flex: 1, marginLeft: "4px" }}>
                                    <FormInput id="resellers_ein" label="EIN / Tax ID *" mask="ein" value={globalState.reseller.ein}  />
                                </div>
                            </CardRow>
                            <FormInput id="resellers_emaildrivers" label="Driver Email *" mask="text" value={globalState.reseller.emaildrivers}/>
                            <FormInput id="resellers_emailbilling" label="Billing Email *" mask="text" value={globalState.reseller.emailbilling} />
                            <FormInput id="resellers_emailsupport" label="Support Email *" mask="text" value={globalState.reseller.emailsupport} />
                            <div style={{ width: "100%", textAlign: "right" }}><FormButton onClick={submitForm} label="Save" /></div>
                        </CardForm>
                    </FieldSetStyle>
                </PanelScroll>
            </PanelContent>
        </Panel >
    </>)
}