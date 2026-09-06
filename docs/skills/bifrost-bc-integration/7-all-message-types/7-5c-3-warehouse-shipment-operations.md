---
id: 7-5c-3-warehouse-shipment-operations
title: "7.5c.3 Warehouse shipment operations"
sidebar_label: "7.5c.3 Warehouse shipment operations"
sidebar_position: 11
---

**Subject identification:** Warehouse Shipment `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `shipmentNo`, `no` (SystemId/GUID variants resolve first).

**Posting gate:** `Warehouse.Shipment.Post` is gated by `Warehouse Posting ori` always and by `G/L Posting ori` when `invoice = true`. `Warehouse.Shipment.Create` is not gated (creating a shipment is not a posting operation).

#### `Warehouse.Shipment.Create`

Creates one `Warehouse Shipment Header` per supplied source via BC codeunit 5752 `Get Source Doc. Outbound`. Supported sources: `SalesOrder`, `TransferOrder` (outbound side). BC does **not** merge multiple sources into one shipment automatically — each source produces its own header.

Request:

```json
{
  "sourceDocuments": [
    { "sourceType": "SalesOrder",     "documentNo": "SO-0001" },
    { "sourceType": "TransferOrder",  "documentNo": "TO-0007" }
  ],
  "locationCode":   "BLUE",      // optional; if set, every source must match
  "assignedUserId": "PICKER01",  // optional; applied to each created header after creation
  "postingDate":    "2025-11-15" // optional; applied to each created header after creation
}
```

Response:

```json
{
  "status": "Success",
  "noOfShipments": 1,
  "shipments": [
    {
      "recordSystemId":   "<guid>",
      "no":               "WS-0001",
      "locationCode":     "BLUE",
      "assignedUserId":   "PICKER01",
      "sourceType":       "SalesOrder",
      "sourceDocumentNo": "SO-0001",
      "linesCreated":     2
    }
  ]
}
```

Errors: no sources supplied; unsupported `sourceType`; source document is not `Released`; source location does not have `Require Shipment` = true; no lines were available to ship (already on an open shipment or already being picked); `Location Code` field is write-restricted by `Field Access ori`.

#### `Warehouse.Shipment.Post`

Posts the shipment via BC codeunit 5763 `Whse.-Post Shipment`.

Request:

```json
{ "shipmentNo": "WS-0001", "invoice": true }
```

`invoice` defaults to `false`. When `true`, BC also invoices the underlying source documents (for those source types that support it, e.g. Sales Order).

Response:

```json
{
  "status": "Success",
  "shipmentNo": "WS-0001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS-0001",
  "postedWhseShipmentSystemId": "<guid>",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo":       "S-SHP-0001",
      "sourceDocument":       "Sales Order",
      "sourceNo":             "SO-0001"
    }
  ]
}
```

`postedDocuments` is derived from `Posted Whse. Shipment Line` (filtered by the posted shipment `No.`) and de-duplicated by `(postedSourceDocument, postedSourceNo)`. This generalizes across source types (sales, transfer, etc.).

Errors: missing `Warehouse Posting ori` (or `G/L Posting ori` when `invoice = true`); shipment has no lines; any error raised by `Whse.-Post Shipment` (e.g. `Qty. to Ship` = 0).

#### `Warehouse.Pick.Create`

Creates a Warehouse Pick (`Warehouse Activity Header.Type = Pick`) from a Warehouse Shipment. Wraps BC report 7318 `Whse.-Shipment - Create Pick`. The report call is isolated in codeunit 10078140 `Whse Pick Create Process ori` (`TableNo = "Warehouse Shipment Header"`) so report-time errors surface as Error responses without aborting the outer message-task transaction. Not a posting action — no posting gate.

**Subject identification:** Warehouse Shipment `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `whseShipmentNo`, `shipmentNo`, `no` (SystemId/GUID variants resolve first).

**Prerequisites:** the shipment's `Location Code` must have `Require Pick = true`; the shipment must have at least one line; available stock must exist for BC to build pick lines.

