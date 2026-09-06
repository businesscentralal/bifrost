---
id: warehouse-shipment-post
title: "Warehouse.Shipment.Post"
sidebar_label: "Warehouse.Shipment.Post"
sidebar_position: 152
description: "Request and response contract for the Warehouse.Shipment.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts a Warehouse Shipment (ship, optionally invoice). Wraps BC's `Whse.-Post Shipment` (codeunit 5763) and returns the resulting Posted Whse. Shipment plus any Posted Sales Shipments that were created.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Preconditions

Posting depends on the Location of the Warehouse Shipment lines:

- **`Require Pick = false`** — the Warehouse Shipment Line has `Qty. to Ship` already populated by `Warehouse.Shipment.Create`. Post immediately.
- **`Require Pick = true`** (including Directed Put-away and Pick) — the Warehouse Shipment Line starts with `Qty. to Ship = 0`. A Warehouse Pick must be created, picked, and **registered** (BC standard warehouse flow, via the BC client) before this message type will succeed. Without a registered pick BC errors with `There is nothing to post because the document does not contain a quantity or amount.`

Manually writing `Qty. to Ship` on a `Warehouse Shipment Line` to bypass the pick step is rejected by BC (`Qty. to Ship must not be greater than 0 units ...`).

## Identifier Resolution Order

1. `subject` — GUID = `Warehouse Shipment Header.SystemId`, otherwise `Warehouse Shipment Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — `SystemId`.
3. JSON `shipmentNo` / `no` — `Warehouse Shipment Header."No."`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| identifier | various | **Yes** | See resolution order. |
| `invoice` | boolean | No | Default `false` (ship only). When `true`, requires `BIFROST GL Post ori` in addition to `BIFROST WhsePost ori`. |

### Request Example
```json
{
  "shipmentNo": "WS001001",
  "invoice": true
}
```

## Response Shape

```json
{
  "status": "Success",
  "shipmentNo": "WS001001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS001001",
  "postedWhseShipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo": "PS-SHP103001",
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001"
    }
  ]
}
```

`postedWhseShipmentNo` and `postedWhseShipmentSystemId` are only present when the underlying `Whse.-Post Shipment` produced a `Posted Whse. Shipment Header`. `postedDocuments` is derived from `Posted Whse. Shipment Line`, de-duplicated by `(postedSourceDocument, postedSourceNo)`, and generalises across source types (Sales Order → Posted Sales Shipment, Transfer Order → Posted Transfer Shipment, etc.).

## Posting Gate

- **Always**: `BIFROST WhsePost ori` permission set.
- **Additionally when `invoice = true`**: `BIFROST GL Post ori` permission set.

## Field Restrictions

No per-field restriction check — the entire operation is gated by the permission sets above.

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST WhsePost ori' permission set.` | Caller lacks the warehouse posting permission. |
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | `invoice = true` and caller lacks G/L posting. |
| `Warehouse Shipment identifier must be specified ...` | Subject and JSON both empty. |
| `Warehouse Shipment {n} has no lines to post.` | Header exists with zero lines. |
| `There is nothing to post because the document does not contain a quantity or amount.` | All Warehouse Shipment Lines have `Qty. to Ship = 0`. At a `Require Pick = true` location this means no pick has been registered yet — see Preconditions. |
| BC posting errors | Bubble up from `Whse.-Post Shipment` (e.g. open pick exists, item tracking incomplete, posting date locked). |

## End-to-End Workflow

See `Warehouse.Shipment.Create` help for the full chain: `Sales.Document.Create` → `Data.Records.Set` (Sales Line) → `Sales.Document.Release` → `Warehouse.Shipment.Create` → (Warehouse Pick + Register, if `Require Pick = true`) → `Warehouse.Shipment.Post`.

## Related Message Types

- `Warehouse.Shipment.Create` — create the Warehouse Shipment from source documents.
- `Sales.Document.Post` — for the G/L invoice side without the warehouse step.

