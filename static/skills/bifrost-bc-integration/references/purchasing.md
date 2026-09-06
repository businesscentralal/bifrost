# Purchasing

Message types for the purchase side: creating, releasing, posting and preview-posting purchase documents, purchase statistics, vendor payment application, quote and blanket-order conversion, and correcting or cancelling a posted purchase invoice.

[← back to SKILL.md](../SKILL.md) · originally sections 7.4 of the single-file skill.

---

### 7.4 PURCHASE ORDER OPERATIONS

#### `Purchase.Document.Release` / `Purchase.Document.Reopen`

Direction: **Inbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Release", "source": "MyApp", "subject": "PO-001" }
```

Release returns `{ "status": "Success", "documentType": "Order", "documentNo": "PO-001", "vendorNo": "10000", "vendorName": "Fabrikam Supplies", "statusBefore": "Open", "statusAfter": "Released" }`.  
Reopen accepts documents with status Released or Pending Approval. For Pending Approval documents without approval entries, status is set directly to Open. Returns `"statusAfter": "Open"` with the actual `"statusBefore"` value.

Full response also includes: `documentDate`, `amount`, `amountIncludingVAT`.

#### `Purchase.Document.Create`

Direction: **Inbound**. Creates a new purchase document header for a specified vendor and document type.

- Required: `documentType` in data JSON — values: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order"
- Vendor lookup: `subject` (No. or GUID) or data keys (`no`, `id`, `systemId`, `recordSystemId`)
- Optional: `postingDate` in data JSON (ISO YYYY-MM-DD, defaults to WorkDate)
- Response uses Data.Records.Get format with all header fields

```json
{ "specversion": "1.0", "type": "Purchase.Document.Create", "source": "MyApp", "subject": "10000", "data": { "documentType": "Order" } }
```

Success: `{ "status": "Success", "noOfRecords": 1, "result": [{ "id": "...", "primaryKey": { "DocumentType": "Order", "No_": "PO-001" }, "fields": { ... } }] }`

Errors: `"documentType is required in request JSON."`, `"Invalid document type 'X'."`, vendor not found.

#### `Purchase.Document.Statistics`

Direction: **Outbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Statistics", "source": "MyApp", "subject": "PO-001" }
```

Response:
```json
{
  "status": "Success",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "currencyCode": "",
  "documentDate": "2026-03-07",
  "order": {
    "amount": 1000.00,
    "invoiceDiscountAmount": 50.00,
    "totalExclVAT": 950.00,
    "vatAmount": 104.50,
    "totalInclVAT": 1054.50,
    "quantity": 10,
    "totalWeight": 25.5,
    "totalVolume": 0.5,
    "noOfVATLines": 1
  },
  "vat_totals": [
    { "vatIdentifier": "NORM", "vatPct": 11, "lineAmount": 950.00, "vatAmount": 104.50, "amountInclVAT": 1054.50 }
  ]
}
```

#### `Purchase.Document.Post`

Direction: **Inbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Post", "source": "MyApp", "subject": "PO-001" }
```

Posts the document. The original document is deleted; one or more posted documents are created.

| Source Document Type | Posted Documents Created |
|---|---|
| Order | Posted Purchase Invoice + Purchase Receipt |
| Invoice | Posted Purchase Invoice |
| Credit Memo | Posted Purchase Credit Memo |
| Return Order | Posted Purchase Credit Memo + Return Shipment |

Success:
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
      "no": "PPI-001",
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

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

---

#### `Purchase.Document.PreviewPost`

Direction: **Inbound**. Supports Order, Invoice, Credit Memo, Return Order.

**Document selection methods** (any one identifies the document):

1. `subject` as plain text — looked up as document `No.` across all four document types on Purchase Header (38).
2. `subject` as GUID — looked up as `SystemId` on Purchase Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` — typed `No.` lookup restricted to Document Type = Order.
5. `data.invoiceNo` — typed `No.` lookup restricted to Document Type = Invoice.
6. `data.creditMemoNo` — typed `No.` lookup restricted to Document Type = Credit Memo.
7. `data.returnOrderNo` — typed `No.` lookup restricted to Document Type = Return Order.