Request:

```json
{
  "whseShipmentNo": "WS-0001",
  "assignedUserId": "PICKER01", // optional; applied to created pick after creation
  "sortingMethod":  "Bin Ranking" // optional; one of enum "Whse. Activity Sorting Method" names (case-insensitive). On BC 27 the valid names are: None, Item, Document, Shelf or Bin, Due Date, Ship-To, Bin Ranking, Action Type. Error response lists the authoritative set for your build. When omitted, response returns sortingMethod = "None".
}
```

Response:

```json
{
  "status": "Success",
  "whseShipmentNo":   "WS-0001",
  "pickNo":           "WPK-0001",
  "pickSystemId":     "<guid>",
  "locationCode":     "WHITE",
  "assignedUserId":   "PICKER01",
  "sortingMethod":    "Bin Ranking",
  "totalPickLines":   4,
  "totalQtyToHandle": 12,
  "message":          "Warehouse Pick WPK-0001 created from Shipment WS-0001 with 4 lines."
}
```

**Field restrictions:** `assignedUserId` and `sortingMethod` are gated by `Field Access ori.IsFieldWriteRestricted` on `Warehouse Activity Header."Assigned User ID"` and `"Sorting Method"` respectively. Supplying a restricted value returns an Error response (the pick is already created on disk at that point — rerun without the restricted parameter or unrestrict the field).

**Unsupported in this API version:** `setBreakbulkFilter = true` and `doNotFillQtyToHandle = true`. Sending either returns an Error response (avoids silent option-loss). The BC defaults (`false`) are honoured.

Errors: missing identifier; shipment does not exist; shipment has no lines; invalid `sortingMethod` (error lists valid names); field-restriction; unsupported option flag; no pick created (nothing to pick, pick already exists, or location does not require a pick); any error raised by BC report 7318.

#### `Warehouse.Pick.Register`

Registers a Warehouse Pick via BC codeunit 7307 `Whse.-Activity-Register` (invoked through `Codeunit.Run` so errors are caught). After registration the source `Warehouse Shipment Line` rows receive `Qty. Picked` / `Qty. to Ship`, the pick header moves to history as `Registered Whse. Activity Hdr.`, and the originating shipment becomes eligible for `Warehouse.Shipment.Post`.

**Posting gate:** `Warehouse Posting ori` (always).

**Subject identification:** Warehouse Pick `No.` (Type = Pick) or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `pickNo`, `no` (SystemId/GUID variants resolve first).

**Pre-condition:** lines must have `Qty. to Handle > 0`. `Warehouse.Pick.Create` populates this on every line (BC report default). To register a partial pick, first call `Data.Records.Set` on `Warehouse Activity Line` to set per-line `Qty. to Handle`.

Request:

```json
{ "pickNo": "WPK-0001" }
```

Response:

```json
{
  "status": "Success",
  "pickNo":              "WPK-0001",
  "linesRegistered":     4,
  "totalQtyRegistered":  12,
  "shipmentNo":          "WS-0001",
  "shipmentSystemId":    "<guid>",
  "registeredPickNo":    "RWPK-0001",
  "registeredPickSystemId": "<guid>",
  "shipmentLines": [
    {
      "shipmentNo":     "WS-0001",
      "lineNo":         10000,
      "sourceDocument": "Sales Order",
      "sourceNo":       "SO-0001",
      "sourceLineNo":   10000,
      "itemNo":         "1896-S",
      "qty":            2,
      "qtyPicked":      2,
      "qtyToShip":      2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK-0001 (4 lines) registered against Warehouse Shipment WS-0001."
}
```

`qtyOutstanding` mirrors `Warehouse Shipment Line."Qty. Outstanding"` (= `Quantity - Qty. Shipped`); pick registration does not ship, so it stays equal to line `Quantity` until `Warehouse.Shipment.Post` runs.

