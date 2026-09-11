---
id: warehouse-shipment-create
title: "Warehouse.Shipment.Create"
sidebar_label: "Warehouse.Shipment.Create"
sidebar_position: 151
description: "Request and response contract for the Warehouse.Shipment.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates one Warehouse Shipment per source document supplied. Wraps BC's `Get Source Doc. Outbound` (codeunit 5752) — each Sales Order or Outbound Transfer Order produces its own Warehouse Shipment Header at the source's location.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Location Prerequisites

The source document's `Location Code` must point to a Location where `Require Shipment = true`. Otherwise BC produces the source documents directly from the Sales Order / Transfer Order without going through a Warehouse Shipment.

Additional behaviour depending on the Location setup:

| Location flags | Effect on Warehouse Shipment line |
|---|---|
| `Require Shipment = true`, `Require Pick = false` | `Qty. to Ship` is populated from the source line. `Warehouse.Shipment.Post` can run immediately. |
| `Require Shipment = true`, `Require Pick = true` | `Qty. to Ship` starts at 0. Create and register a Warehouse Pick with `Warehouse.Pick.Create` then `Warehouse.Pick.Register` before `Warehouse.Shipment.Post` will accept the document. Trying to set `Qty. to Ship` manually is blocked by BC (`Qty. to Ship must not be greater than 0 units ...`). |
| `Directed Put-away and Pick = true` (e.g. WMS bin-mandatory location) | Same as Require Pick — use `Warehouse.Pick.Create` then `Warehouse.Pick.Register` before posting. |

### Discovery — find shipment-required locations

Use `Data.Records.Get` on `Location` (table 14) with `tableView` `WHERE(Require Shipment=CONST(true))` to enumerate the candidates. Inspect the `RequirePick` and `DirectedPutawayandPick` fields to anticipate whether posting needs a registered pick.

## Idempotency / Safety Notes

- Not idempotent: each call inserts new Warehouse Shipment Headers from the relevant number series.
- Each source document creates a separate header (BC standard behaviour).
- Source documents that are already on an open Warehouse Shipment, have no quantity to ship, or have an active pick will fail with `No Warehouse Shipment was created`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `sourceDocuments` | array | **Yes** | One or more `{ sourceType, documentNo }` entries. |
| `sourceDocuments[].sourceType` | string | **Yes** | `SalesOrder` or `TransferOrder` (case-insensitive). |
| `sourceDocuments[].documentNo` | code[20] | **Yes** | The source document's `No.`. |
| `locationCode` | code[10] | No | If supplied, validates each source uses the same location. Subject to write-restriction on `Warehouse Shipment Header."Location Code"`. |
| `assignedUserId` | code[50] | No | Applied to every created header after creation. |
| `postingDate` | date | No | Format 9. Applied to every created header after creation. |

### Request Example
```json
{
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "SalesOrder", "documentNo": "1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Response Shape

```json
{
  "status": "Success",
  "noOfShipments": 2,
  "shipments": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WS001001",
      "locationCode": "WHITE",
      "assignedUserId": "ADMIN",
      "sourceType": "SalesOrder",
      "sourceDocumentNo": "1001",
      "linesCreated": 3
    }
  ]
}
```

## Posting Gate

None — creation does not post. The companion `Warehouse.Shipment.Post` requires the `BIFROST WhsePost ori` permission set.

## Field Restrictions

- `Warehouse Shipment Header."Location Code"` — providing `locationCode` while this field is write-restricted is denied.

## Errors

| Error | Cause |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Request missing the array or array empty. |
| `Source #{n} is missing sourceType or documentNo (both required).` | One of the entries lacks a value. |
| `Unsupported sourceType '{value}'. Expected: SalesOrder, TransferOrder.` | Source type not recognised. |
| `Sales Order/Transfer Order '{no}' not found.` | Document does not exist. |
| `... is not Released.` | Source must be Released before warehouse shipment creation. |
| `... uses location '{x}' which does not match the requested locationCode '{y}'.` | When `locationCode` filter is supplied. |
| `Location '{x}' (from ...) does not require shipment routing` | Location card has `Require Shipment = false`. |
| `No Warehouse Shipment was created for ...` | Source already on a shipment, no qty remaining, or active pick. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `locationCode`. |

## End-to-End Workflow

Concrete sequence to go from a customer to a posted shipment (values from a CRONUS-style demo).

1. **Create the Sales Order** — `Sales.Document.Create`
```json
{ "documentType": "Order", "no": "10000" }
```
Capture `result[0].primaryKey.No_` (e.g. `"101028"`).

2. **Add a Sales Line at the shipment-required Location** — `Data.Records.Set` on table `37` (`Sales Line`).
```json
{
  "tableName": "Sales Line",
  "data": [{
    "primaryKey": { "DocumentType": "Order", "DocumentNo_": "101028", "LineNo_": 10000 },
    "fields": { "Type": "Item", "No_": "1896-S", "LocationCode": "GULUR", "Quantity": 2 }
  }]
}
```

3. **Release the order** — `Sales.Document.Release`
```json
{ "orderNo": "101028" }
```

4. **Create the Warehouse Shipment** — `Warehouse.Shipment.Create`
```json
{ "sourceDocuments": [ { "sourceType": "SalesOrder", "documentNo": "101028" } ] }
```
Capture `shipments[0].no` (e.g. `"SH000004"`).

5. **If the location requires a pick** — call `Warehouse.Pick.Create` for `SH000004`, optionally adjust line-level `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line`, then call `Warehouse.Pick.Register`. Both message types are documented separately.

6. **Post the shipment** — `Warehouse.Shipment.Post`
```json
{ "shipmentNo": "SH000004", "invoice": false }
```

## Related Message Types

- `Warehouse.Shipment.Post` — post the created Warehouse Shipment.
- `Warehouse.Pick.Create` — create the Warehouse Pick when `Require Pick = true`.
- `Warehouse.Pick.Register` — register the pick so `Qty. to Ship` is populated.
- `Data.Records.Get` — load any field on the resulting `Warehouse Shipment Header` / `Warehouse Shipment Line`.

