---
id: iceland-capitaltax-getoverview
title: "Iceland.CapitalTax.GetOverview"
sidebar_label: "Iceland.CapitalTax.GetOverview"
sidebar_position: 8
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetOverview Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir yearly Yfirlit of Allt capital tax submissions using FaYfirlit.

**Stefna:** Outbound
**RSK Operation:** FaYfirlit

## Notaðu case
Kallaðu á til see Allt submissions fyrir a year: submission numbers, dates, totals.
Useful fyrir verifying what RSK has on færsla eftir Submit eða Correction.

## Beiðni
```json
{ "year": 2025 }
```

## Svar fields
| Reitur | Lýsing |
|---|---|
| numerSendingar | Submission number |
| timabil | Quarter (1-4) |
| skiladDags | Filing date |
| skiladAf | Filed by (kennitala) |
| tegund | Gerð (A=new, B=correction) |

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=FaYfirlit


