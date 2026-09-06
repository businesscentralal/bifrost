---
id: warehouse-receipt-create
title: "Warehouse.Receipt.Create"
sidebar_label: "Warehouse.Receipt.Create"
sidebar_position: 148
description: "Request and response contract for the Warehouse.Receipt.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates one Warehouse Receipt per source document supplied. Wraps BC's `Get Source Doc. Inbound` (codeunit 5751) — each Sales Return Order, Purchase Order, or Inbound Transfer Order produces its own Warehouse Receipt Header at the source's receiving location.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Location Prerequisites

The source document's receiving Location must have `Require Receive = true`. Otherwise BC produces posted documents directly from the source without going through a Warehouse Receipt.

Receiving location resolution:

| Source type | Receiving location |
|---|---|
| `SalesReturnOrder` | `Sales Header.Location Code` |
| `PurchaseOrder` | `Purchase Header.Location Code` |
| `TransferOrder` | `Transfer Header."Transfer-to Code"` |

Additional behaviour depending on the Location setup:

| Location flags | Effect on Warehouse Receipt line |
|---|---|
| `Require Receive = true`, `Require Put-away = false` | `Qty. to Receive` is populated from the source line. `Warehouse.Receipt.Post` can run immediately. |
| `Require Receive = true`, `Require Put-away = true` | After posting the receipt, a Warehouse Put-away is created automatically. The receipt itself still posts successfully on its own. |
| `Directed Put-away and Pick = true` (e.g. WMS bin-mandatory location) | Bin Code must be set on the Warehouse Receipt Line before posting. |

### Discovery — find receipt-required locations

Use `Data.Records.Get` on `Location` (table 14) with `tableView = "WHERE(Require Receive=CONST(true))"` to enumerate the candidates. Inspect `RequirePutaway`, `DirectedPutawayandPick`, and `BinMandatory` on each row to anticipate downstream put-away or bin requirements.

## Idempotency / Safety Notes

- Not idempotent: each call inserts new Warehouse Receipt Headers from the relevant number series.
- Each source document creates a separate header (BC standard behaviour).
- Source documents that are already on an open Warehouse Receipt, have no quantity to receive, or have an active put-away will fail with `No Warehouse Receipt was created`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `sourceDocuments` | array | **Yes** | One or more `{ sourceType, documentNo }` entries. |
| `sourceDocuments[].sourceType` | string | **Yes** | `SalesReturnOrder`, `PurchaseOrder`, or `TransferOrder` (case-insensitive). |
| `sourceDocuments[].documentNo` | code[20] | **Yes** | The source document's `No.`. |
| `locationCode` | code[10] | No | If supplied, validates each source uses the same receiving location. Subject to write-restriction on `Warehouse Receipt Header."Location Code"`. |
| `assignedUserId` | code[50] | No | Applied to every created header after creation. |
| `postingDate` | date | No | Format 9. Applied to every created header after creation. |

### Request Example
```json
{
  "locationCode": "GREEN",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder", "documentNo": "PO-1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Response Shape

```json
{
  "status": "Success",
  "noOfReceipts": 2,
  "receipts": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WR001001",
      "locationCode": "GREEN",
      "assignedUserId": "ADMIN",
      "sourceType": "PurchaseOrder",
      "sourceDocumentNo": "PO-1001",
      "linesCreated": 3
    }
  ]
}
```

## Posting Gate

None — creation does not post. The companion `Warehouse.Receipt.Post` requires the `BIFROST WhsePost ori` permission set.

## Field Restrictions

- `Warehouse Receipt Header."Location Code"` — providing `locationCode` while this field is write-restricted is denied.

## Errors

Wording below is the exact text returned by the implementation (verified live).

| Error | Cause |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Request missing the array or array empty. |
| `Source #{n} is missing sourceType or documentNo (both required).` | One of the entries lacks a value. |
| `Unsupported sourceType '{value}'. Expected: SalesReturnOrder, PurchaseOrder, TransferOrder.` | Source type not recognised. |
| `Sales Return / Purchase / Transfer Order '{no}' not found.` | Document does not exist. |
| `Purchase Order '{no}' is not Released. Release it before creating a Warehouse Receipt.` | Source must be Released first. (`Sales Return Order` / `Transfer Order` variants use the same wording.) |
| `... uses/receives at location '{x}' which does not match the requested locationCode '{y}'.` | When `locationCode` filter is supplied. |
| `Location '{x}' (from/Transfer-to on ...) does not require receipt routing` | Location card has `Require Receive = false`. |
| `No Warehouse Receipt was created for {sourceType} '{no}' — already on an open receipt, no lines remain to receive, or put-away already started.` | Bundled cause: source is on an existing open WR, or has been fully received, or has an active put-away. (Returned even when the PO has been previously fully received via a posted WR.) |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `locationCode`. |

## End-to-End Workflow

Typical sequence to receive a Purchase Order via the warehouse:

1. **Create the Purchase Order** — `Purchase.Document.Create` (or `Data.Records.Set` on `Purchase Header`).
2. **Add Purchase Lines at the receipt-required Location** — `Data.Records.Set` on table `39` (`Purchase Line`).
3. **Release the Purchase Order** — `Purchase.Document.Release`.
4. **Create the Warehouse Receipt** — `Warehouse.Receipt.Create` (this message type).
5. (Optional) Adjust `Qty. to Receive` on the Warehouse Receipt Lines via `Data.Records.Set` if partial receive is intended.
6. **Post the Warehouse Receipt** — `Warehouse.Receipt.Post`. This creates Posted Whse. Receipt and Posted Purchase Receipt records and increases inventory.
7. (Optional) Use `Warehouse.Receipt.Post.Preview` between steps 5 and 6 to see the predicted ledger entries without committing.

## Related Message Types

- `Warehouse.Receipt.Post` — post the created Warehouse Receipt.
- `Warehouse.Receipt.Post.Preview` — simulate the post and inspect captured ledger entries.
- `Warehouse.Shipment.Create` / `Warehouse.Shipment.Post` — outbound counterparts.

