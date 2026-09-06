---
id: projects-projectjournal-check
title: "Projects.ProjectJournal.Check"
sidebar_label: "Projects.ProjectJournal.Check"
sidebar_position: 104
description: "Request and response contract for the Projects.ProjectJournal.Check Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Validates a project (job) journal batch and returns an aggregated readiness report. Runs BC `Job Jnl.-Check Line.RunCheck` per line via a try-function and collects errors from the BC Error Message framework.

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
{ "templateName": "PROJECT", "batchName": "DEFAULT" }
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
| `totalLineAmount` | decimal | `CalcSums("Line Amount")` across all lines. |
| `errorCount` | integer | Length of `errors[]`. |
| `warningCount` | integer | Length of `warnings[]`. |
| `errors` | string[] | Blocking errors: zero-quantity lines, BC `Job Jnl.-Check Line` failures, and entries from the BC Error Message framework. |
| `warnings` | string[] | Non-blocking warnings. Currently: `Posting Date` in the future. |

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default project journal",
  "lineCount": 2,
  "totalQuantity": 16.0,
  "totalLineAmount": 4800.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

## Validation Outcomes
- Empty batch → `validationResult = "NotReady"`, errors contain `"No project journal lines exist in the batch."`.
- Zero `Quantity` on a line → error `"Line {n}: Quantity is zero."`.
- `Posting Date` after `WorkDate()` → warning `"Line {n}: Posting Date is in the future ({date})."`.

## Errors

| Message | Cause |
|---|---|
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Project journal batch {templateName}\|{batchName} not found.` | Batch lookup failed. |

## Related Message Types
- `Projects.ProjectJournal.SetupNewLine`
- `Projects.ProjectJournal.Post`

