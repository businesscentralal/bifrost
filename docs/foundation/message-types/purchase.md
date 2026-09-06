---
id: purchase
title: "Purchase message types"
sidebar_position: 4
---

**Parent Document:** [API_Reference.md](/foundation/reference/api/)  
**Implementation Folder:** `app/src/Message Type/Implementations/Purchases/`

---

## Overview

This document describes the Purchase Order message types in the Bifrost API. These message types provide lifecycle management for purchase orders, mirroring the same operations available for sales orders.

| Message Type | Direction | Purpose | Related Table(s) |
|--------------|-----------|---------|------------------|
| Purchase.Document.Release | Inbound | Release an open purchase order to make it ready for receipt and invoicing | Purchase Header (38) |
| Purchase.Document.Reopen | Inbound | Reopen a released or pending approval purchase document to allow modifications | Purchase Header (38) |
| Purchase.Document.Statistics | Outbound | Retrieve purchase document statistics including amounts, VAT totals, quantities, weight and volume | Purchase Header (38) |
| Purchase.Document.Post | Inbound | Post a purchase document and return the resulting posted invoice number | Purchase Header (38), Purch. Inv. Header (122) |
| Purchase.Document.PreviewPost | Inbound | Simulate posting a purchase document and return every captured ledger entry without committing | Purchase Header (38) + every ledger table populated by the BC posting routine (dynamic; native support for G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Vendor / Detailed Vendor Ledger, Cust. / Detailed Cust. Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger) |
| Purchase.Document.Create | Inbound | Create a new purchase document header for a specified vendor and document type | Purchase Header (38) |
| Vendor.Application.Post | Inbound | Apply one vendor ledger entry against one or more open vendor ledger entries via codeunit 227 | Vendor Ledger Entry (25) |
| Vendor.Application.Reverse | Inbound | Reverse (unapply) a posted application on a vendor ledger entry via codeunit 227 | Vendor Ledger Entry (25) |
| Purchase.Quote.MakeOrder | Inbound | Convert a purchase quote into a purchase order via BC codeunit 96 "Purch.-Quote to Order" | Purchase Header (38) |
| Purchase.BlanketOrder.MakeOrder | Inbound | Convert a purchase blanket order into a purchase order via BC codeunit 97 "Blanket Purch. Order to Order" | Purchase Header (38) |
| Purchase.PurchaseInvoice.Correct | Inbound | Cancel a posted purchase invoice and create a new draft purchase invoice for correction via BC codeunit 1313 | Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124), Purchase Header (38) |
| Purchase.PurchaseInvoice.Cancel | Inbound | Cancel a posted purchase invoice by posting a corrective credit memo via BC codeunit 1313 | Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124) |

---

## Purchase.Document.Release

**Purpose:** Release an open purchase document, changing its status from Open to Released.

**Description:** Releases a purchase document using the standard Business Central Release Purchase Document codeunit. Supports all purchase document types: Order, Invoice, Credit Memo, and Return Order. A released document is ready for receipt and invoicing.

**Message Direction:** Inbound

**Input Parameters:**

The document number can be specified in the **subject** field, as a SystemId (GUID) in the **subject** field, or in the **data** field:

```json
{ "subject": "PO-001" }
```

Or:

```json
{ "data": { "orderNo": "PO-001" } }
```

Or by SystemId:

```json
{ "subject": "{12345678-1234-1234-1234-123456789012}" }
```

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Open",
  "statusAfter": "Released",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Response Fields:**

