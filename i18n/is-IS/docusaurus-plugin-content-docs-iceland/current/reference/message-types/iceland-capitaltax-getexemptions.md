---
id: iceland-capitaltax-getexemptions
title: "Iceland.CapitalTax.GetExemptions"
sidebar_label: "Iceland.CapitalTax.GetExemptions"
sidebar_position: 7
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetExemptions Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir capital income tax exemptions using TskFaUndanthagur.

**Stefna:** Outbound
**RSK Operation:** TskFaUndanthagur

## Beiðni
```json
{ "tekjuar": 2025, "timabil": 202503 }
```
Note: timabil format er YYYYQQ fyrir Þessi aðgerð.

## Notaðu case
Check available exemptions áður en submitting a return.

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=TskFaUndanthagur
- RSK may return HTTP 500 fyrir invalid period combinations


