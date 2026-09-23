---
id: eula
title: "Terms of Use"
sidebar_label: "EULA"
sidebar_position: 90
description: "Terms of Use for Origo BC Bifröst and the related Origo BC Agentic Platform."
---

# Terms of Use — Origo BC Bifröst

These Terms of Use (the “Terms”) govern access to and use of Origo BC Bifröst and the related Origo BC Agentic Platform (together, the “Service”), provided by Origo ehf., company registration number 450723-1690, Dalvegur 30a, 201 Kópavogur, Iceland (“Origo”), to business customers.

By accessing or using the Service, by enabling it for a Business Central environment, or by clicking to accept, the customer (the “Customer”) agrees to these Terms. If the person accepting does so on behalf of an organisation, that person represents that they are authorised to bind the organisation, and “Customer” means that organisation.

The Service is intended for business use only and is not offered to consumers.

These Terms refer to Origo and the Customer as the “Parties“, as applicable.

## 1. Definitions

“Business Central” means the Microsoft Dynamics 365 Business Central environment used by the Customer, whether operated by the Customer, by Origo or by a third party.

“Bifröst” means Origo’s dynamic service layer that exposes Business Central data and operations through a single API and the Model Context Protocol (MCP) interface.

“Consumer Application” means any application or agent (including any AI Agent, utilizing large language model or other generative AI technology) integration, script or system that the Customer connects or causes or permits to be connected to the Service to retrieve data from, or perform operations through, the Service (for example an LLM agent, a web store, a portal or a data-warehouse connector).

“Authorised User” means an individual or a service identity that the Customer permits to access the Service under the Customer’s credentials or identity.

“Customer Data” means data belonging to or supplied by the Customer that is accessed, transmitted or processed through the Service, including data held in Business Central.

“Service Data” means operational and technical data that Origo processes to provide, secure and administer the Service, including authentication and licensing/entitlement data and a hashed identifier derived from the Customer’s Business Central tenant.

“Bifröst Transactions” means the unit in which the Customer’s usage allowance for the Service is measured and allocated, and which the Customer purchases under the applicable Commercial Terms.

“Commercial Terms” means the separate order form, price list or commercial agreement under which the Customer purchases Bifröst Transactions and any related services from Origo or Origo’s reseller.

“Skills and Artifacts” means the rules, instructions, configurations, dashboards and other artefacts created by or for the Customer through use of the Service.

“Documentation” means the operation descriptions, parameter definitions and usage guidance published by Origo for the Service.

## 2. The Service

Origo makes the Service available to the Customer to allow Authorised Users and Consumer Applications to read Business Central data and perform operations in Business Central through a standardised interface. The Service operates on a consumer-pull model: the Consumer Application requests the data and operations it requires, at its own pace and volume.

The Service is a technical conduit. Origo does not originate, control or verify the content of the requests made through the Service, the instructions given by Authorised Users or Consumer Applications, or the resulting changes made within Business Central. Such requests and instructions are made by, and under the responsibility of, the Customer.

The Service is provided on an “as is” and “as available” basis. These Terms do not themselves set out any service-level commitment, availability guarantee, support obligation, pricing or payment terms; the purchase of Bifröst Transactions and any related fees are governed by separate Commercial Terms.

## 3. Access, authentication and permissions — Customer responsibility

Access to the Service is authenticated against the Customer’s identity provider (Microsoft Entra ID). The Service acts under the identity and permissions of the Authorised Users or service identity that invokes it. The Service inherits the access rights that identity already holds in Business Central and does not grant any rights beyond them.

The Customer is solely responsible for the design, configuration, granting, review and revocation of access rights, roles and permissions within Business Central, Entra ID and any Consumer Application, and for applying the principle of least privilege. Origo does not set, expand, verify or police the Customer’s permission configuration.

The Customer acknowledges and agrees that:

- any action that an Authorised User, a Consumer Application (including any AI agent) acting under the Customer’s credentials is able to perform through the Service is an action that the Customer’s own permission configuration permitted;
- Origo is not responsible or liable for any consequence arising from access rights that are too broad, incorrectly configured, insufficiently restricted or not revoked in time, including any data disclosure, data change, deletion or transaction resulting from such configuration; including where such access rights are exercised by an unauthorised third party who has obtained a Customer’s credentials or identity, and
- the Customer is responsible for securing its credentials, identities and Consumer Applications, and for all activity carried out under them.