First matched `data` key wins. Same lookup semantics as `Purchase.Document.Post`.

Simulates the full BC posting routine through `Codeunit "Gen. Jnl.-Post Preview"` and **rolls the transaction back**. No data is persisted; the source purchase header is unchanged after the call.

```json
{ "specversion": "1.0", "type": "Purchase.Document.PreviewPost", "source": "MyApp", "subject": "PO-001" }
```

Response shape:

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
  "predictedNumbers": { "postedInvoiceNo": "PI-00045", "postedReceiptNo": "PR-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00, "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17,   "tableName": "G/L Entry",                    "tableCaption": "G/L Entry",                     "description": "...", "entryCount": 3, "entries": [ /* full row per entry */ ] },
    { "tableId": 254,  "tableName": "VAT Entry",                    "tableCaption": "VAT Entry",                     "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 32,   "tableName": "Item Ledger Entry",            "tableCaption": "Item Ledger Entry",             "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 5802, "tableName": "Value Entry",                  "tableCaption": "Value Entry",                   "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 25,   "tableName": "Vendor Ledger Entry",          "tableCaption": "Vendor Ledger Entry",           "description": "...", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR", "...": "..." } ] },
    { "tableId": 379,  "tableName": "Detailed Vendor Ledg. Entry",  "tableCaption": "Detailed Vendor Ledg. Entry",   "description": "...", "entryCount": 1, "entries": [ ... ] }
    /* additional populated tables (Job Ledger, FA Ledger, Bank Account Ledger, Employee Ledger, ...) appear here when the document touches them */
  ]
}
```

**Key contracts:**

- `rollback: true` is always present on success — the source document is unchanged.
- The `preview` array contains **one element per ledger table populated by the BC posting routine**. Tables are discovered dynamically via `Codeunit "Posting Preview Event Handler".FillDocumentEntry()` — the array length depends on the document and any extension-registered tables. The shared `Preview Helper ori` ships curated field-name blocks for 17 BC ledger tables (G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Vendor / Detailed Vendor Ledger, Cust. / Detailed Cust. Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger). Extensions can register additional tables via the `OnGetPreviewFieldNames` and `OnPrecalculateFlowFields` events on Codeunit 10078239 `"Preview Helper ori"`.
- Entry field names use **mechanical normalization** (`RemoveNonAlphaNumericCharacters`): `No.` → `No_`, `Amount (LCY)` → `AmountLCY`, `Document No.` → `DocumentNo_`. Same rules as `Data.Records.Get`.
- Read-restricted fields from `Field Access ori` are omitted from each entry.
- **Currency invariant:** `documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`. Per-entry currency context (`CurrencyCode`, `Amount` (FCY), `AmountLCY`) is carried on each multi-currency entry.
- `predictedNumbers` are informational only — between preview and actual posting another transaction may consume those No. Series numbers.
- `totals.balanced` is determined in LCY (always exists), rounded to 0.01.

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

---

#### `Sales.Document.PreviewPost`

Direction: **Inbound**. Supports Order, Invoice, Credit Memo, Return Order.

**Document selection methods** (any one identifies the document):

1. `subject` as plain text — looked up as document `No.` across all four document types on Sales Header (36).
2. `subject` as GUID — looked up as `SystemId` on Sales Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` — typed `No.` lookup restricted to Document Type = Order.
5. `data.invoiceNo` — typed `No.` lookup restricted to Document Type = Invoice.
6. `data.creditMemoNo` — typed `No.` lookup restricted to Document Type = Credit Memo.
7. `data.returnOrderNo` — typed `No.` lookup restricted to Document Type = Return Order.

First matched `data` key wins. Same lookup semantics as `Sales.Document.Post`.

Simulates the full BC posting routine through `Codeunit "Gen. Jnl.-Post Preview"` driving `Codeunit "Sales-Post (Yes/No)"`, and **rolls the transaction back**. No data is persisted; the source sales header is unchanged after the call.

