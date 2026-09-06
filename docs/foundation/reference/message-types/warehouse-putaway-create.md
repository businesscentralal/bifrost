---
id: warehouse-putaway-create
title: "Warehouse.Putaway.Create"
sidebar_label: "Warehouse.Putaway.Create"
sidebar_position: 146
description: "Request and response contract for the Warehouse.Putaway.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Ensures a Warehouse Put-away exists for an existing Posted Whse. Receipt and returns it. Wraps BC report 7305 `Whse.-Source - Create Document` (the same action invoked by *Create Put-away* on the Posted Warehouse Receipt page) with `SetPostedWhseReceiptLine`. The resulting `Warehouse Activity Header` (`Type = Put-away`) is returned along with line totals.

The message type is **idempotent for the already-created case**: if a put-away already exists for the receipt (most commonly because posting auto-created it — see below), the existing put-away is returned with `"alreadyExisted": true` instead of an error.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Worksheet vs. auto-create — read this first

Whether posting a Warehouse Receipt **auto-creates** the put-away is the single most important thing to understand about this message type. Base app codeunit 5760 `Whse.-Post Receipt` computes:

```
ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"
```

| Location setup | Posting the receipt… | `Warehouse.Putaway.Create` then… |
|---|---|---|
| `Require Put-away = true`, `Use Put-away Worksheet = false` (BC default, e.g. demo locations GULUR / HVÍTUR) | **auto-creates** the put-away | finds report 7305 has nothing left, recovers, and returns the auto-created put-away with `alreadyExisted = true`. |
| `Require Put-away = true`, `Use Put-away Worksheet = true` | does **not** create a put-away (work is left for the worksheet) | creates the put-away fresh and returns `alreadyExisted = false`. |
| `Require Put-away = false` | places stock directly into inventory | no put-away is possible — returns `No Warehouse Put-away was created for ...`. |

So on a standard Require-Put-away location the put-away you receive back was created **by posting**, not by this call. That is expected and correct — chain straight to `Warehouse.Putaway.Register`.

## Prerequisites

- A **Posted** Whse. Receipt must exist for the source. Unposted Warehouse Receipts cannot be used — call `Warehouse.Receipt.Post` first.
- The receipt's `Location Code` must point to a Location with `Require Put-away = true`.
- At least one Posted Whse. Receipt Line must still have `Status <> Completely Put Away` and `Quantity > 0`. (Once everything is put away you get `... has no lines to put away.`)

## Identifying the Posted Whse. Receipt

Provide the posted receipt via the Bifrost Subject (GUID = SystemId, or text = `No.`) or via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Posted Whse. Receipt Header`. |
| `postedWhseReceiptNo` / `receiptNo` / `no` | `No.` of the `Posted Whse. Receipt Header`. |

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `postedWhseReceiptNo` | code[20] | One identifier required | Or use `receiptNo` / `no` / `systemId` / Subject. |
| `assignedUserId` | code[50] | No | Applied to the put-away header (created or pre-existing). Subject to write-restriction on `Warehouse Activity Header."Assigned User ID"`. The user must be a `Warehouse Employee` at the put-away's location. |
| `sortingMethod` | string | No | Case-insensitive name from BC enum `Whse. Activity Sorting Method`. Verified live (BC 27): `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type`. The error response lists the exact set valid on your build. Subject to write-restriction on `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | boolean | No (default false) | Not supported in this API version. Sending `true` returns an error. |
| `doNotFillQtyToHandle` | boolean | No (default false) | Not supported in this API version. Sending `true` returns an error. |