Where an operation may have significant or irreversible effect, the Customer is responsible for deciding whether to require confirmation or an approval step before that operation is executed, and for configuring such controls.

## 4. Artificial intelligence and automated actions

The Service may be used together with large language models and other AI systems. The Customer understands that outputs generated by such systems may be inaccurate, incomplete or unsuitable for a given purpose, and that AI systems may act on instructions in ways the Customer did not intend.

All operations performed through the Service, including those initiated or suggested by an AI system, are performed at the Customer’s direction and risk. The Customer is responsible for reviewing, validating and supervising the outputs and actions of any Consumer Application or AI system it uses with the Service. Origo does not warrant the accuracy, correctness or fitness of any AI-generated output or automated action.

Where the Customer’s use of an AI Agent or other AI system in connection with the Service constitutes the placing on the market, putting into service, or use of an “AI system” as defined in Regulation (EU) 2024/1689 (the “AI Act”), the Customer is solely responsible for correctly classifying that AI system (including its risk category) and for complying with all applicable obligations under the AI Act. The Service itself, does not constitute an AI system for the purposes of the AI Act.

## 5. Acceptable use

The Customer shall use the Service only for its lawful internal business purposes and in accordance with these Terms and the Documentation. The Customer shall not, and shall not permit any Authorised User or Consumer Application to:

- use the Service in breach of applicable law or the rights of any third party;
- attempt to access data or operations beyond the permissions held by the invoking identity, or circumvent or interfere with authentication, tenant isolation, logging or any security measure;
- place an unreasonable or disproportionate load on the Service, exceed or attempt to circumvent the usage allowance, or use it in a manner that impairs its integrity, security or performance for Origo or other customers;
- reverse engineer, decompile or attempt to derive the source code, structure or underlying models of the Service, except to the extent this restriction is prohibited by mandatory law;
- copy, resell, sublicense or make the Service available to third parties except as expressly permitted; or
- introduce malicious code, or use the Service to develop a competing service.

## 6. Customer responsibilities

The Customer is responsible for: (a) holding, paying for and maintaining valid Microsoft Dynamics 365 Business Central licences and any other third-party licences (including Microsoft Azure and any third party AI or language-model provider used with the Service) required for its use of the Service, and for the consequences of any lapse, suspension or restriction of such licenses; (b) the lawfulness, accuracy and quality of Customer Data and of the instructions given through the Service; (c) managing its Authorised Users, Consumer Applications and their configurations; and (d) the content and effect of the Skills and Artifacts it creates or deploys.

## 7. Third-party services and dependencies

The Service relies on and interoperates with third-party products and services, including Microsoft Dynamics 365 Business Central, Microsoft Azure and third-party AI or language-model providers. Use of those products is subject to the relevant third party’s own terms, and the Customer is responsible for complying with them. Origo is not responsible or liable for the availability, performance, acts or omissions of any third-party product or service, for any fees charged by a third party, or for changes a third party makes to it.

## 8. Data protection

Each party shall comply with applicable data-protection law, including Icelandic Data Protection Act No 90/2018 and Regulation (EU) 2016/679 (GDPR). To the extent Origo processes personal data on behalf of the Customer through the Service, Origo acts as processor and the Customer as controller. Origo‘s Terms on the Processing of Personal data and accompanying Data Processing Descriptions, published or provided by Origo, shall govern Origo‘s processing of data on the Customer‘s behalf.  By agreeing to these Terms, the Customer also accepts Origo’s Terms on the Processing of Personal Data.

Origo does not use Customer Data to train its own or any third party’s AI models. Customer Data is transmitted for the purpose of responding to the Customer’s requests, not for model training. Origo may engage sub-processors (including cloud and AI-service providers) as set out in the processing terms referred to above.

## 9. Service data and usage allowance

In addition to processing Customer Data as described in Clause 8, Origo processes limited Service Data to provide, secure and administer the Service. In particular, Origo processes: (a) licensing and entitlement data to authenticate and validate the Customer’s access and entitlement to the Service; and (b) a hashed identifier derived from the Customer’s Business Central tenant, used to allocate and track the Customer’s usage allowance. Origo acts as controller of Service Data for these purposes, and the tenant identifier is stored in hashed form so that the underlying tenant is not directly readable from it.

