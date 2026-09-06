---
id: 7-5c-4-warehouse-receipt-operations
title: "7.5c.4 Warehouse receipt operations"
sidebar_label: "7.5c.4 Warehouse receipt operations"
sidebar_position: 12
---

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

---
