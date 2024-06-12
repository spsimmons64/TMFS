import { useEffect } from "react";
import { useMultiFormContext } from "../../global/contexts/multiformcontext";
import { FormCheck } from "../../components/portals/inputstyles";
import styled from "styled-components";

const UlStyle = styled.ul`
padding-left: 30px;
list-style-type: circle; 
`
const LiStyle = styled.li`
margin-bottom: 10px;
`

export const AccountSetup5 = () => {
    const { handleChange, getValue, buildControlsFromRecord } = useMultiFormContext()
    const labelName = getValue("pay_paymenttype") == "cc" ? `${getValue("pay_firstname")} ${getValue("pay_lastname")}` : getValue("pay_nameonacct")
    useEffect(() => { buildControlsFromRecord({}) }, [])
    return (<>
        <div style={{ fontSize: "24px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Step 5 of 5: Confirmations And Agreements</div>
        <div>Please complete the form by agreeing to the Billing Terms and the Terms Of Service.</div>
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Billing Terms</div>
        <div style={{ display: "flex", width: "100%", margin: "0px 0px 5px 0px" }}>
            <div style={{ width: "200px", textAlign: "right" }}><b>Initial Deposit:</b></div>
            <div style={{ width: "100px", textAlign: "right" }}>{getValue("set_initialdeposit")}</div>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "200px", textAlign: "right" }}><b>Minimum Balance:</b></div>
            <div style={{ width: "100px", textAlign: "right" }}>{getValue("bil_reloadlevel")}</div>
        </div>
        <div style={{ display: "flex", width: "100%", margin: "5px 0px 0px 0px" }}>
            <div style={{ width: "200px", textAlign: "right" }}><b>Auto Deposit:</b></div>
            <div style={{ width: "100px", textAlign: "right" }}>{getValue("bil_autodeposit")}</div>
        </div>
        <div style={{ width: "100%", border: "1px dotted #BFBFBF", padding: "10px", fontSize: "14px", margin: "10px 0px", backgroundColor: "#FFFFE6" }}>
            I, {labelName}, an authorized representative of {getValue("acc_companyname")}, authorize MyDriverFiles.com,
            on behalf of TMFS Corporation, to debit the account billing profile for the Initial Deposit now and automatically
            debit the account billing profile for the Auto Deposit Amount when the account balance reaches the Minimum Balance
            as set forth above. I fully understand these automated billing terms, have no questions and am not unclear in any way.
        </div>
        <FormCheck
            id="set_billingagreement"
            label="I accept the above Billing Terms."
            checked={getValue("set_billingagreement")}
            onChange={handleChange}
        />
        <hr style={{ margin: "20px 0px 0px 0px" }} />
        <div style={{ fontSize: "18px", fontWeight: 700, padding: "10px 0px 5px 0px" }}>Terms Of Service (Important):</div>
        <div style={{ width: "100%", border: "1px dotted #BFBFBF", padding: "10px", fontSize: "14px", margin: "10px 0px", backgroundColor: "#FFFFE6" }}>
            <p>TMFS Corporation, including its web sites, MyDriversFiles.com, TMFSCorp.com, CMVDrivers.com, DriversFilesOnline.com
                (&ldquo;TMFS&rdquo;) requires that all visitors to our site(s) on the World Wide Web (the "Site") adhere to the
                following TERMS OF USE. By accessing the Site you indicate your acknowledgment and acceptance of these terms of use
                as well as attest to all warrants, representations, and obligations set forth herein. IF YOU DO NOT AGREE TO THE TERMS
                OF USE, DO NOT USE THIS SITE OR ANY OF THE SERVICES PROVIDED. BY USING THE SITE IN ANY MANNER, INCLUDING BUT NOT LIMITED
                TO BROWSING THE SITE, YOU AGREE TO BE BOUND BY THE TERMS OF USE AND THE PRIVACY STATEMENT.</p>
            <p style={{ marginTop: "10px" }}><strong>1. Laws and Regulations</strong><br />
                User access to and use of this Site are subject to all applicable international, federal, state and local laws and
                regulations (&ldquo;Laws&rdquo;). You understand and acknowledge that adherence to all applicable Laws, including
                compliance Laws, related to your operations, including meeting all filing deadlines and the accuracy and timeliness
                of the information you are inputting on the Site, is your responsibility and TMFS does not guarantee, nor is required to
                monitor or confirm, any compliance issues or the veracity of inputted related to your adherence to all applicable Laws.
            </p>
            <p style={{ marginTop: "10px" }}><strong>2. Use of this Site</strong><br />
                TMFS hereby grants you permission to use the Site as set forth in these Terms of Use ("Agreement"), provided that: (i)
                your use of the Site as permitted is solely for your internal business use; (ii) you will not copy or otherwise distribute
                any part of the Site in any medium whatsoever without TMFS&rsquo;s prior written authorization; (iii) you will not alter or
                modify any part of the Site other than as may be reasonably necessary to use the Site for its intended purpose; (iv) you
                will comply with the laws of the United States and foreign countries regarding the use of the material on the Site; and (v)
                you will otherwise comply with the terms and conditions of this Agreement. You may not use any "deep-link," "page-scrape,"
                "robot," "spider," "offline readers," or any equivalent manual process, to access or monitor any portion of the Site, or in
                any way reproduce or circumvent the structure or presentation of the Site to obtain or attempt to obtain any materials, documents
                or information through any means not purposely made available through the Site. The Site should only be considered a tool to
                assist you in your obligations to have the appropriate documentation in place pursuant to applicable Law in your discretion.
                TMFS shall accept no liability for your choice not to comply or not with the Law, whether or not the Site is utilized.
            </p>
            <p style={{ marginTop: "10px" }}><strong>3. Intellectual Property</strong><br />
                Unless otherwise indicated, the contents of this Site are the property of TMFS Corporation and are protected, without
                limitation, pursuant to United States and foreign intellectual property laws. No material from TMFS or this Site may be copied,
                reproduced, republished, modified, uploaded, posted, transmitted, or distributed in any way, except that you may download
                one copy of the materials on any single computer for your use only, provided you keep intact all copyright and other proprietary
                notices. Modification of the materials or use of the materials for any other purpose is a violation of TMFS&rsquo;s intellectual
                property rights. For purposes of this Agreement, the use of any such material on any other website or computer environment is
                prohibited without the express written consent of TMFS. The content on the Site, including without limitation, trademarks,
                copyrights, text, software, graphics, photos, music, sounds, videos, photos, text, lyrics and the like ("Content"), are owned
                by or licensed to TMFS and subject to copyright, trademark and other intellectual property laws of the United States and foreign
                countries. The Content on the Site is provided to you "AS IS" and "AS AVAILABLE" for your use only and may not be used, copied,
                reproduced, distributed, transmitted, broadcast, displayed, sold, licensed, or otherwise exploited for any other purpose whatsoever
                without the prior written consent of TMFS. TMFS reserves all rights not expressly granted in and to the Site and the Content.
            </p>
            <p style={{ marginTop: "10px" }}><strong>4. Submissions</strong><br />
                In connection with any submission you make to TMFS ("Submission"), you represent and warrant that you:
            </p>
            <UlStyle>
                <LiStyle>You have the full power, authority and legal right to engage in all the terms, warranties, and covenants contemplated
                    by this Agreement.</LiStyle>
                <LiStyle>No consent, approval or other authorization of or by any court, administrative agency or other governmental authority or
                    any other entity is required in connection with the execution, delivery or compliance with the provisions of this Agreement by
                    you that has not been delivered to TMFS.</LiStyle>
                <LiStyle>Neither the execution nor delivery of this Agreement will conflict with or result in a breach of any of the provisions of any
                    judgment, order, writ, injunction or decree of any court, administrative agency or other governmental authority, or of any
                    agreement or other instrument to which you or any of your affiliates is a party or by which any of them is bound, or constitute
                    a default under any thereof, or, to your knowledge, conflict with or result in a breach of any applicable law, rule or
                    regulation of any such governmental authority, or result in the creation or imposition of any lien, charge or encumbrance upon
                    any property of you or any of your affiliates.</LiStyle>
                <LiStyle>Will not submit any unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, profane, hateful, racially,
                    ethnically or otherwise objectionable material of any kind, including, but not limited to, any material which encourages conduct
                    that would constitute a criminal offense, give rise to civil liability or otherwise violate any applicable local, state, national
                    or international law.</LiStyle>
                <LiStyle>Will not submit multiple messages by the same user restating the same point.</LiStyle>
                <LiStyle>Will not submit chain letters of any kind.</LiStyle>
                <LiStyle>Will not submit materials with computer viruses and/or any type of code that could potentially disrupt the operation of this Site.</LiStyle>
                <LiStyle>Will not submit false, inaccurate or misleading information.</LiStyle>
                <LiStyle>Full use of the program means that you will keep active drivers on file based on your, MCS-150.</LiStyle>
                <LiStyle>Application Only use means that you pay for the limited use of the program for a fee, and that if you are a FULL use client
                    and do not keep active drivers on file TMFS has the right&nbsp;to change your subscription to include application fees
                    accordingly up to including terminating your use entirely with a return of any unused funds as delineated below.</LiStyle>
                <LiStyle>Are eighteen (18) years old or older.</LiStyle>
                <LiStyle>Accept and acknowledge any and all resulting consequences or related liabilities for any Submission or failure to submit pursuant
                    to applicable Law.</LiStyle>
            </UlStyle>
            <p style={{ marginTop: "10px" }}>TMFS assumes no liability relating to any such Submissions. You hereto hereby release, and waive all rights and defenses against TMFS,
                including each of its respective past, present and future owners, directors, officers, employees, agents, servants, representatives,
                partners, members, vendors, independent contractors, parents, subsidiaries, affiliates, insurers, predecessors and successors in
                interests, heirs and assigns from any and all legal, equitable, or other claims, counterclaims, demands, setoffs, defenses, contracts,
                accounts, suits, debts, agreements, actions, causes of action, sums of money, reckonings, bonds, bills, specialties, covenants,
                promises, variances, trespasses, damages, extents, executions, judgments, findings, controversies, and disputes of any kind or nature,
                and any past, present, or future duties, responsibilities, or obligations, whether known or unknown, fixed or contingent, which you
                ever had, now have, or hereafter can, shall, or may have for, upon, or by reason of any matter, cause, thing, conduct, act, or omission
                or against any of them from the beginning of the world to the date of the acceptance of this Agreement, including, without limitation,
                concerning, relating to, or arising from any economic damages, and the consequences thereof, which have resulted or may result from
                the alleged acts or omissions of you or TMFS with regard to the Site, use or lack of use of the Site, or compliance or lack of compliance
                with any applicable Law.</p>
            <p style={{ marginTop: "10px" }}><strong>5. Copyright Infringement Notification</strong><br />
                TMFS does not endorse or permit copyright infringing activities or any other infringement of intellectual property rights on its Site.
                TMFS will remove all Content if properly notified that such Content infringes on another&rsquo;s intellectual property rights. TMFS
                reserves the right to remove any Content without prior notice TMFS also reserves the right to decide whether any Content is appropriate
                and complies with this Agreement. TMFS may remove any Content and/or terminate a user&rsquo;s access to the Site at any time, without
                prior notice and at its sole discretion. You hereby agree to indemnify, defend, and hold harmless TMFS, and each of its affiliates,
                agents, employees, representatives, and contractors, from and against any and all claims, demands, causes of action, liabilities,
                losses, damages, costs, and expenses, including reasonable attorney&rsquo;s fees and litigation expenses, arising out of, relating to,
                or resulting from any claim by a third party alleging that any Content you submitted to the Site infringes or violates a patent,
                trademark, copyright, trade secret, or other right of such third party in the United States. If you are a copyright owner or an agent
                thereof and believe that any Content or other information infringes upon your copyrights, you may submit a notification by providing
                our Copyright Agent with the following information in writing: (i) an electronic or physical signature of the person authorized to act
                on behalf of the owner of the copyright interest; (ii) a description of the copyrighted work that you claim has been infringed; (iii)
                a description of where the material that you claim is infringing is located on the Site; (iv) your address, telephone number, and email
                address; (v) a written statement by you that you have a good faith belief that the disputed use is not authorized by the copyright
                owner, its agent, or the law; and (vi) a statement by you, made under penalty of perjury, that the above information in your notice
                is accurate and that you are the copyright owner or authorized to act on the copyright owner&rsquo;s behalf. TMFS&rsquo;s Copyright
                Agent for notice of claims of copyright infringement can be reached as follows: Copyright Agent, F Simcic at support@mydriversfiles.com.
            </p>
            <p style={{ marginTop: "10px" }}><strong>6. Disclaimer</strong><br />
                THIS SITE, INCLUDING ANY CONTENT OR OTHER INFORMATION CONTAINED WITHIN OR PROVIDED THROUGH IT, IS PROVIDED "AS IS" AND "AS AVAILABLE"
                WITH NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. YOU ASSUME TOTAL RESPONSIBILITY AND RISK FOR YOUR USE OF
                THIS SITE AND THE INFORMATION RECEIVED THROUGH IT. FURTHER, TMFS MAKES NO REPRESENTATIONS WHATSOEVER ABOUT OTHER WEBSITES WHICH YOU
                MAY ACCESS THROUGH THIS SITE. YOU USE THE SITE WILL FULL UNDERSTANDING AND ACKNOWLEDGEMENT THAT COMPLIANCE WITH ALL APPLICABLE LAWS
                IS YOUR RESPONSIBILITY ALONE AND YOU HEREBY RELEASE TMFS FROM ANY AND ALL ISSUES OR CLAIMS RELATED TO YOUR COMPLIANCE OR LACK THEREOF,
                WHETHER BASED ON AN UNSUBSTATIATED RELIANCE ON THE SITE OR TMFS. TMFS further does not warrant the quality, validity, accuracy or
                completeness of the Content or that the functions contained on the Site will be uninterrupted or error-free, or that defects or
                inaccuracies will be corrected or that the selected and/or available forms and options are all the necessary items needed by you
                pursuant to applicable Law. TMFS encourages you to seek counsel related to such compliance to avoid penalties, loss of license(s),
                third-party claims, or other issues pursuant to applicable Law. TMFS may make changes to the Site at any time without notice. The
                Materials on the Site may be out of date, and TMFS makes no commitment to update the Materials at this Site or to make any notification
                of changes. Information published at this Site may refer to products, programs or services that are not available.
            </p>
            <p style={{ marginTop: "10px" }}><strong>7. LIMITATION OF LIABILITY</strong><br />
                TMFS AND ITS MEMBERS, DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS AND ITS AFFILIATES AND ITS SPONSORS ARE NEITHER RESPONSIBLE NOR
                LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, PUNITIVE OR OTHER DAMAGES ARISING OUT OF OR RELATING
                IN ANY WAY TO THE SITE OR ANY INFORMATION RECEIVED FROM THE SITE, INCLUDING THE CONTENT OR ANY INFORMATION CONTAINED WITHIN OR THROUGH
                THE SITE OR ANY ISSUES RELATED TO COMPLIANCE WITH APPLICABLE LAW. YOUR SOLE REMEDY FOR DISSATISFACTION WITH THE SITE IS TO STOP USING
                THE SITE AND THE INFORMATION OBTAINED THEREIN.
            </p>
            <p style={{ marginTop: "10px" }}><strong>8. Indemnity</strong></p>
            <UlStyle>
                <LiStyle>You shall defend, indemnify, and hold harmless TMFS and each of TMFS&rsquo;s Affiliates, and their respective officers,
                    directors, employees, agents, permitted successors, and permitted assigns from and against any and all losses, damages,
                    liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of&nbsp;whatever kind, including attorneys&rsquo; fees, the cost of enforcing any right to indemnification hereunder the cost of pursuing any insurance, and those related to civil, criminal, quasi-judicial, and regulatory matters (&ldquo;Losses&rdquo;) incurred by TMFS to the extent that such Losses arise or are alleged to arise out of any claim, demand, suit, action, or proceeding or threat thereof resulting from your: (i) use of the Site; (ii) breach of any representation, warranty, covenant, or obligation of you under this Agreement; (iii) failure to abide by any applicable Law, including to maintain lawful licensing, insurance, and updated compliance paperwork; (iv) any bodily or personal injury (including death) to any person, or damage to any tangible property resulting from the negligence or more culpable conduct of you; or (v) any willful misconduct, gross negligence, or culpable negligence.</LiStyle>
                <LiStyle>The provisions of this section shall survive the expiration or termination of this Agreement with respect to any claim, loss,
                    liability, cost, or expense, whenever incurred or asserted, arising out of any act, omission, condition, or event that preceded
                    such expiration or termination.</LiStyle>
                <LiStyle>TMFS shall promptly notify you in writing of any claim, suit, action or proceeding for which it seeks indemnification pursuant
                    to this section and cooperate with you at your sole cost and expense. You shall immediately take control of the defense and
                    investigation of such claim, suit, action, or proceeding and shall employ counsel of its choice (that does not pose a conflict
                    of interest with respect to TMFS) to handle and defend the same, at your sole cost and expense. You shall not settle any claim,
                    suit, action, or proceeding on any terms or in any manner that adversely affects the rights of TMFS without TMFS&rsquo;s prior
                    written consent, which shall not be unreasonably withheld or delayed. TMFS may participate in and observe the proceedings at its
                    own cost and expense with counsel of its own choice.</LiStyle>
                <LiStyle>This indemnification obligation will survive the term of this Agreement and your use of the Site.</LiStyle>
            </UlStyle>
            <p style={{ marginTop: "10px" }}><strong>9. Links to Other Websites</strong><br />
                Links to third party websites from this Site may be provided solely as a convenience to you. TMFS may not review all of these sites
                or their content and has no discretion to alter, update, or control the content on a linked website. Thus, TMFS does not endorse or
                make any representations about any linked website, or any information, software or other products or materials found there, or any
                results that may be obtained from using them. If you decide to access any of the third party websites linked to this Site, you do so
                entirely at your own risk, and you accept the Terms of Service of that Site by accepting the terms, obligations, representations,
                and warrants of this Agreement.
            </p>
            <p style={{ marginTop: "10px" }}><strong>10. Non-Confidential Materials</strong><br />
                TMFS does not want to receive any confidential information from you through this Site. Any Submissions or other information you
                transmit or post to this Site or send via e-mail to CMVDR TMFS will be considered non-confidential in compliance with applicable Law.
                TMFS will have no obligations with respect to your Submissions or any information that you send to TMFS to maintain any level of
                confidentiality in compliance with applicable Law. TMFS and its designees will be free to copy, disclose, distribute, incorporate and
                otherwise use the Submissions and all other information that you send to TMFS for any and all commercial or non-commercial purposes
                in compliance with applicable Law.
            </p>
            <p style={{ marginTop: "10px" }}><strong>11. Access to Password Protected/Secure Areas</strong><br />
                Access to and use of password protected and/or secure areas of this site are restricted to authorized users only. Unauthorized
                individuals attempting to access areas of the site may be subject to prosecution.
            </p>
            <p style={{ marginTop: "10px" }}><strong>12. Applicable and Governing Law and Jurisdiction</strong><br />
                This Site is controlled and operated by TMFS from Tampa, Florida, United States of America. Although the Site is accessible worldwide,
                not all features or services offered through the Site are available to all persons or in all geographic locations, or appropriate or
                available for use outside the United States. TMFS and this Site make no representation that materials on this Site are appropriate
                or available for use in other locations. Those who choose to access this Site from other locations do so at their own initiative and
                are responsible for compliance with local laws, if and to the extent local laws are applicable. Any issues related to the Site will
                be governed by and construed in accordance with the internal laws of the State of Florida without giving effect to any choice or
                conflict of law provision or rule that would require or permit the application of the laws of any jurisdiction other than those of
                the State of Florida. Any legal suit, action, or proceeding arising out of or related to the Site shall be instituted exclusively in
                the federal courts of the United States or the courts of the State of Florida in each case located in the city of Tampa, and each
                Party irrevocably submits to the exclusive jurisdiction of such courts in any such suit, action, or proceeding. Service of process,
                summons, notice, or other document by mail to such Party&rsquo;s address set forth herein shall be effective service of process for
                any suit, action, or other proceeding brought in any such court.
            </p>
            <p style={{ marginTop: "10px" }}><strong>13.Cancellation, Lack of Use, and Refund Policy</strong><br />
                You may cancel at any time by logging into your account and cancelling your subscription. No refunds are given on cancellation of
                service for monthly fees due for the current month. Service will run to the end of scheduled prepaid duration with the limitation
                that no additional product orders will be allowed, at which time the service will be turned off. Credits that may be on your account
                and had been paid by you, at the time of your cancellation will be returned to you less the current monthly fees by check within seven
                (7) days after cancellation (Monthly fees are calculated in arrears). You have the ongoing obligation to keep contact information
                current. Failure to do so permits TMFS to submit any refunds to the State of Florida. If your account has been inactive for a period
                of six (6) months or more, TMFS reserves the right to begin charging a monthly storage fee of $5.00 per month and you acknowledge
                such obligation. If there is not enough funds to cover the monthly fee, the account will be terminated immediately.
            </p>
            <p style={{ marginTop: "10px" }}><strong>14. General</strong><br />
                This Agreement represents the entire agreement relating to the use of this Site. TMFS&rsquo;s failure to enforce any right or provision
                of this Agreement does not constitute a waiver of that right or provision. TMFS may at any time revise this Agreement by updating this
                posting. You are bound by any such revisions and should therefore periodically visit this page to review the then current Agreement to
                which you are bound. Please review our Privacy Statement, posted on this Site. TMFS may at any time revise its Privacy Statement. TMFS
                may, in its sole discretion and without prior notice, terminate or suspend your access to all or part of the Site for any reason,
                including, without limitation, breach of this Agreement. If any provision of this Agreement shall be deemed unenforceable or invalid
                then that provision shall be deemed severable from the remaining terms and those remaining terms shall be valid and enforceable to the
                fullest extent permitted by law. For the avoidance of doubt, nothing in these terms shall confer on any third party any benefit or the
                right to enforce this Agreement. Each party further agrees to pay all costs and expenses, including reasonable attorney&rsquo;s fees,
                which may be incurred by the other party in enforcing any of the covenants and agreements of the other party under this Agreement.
            </p>
        </div>
        <div style={{ margin: "10px 0px" }}>
            <FormCheck
                id="set_tosagreement"
                label="I accept the above Terms Of Service."
                checked={getValue("set_tosagreement")}
                onChange={handleChange}
            />
        </div>
    </>)
}