Use of the Service requires a usage allowance measured in Bifröst Transactions, which the Customer purchases under separate Commercial Terms. Bifröst Transactions are consumed by each request received by the Service under an Authorised User’s or Consumer Application’s identity, regardless of whether that specific request was in fact authorised by the Customer. Origo is not responsible or liable for Bifröst Transactions consumed as a result of the Customer’s credentials or identities being compromised, used without authorisation, or otherwise misused by any third party, and no refund or replacement of such Transactions shall be due. Origo may monitor and enforce that allowance and may throttle, queue or decline requests that exceed it, or where the allowance is exhausted, in order to protect the integrity, security and fair use of the Service. The price, quantity, validity, expiry and any refund of Bifröst Transactions are governed by the Commercial Terms and not by these Terms.

## 10. Intellectual property

As between the Parties, Origo owns and retains all intellectual property rights in and to the Service, including Bifröst, the Origo BC Agentic Platform, the MCP layer, the Documentation, and all software, models, structures, know-how and improvements relating to them. No rights are granted to the Customer other than the limited licence set out below.

Origo grants the Customer a non-exclusive, non-transferable, non-sublicensable and revocable right to access and use the Service for its internal business purposes for as long as these Terms are in force and the Customer complies with them, including timely paying of applicable fees for the Service. All rights not expressly granted are reserved to Origo.

As between the Parties, the Customer retains ownership of Customer Data and of the specific content of the Skills and Artifacts it creates. The Customer grants Origo a non-exclusive licence to host, process and transmit Customer Data and such content to the extent necessary to provide, secure and improve the Service. Nothing in this clause transfers to the Customer any rights in the underlying Service, framework or platform used to create or run Skills and Artifacts.

If the Customer provides feedback or suggestions about the Service, Origo may use them without restriction or obligation.

## 11. Confidentiality

Each party shall keep confidential the non-public information of the other party disclosed in connection with the Service, use it only for purposes of these Terms, and protect it with reasonable care. This obligation does not apply to information that is or becomes public without breach, is lawfully obtained from another source, or is required to be disclosed by law or authority.

## 12. Security and audit logging

Origo applies technical and organisational security measures to the Service, including authentication, logging of read and write operations, and isolation so that one customer’s data is not exposed to another. The Customer acknowledges that security is shared: Origo secures the Service, while the Customer is responsible for the security of its identities, credentials, permission configuration and Consumer Applications as set out in these Terms.

Where the Service is used in connection with bookkeeping functions in BC, the Customer is solely responsible as the bookkeeping-obliged entity under applicable bookkeeping legislation, for ensuring that its use of the Service and its use of AI agents satisfies the traceability, identification, back-up and retention requirements of that legislation.

Origo‘s logging under this Clause 12 relates to the operation of the Service and does not constitute or substitute for the Customer’s bookkeeping records, back-up copies or retention required by applicable bookkeeping legislation, which remain the Customer’s sole responsibility within BC and its own systems. Origo is not responsible for providing bookkeeping supervisory authorities or auditors with access to the Service.

## 13. Availability, changes and updates

Origo may modify, add to, version, restrict or discontinue features of the Service, and may perform maintenance, at any time. Because the Service dynamically reflects the operations available in Business Central, the set of available operations may change as Business Central changes. Origo will use reasonable efforts to avoid material adverse disruption but does not guarantee uninterrupted availability.

Origo may update these Terms from time to time, and will give the Customer reasonable prior notice of any change that is material and adverse to the Customer. The updated Terms take effect when published or otherwise notified, and continued use of the Service after that constitutes acceptance. If the Customer does not accept an update, its remedy is to stop using the Service.

## 14. Warranties and disclaimers

To the maximum extent permitted by law, the Service is provided “as is” and “as available”, and Origo disclaims all warranties, conditions and representations of any kind, whether express or implied, including any implied warranty of merchantability, fitness for a particular purpose, accuracy, non-infringement, uninterrupted or error-free operation, or that the Service will meet the Customer’s requirements. The Customer is responsible for determining whether the Service is suitable for its intended use.

## 15. Limitation of liability

