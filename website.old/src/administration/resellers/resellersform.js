import { useContext, useEffect, useState } from "react";
import { domains, initFormState, statesArray, timeZonesTypes } from "../../global/staticdata";
import { useRestApi } from "../../global/hooks/restapi";
import { CardHeader, CardForm, CardFooter, CardModal, CardRow, CardScrollContent } from "../../components/administration/card";
import { FormInput } from "../../components/administration/inputs/forminput";
import { FormCheck } from "../../components/administration/inputs/checkbox";
import { CardButton } from "../../components/administration/button";
import { serializeForm} from "../../global/globals";
import { YesNo, initYesNoState } from "../../components/administration/yesno";
import { useMousePosition } from "../../global/hooks/usemousepos";

import { FormStaticSelect } from "../../components/administration/inputs/formstaticselect";
import { FormDataSelect } from "../../components/administration/inputs/formdataselect";
import { ErrorContext } from "../../global/contexts/errorcontext";
import styled from "styled-components";
import { useUserAction } from "../../global/contexts/useractioncontext";

const SectionDividerStyle = styled.div`
width: 100%;
font-size: 20px;
font-weight: 500;
color: #76B66A;
border-bottom: 1px solid #76B66A;
margin-bottom: 20px;
`

export const ResellersForm = ({ record, parent, callBack }) => {
    const mousePos = useMousePosition()
    const [errorState, setErrorState] = useContext(ErrorContext)
    const [ynRequest, setYnRequest] = useState({ ...initYesNoState });
    const [formState, setFormState] = useState(initFormState("consultants-form"))
    const formData = useRestApi(formState.url, formState.verb, formState.data, formState.reset);
    const {reportUserAction} = useUserAction()

    const submitForm = (e, del = false) => {
        let data = serializeForm(formState.id)
        data.append("resellers_recordid", record.resellers_recordid || "")
        const verb = !record.resellers_recordid ? "POST" : (del ? "DELETE" : "PUT")
        setFormState(ps => ({ ...ps, busy: true, verb: verb, url: "resellers", data: data, reset: !formState.reset }))
    }

    const handleActionRequest = () => {
        setYnRequest({
            message: `Do You Wish To ${record.resellers_deleted ? "Reactivate" : "Deactivate"} This Reseller?`,
            left: mousePos.x,
            top: mousePos.y,
            halign: "right",
            valign: "bottom",
            callback: deactivateRequestResponse
        })
    }

    const deactivateRequestResponse = (resp) => {
        setYnRequest({ message: "", left: 0, top: 0, halign: "", valign: "", callback: "" })
        resp && submitForm(null, !record.resellers_deleted);
    }

    useEffect(() => {
        if(formData.status === 200){
            let action = record.resellers_recordid ? "Updated Reseller" : "Created Reseller" 
            reportUserAction(`${action} ${document.getElementById("resellers_companyname").value}`)
            callBack(true)
        }
        formData.status === 400 && setErrorState(formData.errors);
        setFormState(ps => ({ ...ps, busy: false }))
    }, [formData])

    useEffect(() => { 
        record.resellers_recordid &&  reportUserAction(`Viewed Consltantant ${record.resellers_companyname}`)
        return() => setErrorState([]) 
    }, [])

    return (<>
        <CardModal width="700px" height="700px">
            <CardHeader label="Resellers Editor" busy={formState.busy}></CardHeader>
            <CardScrollContent>
                <CardForm id={formState.id} busy={formState.busy}>
                    <SectionDividerStyle>Demographics</SectionDividerStyle>
                    <CardRow>
                        {record.resellers_recordid &&
                            <div style={{ width: "120px", marginRight: "8px" }}>
                                <FormInput style={{ textAlign: "center" }} id="resellers_internalid" label="Reseller ID" mask="number" value={record.resellers_internalid} readOnly />
                            </div>
                        }
                        <div style={{ flex: 1 }}>
                            <FormInput id="resellers_companyname" label="Company Name *" mask="text" value={record.resellers_companyname || ""}  autoFocus />
                        </div>
                    </CardRow>
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormInput id="resellers_contactfirstname" label="Contact First Name *" mask="text" value={record.resellers_contactfirstname}  />
                        </div>
                        <div style={{ flex: 1, marginLeft: "4px" }}>
                            <FormInput id="resellers_contactlastname" label="Contact Last Name *" mask="text" value={record.resellers_contactlastname}  />
                        </div>
                    </CardRow>
                    <FormInput id="resellers_emailaddress" label="Email Address *" mask="text" value={record.resellers_emailaddress}  />
                    <FormInput id="resellers_address1" label="Reseller Address 1 *" mask="text" value={record.resellers_address1}  />
                    <FormInput id="resellers_address2" label="Reseller Address 2" mask="text" value={record.resellers_address2} />
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormInput id="resellers_city" label="City *" mask="text" value={record.resellers_city}  />
                        </div>
                        <div style={{ width: "200px", margin: " 0px 4px" }}>
                            <FormStaticSelect id="resellers_state" label="State *" value={record.resellers_state} options={statesArray} />
                        </div>
                        <div style={{ width: "150px", marginLeft: "4px" }}>
                            <FormInput id="resellers_zipcode" label="Zip Code *" mask="text" value={record.resellers_zipcode}  />
                        </div>
                    </CardRow>
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormInput id="resellers_telephone" label="Telephone *" mask="telephone" value={record.resellers_telephone}  />
                        </div>
                        <div style={{ flex: 1, margin: " 0px 4px" }}>
                            <FormInput id="resellers_ein" label="EIN / Tax ID# *" mask="ein" value={record.resellers_ein}  />
                        </div>
                        <div style={{ flex: 1, marginLeft: "4px" }}>
                            <FormStaticSelect id="resellers_timezone" label="Time Zone *" value={record.resellers_timezone} options={timeZonesTypes} />
                        </div>
                    </CardRow>
                    <SectionDividerStyle>Account Setup</SectionDividerStyle>
                    <FormDataSelect id="resellers_smtpprofileid" label="Mail Domain" value={record.resellers_smtpprofileid} url="combos/smtpprofiles"  />
                    <CardRow>
                        <span style={{ fontWeight: "400", marginTop: "-25px" }}>https://</span>
                        <div style={{ flex: 1, margin: " 0px 4px" }}>
                            <FormInput id="resellers_siteroute" label="Service URL *" mask="text" value={record.resellers_siteroute}  />
                        </div>
                        <span style={{ fontWeight: "400", marginTop: "-8px" }}>.</span>
                        <div style={{ width: "200px", marginLeft: "4px" }}>
                            <FormStaticSelect id="resellers_sitedomain" label="Domain *" value={record.resellers_sitedomain} options={domains} />
                        </div>
                    </CardRow>
                    <CardRow style={{ justifyContent: "space-around", marginBottom: "20px" }}>
                        <FormCheck width="170px" id="resellers_manualpsp" label="Allow Manual PSPs" value={record.resellers_manualpsp} hideerror={1} />
                        <FormCheck width="170px" id="resellers_manualmvr" label="Allow Manual MVRs" value={record.resellers_manualmvr} hideerror={1} />
                    </CardRow>
                    <SectionDividerStyle>Billing And Fees</SectionDividerStyle>
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormDataSelect id="resellers_pricingid" label="Monthly Recurring Fees" value={record.resellers_pricingid} url="combos/pricing/resellers/monthly"  />
                        </div>
                        <div style={{ width: "145px", marginLeft: "4px" }}>
                            <FormCheck id="resellers_allowecheck" label="Allow E-Checks" value={record.resellers_allowecheck} />
                        </div>
                    </CardRow>
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormInput id="resellers_setupfee" label="Setup Fees" mask="currency" value={record.resellers_setupfee}  />
                        </div>
                        <div style={{ flex: 1, margin: "0px 4px" }}>
                            <FormInput id="resellers_reloadlevel" label="Reload Level" mask="currency" value={record.resellers_reloadlevel} readOnly tabIndex={-1} />
                        </div>
                        <div style={{ flex: 1, marginLeft: "4px" }}>
                            <FormInput id="resellers_reloaddeposit" label="Reload Amount" mask="currency" value={record.resellers_reloaddeposit} readOnly tabIndex={-1} />
                        </div>
                    </CardRow>
                    <CardRow>
                        <div style={{ flex: 1, marginRight: "4px" }}>
                            <FormInput id="resellers_pspdiscount" label="PSP Discount" mask="currency" value={record.resellers_pspdiscount} />
                        </div>
                        <div style={{ flex: 1, margin: "0px 4px" }}>
                            <FormInput id="resellers_mvrdiscount" label="MVR Discount" mask="currency" value={record.resellers_mvrdiscount} />
                        </div>
                        <div style={{ flex: 1, marginLeft: "4px" }}>
                            <FormInput id="resellers_cdlisdiscount" label="CDLIS Discount" mask="currency" value={record.resellers_cdlisdiscount} />
                        </div>
                    </CardRow>
                    <SectionDividerStyle>Email Addresses</SectionDividerStyle>                
                    <FormInput id="resellers_emaildrivers" label="Driver Email" mask="text" value={record.resellers_emaildrivers} readOnly tabIndex={-1} />
                    <FormInput id="resellers_emailbilling" label="Billing Email" mask="text" value={record.resellers_emailbilling} readOnly tabIndex={-1} />
                    <FormInput id="resellers_emailsupport" label="Support Email" mask="text" value={record.resellers_emailsupport} readOnly tabIndex={-1} />
                    <SectionDividerStyle>Reseller Logo</SectionDividerStyle>
                    <div style={{ width: "100%", height: "300px", border: "1px solid #808080", borderRadius: "5px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={`data:image/png;base64,${record.resellers_logo || ""}`} style={{ width: "300px" }} alt=" " />
                    </div>
                </CardForm>

            </CardScrollContent>
            <CardFooter>
                <div style={{ flex: 1 }}>
                    {(record.resellers_recordid) &&
                        <CardButton style={{ width: "90px", height: "30px" }} onClick={handleActionRequest}>
                            {record.resellers_deleted ? "Reactivate" : "Deactivate"}
                        </CardButton>
                    }
                </div>
                <div style={{ marginRight: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={() => callBack(false)}>Cancel</CardButton></div>
                <div style={{ marginLeft: "4px" }}><CardButton style={{ width: "90px", height: "30px" }} onClick={submitForm}>Save</CardButton></div>
            </CardFooter>
        </CardModal >
        {ynRequest.message && <YesNo {...ynRequest} callback={deactivateRequestResponse} />}
    </>)
}