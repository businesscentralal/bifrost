---
id: iceland-capitaltax-submit
title: "Iceland.CapitalTax.Submit"
sidebar_label: "Iceland.CapitalTax.Submit"
sidebar_position: 14
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.Submit Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a capital income tax return til Skatturinn using SendaSkilagrein.
Each entry identifies the recipient (Kennitala) og income Gerð.

**Stefna:** Both
**RSK Operation:** SendaSkilagrein
**Auth:** SOAP headers + HTTP Basic Auth

## fulla FTS Verkflæði
`
1. GetTypes           - discover income Gerð IDs
2. GetSubmittablePeriods - find open quarters
3. Create period + entries (með recipient Kennitala)
4. Submit             - file með RSK
5. GetStatus          - poll processing status
6. GetOverview        - verify submission Listi

Correction: Reopen -> modify entries -> Submit (Adgerd=Breyta)
`

## Tracking tables
| Table | PK | Role |
|---|---|---|
| Iceland CapTax Period ori | Year, Quarter | Header: status, RSK Svar, claim details, PDF receipt |
| Iceland CapTax Period Ent. ori | Year, Quarter, Line No. | Lines: Kennitala + Gerð Id + Tekjur + Stadgreidsla per recipient |

## Entry fields
| Reitur | Lýsing |
|---|---|
| Kennitala | Recipient kennitala (who received income, e.g. 1102713369) |
| Gerð Id | Income Gerð frá GetTypes (11=Hlutabref/Ardur, 6=Bankareikningur/Vextir) |
| Tekjur | Income amount |
| Stadgreidsla | Withholding amount |

## Beiðni
`json
&#123; "year": 2025, "quarter": 1 &#125;
`

## State gates
| Status | Adgerd | Behavior |
|---|---|---|
| Open | Nyskra | New submission |
| Open | Breyta | Correction (uses existing NumerSendingar) |
| Submitted | - | Error: Kallaðu á Iceland.CapitalTax.Reopen first |

## Credentials
- **FTS Password** (valfrjálst) in Bifrost Setup - used Ef set
- Falls back til **Payroll Password** Ef FTS Password er empty
- **Kennitala** frá fyrirtæki Information Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=SendaSkilagrein
- Body uses StadgreidslaFTSInntak/StreamXLMDataRequest með Base64-encoded XML
- Timabil = quarter number (1-4), not YYYYQQ


