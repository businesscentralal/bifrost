---
id: iceland-capitaltax-getsubmittableperiods
title: "Iceland.CapitalTax.GetSubmittablePeriods"
sidebar_label: "Iceland.CapitalTax.GetSubmittablePeriods"
sidebar_position: 11
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetSubmittablePeriods Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir periods currently open fyrir submission using FaSkilanlegTimabil.

**Stefna:** Outbound
**RSK Operation:** FaSkilanlegTimabil

## Verkflæði position
```
GetTypes -> >>> GetSubmittablePeriods <<< -> entries -> Submit
```
Kallaðu á áður en Submit til verify the target quarter er still open.

## Beiðni
```json
{ "year": 2025 }
```

## Svar
Same structure as GetPeriods but filtered til submittable Aðeins.
Empty = Allt periods closed fyrir that year.

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=FaSkilanlegTimabil


