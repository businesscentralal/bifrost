---
id: finance-fajournal-post
title: "Finance.FAJournal.Post"
sidebar_label: "Finance.FAJournal.Post"
sidebar_position: 41
description: "Request and response contract for the Finance.FAJournal.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts an FA Journal Batch via BC `FA Jnl.-Post Batch` and returns the resulting `FA Register` plus the posting summary. Errors from the BC posting engine are caught and returned as `{status, error, callstack}` instead of throwing — the message itself does not fail.

**Direction**: Inbound (write — creates FA Ledger Entries)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Not idempotent** — re-posting after a successful post produces `No lines to post` because the batch is now empty.
- Posting clears the batch lines; the `FA Register` carries the audit trail (`fromEntryNo`..`toEntryNo`).
- Recommended workflow: call `Finance.FAJournal.Check` first and only post when `validationResult ∈ {Ready, ReadyWithWarnings}`.

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

### Success
```json
{
  "status": "Success",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA journal",
  "linesPosted": 3,
  "postingDate": "2026-04-15",
  "totalQuantity": 0.0,
  "totalAmount": 1500.0,
  "faRegisterNo": 42,
  "faRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1003
}
```

### Posting Failure (BC error caught)
```json
{
  "status": "Error",
  "error": "FA No. must have a value in FA Journal Line ...",
  "callstack": "<BC error callstack>"
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `linesPosted` | int | Lines counted before posting (i.e. the batch size that was sent through `FA Jnl.-Post Batch`). |
| `postingDate` | string | `FA Posting Date` of the first line (ISO 8601, culture-invariant format 9). |
| `totalQuantity` / `totalAmount` | decimal | `CalcSums` across the pre-post lines. |
| `faRegisterNo` | int | New FA Register `No.`. |
| `faRegisterId` | GUID | FA Register `SystemId` (no braces). |
| `fromEntryNo` / `toEntryNo` | int | FA Ledger Entry range posted (from FA Register). |

## Posting Gate
Calling this message type requires the `BIFROST FA Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST FA Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST FA Post ori' permission set.` | Caller lacks the `BIFROST FA Post ori` permission set. |
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Fixed asset journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Nothing was posted. Review journal for errors.` | `FA Jnl.-Post Batch` returned without producing an FA Register (or the post-Line No. is 0). |
| BC posting errors | Returned as `{status, error, callstack}` — `error` is the BC error text, `callstack` from `GetLastErrorCallStack()`. |

## Related Message Types

- `Finance.FAJournal.SetupNewLine` — create new FA journal lines.
- `Finance.FAJournal.Check` — validate before posting.