```json
{ "specversion": "1.0", "type": "Sales.Document.PreviewPost", "source": "MyApp", "subject": "SO-001" }
```

Response shape:

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order SO-001 for customer C01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "C01",
  "customerName": "Acme Customer",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": { "postedInvoiceNo": "SI-00045", "postedShipmentNo": "SS-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00, "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17,   "tableName": "G/L Entry",                    "tableCaption": "G/L Entry",                     "description": "...", "entryCount": 3, "entries": [ /* full row per entry */ ] },
    { "tableId": 254,  "tableName": "VAT Entry",                    "tableCaption": "VAT Entry",                     "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 32,   "tableName": "Item Ledger Entry",            "tableCaption": "Item Ledger Entry",             "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 5802, "tableName": "Value Entry",                  "tableCaption": "Value Entry",                   "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 21,   "tableName": "Cust. Ledger Entry",           "tableCaption": "Cust. Ledger Entry",            "description": "...", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 380,  "tableName": "Detailed Cust. Ledg. Entry",   "tableCaption": "Detailed Cust. Ledg. Entry",    "description": "...", "entryCount": 1, "entries": [ ] }
    /* additional populated tables (Job Ledger, FA Ledger, Bank Account Ledger, Employee Ledger, ...) appear here when the document touches them */
  ]
}
```

**Key contracts:**

- `rollback: true` is always present on success — the source document is unchanged.
- `predictedNumbers` keys depend on document type: Order → `postedInvoiceNo` + `postedShipmentNo`; Invoice → `postedInvoiceNo`; Credit Memo → `postedCreditMemoNo`; Return Order → `postedCreditMemoNo` + `postedReturnReceiptNo`.
- The `preview` array, field-name normalization, field-access restrictions, currency invariant, and `totals.balanced` semantics are identical to `Purchase.Document.PreviewPost`.
- Customer sign convention: the customer is **debited** (positive `Amount`) on Invoice/Order; credited (negative) on Credit Memo/Return Order. FCY columns are one-sided on the Cust. Ledger Entry side per document.

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

#### `Vendor.Application.Post`

Direction: **Inbound**. Apply one open vendor ledger entry (payment / credit memo / refund) against one or more open target entries of the same vendor via codeunit 227.

`subject` = SystemId (GUID) or Entry No. of the *applying* entry. `data.appliesToEntries` (required) is a non-empty array of Entry Nos / SystemIds / `{entryNo}` / `{systemId}` objects.

**Sign trap (opposite of customer):** vendor payments are *positive*, invoices *negative*. `amountToApply` must match the sign of the applying entry's `Remaining Amount` (which includes VAT).

Full request/response schema, sign convention table, identifier resolution order, discovery workflow, partial-apply and multi-invoice examples, and error catalog: call `Help.Implementation.Get` with `name = Vendor.Application.Post`.

#### `Vendor.Application.Reverse`

Direction: **Inbound**. Unapply a posted application on a vendor ledger entry via codeunit 227.

`subject` = SystemId (GUID) or Entry No. of the vendor ledger entry. Optional `data.detailedEntryNo` targets a specific application; without it, the most recent un-reversed application is reversed (**not idempotent** — always pass `detailedEntryNo` for retry safety).

Full schema, how to find the right `detailedEntryNo` via `Detailed Vendor Ledg. Entry`, identifier resolution order, and error catalog: call `Help.Implementation.Get` with `name = Vendor.Application.Reverse`.

#### `Purchase.Quote.MakeOrder`

Direction: **Inbound**. Converts an existing purchase **quote** into a purchase **order** via BC codeunit 96 `"Purch.-Quote to Order"`. The original quote is deleted; the new order keeps the same vendor, lines, and dimensions.

- `subject` = quote document number or SystemId (GUID) of the `Purchase Header`
- Resolved document **must** have `Document Type = Quote`

```json
{ "specversion": "1.0", "type": "Purchase.Quote.MakeOrder", "source": "MyApp", "subject": "PQ-001" }
```

Success: `{ "status": "Success", "quoteNo": "PQ-001", "orderNo": "PO-005", "orderSystemId": "…", "vendorNo": "10000", "vendorName": "Fabrikam, Inc.", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: `"Subject parameter is required."`, `"Purchase header {No} not found."`, `"Purchase document {No} is not a Quote (actual type: {Type})."`, or any BC validation error (callstack included as `callstack` field).

#### `Purchase.BlanketOrder.MakeOrder`

Direction: **Inbound**. Creates a new purchase order from an existing purchase **blanket order** via BC codeunit 97 `"Blanket Purch. Order to Order"`. Only lines with `Qty. to Receive > 0` are transferred; the blanket order remains and outstanding quantities are reduced.

- `subject` = blanket order document number or SystemId (GUID) of the `Purchase Header`
- Resolved document **must** have `Document Type = Blanket Order`
- **Prerequisite:** at least one line must have `Qty. to Receive > 0` — set via `Data.Records.Set` if needed

```json
{ "specversion": "1.0", "type": "Purchase.BlanketOrder.MakeOrder", "source": "MyApp", "subject": "PB-001" }
```

Success: `{ "status": "Success", "blanketOrderNo": "PB-001", "orderNo": "PO-006", "orderSystemId": "…", "vendorNo": "10000", "vendorName": "Fabrikam, Inc.", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: same as `Purchase.Quote.MakeOrder` but with "Blanket Order" wording; the BC codeunit also errors if no line qualifies for receipt.

#### `Purchase.PurchaseInvoice.Correct`

Direction: **Inbound**. Wraps BC codeunit 1313 `Correct Posted Purch. Invoice` method `CancelPostedInvoiceStartNewInvoice`. Posts a corrective credit memo against a **posted** purchase invoice and creates a new draft `Purchase Header` (Document Type = Invoice) initialised from the original. Posting gate: **G/L**.

- `subject` = posted invoice `No.` or SystemId (GUID) of `Purch. Inv. Header`
- Or `data` keys: `systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`

```json
{ "specversion": "1.0", "type": "Purchase.PurchaseInvoice.Correct", "source": "MyApp", "subject": "PINV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "PINV-000123", "originalInvoiceId": "…", "vendorNo": "10000", "vendorName": "Fabrikam", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" }, "newDraftInvoice": { "no": "PI-000789", "id": "…", "documentType": "Invoice" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Purchase Header` (new draft), `Purch. Cr. Memo Hdr.` (cancelling credit memo), and `Purch. Inv. Header` (original). Lines via `Purchase Line` / `Purch. Cr. Memo Line` by `Document No.`.

Linkage: original invoice has `Cancelled = true` and `Canceled By Cr. Memo No.`; credit memo has `Applies-to Doc. Type/No. = Invoice / <originalInvoiceNo>`; `Cancelled Document` row carries the formal link (`Source ID = 122`, `Cancelled Doc. No.`, `Cancelled By Doc. No.`). New draft has no field-level FK to the original.

Errors: missing identifier, invoice not found, invoice cannot be corrected — BC error text with `callstack` field.

#### `Purchase.PurchaseInvoice.Cancel`

Direction: **Inbound**. Wraps BC codeunit 1313 method `CancelPostedInvoice`. Posts only the corrective credit memo — no new draft invoice. Same lookup, gate (G/L), and errors as `Purchase.PurchaseInvoice.Correct`. Response omits `newDraftInvoice`.

```json
{ "specversion": "1.0", "type": "Purchase.PurchaseInvoice.Cancel", "source": "MyApp", "subject": "PINV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "PINV-000123", "originalInvoiceId": "…", "vendorNo": "10000", "vendorName": "Fabrikam", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Purch. Cr. Memo Hdr.` (+ `Purch. Cr. Memo Line` by `Document No.`) and `Purch. Inv. Header` (original). Same linkage fields as `Purchase.PurchaseInvoice.Correct` (`Cancelled`, `Canceled By Cr. Memo No.`, `Applies-to Doc.`, `Cancelled Document` with `Source ID = 122`).
