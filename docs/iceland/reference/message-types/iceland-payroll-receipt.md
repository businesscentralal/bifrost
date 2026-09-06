---
id: iceland-payroll-receipt
title: "Iceland.Payroll.Receipt"
sidebar_label: "Iceland.Payroll.Receipt"
sidebar_position: 44
description: "Request and response contract for the Iceland.Payroll.Receipt Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the stored PDF receipt from a submitted payroll period.

**Direction:** Outbound
**Content-Type:** application/pdf
**Local read:** Reads `Sub. PDF Receipt` from `Iceland PAYE Period ori`.

## Workflow
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send -> Receipt (new receipt replaces old)
```

## Tables
| Table | Field |
|---|---|
| Iceland PAYE Period ori | `Sub. PDF Receipt` (BLOB) — stored by Send |

## Request
```json
{ "year": 2026, "month": "08" }
```

## Response
Binary PDF content (~41KB). Content type set to `application/pdf`.

## Errors
- No submitted period found → period does not exist or Status is not Submitted.
- No PDF receipt stored → Send completed but RSK did not return a receipt.

