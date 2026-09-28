---
id: resources-resourcejournal-check
title: "Resources.ResourceJournal.Check"
sidebar_label: "Resources.ResourceJournal.Check"
sidebar_position: 118
description: "Request and response contract for the Resources.ResourceJournal.Check Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Validates a resource journal batch and returns an aggregated readiness report. Runs BC `Res. Jnl.-Check Line.RunCheck` per line and collects errors via the BC Error Message framework.

**Direction**: Outbound (read-only) · **Content-Type**: `text/json`

## Identifier Resolution
Batch is resolved in this order:
1. JSON `templateName` (+ optional `batchName`)
2. `subject` is a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Request Parameters

| Name | Type | Description |
|---|---|---|
| `templateName` | string | Journal template name (`Code[10]`). |
| `batchName` | string | Journal batch name (`Code[10]`). |

## Request Example
```json
{ "templateName": "RESOURCE", "batchName": "DEFAULT" }
```

## Response Shape

| Property | Type | Description |
|---|---|---|
| `status` | string | `"Success"`. |
| `validationResult` | string | `Ready` (no issues), `ReadyWithWarnings` (warnings only), `NotReady` (errors or empty batch). |
| `templateName` | string | Echoed template name. |
| `batchName` | string | Echoed batch name. |
| `batchDescription` | string | Batch description. |
| `lineCount` | integer | Number of lines in the batch (0 when empty). |
| `totalQuantity` | decimal | `CalcSums(Quantity)` across all lines. |
| `totalCost` | decimal | `CalcSums("Total Cost")` across all lines. |
| `errorCount` | integer | Length of `errors[]`. |
| `warningCount` | integer | Length of `warnings[]`. |
| `errors` | object[] | Blocking errors collected from the BC Error Message framework. |
| `warnings` | object[] | Non-blocking warnings: zero `Quantity` line, and `Posting Date` in the future. |

Each `errors` entry is an object `{code, error, parameter}` and each `warnings` entry `{code, message, parameter}`. `parameter` is `line <Line No.>` (the journal line's own Line No., e.g. `line 10000`) for a problem on one line, and is left out for a batch-level problem. `code` is `InvalidLine` for a Foundation check, `BusinessCentralError` for a Business Central check, and `PreconditionFailed` for an empty or unbalanced batch.

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default resource journal",
  "lineCount": 3,
  "totalQuantity": 8.0,
  "totalCost": 1500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

## Validation Outcomes
- Empty batch → `validationResult = "NotReady"`, errors contain `"No resource journal lines exist in the batch."`.
- Zero `Quantity` on a line → **warning** `"Line {n}: Quantity is zero."` (unlike project journals, this is non-blocking).
- `Posting Date` after `WorkDate()` → warning `"Line {n}: Posting Date is in the future ({date})."`.

## Errors

| Message | Cause |
|---|---|
| `Resource journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` (`MissingParameter`) | No identification provided. |
| `Res. Journal Batch "{template}\|{batch}" was not found (from subject).` (`RecordNotFound`) | The batch does not exist. `parameter` is `subject`, or `templateName, batchName` when those keys were sent; `received` is the value. |

## Related Message Types
- `Resources.ResourceJournal.Create`
- `Resources.ResourceJournal.Post`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

