---
id: finance-generaljournal-post
title: "Finance.GeneralJournal.Post"
sidebar_label: "Finance.GeneralJournal.Post"
sidebar_position: 46
description: "Request and response contract for the Finance.GeneralJournal.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts a Gen. Journal Batch via BC `Gen. Jnl.-Post Batch` and returns the resulting `G/L Register` plus the posting summary. Errors from the BC posting engine are caught and returned as `{status, error, callstack}` instead of throwing — the message itself does not fail.

**Direction**: Inbound (write — creates G/L, customer/vendor/bank/employee, VAT, FA, and any other ledger entries the BC posting routine emits)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Not idempotent** — `Gen. Jnl.-Post Batch` clears the journal lines on success, so re-posting the same batch returns `No lines to post`.
- The batch record itself survives the post; only the lines are removed.
- Recommended workflow: call `Finance.GeneralJournal.Check` first and only post when `validationResult ∈ {Ready, ReadyWithWarnings}`. For high-risk batches, use `Finance.GeneralJournal.PreviewPost` to inspect the entries that would be created.

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

### Success
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2026-04-15",
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

### Posting Failure (BC error caught)
```json
{
  "status": "Error",
  "error": "<BC posting error text>",
  "callstack": "<BC error callstack>"
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `linesPosted` | int | Lines counted before posting. |
| `postingDate` | string | `Posting Date` of the first line (ISO 8601, culture-invariant format 9). |
| `totalAmount` / `totalAmountLCY` | decimal | `CalcSums` across the pre-post lines. For a balanced journal both are `0.0`. |
| `glRegisterNo` | int | New G/L Register `No.`. |
| `glRegisterId` | GUID | G/L Register `SystemId` (no braces). |
| `fromEntryNo` / `toEntryNo` | int | G/L Entry range from the new register. |
| `fromVATEntryNo` / `toVATEntryNo` | int | VAT Entry range from the new register. `0` when no VAT entries were created. |

## Examples (from unit tests)

From `Gen. Journal Post Tests` (codeunit, see `test/test/Finance/GenJournalPostTests.Codeunit.al`):
- `FinanceGeneralJournalPost_BalancedBatch_ReturnsSuccess` — subject = `"GENERAL|DEFAULT"` with balanced lines → `status: "Success"` and a populated G/L Register.
- `FinanceGeneralJournalPost_SystemIdSubject_ReturnsSuccess` — subject = batch `SystemId` (`Format(SystemId, 0, 4)`).
- `FinanceGeneralJournalPost_DataParameters_ReturnsSuccess` — data = `{ "templateName": "GENERAL", "batchName": "DEFAULT" }`.
- `FinanceGeneralJournalPost_NonExistentBatch_ReturnsError` — subject = `"GENERAL|NONEXISTENT"` → `Journal batch GENERAL|NONEXISTENT not found.`.
- `FinanceGeneralJournalPost_EmptySubjectNoData_ReturnsError` — missing identification.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Nothing was posted. Review journal for errors.` | `Gen. Jnl.-Post Batch` returned without producing a G/L Register. |
| BC posting errors | Returned as `{status, error, callstack}` — `error` is the BC error text, `callstack` from `GetLastErrorCallStack()`. |

## Related Message Types

- `Finance.GeneralJournal.SetupNewLine` — create new journal lines.
- `Finance.GeneralJournal.Check` — validate before posting.
- `Finance.GeneralJournal.PreviewPost` — simulate the post without committing.
- `Finance.GeneralJournal.ReverseRegister` — reverse the G/L Register produced by this post.

