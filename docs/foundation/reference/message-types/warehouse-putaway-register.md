---
id: warehouse-putaway-register
title: "Warehouse.Putaway.Register"
sidebar_label: "Warehouse.Putaway.Register"
sidebar_position: 147
description: "Request and response contract for the Warehouse.Putaway.Register Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Registers a Warehouse Put-away. Wraps BC codeunit 7307 `Whse.-Activity-Register` (the same codeunit used for Pick registration). After registration the bin contents are updated (stock moves from the receive bin to the storage bin), the put-away header is deleted and a row appears in `Registered Whse. Activity Hdr.`, and the source Posted Whse. Receipt Line's `Qty. Put Away` is incremented.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Posting Gate

Requires `Bifrost Posting Type::Warehouse` — i.e. the `BIFROST WhsePost ori` permission set on the message-task user. Without it the request returns an Error response and nothing is registered.

## Identifying the Warehouse Put-away

Provide the put-away via the Bifrost Subject (GUID = SystemId of the activity header, or text = `No.`) or via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Activity Header` (Type = Put-away). |
| `putawayNo` / `no` | `No.` of the `Warehouse Activity Header` (Type = Put-away). |

## Pre-condition: Lines Must Have Qty. to Handle

BC registers only what the warehouse worker has confirmed put away. By default `Warehouse.Putaway.Create` populates `Qty. to Handle` on every line (the `doNotFillQtyToHandle = false` default of the BC report). If you call `Warehouse.Putaway.Register` against a put-away with zero `Qty. to Handle` on every line, BC raises `Nothing to register.`

To register a partial put-away, first call `Data.Records.Set` on `Warehouse Activity Line` to update `Qty. to Handle` per line. On `Bin Mandatory` / `Directed Put-away and Pick` locations put-away lines come in **Take + Place pairs** — update both rows to the same value. On a **non-bin** location (`Bin Mandatory = false`) there is a single line per source line and no pairing (verified live: a 1-line receipt produced 1 put-away line).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `putawayNo` | code[20] | One identifier required | Or use `no` / `systemId` / Subject. |

### Request Example
```json
{ "putawayNo": "WPA000456" }
```

## Response Shape

Verified live (BC 27, CRONUS IS) — registering put-away `PU000025` (1 line, 5 × item `1896-S`) created from Posted Whse. Receipt `R_000030`:

```json
{
  "status": "Success",
  "putawayNo": "PU000025",
  "linesRegistered": 1,
  "totalQtyRegistered": 5,
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "registeredPutawayNo": "PU_000007",
  "registeredPutawaySystemId": "244cf98f-ff61-f111-b7a5-fb5809e04ea8",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "R_000030",
      "lineNo": 10000,
      "sourceDocument": "Purchase Order",
      "sourceNo": "106032",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 5,
      "qtyPutAway": 5,
      "qtyOutstanding": 0,
      "status": "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away PU000025 (1 lines) registered against Posted Whse. Receipt R_000030."
}
```

`qtyPutAway` and `status` on each receipt line reflect the post-registration totals: full registrations transition the line to `Completely Put Away`; partial registrations leave the line at `Partially Put Away` (`Qty. Outstanding > 0`).

## Field Restrictions

None — this message type does not accept any caller-supplied field overrides.

## Errors

| Error | Cause |
|---|---|
| `Warehouse Put-away identifier must be specified ...` | No Subject and no identifier key in request JSON. |
| `Warehouse Put-away {id} does not exist.` | Supplied SystemId or No. not found, or activity is not Type Put-away. |
| `Warehouse Activity {n} is not of Type Put-away.` | Activity exists but is a Pick / Movement / Invt. Put-away. |
| `Warehouse Put-away {n} has no lines.` | Header exists with zero lines (shouldn't happen for put-aways created by BC). |
| `Nothing to register.` | All lines have `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Posting gate (BIFROST WhsePost ori) denied the request. |

## Pitfalls

- **Put-away header disappears after registration**: On `Success` the `Warehouse Activity Header` row is deleted and a `Registered Whse. Activity Hdr.` row appears. A second `Warehouse.Putaway.Register` call against the same `putawayNo` therefore returns `Warehouse Put-away {n} does not exist.` — that is the success indicator, not a failure. Read the history via `Data.Records.Get` on `Registered Whse. Activity Hdr.` (filter by `Whse. Activity No.`).
- **Activity Type filter**: `Warehouse Activity Header` is shared by Picks, Put-aways, Movements, and Invt. Put-aways. The wrapper checks `Type = Put-away` and rejects others — but make sure the `putawayNo` / SystemId you supply is genuinely a Put-away.
- **Partial put-aways need `Data.Records.Set` first**: BC fills `Qty. to Handle` automatically when the put-away is created. If the warehouse worker placed less, update each line's `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) before calling Register. Zero `Qty. to Handle` across all lines yields `Nothing to register.`
- **Take and Place lines (bin locations only)**: On `Bin Mandatory` / `Directed Put-away and Pick` locations BC put-away lines come in pairs — one `Action Type = Take` (from the receive bin) and one `Action Type = Place` (to the storage bin) per source line. When updating `Qty. to Handle`, update **both** rows to the same value or BC rejects the register with `Qty. to Handle (Base) in the line must be equal to ...`. Non-bin locations have a single line per source line with no Take/Place split.
- **Bin contents update**: Registration credits the storage bin and debits the receive bin via `Whse. Item Tracking` and `Bin Content`. Subsequent picks for the same item will pull from the new storage bin.
- **Posting gate**: The message-task user must have `BIFROST WhsePost ori` even though no item ledger entries are produced by put-away registration — BC still treats it as a warehouse posting action.
- **Source Posted Receipt status**: A partially registered put-away leaves the Posted Whse. Receipt Line at `Partially Put Away`. A second `Warehouse.Putaway.Create` against the same Posted Receipt then generates a new put-away for the outstanding quantity.

## AI-Agent Guidance

When orchestrating this message type from an agent:

1. **Identifier resolution order is fixed**: Subject > `systemId` > `recordSystemId` > `id` > `putawayNo` > `no`. Pick exactly one.
2. **Capture `registeredPutawaySystemId` from the response** if you need to navigate to the history record afterwards — re-deriving it from `putawayNo` after registration requires a `Registered Whse. Activity Hdr.` lookup keyed on `Whse. Activity No.`.
3. **Treat `Warehouse Put-away {n} does not exist.` on a known put-away as evidence the put-away was already registered** (the activity header moved to history). Confirm by reading `Registered Whse. Activity Hdr.` before retrying.
4. **Idempotency**: This message type is **not** idempotent — second successful invocation against the same `putawayNo` is impossible because the header is gone. Use `Registered Whse. Activity Hdr.` to check whether registration already happened.
5. **Workflow completion**: On `Success` against the last outstanding line of a Posted Whse. Receipt, the Posted Receipt Line transitions to `Completely Put Away` and the inbound flow is complete. The response includes `postedWhseReceiptNo` and `postedWhseReceiptSystemId` for downstream queries.

## Workflow Chain

1. `Sales.ReturnOrder.Release` (or Purchase Order release)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post`
4. `Warehouse.Putaway.Create`
5. **`Warehouse.Putaway.Register`** — this message type

## Related Message Types

- `Warehouse.Putaway.Create` — produces the input.
- `Data.Records.Set` on `Warehouse Activity Line` — to adjust `Qty. to Handle` before registering a partial put-away.
- `Data.Records.Get` — load any field on the resulting `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line` or on the source `Posted Whse. Receipt Line`.

