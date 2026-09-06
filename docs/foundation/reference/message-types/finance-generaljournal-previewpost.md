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
| `totals.balanced` | bool | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
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

## Errors

| Error | Cause |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | The BC posting engine raised during preview — usually means the same error would occur during a real post. Run `Finance.GeneralJournal.Check` to enumerate the underlying validation failures. |

## Related Message Types

- `Finance.GeneralJournal.Check` — get the validation results that would gate the post.
- `Finance.GeneralJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.ReverseRegister` — undo a register after a real post.