After a successful register the source `Warehouse Activity Header` row is deleted (moved to `Registered Whse. Activity Hdr.`). A second `Warehouse.Pick.Register` against the same `pickNo` therefore returns `Warehouse Pick {n} does not exist.` — that is the success indicator, not a failure. Look the registered pick up via `Data.Records.Get` on table `Registered Whse. Activity Hdr.` filtered by `Whse. Activity No.`.

`shipmentLines` is omitted (empty array) when the pick was not created from a Warehouse Shipment (e.g. inventory pick). `registeredPickNo` is resolved from `Registered Whse. Activity Hdr.` filtered by the original `Whse. Activity No.`.

Errors: missing identifier; pick does not exist or is not Type = Pick; pick has no lines; `Nothing to register.` (all lines have `Qty. to Handle = 0`); missing `Warehouse Posting ori`; any error raised by `Whse.-Activity-Register`.

**Workflow chain:** `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` → `Warehouse.Shipment.Post`.

#### `Warehouse.Putaway.Create`

Ensures a Warehouse Put-away (`Warehouse Activity Header.Type = Put-away`) exists for a **Posted** Whse. Receipt and returns it. Wraps BC report 7305 `Whse.-Source - Create Document` via `SetPostedWhseReceiptLine` (with `Quantity > 0` and `Status <> Completely Put Away` filters — mirroring `PostedWhseReceiptLine.CreatePutAwayDoc` in BC base app). Report call is isolated in codeunit 10078143 `Whse Putaway Create Proc. ori` (`TableNo = "Posted Whse. Receipt Header"`) so report-time errors surface as Error responses. Not a posting action — no posting gate.

**Idempotent / auto-create behaviour (read this first):** whether posting the receipt already created the put-away is governed by base app codeunit 5760 `Whse.-Post Receipt`: `ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"`. On a standard `Require Put-away` location (`Use Put-away Worksheet = false` — the BC default, e.g. demo locations GULUR/HVÍTUR) posting **auto-creates** the put-away; report 7305 then has nothing left and raises `There is nothing to handle.` The implementation detects the already-existing put-away and returns it as `Success` with `alreadyExisted = true` (verified live). Only on a `Use Put-away Worksheet = true` location does this message type create the put-away itself (`alreadyExisted = false`). A repeat call against an unregistered put-away likewise returns the same one — safe to retry.

