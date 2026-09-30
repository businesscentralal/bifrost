---
id: finance-generaljournal-previewpost
title: "Finance.GeneralJournal.PreviewPost"
sidebar_label: "Finance.GeneralJournal.PreviewPost"
sidebar_position: 47
description: "Request and response contract for the Finance.GeneralJournal.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting a Gen. Journal Batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Each row is serialized through `Bifrost Preview Helper` (with the `OnGetPreviewFieldNames` and `OnPrecalculateFlowFields` integration events) so consumers can pick which fields they care about.

Returns `rollback: true` so callers know the database was untouched. Also pre-computes the LCY balance and the distinct G/L `Document No.` values that would appear on the register.

**Direction**: Inbound (read-only — all changes rolled back)  **Content-Type**: `text/markdown`

Response is wrapped as a markdown document around a fenced ```json``` block so it renders inline in chat clients; the JSON inside is the structured payload below.

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
  "rollback": true,
  "summary": "Previewed 2 lines in GENERAL|DEFAULT — 4 G/L entries, 2 VAT entries, balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["G00042"],
  "totals": { "balanced": true, "totalDebitLCY": 500.0, "totalCreditLCY": 500.0 },
  "preview": [
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "entryCount": 4,
      "entries": [
        { "EntryNo_": 0, "GLAccountNo_": "1100", "DocumentNo_": "G00042", "Amount": 500.0, "AmountLCY": 500.0 }
      ]
    },
    {
      "tableId": 254,
      "tableName": "VAT Entry",
      "entryCount": 2,
      "entries": [ ]
    }
  ]
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `rollback` | bool | Always `true` for this message type. |
| `summary` | string | One-line human-readable recap. |
| `linesToPost` | int | Journal lines fed into the preview. |
| `postingDate` | string | `Posting Date` of the first line. |
| `lcyCode` | string | `GLSetup."LCY Code"`. |
| `predictedDocumentNos` | string[] | Distinct `Document No.` values across the previewed G/L entries. The actual document numbers BC would assign — useful when a No. Series is configured. |
| `totals.balanced` | bool | Present only when G/L entries were captured (`glEntryCount > 0`): `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Omitted when the posting creates no G/L entry. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Aggregated from the previewed G/L entries. |
| `preview[]` | array | One element per populated ledger / journal table that BC would write to (G/L Entry, VAT Entry, Cust. Ledger Entry, Vendor Ledger Entry, Bank Account Ledger Entry, FA Ledger Entry, Employee Ledger Entry, etc.). |
| `preview[].tableId` / `tableName` | int / string | BC table identification. |
| `preview[].entryCount` | int | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Field values. Field names follow the same normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). Subscribe to `OnGetPreviewFieldNames` to control which fields appear; subscribe to `OnPrecalculateFlowFields` to pre-compute FlowFields before serialization. |

## Examples (from unit tests)

From `Gen. Jnl. Prev. Post Tests` (codeunit 95389):
- `PreviewPost_BalancedBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, `totals.balanced: true`, and that the journal lines are **still present** after the preview (no commit).
- `PreviewPost_BalancedBatch_DoesNotCreateGLRegister` — verifies no `G/L Register` row is created (the preview is in-memory only).
- `PreviewPost_BalancedBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields (`templateName`, `batchName`, `linesToPost`) and that `preview[]` contains a populated `G/L Entry` element.

## Preview Outcome

The preview answers `Success` only when it captured at least one entry. Every answer carries `entryCount` (all captured entries) and `glEntryCount` (the G/L entries among them).

- **Nothing would be posted** (no entry captured, or BC reports that there is nothing to post): `status: Error`, `code: NothingToPreview`, `error: "The preview produced no entries. Nothing would be posted."` and a `nextStep`: Run `Finance.GeneralJournal.Check` to see which lines are incomplete.
- **No G/L entries** (for example item or value entries with Automatic Cost Posting off): `Success` with `glEntryCount: 0` and **no** `totals.balanced`; the summary says "No G/L entries would be posted."
- **G/L entries**: `totals.balanced` as described above.
- **Empty lines** (lines posting would skip): `linesInBatch` and `skippedLines` are always present. When `skippedLines > 0` the answer stays `Success` and adds a `LinesSkipped` warning ("2 of 3 lines are empty and would be skipped by posting."), a `nextStep` naming `Finance.GeneralJournal.Check`, and the same sentence in `summary`. When every line is empty, nothing would be posted (above).

## Errors

| Error | Cause |
|---|---|
| `The preview produced no entries. Nothing would be posted.` (`NothingToPreview`) | Nothing would be posted. `nextStep`: Run `Finance.GeneralJournal.Check` to see which lines are incomplete. |
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` (`MissingParameter`) | No identification was supplied. |
| `Gen. Journal Batch "{template}\|{batch}" was not found (from subject).` (`RecordNotFound`) | The batch does not exist. `parameter` is `subject`, or `templateName, batchName` when those keys were sent; `received` is the value. |
| `Journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | The BC posting engine raised during preview — usually means the same error would occur during a real post. Run `Finance.GeneralJournal.Check` to enumerate the underlying validation failures. |

## Related Message Types

- `Finance.GeneralJournal.Create` — add the lines to preview.
- `Finance.GeneralJournal.Check` — get the validation results that would gate the post.
- `Finance.GeneralJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.ReverseRegister` — undo a register after a real post.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

