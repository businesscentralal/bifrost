---
id: finance-fajournal-check
title: "Finance.FAJournal.Check"
sidebar_label: "Finance.FAJournal.Check"
sidebar_position: 40
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview

Validates an FA Journal Batch without posting. Runs BC `FA Jnl.-Check Line` against every line under the BC Error Message Management framework so **all** errors are collected in one pass, plus emits explicit checks for missing `FA No.` / `Depreciation Book Code` and warnings for zero amounts and future FA Posting Dates. Returns aggregate totals and per-line errors/warnings.

**Direction**: Outbound (read-only — no data modified)  **Content-Type**: `text/json`

## Batch Identification Order

First match wins:
1. `data.templateName` (+ optional `data.batchName`).
2. `subject` envelope attribute is a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | FA journal template (Code[10]). |
| `batchName` | string | No | FA journal batch (Code[10]). |

### Request Example
```json
{ "templateName": "ASSETS", "batchName": "DEFAULT" }
```

## Response Shape

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA journal",
  "lineCount": 3,
  "totalQuantity": 0.0,
  "totalAmount": 1500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `validationResult` | string | `Ready` (no errors, no warnings), `ReadyWithWarnings` (no errors, ≥1 warning), or `NotReady` (≥1 error, **including the case where the batch has no lines**). |
| `lineCount` | int | `0` when the batch has no lines. |
| `totalQuantity` | decimal | `CalcSums` of `Quantity` across all lines. |
| `totalAmount` | decimal | `CalcSums` of `Amount` across all lines. |
| `errors` | object[] | Per-line blocking issues. Includes BC error-message-framework output from `FA Jnl.-Check Line.CheckFAJnlLine`, the missing-FA / missing-Depreciation-Book checks below, and the literal `"No fixed asset journal lines exist in the batch."` when the batch is empty. |
| `warnings` | object[] | Non-blocking — zero amount, future FA Posting Date. |

Each `errors` entry is an object `{code, error, parameter}` and each `warnings` entry `{code, message, parameter}`. `parameter` is `line <Line No.>` (the journal line's own Line No., e.g. `line 10000`) for a problem on one line, and is left out for a batch-level problem. `code` is `InvalidLine` for a Foundation check, `BusinessCentralError` for a Business Central check, and `PreconditionFailed` for an empty or unbalanced batch.

## Per-Line Checks

Explicit checks run **before** delegating to `FA Jnl.-Check Line.CheckFAJnlLine` (which may skip lines with empty FA No.):

| Condition | Severity | Message |
|---|---|---|
| `FA No.` empty | Error | `Line {lineNo}: FA No. is required.` |
| `Depreciation Book Code` empty (when FA No. set) | Error | `Line {lineNo}: Depreciation Book Code is required.` |
| `Amount = 0` | Warning | `Line {lineNo}: Amount is zero.` |
| `FA Posting Date > WorkDate()` | Warning | `Line {lineNo}: FA Posting Date is in the future ({date}).` |

## Errors

Validation issues are returned via `errors` / `warnings` with `status: "Success"`. The following are returned as `status: "Error"`:

| Error | Cause |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` (`MissingParameter`) | No identification was supplied. |
| `FA Journal Batch "{template}\|{batch}" was not found (from subject).` (`RecordNotFound`) | The batch does not exist. `parameter` is `subject`, or `templateName, batchName` when those keys were sent; `received` is the value. |

## Related Message Types

- `Finance.FAJournal.Create` — create new FA journal lines.
- `Finance.FAJournal.Post` — post the batch after a `Ready` / `ReadyWithWarnings` result.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

