import { useState, useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { countryTypes, statesArray, yesNoTypes } from "../../global/staticdata";
import { FormDate, FormInput, FormSelect, FormText } from "../../components/portals/inputstyles";
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles";
import { Experience } from "./experience";
import { FormButton } from "../../components/portals/buttonstyle";
import { SignatureForm } from "../../classes/signatureform";
import { AddressGrid } from "./address/addressgrid";
import { LicenseGrid } from "./licenses/licensegrid";
import { ViolationsGrid } from "./violations/voilationsgrid";
import { AccidentsGrid } from "./accidents/accidentsgrid";
import { EmployersGrid } from "./employers/employersgrid";
import { useButtonContext } from "./buttoncontext";
import { calcDaysBetweenDates, calcYearsBetweenDates, toSimpleDate } from "../../global/globals";

export const SetupPage4 = ({ gapTrack, setGapTrack }) => {
    const { setNextDisable, setNextVisible, setPrevVisible } = useButtonContext()
    const { handleChange, setValue, getValue, getError, setFormErrors, buildControlsFromRecord, formControls } = useMultiFormContext()
    const [sigLookup, setSigLookup] = useState(false)
    const [signature, setSignature] = useState({})
    const [driverAge, setDriverAge] = useState(0)

    const calibrateGapTrack = () => {
        let newGapList = []
        const oneDay = 86400000;
        const gapLimit = 30
        const today = toSimpleDate(new Date())
        const newList = [...getValue("drv_employers")]
        newList.forEach((r, ndx) => {
            const newNdx = (ndx + 1) < (newList.length) ? ndx + 1 : false
            const startDate = r.emp_dateto
            const endDate = newNdx ? newList[newNdx].emp_datefrom : today
            if (calcDaysBetweenDates(startDate, endDate) > gapLimit) {
                if (newList[newNdx]) {
                    newGapList.push({ ndx: newNdx, error: false })
                } else {
                    newGapList.push({ ndx: ndx, error: false })
                }
            }
        })
        setGapTrack(newGapList)
    }

    const handleValidate = () => {
        var errors = {}
        const exp_list = ["strtrk", "trktrc", "semtrl", "dbltrp", "flatbed", "bus", "other"]
        if (!getValue("drv_firstname")) errors["drv_firstname"] = "First Name is Required!"
        if (!getValue("drv_lastname")) errors["drv_lastname"] = "Last Name Is Required!"
        if (!getValue("drv_birthdate")) errors["drv_birthdate"] = "Birthdate Is Required!"
        if (!getValue("drv_telephone1")) errors["drv_telephone1"] = "Main Telephone Is Required!"
        if (!getValue("drv_city")) errors["drv_city"] = "City Is Required!"
        if (!getValue("drv_zipcode")) errors["drv_zipcode"] = "Zip Code Is Required!"
        if (!getValue("drv_emailaddress")) errors["drv_emailaddress"] = "Email Address Is Required!"
        if (!getValue("drv_emailaddress")) errors["drv_emailaddress"] = "Email Address Is Required!"
        if (!getValue("dat_medcardexpires") && !getValue("drv_medcardna")) errors["dat_medcardexpires"] = "Medical Certificate Expiration Date Is Required!"
        if (getValue("exp_bus") == "N" &&
            getValue("exp_dbltrp") == "N" &&
            getValue("exp_flatbed") == "N" &&
            getValue("exp_other") == "N" &&
            getValue("exp_strtrk") == "N" &&
            getValue("exp_trktrc") == "N" &&
            getValue("exp_semtrl") == "N"
        ) errors["experience"] = true
        if (getValue("exp_other") == "Y" && !getValue("exp_othernotes")) errors["exp_othernotes"] = "Please List The Equipment You Have Experience With"
        if (getValue("drv_licenses").length == 0) errors["drv_licenses"] = "Please Enter At Least One Driver's License!"
        exp_list.forEach(r => {
            if (formControls[`exp_${r}`] == "Y") {
                if (!formControls[`exp_${r}from`]) errors[`exp_${r}from`] = "Date From Is Required!"
                if (!formControls[`exp_${r}to`]) errors[`exp_${r}to`] = "Date To Is Required!"
                if (!formControls[`exp_${r}miles`]) errors[`exp_${r}miles`] = "Approximate Miles Is Required!"
            }
        });
        if (getValue("drv_beendenied") == "Y" || getValue("drv_beenrevoked") == "Y")
            if (!getValue("drv_forfeituredetails")) errors["drv_forfeituredetails"] = "Forfeiture Circumstatnces Is Required!"
        return (errors)
    }

    const checkForSignature = () => {
        const rec = getValue("drv_signatures").find(r => r.sig_typecode == "11")
        console.log(rec)
        setSignature(rec || {})
        setNextDisable(rec ? false : true)
    }

    const signatureCallBack = (sig_rec) => {        
        if (sig_rec){
            setValue("drv_esignature", sig_rec)                
            let newList = [...getValue("drv_signatures")]
            let new_rec = {
                sig_typecode: "11",
                sig_esignatureid: sig_rec["recordid"],
                sig_esignaturedate: toSimpleDate(new Date())
            }
            newList.push(new_rec)            
            setValue("drv_signatures", newList)
        }
        setSigLookup(false)
    }

    useEffect(() => checkForSignature(), [getValue("drv_signatures")])

    useEffect(() => calibrateGapTrack(), [getValue("drv_employers")])

    useEffect(() => {
        const today = toSimpleDate(new Date())
        setDriverAge(calcYearsBetweenDates(getValue("drv_birthdate"), today))
    }, [getValue("drv_birthdate")])

    useEffect(() => {
        const sta_rec = statesArray.find(r => r.default)
        const cty_rec = countryTypes.find(r => r.default)
        buildControlsFromRecord({})
        setValue("drv_state", getValue("drv_state") || sta_rec.value || "")
        setValue("drv_country", getValue("drv_country") || cty_rec.value || "")
        setNextVisible(true)
        setPrevVisible(false)
        checkForSignature()
    }, [])

    console.log(getValue("drv_esignature"))

    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 0px 0px" }} id="scrollback">Application For Employment</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please Enter Your Personal Information Below. </b></div>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>First Name</FormTopLabel>
                <FormInput
                    id="drv_firstname"
                    mask="text"
                    value={getValue("drv_firstname")}
                    error={getError("drv_firstname")}
                    onChange={handleChange}
                    autoFocus
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Middle Name</FormTopLabel>
                <FormInput
                    id="drv_middlename"
                    mask="text"
                    value={getValue("drv_middlename")}
                    error={getError("drv_middlename")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Last Name</FormTopLabel>
                <FormInput
                    id="drv_lastname"
                    mask="text"
                    value={getValue("drv_lastname")}
                    error={getError("drv_lastname")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "100px" }}>
                <FormTopLabel>Suffix</FormTopLabel>
                <FormInput
                    id="drv_suffix"
                    mask="text"
                    value={getValue("drv_suffix")}
                    error={getError("drv_suffix")}
                    disabled={getValue("esignatureid") != ""}
                    onChange={handleChange}
                />
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Date Of Birth (Month/Day/Year)</FormTopLabel>
                <FormDate
                    id="drv_birthdate"
                    value={getValue("drv_birthdate") || ""}
                    error={getError("drv_birthdate")}
                    onChange={handleChange}
                    readOnly = {signature.sig_esignaturedate}
                    placeholder="MM/DD/YYYY"
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Social Security Number</FormTopLabel>
                <FormInput
                    id="drv_socialsecurity"
                    mask="ssn"
                    value={getValue("drv_socialsecurity")}
                    error={getError("drv_socialsecurity")}
                    onChange={handleChange}
                    placeholder="XXX-XX-XXXX"
                    readOnly
                />
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Main Telephone</FormTopLabel>
                <FormInput
                    id="drv_telephone1"
                    mask="telephone"
                    value={getValue("drv_telephone1")}
                    error={getError("drv_telephone1")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Alternate Telephone</FormTopLabel>
                <FormInput
                    id="drv_telephone2"
                    mask="telephone"
                    value={getValue("drv_telephone2")}
                    error={getError("drv_telephone2")}
                    onChange={handleChange}
                />
            </div>
        </FormFlexRowStyle>
        <FormTopLabel>Email Address</FormTopLabel>
        <FormInput
            id="drv_emailaddress"
            mask="text"
            value={getValue("drv_emailaddress")}
            error={getError("drv_emailaddress")}
            onChange={handleChange}
        />
        <FormTopLabel>Street Address</FormTopLabel>
        <FormInput
            id="drv_address"
            mask="text"
            value={getValue("drv_address")}
            error={getError("drv_address")}
            onChange={handleChange}
        />
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>City</FormTopLabel>
                <FormInput
                    id="drv_city"
                    mask="text"
                    value={getValue("drv_city")}
                    error={getError("drv_city")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "200px" }}>
                <FormTopLabel>State</FormTopLabel>
                <FormSelect
                    id="drv_state"
                    options={statesArray}
                    value={getValue("drv_state")}
                    error={getError("drv_state")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ width: "200px" }}>
                <FormTopLabel>Zip Code</FormTopLabel>
                <FormInput
                    id="drv_zipcode"
                    mask="text"
                    value={getValue("drv_zipcode")}
                    error={getError("drv_zipcode")}
                    onChange={handleChange}
                />            </div>
        </FormFlexRowStyle>
        <FormTopLabel>Country</FormTopLabel>
        <FormSelect
            id="drv_country"
            options={countryTypes}
            value={getValue("drv_country")}
            error={getError("drv_country")}
            onChange={handleChange}
        />
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Do you have a TWIC Card?</FormTopLabel>
                <FormSelect
                    id="drv_hastwic"
                    options={yesNoTypes}
                    value={getValue("drv_hastwic")}
                    error={getError("drv_hastwic")}
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Do You Have A Passport?</FormTopLabel>
                <FormSelect
                    id="drv_haspassport"
                    options={yesNoTypes}
                    value={getValue("drv_haspassport")}
                    error={getError("drv_haspassport")}
                    onChange={handleChange}
                />
            </div>
        </FormFlexRowStyle>
        <hr />
        <AddressGrid />
        <hr />
        <LicenseGrid />
        <hr />
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Medical Certificate</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please Enter Your Medical Certificate Information Below. </b></div>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Medical Certificate Expire Date (Month/Day/Year)</FormTopLabel>
                <FormDate
                    id="dat_medcardexpires"
                    value={getValue("dat_medcardexpires") || ""}
                    error={getError("dat_medcardexpires")}
                    onChange={handleChange}
                />
            </div>
        </FormFlexRowStyle>
        <hr />
        <Experience />
        <hr style={{ marginTop: "15px" }} />
        <AccidentsGrid />
        <hr />
        <ViolationsGrid />
        <hr />
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Forfeitures</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Indicate driver's license denials or suspensions in the last 3 years.</b></div>
        <FormFlexRowStyle>
            <div style={{ width: "80px" }}>
                <FormSelect
                    id="drv_beendenied"
                    options={yesNoTypes}
                    value={getValue("drv_beendenied")}
                    error={getError("drv_beendenied")}
                    hideerror
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1, padding: "0px 0px 0px 0px" }}>
                <FormTopLabel>Have you ever been denied a license, permit or privilege to operate a motor vehicle in the last 3 years?</FormTopLabel>
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle style={{ margin: "10px 0px" }}>
            <div style={{ width: "80px" }}>
                <FormSelect
                    id="drv_beenrevoked"
                    options={yesNoTypes}
                    value={getValue("drv_beenrevoked")}
                    error={getError("drv_beenrevoked")}
                    hideerror
                    onChange={handleChange}
                />
            </div>
            <div style={{ flex: 1, padding: "0px 0px 0px 0px" }}>
                <FormTopLabel>Has any license, permit or privilege ever been suspended or revoked in the last 3 years?</FormTopLabel>
            </div>
        </FormFlexRowStyle>
        <FormTopLabel>If Yes To Any Answer Above, Enter The Circumstances</FormTopLabel>
        <FormText
            id="drv_forfeituredetails"
            value={getValue("drv_forfeituredetails")}
            error={getError("drv_forfeituredetails")}
            disabled={getValue("drv_beendenied"=="Y") || getValue("drv_beenrevoked"=="Y")}
            onChange={handleChange}
        />
        <hr />
        <EmployersGrid gapTrack={gapTrack} setGapTrack={setGapTrack} />
        <hr />
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Fair Credit Reporting Act</div>
        <div style={{ padding: "5px 0px 20px 0px" }}>
            Pursuant to the federal Fair Credit Reporting Act, I hereby authorize this company and its designated
            agents and representatives to conduct a comprehensive review of my background through any consumer report
            for employment. I understand that the scope of the consumer report/investigative consumer report may include,
            but is not limited to, the following areas: verification of Social Security number; current and previous
            residences; employment history, including all personnel files; education; references; credit history and
            reports; criminal history, including records from any criminal justice agency in any or all federal, state
            or county jurisdictions; birth records; motor vehicle records, including traffic citations and registration;
            and any other public records.
        </div>
        <hr />
        <div style={{ padding: "15px 0px", fontWeight: 700,color:"#0A21C0"  }}>
            This certifies that this application was completed by me, and that all entries on it and information in it
            are true and complete to the best of my knowledge. <u>Please double check your entries as some items cannot be
            changed once the application is signed.</u>
        </div>
        <FormFlexRowStyle>
            <div style={{ flex: 1 }}>
                <FormTopLabel>Applicant Signature</FormTopLabel>
                <div style={{ width: "100%", height: "35px", border: "1px dotted #B6B6B6", backgroundColor: "#E9E9E9", borderRadius: "5px", marginBottom: "20px" }}>
                    {signature.sig_esignaturedate && <img src={`data:image/png;base64,${getValue("drv_esignature").esignature}`} style={{ height: "33px" }} alt=" " />}
                </div>
            </div>
            <div style={{ width: "200px" }}>
                <FormTopLabel>Date Signed</FormTopLabel>
                <FormDate
                    id="esignaturedate"
                    style={{ textAlign: "center" }}
                    value={signature.sig_esignaturedate || ""}
                    tabIndex={-1}
                    readOnly
                    data-ignore
                />
            </div>
        </FormFlexRowStyle>
        <FormFlexRowStyle>
            <div>
                <FormButton
                    id="new-employment-button"
                    data-ignore style={{ marginBottom: "10px" }}
                    disabled={signature.sig_esignaturedate || driverAge < 18}
                    onClick={() => setSigLookup(true)}
                >Sign My Application
                </FormButton>
            </div>
            {driverAge < 18 && <div style={{ color: "#FF6666", fontWeight: 700,paddingBottom:"7px" }}>You Must Be 18 Years Or Older To Sign This Application.</div>}
        </FormFlexRowStyle>
        <div style={{ margin: "5px 0px" }}></div>
        {sigLookup &&
            <SignatureForm
                doctype={{
                    document: "Application For Employment",
                    docdesc: "This document is a DOT compliant Application For Employment.",
                    signature: "Applicant Signature",
                    sigdesc: "The signature of the applicant confirming submission of the Application For Employment.",
                }}
                callback={signatureCallBack}
                esignature={getValue("drv_esignature")}
                entity="driver"
                resourceid={getValue("drv_recordid")}
            />
        }
    </>)
}