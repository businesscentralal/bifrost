---
id: finance-fajournal-previewpost
title: "Finance.FAJournal.PreviewPost"
sidebar_label: "Finance.FAJournal.PreviewPost"
sidebar_position: 42
description: "Request and response contract for the Finance.FAJournal.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting an FA Journal Batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `FA. Jnl.-Post` subscriber, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Typical previewed tables include `FA Ledger Entry`, `Maintenance Ledger Entry`, and (when the depreciation book posts to G/L) `G/L Entry` and `VAT Entry`. Each row is serialized through `Bifrost Preview Helper` so consumers can pick which fields they care about.

Returns `rollback: true` so callers know the database was untouched. Also pre-computes the LCY balance (from any captured G/L entries) and the distinct G/L `Document No.` values that would appear on the register.

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
  "rollback": true,
  "summary": "Preview-posting fixed asset journal batch ASSETS|DEFAULT (1 lines) would create 2 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": [],
  "totals": { "balanced": true, "totalDebitLCY": 0.0, "totalCreditLCY": 0.0 },
  "preview": [
    {
      "tableId": 5625,
      "tableName": "Maintenance Ledger Entry",
      "tableCaption": "Maintenance Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "FANo_": "FA000010", "DocumentNo_": "***", "Amount": "5000", "DepreciationBookCode": "COMPANY" }
        }
      ]
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
| `batchDescription` | string | The batch's `Description` field. May be empty when the batch has no description. |
| `predictedDocumentNos` | string[] | Distinct `Document No.` values across the previewed G/L entries. May contain the literal `"***"` when BC's preview engine masks an unassigned number-series value. Empty when the depreciation book does not post to G/L for the line's FA Posting Type (see Operational Notes). |
| `totals.balanced` | bool | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true when no G/L entries are produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Aggregated from the previewed G/L entries (zero when no G/L integration applies). |
| `preview[]` | array | One element per populated ledger / journal table that BC would write to (`FA Ledger Entry`, `Maintenance Ledger Entry`, `G/L Entry`, `VAT Entry`, etc.). |
| `preview[].tableId` / `tableName` | int / string | BC table identification. |
| `preview[].tableCaption` | string | BC `RecordRef.Caption` for the table (display name). |
| `preview[].entryCount` | int | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Per-entry objects with `id` (placeholder SystemId GUID), `primaryKey` (object of PK field-name → value), and `fields` (all serialized fields). Field names follow the same normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` are commonly `"***"` when BC masks an unassigned number-series. Subscribe to `OnGetPreviewFieldNames` to control which fields appear; subscribe to `OnPrecalculateFlowFields` to pre-compute FlowFields before serialization. |

## Examples (from unit tests)

From `FA Jnl. Prev. Post Tests` (codeunit 95437):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, and that the journal lines are **still present** after the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateFALedgerEntry` — verifies no `FA Ledger Entry` row is actually persisted.
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields and that `preview[]` contains at least one populated table.

## Errors

**BC validation errors propagate verbatim** to the caller. The catch-all below is only used when the preview subscriber runs cleanly but produces zero captured entries.

| Error | Cause |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Fixed asset journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` | **Critical** — BC blocks the FA Journal when the depreciation book has `G/L Integration - {Type} = true` for that FA Posting Type. See Operational Notes below. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — only fires when the BC subscriber completes without raising but writes no entries. Run `Finance.FAJournal.Check` to enumerate the underlying validation failures. |

## Operational Notes

- **FA Journal vs. General Journal routing.** BC requires that FA postings with `G/L Integration` enabled on the depreciation book go through the **general journal**, not the FA journal. The FA Journal preview will fail with `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` for every line whose depreciation book has `G/L Integration - {Type} = true`. Inspect `Depreciation Book` fields `G/L Integration - Acq. Cost`, `G/L Integration - Depreciation`, `G/L Integration - Write-Down`, `G/L Integration - Appreciation`, `G/L Integration - Custom 1`, `G/L Integration - Custom 2`, `G/L Integration - Disposal`, `G/L Integration - Maintenance` before previewing.
- **Use `Finance.GeneralJournal.PreviewPost` for G/L-integrated FA postings** — set the journal line `Account Type = Fixed Asset` and supply the FA-specific fields (`FA Posting Type`, `Depreciation Book Code`, `Maintenance Code` when applicable). That route honours the G/L Integration setup.
- **Demo data caveat.** CRONUS demo databases typically ship with **every** G/L Integration flag enabled on the default depreciation book, which means none of the FA Journal posting types can be previewed without first switching them off (and switching them back).
- **Maintenance entries without G/L integration** populate `Maintenance Ledger Entry` (table 5625) only — no G/L Entry, so `totals` and `predictedDocumentNos` are empty/zero/balanced.

## Related Message Types

- `Finance.FAJournal.Check` — get the validation results that would gate the post.
- `Finance.FAJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — same pattern for the general journal.

