import styled from "styled-components"
import { FormFlexRowStyle, FormTopLabel } from "../../components/portals/formstyles"
import { FormDate, FormInput, FormSelect, FormText } from "../../components/portals/inputstyles"
import { yesNoTypes } from "../../global/staticdata"
import { useMultiFormContext } from "../../global/contexts/multiformcontext"



export const ExperienceBoxStyle = styled.fieldset`
width: 100%;
border: 1px dotted #B6B6B6;
padding: 5px 10px;
border-radius: 4px;
margin-bottom: 5px;
`
export const ExperienceLabelStyle = styled.legend`
font-size:18px;
font-weight: bold;
`
export const Experience = () => {
    const { getValue, getError, handleChange } = useMultiFormContext("")
    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Experience</div>
        <div style={{ margin: "5px 0px 20px 0px", color: "#0A21C0" }}><b>Please select at least one Experience Category.</b></div>
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Straight Truck</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width: "100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_strtrk"
                        options={yesNoTypes}
                        value={getValue("exp_strtrk")}
                        error={getError("exp_strtrk")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_strtrkfrom"}
                        value={getValue("exp_strtrkfrom")}
                        error={getError("exp_strtrkfrom")}
                        disabled={getValue("exp_strtrk") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_strtrkto"}
                        value={getValue("exp_strtrkto")}
                        error={getError("exp_strtrkto")}
                        disabled={getValue("exp_strtrk") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_strtrkmiles"}
                        value={getValue("exp_strtrkmiles")}
                        error={getError("exp_strtrkmiles")}
                        disabled={getValue("exp_strtrk") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Truck-Tractor</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width: "100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_trktrc"
                        options={yesNoTypes}
                        value={getValue("exp_trktrc")}
                        error={getError("exp_trktrc")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_trktrcfrom"}
                        value={getValue("exp_trktrcfrom")}
                        error={getError("exp_trktrcfrom")}
                        disabled={getValue("exp_trktrc") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_trktrcto"}
                        value={getValue("exp_trktrcto")}
                        error={getError("exp_trktrcto")}
                        disabled={getValue("exp_trktrc") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_trktrcmiles"}
                        value={getValue("exp_trktrcmiles")}
                        error={getError("exp_trktrcmiles")}
                        disabled={getValue("exp_trktrc") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Semi-Trailers</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width: "100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_semtrl"
                        options={yesNoTypes}
                        value={getValue("exp_semtrl")}
                        error={getError("exp_semtrl")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_semtrlfrom"}
                        value={getValue("exp_semtrlfrom")}
                        error={getError("exp_semtrlfrom")}
                        disabled={getValue("exp_semtrl") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_semtrlto"}
                        value={getValue("exp_semtrlto")}
                        error={getError("exp_semtrlto")}
                        disabled={getValue("exp_semtrl") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_semtrlmiles"}
                        value={getValue("exp_semtrlmiles")}
                        error={getError("exp_semtrlmiles")}
                        disabled={getValue("exp_semtrl") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Double / Triples</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width:"100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_dbltrp"
                        options={yesNoTypes}
                        value={getValue("exp_dbltrp")}
                        error={getError("exp_dbltrp")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_dbltrpfrom"}
                        value={getValue("exp_dbltrpfrom")}
                        error={getError("exp_dbltrpfrom")}
                        disabled={getValue("exp_dbltrp") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_dbltrpto"}
                        value={getValue("exp_dbltrpto")}
                        error={getError("exp_dbltrpto")}
                        disabled={getValue("exp_dbltrp") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_dbltrpmiles"}
                        value={getValue("exp_dbltrpmiles")}
                        error={getError("exp_dbltrpmiles")}
                        disabled={getValue("exp_dbltrp") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Flatbed</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width:"100px" }}> 
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_flatbed"
                        options={yesNoTypes}
                        value={getValue("exp_flatbed")}
                        error={getError("exp_flatbed")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_flatbedfrom"}
                        value={getValue("exp_flatbedfrom")}
                        error={getError("exp_flatbedfrom")}
                        disabled={getValue("exp_flatbed") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_flatbedto"}
                        value={getValue("exp_flatbedto")}
                        error={getError("exp_flatbedto")}
                        disabled={getValue("exp_flatbed") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_flatbedmiles"}
                        value={getValue("exp_flatbedmiles")}
                        error={getError("exp_flatbedmiles")}
                        disabled={getValue("exp_flatbed") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Bus</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width:"100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_bus"
                        options={yesNoTypes}
                        value={getValue("exp_bus")}
                        error={getError("exp_bus")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_busfrom"}
                        value={getValue("exp_busfrom")}
                        error={getError("exp_busfrom")}
                        disabled={getValue("exp_bus") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_busto"}
                        value={getValue("exp_busto")}
                        error={getError("exp_busto")}
                        disabled={getValue("exp_bus") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_busmiles"}
                        value={getValue("exp_busmiles")}
                        error={getError("exp_busmiles")}
                        disabled={getValue("exp_bus") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
        </ExperienceBoxStyle >
        <ExperienceBoxStyle>
            <ExperienceLabelStyle>Other</ExperienceLabelStyle>
            <FormFlexRowStyle>
                <div style={{ width:"100px" }}>
                    <FormTopLabel>Experience</FormTopLabel>
                    <FormSelect
                        id="exp_other"
                        options={yesNoTypes}
                        value={getValue("exp_other")}
                        error={getError("exp_other")}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date From (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_otherfrom"}
                        value={getValue("exp_otherfrom")}
                        error={getError("exp_otherfrom")}
                        disabled={getValue("exp_other") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Date To (Month/Day/Year)</FormTopLabel>
                    <FormDate
                        id={"exp_otherto"}
                        value={getValue("exp_otherto")}
                        error={getError("exp_otherto")}
                        disabled={getValue("exp_other") == "N"}
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormTopLabel>Approximate Miles</FormTopLabel>
                    <FormInput
                        mask="text"
                        id={"exp_othermiles"}
                        value={getValue("exp_othermiles")}
                        error={getError("exp_othermiles")}
                        disabled={getValue("exp_other") == "N"}
                        onChange={handleChange}
                    />
                </div>
            </FormFlexRowStyle>
            {getValue("exp_other") == "Y" && <>
                <FormTopLabel>Please List Equipment</FormTopLabel>
                <FormText
                    id={"exp_othernotes"}
                    value={getValue("exp_othernotes")}
                    error={getError("exp_othernotes")}
                    onChange={handleChange}
                />
            </>}
            {getError("exp_experience") &&
                <div style={{ width: "100%", height: "36px", color: "#FF6666" }}>
                    <span style={{ fontWeight: 700, fontSize: "24px" }}>Please Select At Least One Experience Category</span>
                </div>
            }
        </ExperienceBoxStyle >
    </>)
}