**Subject identification:** Posted Whse. Receipt `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `postedWhseReceiptNo`, `receiptNo`, `no` (SystemId/GUID variants resolve first).

**Prerequisites:** the receipt's `Location Code` must have `Require Put-away = true`; at least one Posted Whse. Receipt Line must have `Quantity > 0` and `Status <> Completely Put Away`. The Warehouse Receipt must already be posted (call `Warehouse.Receipt.Post` first).

Request:

```json
{
  "postedWhseReceiptNo": "PWR000123",
  "assignedUserId":      "ADMIN",         // optional; applied after creation
  "sortingMethod":       "Bin Ranking"    // optional; same enum + naming as Warehouse.Pick.Create
}
```

Response (verified live, BC 27 / CRONUS IS, worksheet location `CEPUT`, 5 × item `1896-S`):

```json
{
  "status": "Success",
  "postedWhseReceiptNo":       "R_000030",
  "postedWhseReceiptSystemId": "<guid>",
  "putawayNo":                 "PU000025",
  "putawaySystemId":           "<guid>",
  "locationCode":              "CEPUT",
  "assignedUserId":            "",
  "sortingMethod":             "None",
  "alreadyExisted":            false,        // true when posting (or a prior call) already created it
  "totalPutawayLines":         1,            // 1 per source line on non-bin; Take+Place pairs (≈ ×2) on bin/directed locations
  "totalQtyToHandle":          5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

**Field restrictions:** same as `Warehouse.Pick.Create` — `assignedUserId` and `sortingMethod` are gated by `Field Access ori.IsFieldWriteRestricted` on `Warehouse Activity Header."Assigned User ID"` and `"Sorting Method"`.

**Unsupported in this API version:** `setBreakbulkFilter = true` and `doNotFillQtyToHandle = true`. Sending either returns an Error response.

Errors: missing identifier; receipt does not exist; receipt has no lines to put away (every line `Completely Put Away` or `Quantity = 0`); invalid `sortingMethod`; field-restriction; unsupported option flag; `No Warehouse Put-away was created for ...` (report 7305 ran but produced no header AND none pre-existed — e.g. location does not actually require put-away, or cross-dock consumed the lines); any error raised by BC report 7305 (e.g. `No available bin ...` on directed put-away locations without a bin policy). Note: `There is nothing to handle.` (report 7305 when a put-away already exists) is **not** surfaced — it is converted to a `Success` with `alreadyExisted = true`.

#### `Warehouse.Putaway.Register`

Registers a Warehouse Put-away via BC codeunit 7307 `Whse.-Activity-Register` (same codeunit as Pick). After registration the source `Posted Whse. Receipt Line` rows receive `Qty. Put Away` (transitioning Status to `Completely Put Away` on full registration), bin contents are updated (stock moves from receive bin to storage bin), and the put-away header moves to history as `Registered Whse. Activity Hdr.` (the source `Warehouse Activity Header` row is deleted).

**Posting gate:** `Warehouse Posting ori` (always).

**Subject identification:** Warehouse Put-away `No.` (Type = Put-away) or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `putawayNo`, `no` (SystemId/GUID variants resolve first).

**Pre-condition:** lines must have `Qty. to Handle > 0`. `Warehouse.Putaway.Create` populates this on every line. To register a partial put-away, first call `Data.Records.Set` on `Warehouse Activity Line` to set per-line `Qty. to Handle`. On `Bin Mandatory` / `Directed Put-away and Pick` locations put-away lines come in **Take + Place pairs** — update both rows to the same value or BC rejects with `Qty. to Handle (Base) in the line must be equal to ...`. On a **non-bin** location (`Bin Mandatory = false`) there is a single line per source line and no pairing (verified live: a 1-line receipt → 1 put-away line, `linesRegistered = 1`).

Request:

```json
{ "putawayNo": "WPA000456" }
```

Response:

```json
{
  "status": "Success",
  "putawayNo":                  "WPA000456",
  "linesRegistered":            6,
  "totalQtyRegistered":         25,
  "postedWhseReceiptNo":        "PWR000123",
  "postedWhseReceiptSystemId":  "<guid>",
  "registeredPutawayNo":        "RPA000456",
  "registeredPutawaySystemId":  "<guid>",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "PWR000123",
      "lineNo":              10000,
      "sourceDocument":      "Purchase Order",
      "sourceNo":            "106001",
      "sourceLineNo":        10000,
      "itemNo":              "1896-S",
      "qty":                 5,
      "qtyPutAway":          5,
      "qtyOutstanding":      0,
      "status":              "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away WPA000456 (6 lines) registered against Posted Whse. Receipt PWR000123."
}
```

After a successful register the source `Warehouse Activity Header` row is deleted (moved to `Registered Whse. Activity Hdr.`). A second `Warehouse.Putaway.Register` against the same `putawayNo` therefore returns `Warehouse Put-away {n} does not exist.` — that is the success indicator, not a failure. Look the registered put-away up via `Data.Records.Get` on table `Registered Whse. Activity Hdr.` filtered by `Whse. Activity No.`.

`receiptLines` is omitted (empty array) when the put-away was not sourced from a Posted Whse. Receipt. `registeredPutawayNo` is resolved from `Registered Whse. Activity Hdr.` filtered by the original `Whse. Activity No.`.

Errors: missing identifier; put-away does not exist or is not Type = Put-away; put-away has no lines; `Nothing to register.` (all lines have `Qty. to Handle = 0`); missing `Warehouse Posting ori`; any error raised by `Whse.-Activity-Register` (e.g. Take/Place pair mismatch).

**Workflow chain:** `Purchase.Order.Release` (or `Sales.ReturnOrder.Release`) → `Warehouse.Receipt.Create` → `Warehouse.Receipt.Post` → `Warehouse.Putaway.Create` → `Warehouse.Putaway.Register`.

---
