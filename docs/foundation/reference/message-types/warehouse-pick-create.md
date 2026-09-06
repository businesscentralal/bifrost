---
id: warehouse-pick-create
title: "Warehouse.Pick.Create"
sidebar_label: "Warehouse.Pick.Create"
sidebar_position: 144
description: "Request and response contract for the Warehouse.Pick.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates a Warehouse Pick from an existing Warehouse Shipment. Wraps BC report 7318 `Whse.-Shipment - Create Pick` (the same action invoked by *Create Pick* on the Warehouse Shipment page). The resulting `Warehouse Activity Header` (`Type = Pick`) is returned along with line totals.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Prerequisites

- The Warehouse Shipment must exist and have at least one line.
- The shipment's `Location Code` must point to a Location with `Require Pick = true` (typically a Directed Put-away and Pick / WMS location). On Locations with `Require Shipment = true, Require Pick = false`, no pick is needed — call `Warehouse.Shipment.Post` directly.
- Sufficient inventory must exist in the source bins so BC has something to pick.

## Identifying the Warehouse Shipment

Provide the shipment via the Bifrost Subject (GUID = SystemId, or text = `No.`) or via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Shipment Header`. |
| `whseShipmentNo` / `shipmentNo` / `no` | `No.` of the `Warehouse Shipment Header`. |

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `whseShipmentNo` | code[20] | One identifier required | Or use `shipmentNo` / `no` / `systemId` / Subject. |
| `assignedUserId` | code[50] | No | Applied to the created Warehouse Pick. Subject to write-restriction on `Warehouse Activity Header."Assigned User ID"`. |
| `sortingMethod` | string | No | Case-insensitive name from BC enum `Whse. Activity Sorting Method` — currently: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). The error response lists the exact set valid on your build. Subject to write-restriction on `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | boolean | No (default false) | Not supported in this API version. Sending `true` returns an error. |
| `doNotFillQtyToHandle` | boolean | No (default false) | Not supported in this API version. Sending `true` returns an error. |

### Request Example
```json
{
  "whseShipmentNo": "WS001001",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Response Shape

```json
{
  "status": "Success",
  "whseShipmentNo": "WS001001",
  "pickNo": "WPK000123",
  "pickSystemId": "00000000-0000-0000-0000-000000000000",
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking",
  "totalPickLines": 4,
  "totalQtyToHandle": 12,
  "message": "Warehouse Pick WPK000123 created from Shipment WS001001 with 4 lines."
}
```

When no `sortingMethod` is supplied, the response returns `"sortingMethod": "None"` (the BC enum's blank/whitespace caption is normalised to `None`).

## Posting Gate

None — pick creation does not register stock movement. The companion `Warehouse.Pick.Register` requires the `BIFROST WhsePost ori` permission set.

## Field Restrictions

Before applying caller-supplied values to the created Warehouse Pick, the implementation calls `Bifrost Field Access.IsFieldWriteRestricted` on:

- `Warehouse Activity Header."Assigned User ID"` (when `assignedUserId` is supplied)
- `Warehouse Activity Header."Sorting Method"` (when `sortingMethod` is supplied)

A restricted field aborts the request with an Error response — the pick still exists on disk; remove or rerun without the restricted parameter.

## Errors

| Error | Cause |
|---|---|
| `Warehouse Shipment identifier must be specified ...` | No Subject and no identifier key in request JSON. |
| `Warehouse Shipment {id} does not exist.` | Supplied SystemId or No. not found. |
| `Warehouse Shipment {n} has no lines to pick.` | Shipment header exists but has zero lines. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Value not in `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `assignedUserId` or `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` or `doNotFillQtyToHandle` supplied as `true`. |
| `No Warehouse Pick was created for ...` | BC report ran without errors but produced no activity header (nothing to pick, pick already exists, location does not require a pick). |
| `Nothing to handle.` / `There is nothing to create.` | BC report error surfaced as Bifrost Error — no available inventory in source bins. |

## Pitfalls

- **Pick already exists**: BC report 7318 silently produces nothing if an open Warehouse Pick for the Shipment is already on disk. The wrapper surfaces this as `No Warehouse Pick was created for ...`. Inspect `Warehouse Activity Header` (`Type = Pick`, `Whse. Document No.` = your shipment) before deciding to retry.
- **No-pick locations**: If the Shipment's `Location Code` has `Require Pick = false`, BC will not create a pick — you get the same `No Warehouse Pick was created for ...` error. Call `Warehouse.Shipment.Post` directly.
- **Insufficient inventory**: BC report 7318 only creates lines for what is currently available in the source bins, including reservations against other documents. A shipment with `Quantity = 5` may produce a pick with `totalQtyToHandle < 5`. Always compare `totalQtyToHandle` against the shipment line totals before treating the call as fully successful.
- **Bin-mandatory / WMS locations**: Locations with `Bin Mandatory = true` or `Directed Put-away and Pick = true` require source bins to be configured and items to be put away. Without put-away, the pick is empty and you get `No Warehouse Pick was created for ...`.
- **Permission for `assignedUserId`**: The target user must already exist as a `Warehouse Employee` at the pick's `Location Code`. Otherwise BC raises `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Sorting list drift**: The enum `Whse. Activity Sorting Method` is extensible — Microsoft has historically added values. The list above reflects BC 27. If `sortingMethod` is rejected, the error response contains the authoritative list for your tenant.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC report 7318 exposes these on its request page only. The wrapper rejects `true` to avoid silent loss; omit the keys (or send `false`) for default BC behaviour.

## AI-Agent Guidance

When orchestrating this message type from an agent:

1. **Identifier resolution order is fixed**: Subject > `systemId` > `recordSystemId` > `id` > `whseShipmentNo` > `shipmentNo` > `no`. Pick exactly one; do not mix.
2. **Prefer SystemId over `No.`** for repeatable calls — the No. series changes when a Warehouse Shipment is posted/deleted.
3. **Treat `status: "Success"` plus `totalPickLines == 0` as a soft failure** — it means the pick exists but cannot move stock; do not chain to `Warehouse.Pick.Register`.
4. **Idempotency**: This message type is **not** idempotent. If a transient error occurs after BC report 7318 ran but before the response was returned, a retry may create a second pick. Always look up existing picks for the Shipment before retrying.
5. **For partial picks**: Pre-update `Quantity` / `Qty. Outstanding` on the Warehouse Shipment Lines before calling Pick.Create, or modify the resulting Warehouse Activity Lines' `Qty. to Handle` via `Data.Records.Set` before calling `Warehouse.Pick.Register`.

## Workflow Chain

1. `Sales.Document.Release` (or Transfer Order release)
2. `Warehouse.Shipment.Create`
3. **`Warehouse.Pick.Create`** — this message type
4. `Warehouse.Pick.Register`
5. `Warehouse.Shipment.Post`

## Related Message Types

- `Warehouse.Shipment.Create` — produces the input.
- `Warehouse.Pick.Register` — registers the pick after the warehouse worker has picked the items.
- `Warehouse.Shipment.Post` — final step after the pick is registered.
- `Data.Records.Get` — load any field on the resulting `Warehouse Activity Header` / `Warehouse Activity Line`.

