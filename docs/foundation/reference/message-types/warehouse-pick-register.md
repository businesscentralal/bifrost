---
id: warehouse-pick-register
title: "Warehouse.Pick.Register"
sidebar_label: "Warehouse.Pick.Register"
sidebar_position: 145
description: "Request and response contract for the Warehouse.Pick.Register Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Registers a Warehouse Pick. Wraps BC codeunit 7307 `Whse.-Activity-Register`. After registration the source `Warehouse Shipment Line` rows receive the picked quantity (`Qty. Picked` and `Qty. to Ship`), the pick header moves to history (`Registered Whse. Activity Hdr.`), and the originating Warehouse Shipment becomes eligible for `Warehouse.Shipment.Post`.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Posting Gate

Requires `Bifrost Posting Type::Warehouse` — i.e. the `BIFROST WhsePost ori` permission set on the message-task user. Without it the request returns an Error response and nothing is registered.

## Identifying the Warehouse Pick

Provide the pick via the Bifrost Subject (GUID = SystemId of the activity header, or text = `No.`) or via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Activity Header` (Type = Pick). |
| `pickNo` / `no` | `No.` of the `Warehouse Activity Header` (Type = Pick). |

## Pre-condition: Lines Must Have Qty. to Handle

BC registers only what the warehouse worker has confirmed picked. By default `Warehouse.Pick.Create` populates `Qty. to Handle` on every line (the `doNotFillQtyToHandle = false` default of the BC report). If you call `Warehouse.Pick.Register` against a pick with zero `Qty. to Handle` on every line, BC raises `Nothing to register.`

To register a partial pick, first call `Data.Records.Set` on `Warehouse Activity Line` to update `Qty. to Handle` per line.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `pickNo` | code[20] | One identifier required | Or use `no` / `systemId` / Subject. |

### Request Example
```json
{ "pickNo": "WPK000123" }
```

## Response Shape

```json
{
  "status": "Success",
  "pickNo": "WPK000123",
  "linesRegistered": 4,
  "totalQtyRegistered": 12,
  "shipmentNo": "WS001001",
  "shipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "registeredPickNo": "RWPK000123",
  "registeredPickSystemId": "00000000-0000-0000-0000-000000000000",
  "shipmentLines": [
    {
      "shipmentNo": "WS001001",
      "lineNo": 10000,
      "sourceDocument": "Sales Order",
      "sourceNo": "101028",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 2,
      "qtyPicked": 2,
      "qtyToShip": 2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK000123 (4 lines) registered against Warehouse Shipment WS001001."
}
```

`qtyOutstanding` mirrors the BC `Warehouse Shipment Line."Qty. Outstanding"` flow — it is `Quantity - Qty. Shipped`. Pick registration does **not** ship, so `qtyOutstanding` stays at the line `Quantity` until `Warehouse.Shipment.Post` runs.

## Field Restrictions

None — this message type does not accept any caller-supplied field overrides.

## Errors

| Error | Cause |
|---|---|
| `Warehouse Pick identifier must be specified ...` | No Subject and no identifier key in request JSON. |
| `Warehouse Pick {id} does not exist.` | Supplied SystemId or No. not found, or activity is not Type Pick. |
| `Warehouse Activity {n} is not of Type Pick.` | Activity exists but is a Put-away / Movement / Invt. Pick. |
| `Warehouse Pick {n} has no lines.` | Header exists with zero lines (shouldn't happen for picks created by BC). |
| `Nothing to register.` | All lines have `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Posting gate (BIFROST WhsePost ori) denied the request. |

## Pitfalls

- **Pick header disappears after registration**: On `Success` the `Warehouse Activity Header` row is deleted and a `Registered Whse. Activity Hdr.` row appears. A second `Warehouse.Pick.Register` call against the same `pickNo` therefore returns `Warehouse Pick {n} does not exist.` — that is the success indicator, not a failure. Read the history via `Data.Records.Get` on `Registered Whse. Activity Hdr.` (filter by `Whse. Activity No.`).
- **Activity Type filter**: `Warehouse Activity Header` is shared by Picks, Put-aways, Movements, and Invt. Picks. The wrapper checks `Type = Pick` and rejects others — but make sure the `pickNo` / SystemId you supply is genuinely a Pick.
- **Partial picks need `Data.Records.Set` first**: BC fills `Qty. to Handle` automatically when the pick is created. If the warehouse worker picked less, update each line's `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) before calling Register. Zero `Qty. to Handle` across all lines yields `Nothing to register.`
- **Both Take and Place lines**: BC pick lines come in pairs — one `Action Type = Take` and one `Action Type = Place` per source line. When updating `Qty. to Handle`, update **both** rows to the same value or BC rejects the register with `Qty. to Handle (Base) in the line must be equal to ...`.
- **Source Shipment must still be Released**: If the source `Warehouse Shipment` was deleted/reopened after pick creation, registration fails. The wrapper surfaces the BC error text verbatim via `GetLastErrorText`.
- **Posting gate**: The message-task user must have `BIFROST WhsePost ori` even though no inventory ledger entries are produced by registration — BC still treats it as a warehouse posting action.
- **Does not ship**: Registration only updates `Qty. Picked` and `Qty. to Ship` on the Warehouse Shipment Line — `Qty. Outstanding` is unchanged until `Warehouse.Shipment.Post` runs.

## AI-Agent Guidance

When orchestrating this message type from an agent:

1. **Identifier resolution order is fixed**: Subject > `systemId` > `recordSystemId` > `id` > `pickNo` > `no`. Pick exactly one.
2. **Capture `registeredPickSystemId` from the response** if you need to navigate to the history record afterwards — re-deriving it from `pickNo` after registration requires a `Registered Whse. Activity Hdr.` lookup keyed on `Whse. Activity No.`.
3. **Treat `Warehouse Pick {n} does not exist.` on a known pick as evidence the pick was already registered** (the activity header moved to history). Confirm by reading `Registered Whse. Activity Hdr.` before retrying.
4. **Idempotency**: This message type is **not** idempotent — second successful invocation against the same `pickNo` is impossible because the header is gone. Use `Registered Whse. Activity Hdr.` to check whether registration already happened.
5. **Workflow continuation**: On `Success`, the originating Warehouse Shipment is ready for `Warehouse.Shipment.Post`. The response includes `shipmentNo` and `shipmentSystemId` for that chained call.

## Workflow Chain

1. `Sales.Document.Release` (or Transfer Order release)
2. `Warehouse.Shipment.Create`
3. `Warehouse.Pick.Create`
4. **`Warehouse.Pick.Register`** — this message type
5. `Warehouse.Shipment.Post`

## Related Message Types

- `Warehouse.Pick.Create` — produces the input.
- `Warehouse.Shipment.Post` — call after registration to ship the Warehouse Shipment.
- `Data.Records.Set` on `Warehouse Activity Line` — to adjust `Qty. to Handle` before registering a partial pick.
- `Data.Records.Get` — load any field on the resulting `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line`.

