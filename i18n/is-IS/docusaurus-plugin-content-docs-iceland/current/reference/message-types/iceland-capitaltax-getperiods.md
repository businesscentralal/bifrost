---
id: iceland-capitaltax-getperiods
title: "Iceland.CapitalTax.GetPeriods"
sidebar_label: "Iceland.CapitalTax.GetPeriods"
sidebar_position: 9
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetPeriods Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt valid periods fyrir capital income tax using FaTimabil.

**Stefna:** Outbound
**RSK Operation:** FaTimabil

## Beiðni
```json
{ "year": 2025 }
```

## Svar
Skilar period færslur með start/end dates og names.
Notaðu GetSubmittablePeriods til filter til Aðeins those still open.

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=FaTimabil
- Requires ForritUtgafa registration at RSK fyrir non-public queries