### Request Example
```json
{
  "postedWhseReceiptNo": "R_000030",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Response Shape

Verified live (BC 27, CRONUS IS, location `CEPUT` with `Use Put-away Worksheet = true`, PO of 5 × item `1896-S`):

```json
{
  "status": "Success",
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "putawayNo": "PU000025",
  "putawaySystemId": "31cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "locationCode": "CEPUT",
  "assignedUserId": "",
  "sortingMethod": "None",
  "alreadyExisted": false,
  "totalPutawayLines": 1,
  "totalQtyToHandle": 5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

- `alreadyExisted` — `false` when this call created the put-away; `true` when an open put-away already existed (e.g. posting auto-created it) and was returned as-is.
- `totalPutawayLines` — on a **non-bin** location (`Bin Mandatory = false`) there is **one** put-away line per source line (verified: 1 line for a single-line receipt). On `Bin Mandatory` / `Directed Put-away and Pick` locations each source line becomes a **Take + Place pair**, so the count is roughly double.
- When no `sortingMethod` is supplied, the response returns `"sortingMethod": "None"` (the BC enum's blank/whitespace caption is normalised to `None`).

## Verified Behaviour Matrix

Each row was executed live via the BC Bifrost MCP `call_message_type` tool:

| Scenario | Result |
|---|---|
| Worksheet location, fresh receipt | `Success`, `alreadyExisted = false`, put-away created. |
| Non-worksheet location (posting auto-created) | `Success`, `alreadyExisted = true`, auto-created put-away returned. |
| Call again while an open put-away exists | `Success`, `alreadyExisted = true` (same put-away). |
| Call after the receipt is fully put away | Error `Posted Whse. Receipt {n} has no lines to put away.` |
| `sortingMethod = "NotAMethod"` | Error `sortingMethod 'NotAMethod' is not valid. Expected one of: None, Item, ...` |
| No identifier | Error `Posted Whse. Receipt identifier must be specified ...` |
| Unknown receipt | Error `Posted Whse. Receipt {id} does not exist.` |
| `setBreakbulkFilter = true` | Error `setBreakbulkFilter = true is not supported by this API version. ...` |

## Posting Gate

None — put-away creation does not register stock movement. The companion `Warehouse.Putaway.Register` requires the `BIFROST WhsePost ori` permission set.

## Field Restrictions

Before applying caller-supplied values to the put-away, the implementation calls `Bifrost Field Access.IsFieldWriteRestricted` on:

- `Warehouse Activity Header."Assigned User ID"` (when `assignedUserId` is supplied)
- `Warehouse Activity Header."Sorting Method"` (when `sortingMethod` is supplied)

A restricted field aborts the request with an Error response — the put-away still exists on disk; remove or rerun without the restricted parameter.

## Errors

| Error | Cause |
|---|---|
| `Posted Whse. Receipt identifier must be specified ...` | No Subject and no identifier key in request JSON. |
| `Posted Whse. Receipt {id} does not exist.` | Supplied SystemId or No. not found. |
| `Posted Whse. Receipt {n} has no lines to put away.` | Header exists but every line is `Completely Put Away` or has `Quantity = 0`. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Value not in `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `assignedUserId` or `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` or `doNotFillQtyToHandle` supplied as `true`. |
| `No Warehouse Put-away was created for ...` | Report 7305 ran without error but produced no header AND none pre-existed — e.g. the location does not actually require put-away, or stock was cross-docked. |
| (bin errors, verbatim from BC) | On `Bin Mandatory` / directed locations with no resolvable destination bin: e.g. `There is no Bin ...`. Surfaced unchanged. |

> Note: `There is nothing to handle.` (raised by report 7305 when a put-away already exists) is **no longer surfaced as an error** — the implementation detects the existing put-away and returns it with `alreadyExisted = true`. You will only see that text if the receipt has a put-away on disk that the wrapper somehow cannot match (it should not happen for put-aways created by BC).

## Pitfalls

- **Put-away source is POSTED, not unposted**: A Warehouse Receipt must be posted (via `Warehouse.Receipt.Post`) before a put-away can be created. The unposted `Warehouse Receipt Header` cannot drive put-away creation.
- **The put-away is usually created by posting, not by this call**: On any `Require Put-away` location that is not a worksheet location, posting auto-creates it. `alreadyExisted = true` is the normal, healthy result there — not a warning.
- **New locations need an Inventory Posting Setup row**: Posting the receipt fails with `The Inventory Posting Setup does not exist. ... Location Code='{loc}', Invt. Posting Group Code='{grp}'` until a row exists for the location + each item's Inventory Posting Group. Create it via `Data.Records.Set` on `Inventory Posting Setup` (copy an existing location's accounts).
- **No-put-away locations**: If the receipt's `Location Code` has `Require Put-away = false`, the put-away step is skipped at receipt-posting time and a manual put-away cannot be created either — you get `No Warehouse Put-away was created for ...`. The stock is already in inventory.
- **Bin-mandatory / WMS locations**: Locations with `Bin Mandatory = true` or `Directed Put-away and Pick = true` require destination bins to be configurable (default bin, put-away template, or bin policy). Without one BC raises a bin error which is returned verbatim. Put-away lines come in Take + Place pairs there.
- **Permission for `assignedUserId`**: The target user must already exist as a `Warehouse Employee` at the put-away's `Location Code`. Otherwise BC raises `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Sorting list drift**: The enum `Whse. Activity Sorting Method` is extensible. If `sortingMethod` is rejected, the error response contains the authoritative list for your tenant.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC report 7305 exposes these on its request page only. The wrapper rejects `true` to avoid silent loss; omit the keys (or send `false`) for default BC behaviour.

## AI-Agent Guidance

When orchestrating this message type from an agent:

1. **Identifier resolution order is fixed**: Subject > `systemId` > `recordSystemId` > `id` > `postedWhseReceiptNo` > `receiptNo` > `no`. Pick exactly one; do not mix.
2. **Prefer SystemId over `No.`** for repeatable calls — Posted Whse. Receipt numbers come from a No. Series and may be re-issued in non-production tenants after database restores.
3. **`alreadyExisted` tells you who created the put-away**, not whether it is usable. Either way the `putawayNo` is ready for `Warehouse.Putaway.Register`. Do not treat `alreadyExisted = true` as a failure.
4. **Idempotency**: Safe to retry. A second call against the same receipt returns the same open put-away (`alreadyExisted = true`) rather than creating a duplicate — provided no put-away has been registered in between.
5. **For partial put-aways**: Modify the resulting Warehouse Activity Lines' `Qty. to Handle` via `Data.Records.Set` before calling `Warehouse.Putaway.Register`. Remember Take + Place pairs on bin-mandatory locations.

## Reproduce / Test via the BC Bifrost MCP

A full end-to-end test against a CRONUS-style tenant (all steps are `call_message_type` / `set_records` MCP tools):

1. `set_records` on `Location` — create a worksheet put-away location: `{ RequireReceive: true, RequirePutaway: true, UsePutawayWorksheet: true, BinMandatory: false }`.
2. `set_records` on `Inventory Posting Setup` — add a row for the new location + the item's Invt. Posting Group (copy accounts from an existing location).
3. `Purchase.Document.Create` (subject = vendor No., `data: { documentType: "Order" }`) → note the PO No.
4. `set_records` on `Purchase Line` — add an item line with `LocationCode` = the new location, a `Quantity`, and a `DirectUnitCost`.
5. `Purchase.Document.Release` (subject = PO No.).
6. `Warehouse.Receipt.Create` (`data: { sourceDocuments: [{ sourceType: "PurchaseOrder", documentNo: "<PO>" }] }`). Omit `locationCode` unless it is set on the Purchase **Header** — the filter validates the header, not the line.
7. `Warehouse.Receipt.Post` (`data: { receiptNo: "<WR>" }`) → note `postedWhseReceiptNo`.
8. `Warehouse.Putaway.Create` (subject = posted receipt No.) → `alreadyExisted = false` on a worksheet location; `true` on a non-worksheet location.
9. `Warehouse.Putaway.Register` (subject = `putawayNo`).

## Workflow Chain

1. `Sales.ReturnOrder.Release` (or Purchase Order release)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post` — produces the **Posted** Whse. Receipt that this message type consumes (and, on non-worksheet locations, the put-away itself).
4. **`Warehouse.Putaway.Create`** — this message type
5. `Warehouse.Putaway.Register`

## Related Message Types

- `Warehouse.Receipt.Post` — produces the input (the Posted Whse. Receipt).
- `Warehouse.Putaway.Register` — registers the put-away after the warehouse worker has placed the items.
- `Data.Records.Get` — load any field on the resulting `Warehouse Activity Header` / `Warehouse Activity Line`.

