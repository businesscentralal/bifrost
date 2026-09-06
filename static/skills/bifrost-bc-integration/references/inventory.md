# Inventory and warehouse

The item journal and the physical document flow around it: transfer orders, assembly orders, warehouse shipments, picks, put-aways and receipts — each with its create, release, post and preview-post message types.

[← back to SKILL.md](../SKILL.md) · originally sections 7.5c, 7.5c.1 – 7.5c.4 of the single-file skill.

---
### 7.5c ITEM JOURNAL OPERATIONS

**Identification:** Same three modes as general journals (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Inventory.ItemJournal.SetupNewLine` → `Data.Records.Set` → `Inventory.ItemJournal.Check` → `Inventory.ItemJournal.Post` (or `Inventory.ItemJournal.PreviewPost` for a dry run).

#### `Inventory.ItemJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.SetupNewLine", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Returns the new Item Journal Line with `primaryKey { JournalTemplateName, JournalBatchName, LineNo_ }`. Optional: `fieldNumbers`, `noOfLines`, `clearExistingLines`.

#### `Inventory.ItemJournal.Check`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.Check", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Inventory.ItemJournal.Post`

Posts via BC `Item Jnl.-Post Batch` (isolated). Response (success): + `linesPosted`, `postingDate`, `itemRegisterNo`, `itemRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Inventory.ItemJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Item Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Item Ledger Entry` (32), `Value Entry` (5802), and for runs that produce G/L impact also `G/L Entry` (17) and `VAT Entry` (254).

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.PreviewPost", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: same envelope as the other PreviewPost types (`rollback`, `summary`, `totals`, `preview[]` with per-row `id` + `primaryKey` + `fields` + `tableCaption`). `predictedDocumentNos` may contain `"***"` when BC masks an unallocated number-series value.

**Operational notes:**
- **Prefer inserting lines through the BC UI / `Insert(true)` when possible** — AL `OnValidate` triggers populate downstream fields (posting groups, location, costing method) automatically. When lines are inserted via OData/MCP `set_records`, every field BC needs to post must be supplied; `set_records` does **not** fire `OnValidate`.
- Preview rolls back ledger entries but does not roll back side effects on locks (e.g. batch description).

---

### 7.5c.1 TRANSFER ORDER OPERATIONS

Transfer orders use the `Transfer Header` (table 5740) and `Transfer Line` (table 5741) tables.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Transfer Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

**Workflow:** `Inventory.TransferOrder.Create` → `Data.Records.Set` (Transfer Line) → `Inventory.TransferOrder.Release` → `Inventory.TransferOrder.Post` (Ship, then Receive for non-direct).

#### `Inventory.TransferOrder.Create`

Creates a Transfer Header. Required: `transferFromCode`, `transferToCode`. Required when `directTransfer = false`: `inTransitCode`. Optional: `directTransfer`, `postingDate` (defaults to WORKDATE), `shipmentDate`, `receiptDate`, `externalDocumentNo`.

```json
{ "specversion": "1.0", "type": "Inventory.TransferOrder.Create", "source": "MyApp",
  "data": { "transferFromCode": "BLUE", "transferToCode": "RED", "inTransitCode": "OUT. LOG." } }
```

Response: `status`, `documentNo`, `systemId`, `transferFromCode`, `transferToCode`, `inTransitCode`, `directTransfer`, `postingDate`, `shipmentDate`, `receiptDate`, `externalDocumentNo`, `statusAfter` (= `"Open"`).

#### `Inventory.TransferOrder.Release`

Calls codeunit 5708 `Release Transfer Document`. Response: `status`, `documentNo`, `transferFromCode`, `transferToCode`, `directTransfer`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.TransferOrder.Reopen`

Calls codeunit 5708 `Release Transfer Document`.Reopen. Same response shape as `Release` but with status transition Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.TransferOrder.Post`

Calls codeunit 5706 `TransferOrder-Post (Yes/No)`. Request: `postingType` = `"Ship"` or `"Receive"` (case-insensitive). Required for non-direct transfers; ignored for direct transfers (BC's Inventory Setup `Direct Transfer Posting` decides Receipt+Shipment vs. single Direct Transfer).

Response: `status`, `documentNo`, `postingType`, `directTransfer`, `postedShipmentNo`, `postedReceiptNo`, `postingDate`. Posted numbers are populated by diffing `Last Shipment No.` / `Last Receipt No.` on the Transfer Header before and after posting.

#### `Inventory.TransferOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table, each with `rows[]`.
- `predictedNumbers` — next document number(s) BC would assign: `postedShipmentNo` (non-direct Ship), `postedReceiptNo` (non-direct Receive), or `postedDirectTransferNo` (direct).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.TransferOrder.Statistics`

Mirrors Page 5755 `Transfer Statistics`. Read-only. Response includes header fields plus `totals { lineCount, quantity, parcels, netWeight, grossWeight, volume }`. Derived lines (`Derived From Line No. <> 0`) are excluded.

---

### 7.5c.2 ASSEMBLY ORDER OPERATIONS

Assembly orders use the `Assembly Header` (table 900) and `Assembly Line` (table 901) tables. Document Type is always `Order`.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Assembly Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`. The lookup is constrained to Document Type = Order via the helper `Argument.FindAssemblyHeader(...)` on the message argument table.

**Workflow:** `Inventory.AssemblyOrder.Create` (refreshes BOM by default) → optional `Data.Records.Set` on Assembly Line → optional `Inventory.AssemblyOrder.RefreshLines` after header field changes → `Inventory.AssemblyOrder.Release` → `Inventory.AssemblyOrder.Post`.

#### `Inventory.AssemblyOrder.Create`

Creates an Assembly Header (Document Type = Order). Required: `itemNo`, `quantity` (> 0). Optional: `variantCode`, `locationCode`, `binCode`, `unitOfMeasureCode`, `description`, `postingDate` (defaults to WORKDATE), `dueDate`, `startingDate`, `endingDate`, `quantityToAssemble`, `refreshLines` (default `true`).

Response: `status`, `documentNo`, `systemId`, `itemNo`, `variantCode`, `description`, `locationCode`, `binCode`, `unitOfMeasureCode`, `quantity`, `quantityToAssemble`, `postingDate`, `dueDate`, `startingDate`, `endingDate`, `statusAfter` (= `"Open"`), `lineCount`.

#### `Inventory.AssemblyOrder.RefreshLines`

Refreshes BOM component lines on an existing assembly order. Use this after editing `Item No.`, `Quantity`, `Variant Code`, `Location Code`, or `Unit of Measure Code` on the header. Response: `status`, `documentNo`, `linesBefore`, `linesAfter`, `statusAfter`. Errors if the header is Released.

**Cloud-safe implementation:** `RefreshBOM` is `[Scope('OnPrem')]` in BC27. The implementation calls `AssemblyHeader.Validate("Item No.", AssemblyHeader."Item No.")` which triggers the same BOM-refresh path via the table's `OnValidate("Item No.")` trigger.

#### `Inventory.AssemblyOrder.Release`

Calls codeunit 414 `Release Assembly Document`. Response: `status`, `documentNo`, `itemNo`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.AssemblyOrder.Reopen`

Calls codeunit 414 `Release Assembly Document`.Reopen via an isolated process codeunit (`Asm. Order Reopen Process ori`, `Codeunit.Run` pattern) so BC errors return as a structured Error response. Same response shape as `Release` with Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.AssemblyOrder.Post`

Calls codeunit 900 `Assembly-Post`. Request: optional `postingDate` overrides the header value.

Response: `status`, `documentNo`, `postedDocumentNo`, `postedSystemId`, `postedQuantity`, `assembleToOrder`, `postingDate`. `assembleToOrder` is `true` when the source is a sales order (Assemble-to-Order); in that case the source sales line is updated. `postedSystemId` is the SystemId of the resulting `Posted Assembly Header` (table 910).

#### `Inventory.AssemblyOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table (Item Ledger, Value Entry, Capacity Ledger, G/L Entry), each with `rows[]`.
- `predictedNumbers` — `postedDocumentNo` (the next Posted Assembly Order No. BC would assign).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.AssemblyOrder.Statistics`

Mirrors Page 920 `Assembly Order Statistics`. Read-only. Response includes header fields plus a `cost` object: `expectedMaterialCost`, `expectedResourceCost`, `expectedResourceOverheadCost`, `expectedAssemblyOverheadCost`, `expectedTotalCost`, and the matching `actual*` fields. Expected costs are summed from `Cost Amount` on assembly lines; actual costs are computed via `CalcActualCosts` from Item Ledger / Capacity Ledger entries.

---

### 7.5c.3 WAREHOUSE SHIPMENT OPERATIONS

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

### 7.5c.4 WAREHOUSE RECEIPT OPERATIONS

**Subject identification:** Warehouse Receipt `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `receiptNo`, `no` (SystemId/GUID variants resolve first).

**Posting gate:** `Warehouse.Receipt.Post` is gated by `Warehouse Posting ori`. There is no invoice option and no G/L posting gate (warehouse receipts only post receipt of goods). `Warehouse.Receipt.Create` and `Warehouse.Receipt.Post.Preview` are not gated.

#### `Warehouse.Receipt.Create`

Creates one `Warehouse Receipt Header` per supplied source via BC codeunit 5751 `Get Source Doc. Inbound`. Supported sources: `PurchaseOrder`, `SalesReturnOrder`, `TransferOrder` (inbound side — `Transfer-to Code`).

Request:

```json
{
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder",    "documentNo": "PO-0001" },
    { "sourceType": "TransferOrder",    "documentNo": "TO-0007" }
  ],
  "locationCode":   "BLUE",        // optional; if set, every source must receive here
  "assignedUserId": "RECEIVER01",  // optional; applied to each created header after creation
  "postingDate":    "2025-11-15"   // optional; applied to each created header after creation
}
```

Response:

```json
{
  "status": "Success",
  "noOfReceipts": 1,
  "receipts": [
    {
      "recordSystemId":   "<guid>",
      "no":               "WR-0001",
      "locationCode":     "BLUE",
      "assignedUserId":   "RECEIVER01",
      "sourceType":       "PurchaseOrder",
      "sourceDocumentNo": "PO-0001",
      "linesCreated":     2
    }
  ]
}
```

Location source per type: `PurchaseOrder` uses `Purchase Header."Location Code"`, `SalesReturnOrder` uses `Sales Header."Location Code"`, `TransferOrder` uses `Transfer Header."Transfer-to Code"`.

Errors: no sources supplied; unsupported `sourceType`; source document not `Released` (exact: `Purchase Order '<no>' is not Released. Release it before creating a Warehouse Receipt.`, or per-type equivalents); receiving location does not have `Require Receive` = true; bundled `No Warehouse Receipt was created for <sourceType> '<no>' — already on an open receipt, no lines remain to receive, or put-away already started.`; `Location Code` field write-restricted by `Field Access ori`.

**Discovery:** to enumerate receipt-required locations, call `Data.Records.Get` on `Location` (table 14) with `tableView = "WHERE(Require Receive=CONST(true))"`. Inspect `RequirePutaway`, `DirectedPutawayandPick`, and `BinMandatory` to anticipate downstream put-away or bin behaviour.

#### `Warehouse.Receipt.Post`

Posts the receipt via BC codeunit 5760 `Whse.-Post Receipt`. No invoice option. After a successful post BC deletes the `Warehouse Receipt Header`.

Request:

```json
{ "receiptNo": "WR-0001" }
```

Or via subject (GUID or text).

Response:

```json
{
  "status": "Success",
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "<guid>",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo":       "107242",
      "sourceDocument":       "Purchase Order",
      "sourceNo":             "106031"
    }
  ]
}
```

Numbers are example only — `postedWhseReceiptNo` comes from the location's `Whse. Receipt Nos.` series, `postedSourceNo` from the source's posting series. `postedSourceDocument` is one of `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`. `postedDocuments` is derived from `Posted Whse. Receipt Line` and de-duplicated by `(postedSourceDocument, postedSourceNo)`.

Errors: missing identifier; missing `Warehouse Posting ori`; receipt has no lines; `The Warehouse Receipt Header does not exist.` (re-posting an already-posted identifier); any error raised by `Whse.-Post Receipt` (e.g. quantity to receive zero, item tracking incomplete, posting date locked, missing Bin Code on a directed put-away/pick location).

#### `Warehouse.Receipt.Post.Preview`

Simulates posting via `Whse.-Post Receipt (Yes/No)` (codeunit 5761) bound with `EventSubscriberInstance = Manual`. The wrapper's `OnRunPreview` subscriber sets preview mode on `Whse.-Post Receipt` (5760), and `Gen. Jnl.-Post Preview.SetContext + Run()` rolls back the transaction. Returns `predictedNumbers`, `totals`, `preview[]` per captured table.

Request: same identifier shape as `Warehouse.Receipt.Post`.

Captured tables (BC's preview whitelist): `Item Ledger Entry` (32) and `Value Entry` (5802) are always present (one per receipt line). `G/L Entry` (17) only appears if cost adjustment runs inline. `Posted Whse. Receipt Header` (7320) is **not** captured — `predictedNumbers.postedWhseReceiptNo` is always emitted but always empty.

Number redaction: BC's preview replaces assigned numbers with `***` to signal rollback. Affects `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` and `preview[].rows[].DocumentNo_` on Item Ledger / Value Entry rows.

Response:

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableName": "Item Ledger Entry", "tableNo": 32, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] },
    { "tableName": "Value Entry",       "tableNo": 5802, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] }
  ]
}
```

`predictedNumbers` key set varies by source type: `postedPurchaseReceiptNo` (PO), `postedReturnReceiptNo` (sales return), `postedTransferReceiptNo` (inbound transfer) — each value is always `***` in preview. `postedWhseReceiptNo` is always emitted but always empty. Warehouse receipts have no direct G/L impact — `balanced` is `true` with zero totals. Use `Warehouse.Receipt.Post` to obtain real numbers.

Errors: missing identifier; receipt has no lines; any error raised by `Whse.-Post Receipt` (same conditions as the real post).

#### `Warehouse.Shipment.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Whse.-Post Shipment (Yes/No)` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Item Ledger Entry` (32), `Value Entry` (5802), `Posted Whse. Shipment Header/Line` (7322/7323), `Sales Shipment Header/Line` (110/111), and for the invoice side `Sales Invoice Header/Line` (112/113), `G/L Entry` (17), `VAT Entry` (254), `Cust. Ledger Entry` (21).

