---
id: warehouse-shipment-previewpost
title: "Warehouse.Shipment.PreviewPost"
sidebar_label: "Warehouse.Shipment.PreviewPost"
sidebar_position: 153
description: "Request and response contract for the Warehouse.Shipment.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting a Warehouse Shipment and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Whse.-Post Shipment (Yes/No)` subscriber, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Typical previewed tables include `Item Ledger Entry`, `Value Entry`, `Posted Whse. Shipment Header`, `Posted Whse. Shipment Line`, `Sales Shipment Header`, `Sales Shipment Line`, plus `Sales Invoice Header`, `Sales Invoice Line`, `G/L Entry`, `VAT Entry`, `Cust. Ledger Entry` for the invoice pass. Each row is serialized through `Bifrost Preview Helper` so consumers can pick which fields they care about.

**Important — Invoice flag is fixed.** BC's `Whse.-Post Shipment (Yes/No)` preview subscriber forces `Invoice = true` for the simulated post. This message type therefore always reports the full **Ship + Invoice** impact regardless of the Warehouse Shipment header's settings. The response `invoice` field is therefore always `true`.

Returns `rollback: true` so callers know the database was untouched. Also pre-computes the LCY balance and the distinct G/L `Document No.` values that would appear on the register.

**Direction**: Inbound (read-only — all changes rolled back)  **Content-Type**: `text/markdown`

Response is wrapped as a markdown document around a fenced ```json``` block so it renders inline in chat clients; the JSON inside is the structured payload below.

## Shipment Identification Order

First match wins:
1. `subject` envelope attribute is a GUID → header SystemId.
2. `subject` envelope attribute non-empty text → header `No.`.
3. `data.systemId` / `data.recordSystemId` / `data.id` → header SystemId.
4. `data.shipmentNo` / `data.no` → header `No.`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `shipmentNo` | string | See above | Warehouse Shipment `No.` (Code[20]). |
| `no` | string | See above | Alias for `shipmentNo`. |
| `systemId` / `recordSystemId` / `id` | string (GUID) | See above | Warehouse Shipment Header SystemId. |

### Request Example
```json
{ "shipmentNo": "WS00001" }
```

## Response Shape

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting warehouse shipment WS00001 (2 lines, Ship + Invoice) would create 10 ledger entries across 6 tables. G/L impact is balanced.",
  "shipmentNo": "WS00001",
  "locationCode": "WHITE",
  "invoice": true,
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedNumbers": ["INV00012"],
  "totals": { "balanced": true, "totalDebitLCY": 250.0, "totalCreditLCY": 250.0 },
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
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "-5", "LocationCode": "WHITE" }
        }
      ]
    },
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "tableCaption": "G/L Entry",
      "entryCount": 4,
      "entries": []
    }
  ]
}
```

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `rollback` | bool | Always `true` for this message type. |
| `summary` | string | One-line human-readable recap. |
| `shipmentNo` / `locationCode` | string | Identifying header fields. |
| `invoice` | bool | Always `true` — BC's preview subscriber forces Ship + Invoice. |
| `linesToPost` | int | Warehouse Shipment Lines fed into the preview. |
| `postingDate` | string | `Posting Date` of the shipment header. |
| `lcyCode` | string | `GLSetup."LCY Code"`. |
| `predictedNumbers` | string[] | Distinct `Document No.` values across the previewed G/L entries (typically the future Sales Invoice No., Posted Whse. Shipment No., etc.). May contain the literal `"***"` when BC's preview engine masks an unassigned number-series value. |
| `totals.balanced` | bool | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Aggregated from the previewed G/L entries. |
| `preview[]` | array | One element per populated ledger / posted-document table that BC would write to. |
| `preview[].tableId` / `tableName` | int / string | BC table identification. |
| `preview[].tableCaption` | string | BC `RecordRef.Caption` for the table (display name). |
| `preview[].entryCount` | int | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Per-entry objects with `id` (placeholder SystemId GUID), `primaryKey` (object of PK field-name → value), and `fields` (all serialized fields). Field names follow the same normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` are commonly `"***"` when BC masks an unassigned number-series. Subscribe to `OnGetPreviewFieldNames` to control which fields appear; subscribe to `OnPrecalculateFlowFields` to pre-compute FlowFields before serialization. |

## Examples (from unit tests)

From `Whse Ship. Prev. Post Tests` (codeunit 95439):
- `PreviewPost_PostableShipment_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, and that the shipment lines remain after the preview (no commit).
- `PreviewPost_PostableShipment_DoesNotPostShipment` — verifies no `Posted Whse. Shipment Header` row is actually persisted.
- `PreviewPost_PostableShipment_ReturnsContextAndPreviewArray` — verifies the shipment context fields and that `preview[]` contains at least one populated table.

## Errors

**BC validation errors propagate verbatim** to the caller. The catch-all below is only used when the preview subscriber runs cleanly but produces zero captured entries.

| Error | Cause |
|---|---|
| `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, shipmentNo).` | No identifier was supplied. |
| `Warehouse Shipment {no} has no lines to post.` | Header exists but has no lines. |
| `There is nothing to post because the document does not contain a quantity or amount.` | Every line has `Qty. to Ship = 0`. On WMS locations (`Require Pick = true`) this happens when no warehouse pick has been registered yet — the pick registration is what populates `Qty. to Ship`. See Operational Notes. |
| `Posting preview failed and no entries were captured. The shipment cannot be posted in its current state.` | Rare catch-all — only fires when the BC subscriber completes without raising but writes no entries. |

## Operational Notes

- **WMS locations require a registered pick first.** On a location with `Require Pick = true` (e.g. CRONUS `WHITE` / `GULUR`), the Warehouse Shipment lines start with `Qty. to Ship = 0`. The warehouse pick must be created **and registered** before previewing — pick registration is what writes `Qty. to Ship` back onto the shipment lines.
- **Locations with `Require Shipment = true` and `Require Pick = false`** behave like a basic shipping flow: `Qty. to Ship` is populated when the shipment line is created, so the preview runs directly without a pick step.
- **Invoice flag is fixed at `true`.** The Ship + Invoice impact is always reported regardless of how you would post in production. To preview Ship-only behaviour, use the source document's own posting preview (e.g. `Sales.Order.PreviewPost` once available, or post the shipment with `Warehouse.Shipment.Post` after registering picks).

## Related Message Types

- `Warehouse.Shipment.Create` — create a Warehouse Shipment from a source document.
- `Warehouse.Shipment.Post` — commit the actual post (with or without invoice).
- `Finance.GeneralJournal.PreviewPost` — same pattern for the general journal.

