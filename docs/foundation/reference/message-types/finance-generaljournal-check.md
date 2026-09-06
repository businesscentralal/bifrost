---
id: finance-generaljournal-check
title: "Finance.GeneralJournal.Check"
sidebar_label: "Finance.GeneralJournal.Check"
sidebar_position: 45
description: "Request and response contract for the Finance.GeneralJournal.Check Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Validates a Gen. Journal Batch without posting. Runs BC `Gen. Jnl.-Check Line.RunCheck` against every line under the BC Error Message Management framework so **all** errors are collected in one pass, plus computes the LCY balance and emits warnings for zero amounts and future Posting Dates.

**Direction**: Outbound (read-only — no data modified)  **Content-Type**: `text/json`

## Batch Identification Order

First match wins:
1. `data.templateName` (+ optional `data.batchName`).
2. `subject` envelope attribute is a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | Gen. journal template (Code[10]). |
| `batchName` | string | No | Gen. journal batch (Code[10]). |

### Request Example
```json
{ "templateName": "GENERAL", "batchName": "DEFAULT" }
```

## Response Shape

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "lineCount": 4,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
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
| `isBalanced` | bool | `true` when `totalAmountLCY = 0`. |
| `requiresBalance` | bool | `true` when the journal template `Type = General`. Other template types may post without a zero total. |
| `totalAmount` / `totalAmountLCY` | decimal | `CalcSums` of `Amount` / `Amount (LCY)` across all lines. |
| `errors` | string[] | Per-line blocking issues from BC `Gen. Jnl.-Check Line.RunCheck`, plus the literal `Journal is not balanced: Total LCY = {amount} (should be 0.00).` when `requiresBalance` and not balanced, and the literal `"No journal lines exist in the batch."` when the batch is empty. |
| `warnings` | string[] | Non-blocking — zero amount, future Posting Date. |

## Per-Line Warnings

| Condition | Severity | Message |
|---|---|---|
| `Amount = 0` | Warning | `Line {lineNo}: Amount is zero.` |
| `Posting Date > WorkDate()` | Warning | `Line {lineNo}: Posting Date is in the future ({date}).` |

Field-level errors come unaltered from BC `Gen. Jnl.-Check Line` (missing G/L account, posting period closed, blocked customer/vendor, missing dimensions, VAT validation, etc.).

## Examples (from unit tests)

From `Gen. Journal Check Tests` (codeunit 95334):
- `FinanceGeneralJournalCheck_BalancedBatch_ReturnsReady` — balanced lines → `validationResult: "Ready"`, `errorCount: 0`.
- `FinanceGeneralJournalCheck_UnbalancedBatch_ReturnsNotReady` — debits ≠ credits → `validationResult: "NotReady"`, `errorCount > 0`, balance error included in `errors`.
- `FinanceGeneralJournalCheck_FuturePostingDate_ReturnsReadyWithWarnings` — `Posting Date > WorkDate()` → `validationResult: "ReadyWithWarnings"`.
- `FinanceGeneralJournalCheck_SystemIdSubject_ReturnsReady` — subject = batch `SystemId` (`Format(SystemId, 0, 4)`).

## Errors

Validation issues are returned via `errors` / `warnings` with `status: "Success"`. The following are returned as `status: "Error"`:

| Error | Cause |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |

## Related Message Types

- `Finance.GeneralJournal.SetupNewLine` — create new journal lines.
- `Finance.GeneralJournal.PreviewPost` — simulate the post without committing.
- `Finance.GeneralJournal.Post` — post the batch after a `Ready` / `ReadyWithWarnings` result.