**The invoice flag is forced.** The BC `Whse.-Post Shipment (Yes/No)` preview subscriber forces `Invoice = true`. The response `invoice` field is therefore **always `true`** — to preview shipment-only behaviour, drive the source document's preview type (e.g. `Sales.Document.PreviewPost`) instead.

```json
{ "specversion": "1.0", "type": "Warehouse.Shipment.PreviewPost", "source": "MyApp", "subject": "WS-0001" }
```

Response uses the same envelope as other PreviewPost types. Notable:
- `shipmentNo` / `locationCode` identify the header.
- `invoice` is always `true`.
- `linesToPost` is the number of Warehouse Shipment Lines submitted to preview.
- `predictedNumbers` enumerates predicted `Document No.` values (e.g. the next sales invoice number). May contain `"***"`.

**Operational notes:**
- **WMS locations require a registered pick first.** On a location with `Require Pick = true` (e.g. CRONUS `WHITE` / `GULUR`), a freshly created Warehouse Shipment Line starts with `Qty. to Ship = 0`. A Warehouse Pick must be **created and registered** before preview will produce any output — pick registration is what writes `Qty. to Ship` back onto the line.
- **Locations with `Require Shipment = true` and `Require Pick = false`** behave like a direct shipment flow: `Qty. to Ship` is populated when the line is created, and preview runs immediately without a pick.
- The forced-invoice behaviour means `G/L Posting ori` would also be required for the equivalent live post, but preview does not enforce permission gates.