- **status**: Processing status ("Success" or "Error")
- **documentType**: Actual document type of the found record (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Purchase document number
- **vendorNo**: Buy-from vendor number
- **vendorName**: Buy-from vendor name
- **statusBefore**: Document status before release (typically "Open")
- **statusAfter**: Document status after release (typically "Released" on success)
- **documentDate**: Order date
- **amount**: Total amount excluding VAT
- **amountIncludingVAT**: Total amount including VAT

**Notes:**

- Uses the standard Business Central `"Release Purchase Document"` codeunit
- Filter Table No: 38 (Purchase Header)
- Message Direction: Inbound

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Release",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Error Scenarios:**

- `"Purchase document not found."` — document number or SystemId does not exist
- `"Purchase Order PO-001 is already released."` — document is already in Released status
- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — no identifier provided

**Related Message Types:**

- [Purchase.Document.Reopen](#purchasedocumentreopen): Reopen a released order to make changes
- [Purchase.Document.Statistics](#purchasedocumentstatistics): View order totals
- [Purchase.Document.Post](#purchasedocumentpost): Post the released order

---

## Purchase.Document.Reopen

**Purpose:** Reopen a purchase document, changing its status from Released or Pending Approval back to Open.

**Description:** Reopens a purchase document using the standard Business Central `"Purch. Manual Reopen"` codeunit for Released documents, or directly sets status to Open for Pending Approval documents without approval entries. Supports all purchase document types: Order, Invoice, Credit Memo, and Return Order. This allows modifications to be made before re-releasing and posting.

**Message Direction:** Inbound

**Input Parameters:**

The document number can be specified in the **subject** field, as a SystemId (GUID), or in the **data** field:

```json
{ "subject": "PO-001" }
```

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Response Fields:**

- **status**: Processing status ("Success" or "Error")
- **documentType**: Actual document type of the found record (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Purchase document number
- **vendorNo**: Buy-from vendor number
- **vendorName**: Buy-from vendor name
- **statusBefore**: Document status before reopen (e.g. "Released" or "Pending Approval")
- **statusAfter**: Document status after reopen (typically "Open" on success)
- **documentDate**: Order date
- **amount**: Total amount excluding VAT
- **amountIncludingVAT**: Total amount including VAT

**Notes:**

- Uses the standard Business Central `"Purch. Manual Reopen"` codeunit for Released documents
- For Pending Approval documents without approval entries, directly sets status to Open
- Filter Table No: 38 (Purchase Header)
- Message Direction: Inbound

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Reopen",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Error Scenarios:**

- `"Purchase document not found."` — document number or SystemId does not exist
- `"Purchase Order PO-001 is already open."` — document is already in Open status
- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — no identifier provided

**Related Message Types:**

- [Purchase.Document.Release](#purchasedocumentrelease): Release after making changes
- [Purchase.Document.Post](#purchasedocumentpost): Post the order

---

## Purchase.Document.Statistics

**Purpose:** Retrieve comprehensive statistics for a purchase document including amounts, VAT totals, quantities, weight and volume.

**Description:** Returns the same information displayed on the Purchase Statistics page in Business Central, calculated in real-time from the current state of the document. Supports all purchase document types: Order, Invoice, Credit Memo, and Return Order.

**Message Direction:** Outbound

**Input Parameters:**

The document number can be specified in the **subject** field, as a SystemId (GUID), or in the **data** field:

```json
{ "subject": "PO-001" }
```

Or:

```json
{
  "data": { "orderNo": "PO-001" }
}
```

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "currencyCode": "",
  "documentDate": "2026-03-07",
  "order": {
    "amount": 5000.00,
    "lineDiscountAmount": 150.00,
    "invoiceDiscountAmount": 250.00,
    "totalExclVAT": 4750.00,
    "vatAmount": 1187.50,
    "totalInclVAT": 5937.50,
    "quantity": 100,
    "totalWeight": 125.50,
    "totalVolume": 2.35,
    "noOfVATLines": 1
  },
  "vat_totals": [
    {
      "vatIdentifier": "STANDARD",
      "vatPct": 25.00,
      "lineAmount": 4750.00,
      "vatBase": 4750.00,
      "vatAmount": 1187.50,
      "amountInclVAT": 5937.50
    }
  ]
}
```

**Response Fields:**

Top level:
- **status**: Processing status ("Success" or "Error")
- **documentType**: Actual document type of the found record (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Purchase document number
- **vendorNo**: Buy-from vendor number
- **vendorName**: Buy-from vendor name
- **currencyCode**: Currency code (blank = LCY)
- **documentDate**: Order date

`order` group:
- **amount**: Total line amount excluding VAT (from Purchase Header)
- **lineDiscountAmount**: Sum of all line discounts
- **invoiceDiscountAmount**: Total invoice discount amount
- **totalExclVAT**: Total amount excluding VAT (after all discounts)
- **vatAmount**: Total VAT amount
- **totalInclVAT**: Total amount including VAT
- **quantity**: Total quantity of all lines
- **totalWeight**: Total gross weight (quantity × gross weight per item)
- **totalVolume**: Total volume (quantity × unit volume per item)
- **noOfVATLines**: Number of different VAT rates in the document

`vat_totals` array (one entry per VAT rate):
- **vatIdentifier**: VAT identifier grouping code
- **vatPct**: VAT percentage rate
- **lineAmount**: Total line amount for this VAT rate
- **vatBase**: Amount subject to this VAT rate (excluding VAT)
- **vatAmount**: VAT amount for this rate
- **amountInclVAT**: Total including VAT for this rate

**Notes:**

- All amounts are rounded using the currency precision of the document
- Statistics are calculated in real-time from the current document state
- VAT calculations use `PurchaseLine.CalcVATAmountLines(QtyType::General, ...)`
- Filter Table No: 38 (Purchase Header)
- Message Direction: Outbound

**Example Requests:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Statistics",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Related Message Types:**

- [Purchase.Document.Release](#purchasedocumentrelease): Release the order
- [Purchase.Document.Post](#purchasedocumentpost): Post the order

---

## Purchase.Document.Post

**Purpose:** Post a purchase document and return all resulting posted documents.

**Description:** Posts a purchase document using the standard Business Central `"Purch.-Post"` codeunit. Supports all four purchase document types: Order, Invoice, Credit Memo, and Return Order. The document must have at least one line. After successful posting the original document is consumed and one or more posted documents are created. The response contains details of each posted document in a `postedDocuments` array.

| Document Type | Posted Documents Created |
|---------------|-------------------------|
| Order | Posted Purchase Invoice + Purchase Receipt |
| Invoice | Posted Purchase Invoice |
| Credit Memo | Posted Purchase Credit Memo |
| Return Order | Posted Purchase Credit Memo + Return Shipment |

**Message Direction:** Inbound

**Input Parameters:**

The document number can be specified in the **subject** field, as a SystemId (GUID), or in the **data** field:

```json
{ "subject": "PO-001" }
```

Or:

```json
{ "data": { "orderNo": "PO-001" } }
```

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "postedDocuments": [
    {
      "type": "Posted Purchase Invoice",
      "recordSystemId": "a1b2c3d4-...",
      "no": "PI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "vendorLedgerEntryNo": 12345
    },
    {
      "type": "Purchase Receipt",
      "recordSystemId": "e5f6a7b8-...",
      "no": "PR-001",
      "postingDate": "2026-03-16",
      "amount": 0,
      "amountIncludingVAT": 0,
      "vendorLedgerEntryNo": 0
    }
  ]
}
```

**Response Fields:**

### Top Level

- **status**: Processing status ("Success" or "Error")
- **documentType**: Document type that was posted (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Original document number that was posted
- **vendorNo**: Buy-from vendor number
- **vendorName**: Buy-from vendor name
- **error**: Error message (only present when status is "Error")
- **callstack**: Error callstack (only present when status is "Error")

### postedDocuments Array

Each entry represents one posted document created by the posting operation:

- **type**: Type of posted document (e.g. "Posted Purchase Invoice", "Purchase Receipt", "Posted Purchase Credit Memo", "Return Shipment")
- **recordSystemId**: SystemId (GUID) of the posted document header
- **no**: Document number of the posted document
- **postingDate**: Posting date
- **amount**: Total amount excluding VAT (0 for receipts and return shipments)
- **amountIncludingVAT**: Total amount including VAT (0 for receipts and return shipments)
- **vendorLedgerEntryNo**: Vendor ledger entry number (0 for receipts and return shipments)

**Notes:**

- Uses the standard Business Central `"Purch.-Post"` codeunit
- The original document is consumed after successful posting
- Receipts and return shipments have no financial amounts (amount = 0); only invoices and credit memos carry full financial details
- The document does not need to be in Released status before posting; Business Central handles release internally
- Filter Table No: 38 (Purchase Header)
- Message Direction: Inbound

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Post",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Error Scenarios:**

- `"Purchase document not found."` — document number or SystemId does not exist
- `"Purchase document PO-001 has no lines to post."` — document exists but has no lines
- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — no identifier provided
- Any BC posting validation error (missing posting groups, blocked items, etc.)

**Related Message Types:**

- [Purchase.Document.Release](#purchasedocumentrelease): Release a document before posting
- [Purchase.Document.Reopen](#purchasedocumentreopen): Reopen a released document to make changes
- [Purchase.Document.Statistics](#purchasedocumentstatistics): Retrieve document totals before posting

---

## Purchase.Document.Create

**Purpose:** Create a new purchase document header for a specified vendor and document type.

**Direction:** Inbound (Action request)

**Filter Table:** Purchase Header (38)

**Description:** Creates a new purchase document (Quote, Order, Invoice, Credit Memo, Blanket Order, or Return Order) for a vendor. Only the header is created — lines must be added separately using Data.Records.Set.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | No | Vendor number or SystemId (GUID) |
| data.documentType | Yes | Document type: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order" |
| data.postingDate | No | Posting date (ISO YYYY-MM-DD). Defaults to WorkDate |
| data.no | No | Vendor number (alternative to subject) |
| data.id | No | Vendor SystemId (GUID, alternative to subject) |
| data.systemId | No | Vendor SystemId (GUID, alternative to subject) |
| data.recordSystemId | No | Vendor SystemId (GUID, alternative to subject) |

### Vendor Lookup Priority

1. **subject** field: GUID → GetBySystemId, plain text → Get by No.
2. **data** JSON keys (first match): no, id, systemId, recordSystemId

### Example Requests

**Create a purchase order for vendor 10000:**
```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Create",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": {
    "documentType": "Order"
  }
}
```

**Create a purchase invoice with a custom posting date:**
```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Create",
  "source": "SupplierSync v2.0",
  "data": {
    "documentType": "Invoice",
    "no": "10000",
    "postingDate": "2026-04-15"
  }
}
```

### Response Format

Returns JSON in Data.Records.Get format:

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-...",
      "primaryKey": {
        "DocumentType": "Order",
        "No_": "PO-001"
      },
      "fields": {
        "DocumentType": "Order",
        "No_": "PO-001",
        "BuyfromVendorNo_": "10000",
        "BuyfromVendorName": "Fabrikam Inc.",
        "PostingDate": "2026-03-07",
        "Status": "Open"
      }
    }
  ]
}
```

### Error Responses

| Error | Cause |
|-------|-------|
| `documentType is required in request JSON` | Missing documentType in data |
| `Invalid document type 'X'` | Unrecognized document type value |
| Vendor not found | No vendor matches the provided identifier |

**Implementation Notes:**

- Document number is assigned by the number series on Insert
- Vendor triggers are executed via Validate("Buy-from Vendor No.")
- Posting date defaults to WorkDate() if not specified or invalid
- Response uses Data.Records.Get format with all header fields

**Related Message Types:**

- [Purchase.Document.Release](#purchasedocumentrelease): Release a purchase document
- [Purchase.Document.Reopen](#purchasedocumentreopen): Reopen a released purchase document
- [Purchase.Document.Post](#purchasedocumentpost): Post a purchase document
- [Data.Records.Set](/foundation/message-types/data/): Add lines to the created document

---

## Purchase.Document.PreviewPost

**Purpose:** Simulate posting a purchase document and return all resulting ledger entries without committing any changes.

**Description:** Drives the standard BC posting routine (`Codeunit "Purch.-Post (Yes/No)"`) through `Codeunit "Gen. Jnl.-Post Preview"`, which captures every entry that *would* be inserted and then rolls back the transaction. Use this to validate that a document can be posted, show an AI agent the exact financial impact, or surface predicted document numbers and totals before posting.

**Message Direction:** Inbound

**Side effects:** None — the transaction is always rolled back. The purchase header remains unchanged.

**Supported Document Types:** Order, Invoice, Credit Memo, Return Order.

**Input Parameters:**

- `source` (required): Description of the calling application.
- `subject` (required/optional): Purchase document number or SystemId (GUID). May also be supplied via the `data` payload.
- `data` (optional): JSON object with the document identifier. **First matched key wins**:
  - `systemId` / `recordSystemId` / `id`: Record SystemId (GUID).
  - `orderNo`: Purchase order number (Document Type = Order).
  - `invoiceNo`: Purchase invoice number.
  - `creditMemoNo`: Purchase credit memo number.
  - `returnOrderNo`: Purchase return order number.

**Document Selection Methods:** Any one of the following identifies the document:

1. `subject` as plain text — looked up as document `No.` across all four document types.
2. `subject` as GUID — looked up as `SystemId` on Purchase Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` / `data.invoiceNo` / `data.creditMemoNo` / `data.returnOrderNo` — typed `No.` lookup restricted to the matching Document Type.

**Response Format:**

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order PO-001 for vendor V01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "V01",
  "vendorName": "Acme Supplies",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": {
    "postedInvoiceNo": "PI-00045",
    "postedReceiptNo": "PR-00045"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00,
    "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00,
    "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "tableCaption": "G/L Entry", "description": "...", "entryCount": 3, "entries": [ /* full row JSON per entry */ ] },
    { "tableId": 254, "tableName": "VAT Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 5802, "tableName": "Value Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 25, "tableName": "Vendor Ledger Entry", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR", "...": "..." } ] },
    { "tableId": 379, "tableName": "Detailed Vendor Ledg. Entry", "entryCount": 1, "entries": [ ... ] }
    /* additional populated tables (e.g. Job Ledger Entry, FA Ledger Entry, Bank Account Ledger Entry, ...) appear here when the document touches them */
  ]
}
```

**Response Fields:**

- `status`: `"Success"` or `"Error"`.
- `rollback`: Always `true` on success — confirms no data was persisted.
- `summary`: One-line natural-language description.
- `documentType` / `documentNo` / `vendorNo` / `vendorName`: Source document context.
- `lcyCode`: Local Currency Code from G/L Setup.
- `documentCurrencyCode`: Empty when the document is in LCY.
- `documentExchangeRate`: FCY→LCY rate. **Always `1` when `documentCurrencyCode` is empty.**
- `predictedNumbers`: Document numbers that *would* be assigned by the No. Series at the moment of preview. These are informational, not reservations.
- `totals.balanced`: `true` when LCY debits equal LCY credits (rounded to 0.01).
- `totals.totalDebit*` / `totalCredit*`: Sum of G/L Entry Debit/Credit amounts in LCY and FCY.
- `preview[]`: One element per ledger table populated by the BC posting routine. Tables are discovered dynamically via `Codeunit "Posting Preview Event Handler".FillDocumentEntry()`. The native helper provides curated field-name blocks for 17 BC ledger tables (G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Vendor / Detailed Vendor Ledger, Cust. / Detailed Cust. Ledger, Bank Account Ledger Entry, FA Ledger Entry, Maintenance Ledger Entry, Job Ledger Entry, Res. Ledger Entry, Service Ledger Entry, Warranty Ledger Entry, Employee / Detailed Employee Ledger Entry); extension tables added via the `OnGetPreviewFieldNames` event are included too.
- `preview[].entries[]`: Full row JSON per captured entry. Field names use mechanical normalization (`No.` → `No_`, `Amount (LCY)` → `AmountLCY`, etc.). Read-restricted fields configured in `Field Access ori` are omitted.

**Currency Invariant:**

`documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`

When the document is in LCY, the FCY columns mirror the LCY columns and the exchange rate is `1`. Per-entry currency context is also available on each multi-currency entry (`CurrencyCode`, `Amount`, `AmountLCY`).

**Predicted vs Actual:** Between preview and actual posting another transaction may consume the predicted No. Series numbers, so the actual posted numbers may differ. Use `predictedNumbers` for informational display only.

**Error Scenarios:**

- Purchase document not found → `{"status":"Error","error":"..."}`.
- Document has no lines → error mentioning "no lines".
- Posting validation failure → underlying BC error text is returned.

**Related Message Types:**

- [Purchase.Document.Post](#purchasedocumentpost): Actually posts the document (no rollback).
- [Purchase.Document.Statistics](#purchasedocumentstatistics): Header/line totals without simulating posting.


---

## Vendor.Application.Post

**Purpose:** Apply one vendor ledger entry (the *applying* entry) against one or more open vendor ledger entries (the *applied-to* entries) and post the application via Microsoft codeunit 227 `"VendEntry-Apply Posted Entries"`.

**Description:** Mirrors the behaviour of the Apply Vendor Entries page. The applying entry's `"Applies-to ID"` and `"Amount to Apply"` are stamped, each target entry is tagged with the same `Applies-to ID`, and `VendEntry-Apply Posted Entries.Apply` posts the application. All entries must belong to the same vendor.

**Message Direction:** Inbound

**Supported Tables:** Vendor Ledger Entry (25)

### Request Format

**Bifrost Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| subject | Yes* | SystemId (GUID) or Entry No. (integer) of the applying vendor ledger entry |
| type | Yes | `Vendor.Application.Post` |

*The applying entry may also be identified via `systemId`, `recordSystemId`, `id`, `entryNo` or `entryNumber` in the request JSON.

**Request JSON:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| appliesToEntries | Array | Yes | Non-empty array of target entries to apply. Each element may be an integer (Entry No.), a GUID string (SystemId), or an object with `entryNo` / `entryNumber` / `systemId` / `recordSystemId` / `id`. |
| postingDate | Date | No | Posting date of the application. Defaults to the applying entry's posting date. |
| documentNo | Code[20] | No | Document No. stamped on the application. Defaults to the applying entry's document no. |
| amountToApply | Decimal | No | Amount to apply from the applying entry. Defaults to the entry's `Remaining Amount`. |

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Vendor.Application.Post",
  "subject": "4321",
  "data": {
    "appliesToEntries": [9876, 9877],
    "postingDate": "2025-02-15",
    "documentNo": "VPAY-2025-0001"
  }
}
```

### Response Format

```json
{
  "status": "Success",
  "applyingEntryNo": 4321,
  "applyingRecordSystemId": "a1b2c3d4-...",
  "vendorNo": "30000",
  "documentNo": "VPAY-2025-0001",
  "postingDate": "2025-02-15",
  "amountToApply": "2500.00",
  "totalApplied": "2500.00",
  "remainingAmount": "0.00",
  "open": false,
  "applications": [
    {
      "entryNo": 9876,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "PINV-1001",
      "amountApplied": "1500.00"
    },
    {
      "entryNo": 9877,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "PINV-1002",
      "amountApplied": "1000.00"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| applyingEntryNo | Integer | Entry No. of the applying entry |
| applyingRecordSystemId | GUID | SystemId of the applying entry |
| vendorNo | Code[20] | Vendor No. of the applying entry |
| documentNo | Code[20] | Document No. used for the application |
| postingDate | Date | Posting date used for the application |
| amountToApply | Decimal | Amount that was set as `Amount to Apply` on the applying entry |
| totalApplied | Decimal | Sum of `amountApplied` across all target entries |
| remainingAmount | Decimal | Remaining amount on the applying entry after the application |
| open | Boolean | Whether the applying entry is still open after the application |
| applications | Array | One entry per target. See below. |
| applications[].entryNo | Integer | Entry No. of the target entry |
| applications[].recordSystemId | GUID | SystemId of the target entry |
| applications[].documentType | Text | Document type of the target entry |
| applications[].documentNo | Code[20] | Document No. of the target entry |
| applications[].amountApplied | Decimal | Amount that was applied against the target entry |

### Error Scenarios

- Missing identifier on subject and request JSON.
- Applying entry not found by SystemId or Entry No.
- Applying entry not open.
- `appliesToEntries` missing or empty.
- A target entry belongs to a different vendor than the applying entry.
- A target entry is closed.
- Microsoft codeunit 227 rejects the application (caller still receives a structured JSON error with callstack).

### Related Message Types

- [Vendor.Application.Reverse](#vendorapplicationreverse) - Reverse a posted application.

---

## Vendor.Application.Reverse

**Purpose:** Reverse (unapply) a posted application on a vendor ledger entry via Microsoft codeunit 227 `"VendEntry-Apply Posted Entries.PostUnApplyVendor"`.

**Description:** By default the most recent application on the supplied entry is reversed. A specific application can be targeted by passing `detailedEntryNo`. Microsoft codeunit 227 enforces unapply rules (e.g. no later transactions that depend on this application).

**Message Direction:** Inbound

**Supported Tables:** Vendor Ledger Entry (25)

### Request Format

**Bifrost Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| subject | Yes* | SystemId (GUID) or Entry No. (integer) of the vendor ledger entry whose application should be reversed |
| type | Yes | `Vendor.Application.Reverse` |

*The entry may also be identified via `systemId`, `recordSystemId`, `id`, `entryNo` or `entryNumber` in the request JSON.

**Request JSON:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| detailedEntryNo | Integer | No | Detailed Vendor Ledg. Entry No. of the application to reverse. Defaults to the last application on the entry. |
| postingDate | Date | No | Posting date of the reversal. Defaults to the application's posting date. |
| documentNo | Code[20] | No | Document No. stamped on the reversal. Defaults to the application's document no. |

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Vendor.Application.Reverse",
  "subject": "4321",
  "data": {
    "postingDate": "2025-02-15",
    "documentNo": "REV-V-0001"
  }
}
```

### Response Format

```json
{
  "status": "Success",
  "entryNo": 4321,
  "recordSystemId": "...",
  "vendorNo": "30000",
  "reversedDetailedEntryNo": 9876,
  "reversedAmount": "2500.00",
  "postingDate": "2025-02-15",
  "documentNo": "REV-V-0001",
  "remainingAmount": "2500.00",
  "open": true
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| entryNo | Integer | Entry No. of the vendor ledger entry |
| recordSystemId | GUID | SystemId of the vendor ledger entry |
| vendorNo | Code[20] | Vendor No. of the entry |
| reversedDetailedEntryNo | Integer | Detailed Vendor Ledg. Entry No. that was reversed |
| reversedAmount | Decimal | Amount that was reversed |
| postingDate | Date | Posting date used for the reversal |
| documentNo | Code[20] | Document No. used for the reversal |
| remainingAmount | Decimal | Remaining amount on the entry after the reversal |
| open | Boolean | Whether the entry is open after the reversal |

### Error Scenarios

- Missing identifier on subject and request JSON.
- Entry not found.
- The entry has no posted application that can be reversed.
- Supplied `detailedEntryNo` does not exist or is not an Application entry.
- Microsoft codeunit 227 rejects the unapply (e.g. later transactions block the unapply).

### Related Message Types

- [Vendor.Application.Post](#vendorapplicationpost) - Apply vendor ledger entries.

---

## Purchase.Quote.MakeOrder

**Purpose:** Convert a purchase quote into a purchase order.

**Direction:** Inbound (Action request)

**Filter Table:** Purchase Header (38)

**Description:** Invokes the standard BC `Codeunit "Purch.-Quote to Order"` (codeunit 96) to convert an existing purchase quote into a purchase order. The original quote is deleted and a new purchase order is created with the same vendor, lines, and dimensions. Returns the new order number along with key header fields.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | Yes | Quote document number or SystemId (GUID) of the Purchase Header |

### Subject Identification Order

The subject value is resolved via `FindPurchaseHeader`:
1. If subject is a valid GUID → `GetBySystemId`
2. Otherwise → `Get` by document number across all purchase document types

The resolved document **must** have `Document Type = Quote`, otherwise an error is returned.

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Purchase.Quote.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "PQ-001"
}
```

### Response Format (Success)

```json
{
  "status": "Success",
  "quoteNo": "PQ-001",
  "orderNo": "PO-005",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| status | Text | `Success` on success, `Error` on failure |
| quoteNo | Code[20] | Number of the original quote that was converted |
| orderNo | Code[20] | Number of the newly created purchase order |
| orderSystemId | Guid | SystemId (GUID) of the new purchase order header |
| vendorNo | Code[20] | Buy-from vendor number |
| vendorName | Text | Buy-from vendor name |
| documentDate | Date | ISO date (yyyy-MM-dd) — document date of the new order |
| orderDate | Date | ISO date (yyyy-MM-dd) — order date of the new order |

### Error Responses

| Error | Cause |
|---|---|
| `Subject parameter is required.` | Subject was empty |
| `Purchase header {No} not found.` | No purchase header matches the subject |
| `Purchase document {No} is not a Quote (actual type: {Type}).` | Subject resolved to a non-Quote document |
| Error text from BC | The standard `Purch.-Quote to Order` codeunit raised an error (callstack included as `callstack` field) |

### Related Message Types

- [Purchase.Document.Create](#purchasedocumentcreate): Create a quote from scratch
- [Purchase.Document.Release](#purchasedocumentrelease): Release the resulting order
- [Purchase.Document.Post](#purchasedocumentpost): Post the resulting order

---

## Purchase.BlanketOrder.MakeOrder

**Purpose:** Convert a purchase blanket order into a purchase order.

**Direction:** Inbound (Action request)

**Filter Table:** Purchase Header (38)

**Description:** Invokes the standard BC `Codeunit "Blanket Purch. Order to Order"` (codeunit 97) to create a new purchase order from a blanket order. Lines with `Qty. to Receive > 0` are transferred to the new order; the blanket order remains and outstanding quantities are reduced accordingly.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | Yes | Blanket order document number or SystemId (GUID) of the Purchase Header |

### Subject Identification Order

1. If subject is a valid GUID → `GetBySystemId`
2. Otherwise → `Get` by document number across all purchase document types

The resolved document **must** have `Document Type = Blanket Order`, otherwise an error is returned.

### Prerequisites

Each blanket-order line that should be transferred must have `Qty. to Receive > 0` (use Data.Records.Set first to set the values). Lines with zero `Qty. to Receive` are skipped.

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Purchase.BlanketOrder.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "PB-001"
}
```

### Response Format (Success)

```json
{
  "status": "Success",
  "blanketOrderNo": "PB-001",
  "orderNo": "PO-006",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| status | Text | `Success` on success, `Error` on failure |
| blanketOrderNo | Code[20] | Number of the source blanket order |
| orderNo | Code[20] | Number of the newly created purchase order |
| orderSystemId | Guid | SystemId (GUID) of the new purchase order header |
| vendorNo | Code[20] | Buy-from vendor number |
| vendorName | Text | Buy-from vendor name |
| documentDate | Date | ISO date (yyyy-MM-dd) — document date of the new order |
| orderDate | Date | ISO date (yyyy-MM-dd) — order date of the new order |

### Error Responses

| Error | Cause |
|---|---|
| `Subject parameter is required.` | Subject was empty |
| `Purchase header {No} not found.` | No purchase header matches the subject |
| `Purchase document {No} is not a Blanket Order (actual type: {Type}).` | Subject resolved to a non-blanket document |
| Error text from BC | The standard `Blanket Purch. Order to Order` codeunit raised an error (e.g. no lines with `Qty. to Receive > 0`); callstack included as `callstack` field |

### Related Message Types

- [Purchase.Document.Create](#purchasedocumentcreate): Create a blanket order from scratch
- [Purchase.Document.Release](#purchasedocumentrelease): Release the resulting order
- [Purchase.Quote.MakeOrder](#purchasequotemakeorder): Sister operation for purchase quotes

---

## Purchase.PurchaseInvoice.Correct

**Purpose:** Cancel a posted purchase invoice and start a new draft purchase invoice for correction.

**Description:** Wraps BC standard codeunit 1313 `Correct Posted Purch. Invoice` method `CancelPostedInvoiceStartNewInvoice`. Posts a corrective credit memo against the original invoice and creates a new draft `Purchase Header` (Document Type = Invoice) initialised from the original invoice.

**Message Direction:** Inbound

**Posting Gate:** `G/L`. The request is rejected when G/L posting is disabled in Bifrost Setup.

**Identifier Resolution Order:** GUID via Subject (SystemId) -> Subject as `No.` (Get) -> JSON keys (`systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`).

**Input Parameters:**

```json
{
  "type": "Purchase.PurchaseInvoice.Correct",
  "subject": "PINV-000123"
}
```

Or by SystemId:

```json
{
  "type": "Purchase.PurchaseInvoice.Correct",
  "subject": "5f0d3b6e-3e8e-4a8b-9f6b-1d3c4e5f6a7b"
}
```

Or by JSON data:

```json
{
  "type": "Purchase.PurchaseInvoice.Correct",
  "data": { "invoiceNo": "PINV-000123" }
}
```

**Response Format:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "PINV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "vendorNo": "V00010",
  "vendorName": "Vendor Ltd.",
  "cancellingCreditMemo": {
    "no": "PCM-000456",
    "id": "1a2b3c4d-..."
  },
  "newDraftInvoice": {
    "no": "PI-000789",
    "id": "9f8e7d6c-...",
    "documentType": "Invoice"
  }
}
```

**Response Fields:**
- `originalInvoiceNo` / `originalInvoiceId`: identifiers of the cancelled invoice
- `vendorNo` / `vendorName`: from the original invoice
- `cancellingCreditMemo.no` / `.id`: the corrective credit memo posted by BC (looked up via `Cancelled Document` table)
- `newDraftInvoice.no` / `.id` / `.documentType`: the new draft `Purchase Header` created by BC

**Process Flow:**
1. Resolve the posted invoice from `subject` or request JSON.
2. Enforce the `G/L` posting gate.
3. Run BC `CancelPostedInvoiceStartNewInvoice` inside an isolated `Codeunit.Run` so BC errors are returned as JSON with full callstack.
4. BC posts a cancelling purchase credit memo, fully applies it to the original invoice, and creates a new draft `Purchase Header` (Document Type = Invoice) copied from the original.
5. The cancelling credit memo is looked up via the `Cancelled Document` link table (`Source ID` = 122, `Cancelled Doc. No.` = original invoice).
6. Original, cancelling credit memo, and new draft are returned in a single JSON response.

**Output Documents:**

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling purchase credit memo (posted, fully applied) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `.no` |
| New editable draft invoice | `Purchase Header` (Document Type = Invoice) | `newDraftInvoice.id` / `.no` |

**Document Linkage:**
- Original invoice: `Cancelled = true`, `Canceled By Cr. Memo No.` = cancelling credit memo no.
- Cancelling credit memo: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = original invoice no.
- `Cancelled Document` table row: `Source ID` = 122, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.
- The new draft has no field-level FK to the original; it is linked only via this response payload.

**Fetching the Resulting Documents with Data.Records.Get:**

Each `id` is the BC `SystemId`. Use it with `Data.Records.Get`:

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purchase Header", "tableView": "WHERE(SystemId=CONST(<newDraftInvoice.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Hdr.", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purchase Line", "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(<newDraftInvoice.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Error Scenarios:**
- Missing identifier -> `Error` with `Message subject or request data must contain a record identifier`.
- Invoice not found -> `Error`.
- Invoice cannot be corrected (already cancelled, payments applied, posting period closed, etc.) -> `Error` with BC error text and `callstack` field.

**Related Message Types:**
- [Purchase.PurchaseInvoice.Cancel](#purchasepurchaseinvoicecancel): Cancel without creating a new draft.
- [Purchase.Document.Post](#purchasedocumentpost): Post the new draft invoice once edited.

---

## Purchase.PurchaseInvoice.Cancel

**Purpose:** Cancel a posted purchase invoice by posting a corrective credit memo.

**Description:** Wraps BC standard codeunit 1313 `Correct Posted Purch. Invoice` method `CancelPostedInvoice`. Posts a corrective credit memo against the original invoice. Unlike `Correct`, no new draft invoice is created.

**Message Direction:** Inbound

**Posting Gate:** `G/L`. The request is rejected when G/L posting is disabled in Bifrost Setup.

**Identifier Resolution Order:** Identical to `Purchase.PurchaseInvoice.Correct`.

**Input Parameters:**

```json
{
  "type": "Purchase.PurchaseInvoice.Cancel",
  "subject": "PINV-000123"
}
```

**Response Format:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "PINV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "vendorNo": "V00010",
  "vendorName": "Vendor Ltd.",
  "cancellingCreditMemo": {
    "no": "PCM-000456",
    "id": "1a2b3c4d-..."
  }
}
```

The `newDraftInvoice` object is intentionally omitted.

**Process Flow:**
1. Resolve the posted invoice from `subject` or request JSON.
2. Enforce the `G/L` posting gate.
3. Run BC `CancelPostedInvoice` inside an isolated `Codeunit.Run` so BC errors are returned as JSON with full callstack.
4. BC posts a cancelling purchase credit memo and fully applies it to the original invoice. No draft is created.
5. The cancelling credit memo is looked up via the `Cancelled Document` link table (`Source ID` = 122, `Cancelled Doc. No.` = original invoice).
6. Original invoice and cancelling credit memo are returned in a single JSON response.

**Output Documents:**

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling purchase credit memo (posted, fully applied) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `.no` |

**Document Linkage:**
- Original invoice: `Cancelled = true`, `Canceled By Cr. Memo No.` = cancelling credit memo no.
- Cancelling credit memo: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = original invoice no.
- `Cancelled Document` table row: `Source ID` = 122, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.

**Fetching the Resulting Documents with Data.Records.Get:**

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Hdr.", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Inv. Header", "tableView": "WHERE(No.=CONST(<originalInvoiceNo>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Error Scenarios:** Same as `Purchase.PurchaseInvoice.Correct`.

**Related Message Types:**
- [Purchase.PurchaseInvoice.Correct](#purchasepurchaseinvoicecorrect): Cancel and start a new draft for correction.
