---
id: iceland-payroll-receipt
title: "Iceland.Payroll.Receipt"
sidebar_label: "Iceland.Payroll.Receipt"
sidebar_position: 44
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.Receipt Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar stored PDF receipt frá a submitted payroll period.

**Stefna:** Outbound
**Efnisgerð:** application/pdf
**Local read:** Reads `Sub. PDF Receipt` frá `Iceland PAYE Period ori`.

## Verkflæði
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send -> Receipt (new receipt replaces old)
```

## Tables
| Table | Reitur |
|---|---|
| Iceland PAYE Period ori | `Sub. PDF Receipt` (BLOB) — stored by Send |

## Beiðni
```json
{ "year": 2026, "month": "08" }
```

## Svar
Binary PDF content (~41KB). Content Gerð set til `application/pdf`.

## Errors
- No submitted period found → period does not exist eða Status er not Submitted.
- No PDF receipt stored → Send completed but RSK did not return a receipt.


