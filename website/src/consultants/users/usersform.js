import { useContext, useEffect, useState } from "react"
import { TabContainer } from "../../components/portals/tabcontainer"
import { FormBoxStyle } from "../../components/portals/formstyles"
import { FormInput, FormSelect } from "../../components/portals/inputstyles"
import { initFormState, languageTypes, timeZonesTypes, userRankTypes, yesNoTypes } from "../../global/staticdata"
import { ErrorContext } from "../../global/contexts/errorcontext"
import { FormButton } from "../../components/portals/buttonstyle"
import { useRestApi } from "../../global/hooks/restapi"
import { serializeForm } from "../../global/globals"
import { useGlobalContext } from "../../global/contexts/globalcontext"
import { useUserAction } from "../../global/contexts/useractioncontext"
import { PanelContainerStyle, PanelHeaderStyle, PanelScrollContainerStyle, PanelScroller } from "../../components/portals/panelstyles"



export const UsersForm = ({ record, setPage }) => {
    const { globalState, fetchGlobalData } = useGlobalContext()
    const [formState, setFormState] = useState(initFormState("consultant-form"))
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [tabSelected, setTabSelected] = useState(0)
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset)
    const tabMenu = [{ text: `Details`, key: 0 }]
    const { reportUserAction } = useUserAction()

    const sumbitForm = (e) => {
        let data = serializeForm(formState.id)
        let verb = record.users_recordid ? "PUT" : "POST"
        data.append("users_recordid", record.users_recordid || "")
        data.append("users_usertype", "consultants")
        data.append("users_usertypeid", globalState.consultant.recordid)
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "users", data: data, reset: !formState.reset }))
    }

    useEffect(() => {
        if (formData.status === 200) {
            let action = record.users_recordid ? "Updated" : "Created"
            let username = `${document.getElementById("users_firstname").value} ${document.getElementById("users_lastname").value}`
            reportUserAction(`${action} Consultant User ${username}`)
            setPage({ page: 2, record: {} })
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => {
        if (record.users_recordid) {
            let username = `${record.users_firstname} ${record.users_lastname}`
            reportUserAction(`Viewed User ${username}`)
        }
        return () => setErrorState([])
    }, [])

    return (
        <PanelContainerStyle>
            <PanelHeaderStyle>
                {record.users_recordid
                    ? <div>{`Consultants > Portal > Users > ${record.users_firstname} ${record.users_lastname}`}</div>
                    : <div>New User</div>
                }
                <div style={{ margin: "19px 0px", fontSize: "28px", fontWeight: 700 }}>
                    {record.users_recordid
                        ? <div>{`Edit User: ${record.users_firstname} ${record.users_lastname}`}</div>
                        : <div>Create New User</div>
                    }
                </div>
                <TabContainer options={tabMenu} selected={tabSelected} callback={(v) => setTabSelected(v)} />
            </PanelHeaderStyle>
            <PanelScrollContainerStyle>
                <PanelScroller>
                    <div style={{ fontSize: "21px", fontWeight: 700, marginBottom: "19px" }}>User Details</div>
                    <FormBoxStyle disabled={formState.busy} id={formState.id}>
                        <FormSelect id="users_securitylevel" value={record.users_securitylevel} options={userRankTypes} label="User Rank *" labelwidth="200px" />
                        <FormSelect id="users_language" value={record.users_language} options={languageTypes} label="Language *" labelwidth="200px" />
                        <div style={{ marginLeft: "213px", marginTop: "-20px", marginBottom: "10px", fontSize: "11px", fontWeight: 500, color: "#8E8E8E" }}>
                            The language in which to display the consultant portal for this user.
                        </div>
                        <FormInput id="users_position" mask="text" value={record.users_position} label="Company Position/Title *" autoFocus labelwidth="200px" />
                        <FormInput id="users_firstname" mask="text" value={record.users_firstname} label="First Name *" labelwidth="200px" />
                        <FormInput id="users_lastname" mask="text" value={record.users_lastname} label="Last Name *" labelwidth="200px" />
                        <FormInput id="users_telephone" mask="telephone" value={record.users_telephone} label="Phone Number &nbsp;&nbsp;" labelwidth="200px" />
                        <FormInput id="users_emailaddress" mask="text" value={record.users_emailaddress} label="Email Address *" labelwidth="200px"/>
                        <div style={{ marginLeft: "200px", display: "flex", alignItems: "center",marginTop:"10px" }}>
                            <FormButton onClick={sumbitForm} color="green" style={{ width: "74px", height: "36px" }}>Save</FormButton>
                            <FormButton onClick={() => setPage({ page: 2, record: {} })} color="red" style={{ marginLeft: "10px", width: "74px", height: "36px" }}>Cancel</FormButton>
                        </div>
                    </FormBoxStyle>
                </PanelScroller>
            </PanelScrollContainerStyle>
        </PanelContainerStyle>
    )
}