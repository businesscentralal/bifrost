---
id: iceland-capitaltax-submit
title: "Iceland.CapitalTax.Submit"
sidebar_label: "Iceland.CapitalTax.Submit"
sidebar_position: 14
description: "Request and response contract for the Iceland.CapitalTax.Submit Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a capital income tax return to Skatturinn using SendaSkilagrein.
Each entry identifies the recipient (Kennitala) and income type.

**Direction:** Both
**RSK Operation:** SendaSkilagrein
**Auth:** SOAP headers + HTTP Basic Auth

## Full FTS workflow
`
1. GetTypes           - discover income type IDs
2. GetSubmittablePeriods - find open quarters
3. Create period + entries (with recipient Kennitala)
4. Submit             - file with RSK
5. GetStatus          - poll processing status
6. GetOverview        - verify submission list

Correction: Reopen -> modify entries -> Submit (Adgerd=Breyta)
`

## Tracking tables
| Table | PK | Role |
|---|---|---|
| Iceland CapTax Period ori | Year, Quarter | Header: status, RSK response, claim details, PDF receipt |
| Iceland CapTax Period Ent. ori | Year, Quarter, Line No. | Lines: Kennitala + Type Id + Tekjur + Stadgreidsla per recipient |

## Entry fields
| Field | Description |
|---|---|
| Kennitala | Recipient kennitala (who received income, e.g. 1102713369) |
| Type Id | Income type from GetTypes (11=Hlutabref/Ardur, 6=Bankareikningur/Vextir) |
| Tekjur | Income amount |
| Stadgreidsla | Withholding amount |

## Request
`json
&#123; "year": 2025, "quarter": 1 &#125;
`

## State gates
| Status | Adgerd | Behavior |
|---|---|---|
| Open | Nyskra | New submission |
| Open | Breyta | Correction (uses existing NumerSendingar) |
| Submitted | - | Error: call Iceland.CapitalTax.Reopen first |

## Credentials
- **FTS Password** (optional) in Bifrost Setup - used if set
- Falls back to **Payroll Password** if FTS Password is empty
- **Kennitala** from Company Information Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=SendaSkilagrein
- Body uses StadgreidslaFTSInntak/StreamXLMDataRequest with Base64-encoded XML
- Timabil = quarter number (1-4), not YYYYQQ