To the maximum extent permitted by law, Origo shall not be liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, goodwill, data, or business, or for any loss arising from: the Customer’s permission configuration or access management; instructions or actions of any Authorised User, Consumer Application or AI system; inaccurate or unintended AI output or automated actions; the Customer’s failure to review, validate or supervise use of the Service; or the acts, omissions or products of any third party.

Subject to the foregoing, and to the extent Origo is otherwise liable, Origo’s total aggregate liability arising out of or in connection with the Service and these Terms shall not exceed the greater of (a) ISK 200.000 and (b) the total amount paid by the Customer for Bifröst Transactions under the applicable Commercial Terms during the twelve (12) months preceding the event giving rise to the liability.

Origo’s limitation of liability shall otherwise by governed by Origo’s General Terms and Conditions

## 16. Indemnification

The Customer shall defend, indemnify and hold harmless Origo against any third-party claim, and any resulting loss, damage, cost or expense, arising out of the Customer’s use of the Service in breach of these Terms or applicable law, the Customer’s permission configuration or access management, the instructions or actions carried out through the Service under the Customer’s identities, or the Customer Data, Skills and Artifacts.

## 17. Suspension and termination

Origo may suspend or terminate access to the Service, in whole or in part, with immediate effect, if the Customer breaches these Terms, including where the Customer fails to pay any fee due under the Commercial Terms and such fee remains unpaid for 10 days after notice, if there is a security or integrity risk, if required by law, or if the Customer ceases to hold the underlying Business Central access or licences.

Where the Customer falls under the scope of Regulation (EU) 2022/2554 (DORA), Origo‘s specific DORA terms, addressing ICT third-party risk management, apply in addition to these Terms. The Customer’s rights to terminate these Terms are additionally governed by, and subject to, such terms.

Customer may terminate use of the Service for convenience without prior notice. Such termination shall not entitle Customer to a refund of any Transactions previously purchased by Customer.

Origo reserves the right to discontinue the Service, in whole or in part, at any time and for any reason, in its sole discretion. Where Origo elects to discontinue the Service, the Service shall terminate automatically upon the expiry of six (6) months' prior written notice given by Origo to Customer.

Upon termination, the Customer’s right to use the Service ends and the Customer shall cease all access. Clauses that by their nature should survive termination (including intellectual property, confidentiality, disclaimers, limitation of liability, indemnity and governing law) survive.

## 18. Governing law and dispute resolution

These Terms, and any dispute or claim arising out of or in connection with them or their subject matter, are governed by and construed in accordance with the laws of Iceland, without regard to conflict-of-laws rules.

Any dispute, controversy or claim arising out of or in connection with these Terms, including any question regarding their existence, validity or termination, shall be finally settled by arbitration administered by the Nordic Arbitration Centre under its rules in force at the commencement of the arbitration. The seat of the arbitration shall be Reykjavík, Iceland; the arbitration shall be conducted in English before a single arbitrator; and the arbitral award shall be final and binding on the Parties. Judgment on the award may be entered in, and enforced by, any court of competent jurisdiction.

Notwithstanding the above, either party may apply to a competent court for interim or injunctive relief, in particular to protect its confidential information or intellectual property rights.

## 19. General

These Terms (together with Origo‘s General Terms and Conditions, Origo‘s Data Processing Terms, DORA Terms (where applicable), Commercial Terms and any separate signed agreement) constitute the entire agreement between the Parties regarding the Service and supersede prior understandings on that subject.

In case of any conflict between these documents: (a) any separate DORA risk-management Terms prevails on matters of ICT third-party risk management; (b) Origo‘s Data Processing Terms prevail on matters of personal data processing; (c) the Commercial Terms prevail on matters of pricing, fees and Bifröst Transactions; and (d) these Terms prevail over Origo‘s General Terms and Conditions; in each case only to the extent of the conflict.

If any provision is held unenforceable, the remainder remains in effect and the provision shall be replaced by an enforceable one reflecting the original intent as closely as possible.

Origo may assign these Terms to an affiliate or in connection with a reorganisation or transfer of business; the Customer may not assign without Origo’s prior written consent.

A failure to enforce a provision is not a waiver of it. Neither party is liable for failure or delay caused by events beyond its reasonable control.

Notices shall be given in writing to the contact details the Parties designate.
