---
id: iceland-capitaltax-getstatus
title: "Iceland.CapitalTax.GetStatus"
sidebar_label: "Iceland.CapitalTax.GetStatus"
sidebar_position: 10
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetStatus Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks the processing status of a submitted capital tax return using FaStodu.

**Stefna:** Both
**RSK Operation:** FaStodu

## Verkflæði position
```
GetTypes -> GetSubmittablePeriods -> entries -> Submit -> >>> GetStatus <<<
```
Kallaðu á eftir a successful Submit til poll RSK processing status.

## Tables updated
| Table | Fields updated |
|---|---|
| Iceland CapTax Period ori | Stada Sendingar (RSK status enum) |

## RSK Status values
| Value | Meaning |
|---|---|
| Received | RSK received the submission |
| Processing | RSK er processing |
| Completed | Accepted |
| Rejected | Submission was rejected |

## Beiðni
```json
{ "year": 2025, "quarter": 1 }
```

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=FaStodu
- Requires a local Iceland CapTax Period ori færsla með NumerSendingar > 0


