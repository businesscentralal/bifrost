---
id: inventory-itemjournal-previewpost
title: "Inventory.ItemJournal.PreviewPost"
sidebar_label: "Inventory.ItemJournal.PreviewPost"
sidebar_position: 86
description: "Request and response contract for the Inventory.ItemJournal.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting an Item Journal Batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Item Jnl.-Post` subscriber, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Typical previewed tables include `Item Ledger Entry`, `Value Entry`, and (for journals that generate G/L impact) `G/L Entry` and `VAT Entry`. Each row is serialized through `Bifrost Preview Helper` so consumers can pick which fields they care about.

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
| `templateName` | string | See above | Item journal template (Code[10]). |
| `batchName` | string | No | Item journal batch (Code[10]). |

### Request Example
```json
{ "templateName": "ITEM", "batchName": "DEFAULT" }
```

## Response Shape

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting item journal batch ITEM|DEFAULT (2 lines) would create 4 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["T00042"],
  "totals": { "balanced": true, "totalDebitLCY": 254500.0, "totalCreditLCY": 254500.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "10", "LocationCode": "MAIN" }
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
| `predictedDocumentNos` | string[] | Distinct `Document No.` values across the previewed G/L entries. May contain the literal `"***"` when BC's preview engine masks an unassigned number-series value. Empty when the journal does not produce G/L impact. |
| `totals.balanced` | bool | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true when no G/L entries are produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Aggregated from the previewed G/L entries (zero when none). |
| `preview[]` | array | One element per populated ledger / journal table that BC would write to (`Item Ledger Entry`, `Value Entry`, `G/L Entry`, `VAT Entry`, etc.). |
| `preview[].tableId` / `tableName` | int / string | BC table identification. |
| `preview[].tableCaption` | string | BC `RecordRef.Caption` for the table (display name, may differ from `tableName` after BC renames — e.g. `Job Ledger Entry` → `Project Ledger Entry`). |
| `preview[].entryCount` | int | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Per-entry objects with `id` (placeholder SystemId GUID — never persisted because the preview rolls back), `primaryKey` (object of PK field-name → value), and `fields` (all serialized fields). Field names follow the same normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` are commonly `"***"` when BC masks an unassigned number-series. Subscribe to `OnGetPreviewFieldNames` to control which fields appear; subscribe to `OnPrecalculateFlowFields` to pre-compute FlowFields before serialization. |

## Examples (from unit tests)

From `Item Jnl. Prev. Post Tests` (codeunit 95436):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, and that the journal lines are **still present** after the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateItemLedgerEntry` — verifies that no `Item Ledger Entry` row is actually persisted (the preview is in-memory only).
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields (`templateName`, `batchName`, `linesToPost`) and that `preview[]` contains at least one populated table.

## Errors

**BC validation errors propagate verbatim** to the caller — most failures surface with the underlying BC message (e.g. missing posting groups, invalid item, blocked location). The catch-all below is only used when the preview subscriber runs cleanly but produces zero captured entries.

| Error | Cause |
|---|---|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Item journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Item journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Gen. Prod. Posting Group must have a value in Item Journal Line: ...` | Standard BC validation — the line is missing posting groups. Common when the line was inserted via OData/MCP `set_records` (which does **not** run OnValidate), so derived fields like `Gen. Prod. Posting Group`, `Inventory Posting Group`, `Location Code` must be supplied explicitly. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — only fires when the BC subscriber completes without raising but writes no entries. Run `Inventory.ItemJournal.Check` to enumerate the underlying validation failures. |

## Operational Notes

- **Insert lines via the BC client when possible** — the AL `Insert(true)` and OnValidate triggers populate derived fields (posting groups, location, costing method) automatically. When inserting via OData/MCP `set_records`, supply every field BC needs to post; `set_records` does not call OnValidate.
- The preview rolls back, but it does **not** roll back metadata changes made before the call (e.g. updated batch headers). Only the captured ledger inserts are discarded.

## Related Message Types

- `Inventory.ItemJournal.Check` — get the validation results that would gate the post.
- `Inventory.ItemJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — same pattern for the general journal.

