# Sales, customers and items

Message types for the sales side: credit limit and sales history, customer statements, item availability and prices, creating, releasing, posting and previewing sales documents, PDF retrieval, payment application, quote and blanket-order conversion, correcting, cancelling and sending invoices.

[← back to SKILL.md](../SKILL.md) · originally sections 7.3 of the single-file skill.

---

### 7.3 SALES, CUSTOMER & ITEM OPERATIONS

#### `Customer.CreditLimit.Get`

Direction: **Outbound**. `subject` = customer number.

```json
{ "specversion": "1.0", "type": "Customer.CreditLimit.Get", "source": "MyApp", "subject": "10000" }
```

Response (all verified fields):
```json
{
  "status": "Success",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "balanceLCY": 4500.00,
  "outstandingBalanceDueLCY": 1200.00,
  "outstandingAmountLCY": 3000.00,
  "creditLimitLCY": 10000.00,
  "remainingCredit": 2500.00,
  "tolerancePercent": 10,
  "remainingCreditWithTolerance": 3500.00,
  "isCreditLimitExceeded": false,
  "hasOverdueBalance": true
}
```

- `remainingCredit` = `creditLimitLCY − balanceLCY − outstandingAmountLCY` (can be negative)
- `remainingCreditWithTolerance` = `creditLimitLCY × (1 + tolerancePercent/100) − balanceLCY − outstandingAmountLCY`
- `isCreditLimitExceeded` = true only when remaining credit **with tolerance** is negative
- Errors: invalid customer number throws a top-level error (no `{"status":"Error"}`)

#### `Customer.SalesHistory.Get`

Direction: **Outbound**. `subject` = customer number (or provide `customerNo` in `data`).

```json
{
  "specversion": "1.0",
  "type": "Customer.SalesHistory.Get",
  "source": "MyApp",
  "subject": "10000",
  "data": "{\"fromDate\":\"2025-01-01\",\"toDate\":\"2025-12-31\"}"
}
```

Parameters: `fromDate` (required, YYYY-MM-DD), `toDate` (optional, defaults to today), `customerNo` (if not in `subject`).

Response:
```json
{
  "status": "Success",
  "noOfRecords": 5,
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31",
  "salesHistory": [
    {
      "itemNo": "1000",
      "variantCode": "",
      "description": "Bicycle",
      "unitOfMeasureCode": "PCS",
      "baseUnitOfMeasure": "PCS",
      "baseUOMDescription": "Piece",
      "quantity": 25,
      "noOfOrders": 3
    }
  ]
}
```

Based on posted sales invoices only. `noOfOrders` = count of sales invoice lines for that item.

#### `Customer.Statement.Pdf`

Direction: **Outbound**. `subject` = customer number or SystemId.

```json
{ "specversion": "1.0", "type": "Customer.Statement.Pdf", "source": "MyApp", "subject": "10000" }
```

Optional: pass `startDate` and `endDate` in `data`. Defaults to last 30 days.

```json
{
  "specversion": "1.0",
  "type": "Customer.Statement.Pdf",
  "source": "MyApp",
  "subject": "10000",
  "data": "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-03-20\"}"
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `startDate` | ISO 8601 date | Today − 30 days | Start of statement period |
| `endDate` | ISO 8601 date | Today | End of statement period |

Response — same two-step PDF flow as all PDF types. `datacontenttype` = `"application/pdf"`. GET `task.data` to download the binary PDF.

**Errors:** `"Subject parameter is required"` · `"Customer {x} not found."` · `"Invalid date range: start date {s} must be before or equal to end date {e}."`.

Statement implementation is configurable via **Customer Statement Type** in Bifrost Setup (extensible enum 10077888). Default (`Standard Statement`) uses BC Report Selections for `C.Statement`.

#### `Item.Availability.Get`

Direction: **Outbound**. Supports single-item (via `subject` or item key) or multi-item (via `tableView`).

```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp",
  "subject": "1000",
  "data": "{\"requestedDeliveryDate\":\"2026-04-01\",\"variantCode\":\"RED\",\"locationFilter\":\"BLUE|RED\"}"
}
```

Item resolution (checked in order): `subject` (GUID → SystemId, text → No.), then data keys `itemNo`, `itemId`, `id`, `systemId`, `recordSystemId`, `tableView` (BC AL table view syntax — see §11). If none specified, returns all non-blocked items.

Optional parameters: `requestedDeliveryDate` (date, defaults to WorkDate), `variantCode`, `locationFilter` (BC filter syntax).

Response wraps results in an `items` array (one entry per matched item). Format depends on Bifrost Setup:

**Physical Inventory** (simpler):
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "inventory": [
        { "locationCode": "BLUE", "inventory": 50 }
      ]
    }
  ]
}
```

**Calculated Quantity** (projected availability):
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "requestedDeliveryDate": "2026-04-01",
      "availability": [
        {
          "locationCode": "BLUE",
          "inventory": 50,
          "qtyReserved": 10,
          "grossRequirement": 20,
          "scheduledReceipt": 30,
          "plannedOrderReceipt": 15,
          "availableQuantity": 65
        }
      ]
    }
  ]
}
```

**Multi-item example** (using `tableView`):
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp",
  "data": "{\"tableView\":\"WHERE(Item Category Code=CONST(FURNITURE))\",\"locationFilter\":\"BLUE\"}"
}
```

#### `Item.Price.Get`

Direction: **Outbound**. Supports single-item (via `subject` or item key) or multi-item (via `tableView`).

```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp",
  "subject": "1000",
  "data": "{\"customerNo\":\"10000\",\"requestedDeliveryDate\":\"2026-04-01\",\"quantity\":10,\"variantCode\":\"RED\"}"
}
```

Item resolution: same as `Item.Availability.Get` — `subject`, `itemNo`, `itemId`, `id`, `systemId`, `recordSystemId`, `tableView`, or all non-blocked items.

Customer resolution (optional, priority order): `customerNo` (Code), `customerId` (SystemId GUID), `customerRecordId` (SystemId GUID), `customerSystemId` (SystemId GUID). If none provided, returns all-customers prices only.

Customer validation (when any customer identifier provided): Customer must exist and have `VAT Bus. Posting Group`, `Gen. Bus. Posting Group`, and `Customer Posting Group` configured. Missing any of these returns an error response.

Response:
```json
{
  "status": "Success",
  "priceListLines": [
    {
      "priceListCode": "SALES-2026",
      "priceListDescription": "Sales Prices 2026",
      "lineNo": 10000,
      "itemNo": "1000",
      "variantCode": "RED",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1,
      "minimumQuantity": 0,
      "amountType": "Price",
      "unitPrice": 100.00,
      "unitPriceExclVAT": 90.91,
      "unitPriceInclVAT": 110.00,
      "lineDiscountPct": 0,
      "allowInvoiceDisc": true,
      "allowLineDisc": true,
      "vatBusPostingGr": "DOMESTIC",
      "vatProdPostingGr": "STANDARD",
      "vatPct": 11,
      "itemName": "Bicycle",
      "itemDescription": "Touring Model",
      "baseUnitOfMeasure": "PCS",
      "eanCode": "5701234560013",
      "unspscCode": "87111501",
      "netWeight": 12.5,
      "itemSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "startingDate": "2026-01-01",
      "endingDate": "2026-12-31"
    }
  ]
}
```

When no price list is configured, returns one line with `"priceListCode": "ITEM CARD"`. Each `priceListLines` entry includes `itemNo` to identify which item the price belongs to.

#### `Sales.Document.Post`

Direction: **Inbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Post", "source": "MyApp", "subject": "SO-001" }
```

Posts the document. The original document is deleted; one or more posted documents are created.

| Source Document Type | Posted Documents Created |
|---|---|
| Order | Posted Sales Invoice + Posted Sales Shipment |
| Invoice | Posted Sales Invoice |
| Credit Memo | Posted Sales Credit Memo |
| Return Order | Posted Sales Credit Memo + Posted Return Receipt |

Success:
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "recordSystemId": "a1b2c3d4-...",
      "no": "PSI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 12345
    },
    {
      "type": "Posted Sales Shipment",
      "recordSystemId": "e5f6a7b8-...",
      "no": "PSS-001",
      "postingDate": "2026-03-16",
      "amount": 0,
      "amountIncludingVAT": 0,
      "custLedgerEntryNo": 0
    }
  ]
}
```

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

#### `Sales.Document.Release` / `Sales.Document.Reopen`

Direction: **Inbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Release", "source": "MyApp", "subject": "SO-001" }
```

Success: `{ "status": "Success", "documentType": "Order", "documentNo": "SO-001", "customerNo": "10000", "customerName": "Adatum Corporation", "statusBefore": "Open", "statusAfter": "Released" }`  
Reopen accepts documents with status Released or Pending Approval. For Pending Approval documents without approval entries, status is set directly to Open. Returns `"statusAfter": "Open"` with the actual `"statusBefore"` value.

#### `Sales.Document.Create`

Direction: **Inbound**. Creates a new sales document header for a specified customer and document type.

- Required: `documentType` in data JSON — values: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order"
- Customer lookup: `subject` (No. or GUID) or data keys (`no`, `id`, `systemId`, `recordSystemId`)
- Optional: `postingDate` in data JSON (ISO YYYY-MM-DD, defaults to WorkDate)
- Response uses Data.Records.Get format with all header fields

```json
{ "specversion": "1.0", "type": "Sales.Document.Create", "source": "MyApp", "subject": "10000", "data": { "documentType": "Order" } }
```

Success: `{ "status": "Success", "noOfRecords": 1, "result": [{ "id": "...", "primaryKey": { "DocumentType": "Order", "No_": "SO-001" }, "fields": { ... } }] }`

Errors: `"documentType is required in request JSON."`, `"Invalid document type 'X'."`, customer not found.

#### `Sales.Document.Statistics`

Direction: **Outbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Statistics", "source": "MyApp", "subject": "SO-001" }
```

Response:
```json
{
  "status": "Success",
  "documentNo": "SO-001",
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
    { "vatIdentifier": "NORM", "vatPct": 11, "lineAmount": 950.00, "vatAmount": 104.50 }
  ]
}
```

#### PDF Document Retrieval

Direction: **Outbound**. `subject` = document number or SystemId.

| Type | Document |
|---|---|
| `Sales.SalesInvoice.Pdf` | Posted sales invoice |
| `Sales.SalesShipment.Pdf` | Posted shipment |
| `Sales.SalesCreditMemo.Pdf` | Posted credit memo |
| `Sales.ReturnReceipt.Pdf` | Posted return receipt |
| `Sales.SalesCreditMemo.Pdf` | Posted credit memo |
| `Sales.ReturnReceipt.Pdf` | Posted return receipt |

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Pdf", "source": "MyApp", "subject": "INV-001" }
```

**Response flow — two steps, same as all other message types:**

The POST to `/tasks` returns a standard JSON envelope. When successful, `datacontenttype`
will be `"application/pdf"` and `data` contains the **full absolute download URL** to
the binary PDF file — exactly the same pattern as `Data.Records.Get`:

```json
{
  "id": "7df25b48-ec25-498f-b8cf-566044ae020d",
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp",
  "subject": "INV-001",
  "datacontenttype": "application/pdf",
  "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(7df25b48-...)/data"
}
```

Then GET the `data` URL with a Bearer token to download the raw binary PDF bytes:

```javascript
// Step 1 — POST the task
const task = await fetch(`${BASE}/companies(${companyId})/tasks`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ specversion: '1.0', type: 'Sales.SalesInvoice.Pdf',
                         source: 'MyApp', subject: 'INV-001' })
}).then(r => r.json());

// Step 2 — GET the binary PDF from the download URL
const pdfResponse = await fetch(task.data, {
  headers: { Authorization: `Bearer ${token}` }
});
const pdfBlob = await pdfResponse.blob();

// Use in browser — open or trigger download
const url = URL.createObjectURL(pdfBlob);
window.open(url);  // or: downloadLink.href = url; downloadLink.click();
```

> **Key point:** `task.datacontenttype === "application/pdf"` signals that the `data`
> URL returns binary content. Use `response.blob()` or `response.arrayBuffer()` — do
> **not** call `response.json()` on the download step.

Errors from the POST response are thrown as exceptions (not `{"status":"Error"}`):
`"Subject parameter is required"`, `"Sales invoice 'X' not found"`.

#### `Customer.Application.Post`

Direction: **Inbound**. Apply one open customer ledger entry (payment / credit memo / refund) against one or more open target entries of the same customer via codeunit 226.

`subject` = SystemId (GUID) or Entry No. of the *applying* entry. `data.appliesToEntries` (required) is a non-empty array of Entry Nos / SystemIds / `{entryNo}` / `{systemId}` objects.

**Sign trap:** customer payments are *negative*, invoices *positive*. `amountToApply` must match the sign of the applying entry's `Remaining Amount` (which includes VAT).

Full request/response schema, sign convention table, identifier resolution order, discovery workflow, partial-apply and multi-invoice examples, and error catalog: call `Help.Implementation.Get` with `name = Customer.Application.Post`.

#### `Customer.Application.Reverse`

Direction: **Inbound**. Unapply a posted application on a customer ledger entry via codeunit 226.

`subject` = SystemId (GUID) or Entry No. of the customer ledger entry. Optional `data.detailedEntryNo` targets a specific application; without it, the most recent un-reversed application is reversed (**not idempotent** — always pass `detailedEntryNo` for retry safety).

Full schema, how to find the right `detailedEntryNo` via `Detailed Cust. Ledg. Entry`, identifier resolution order, and error catalog: call `Help.Implementation.Get` with `name = Customer.Application.Reverse`.

#### `Sales.Quote.MakeOrder`

Direction: **Inbound**. Converts an existing sales **quote** into a sales **order** via BC codeunit 86 `"Sales-Quote to Order"`. The original quote is deleted; the new order keeps the same customer, lines, and dimensions.

- `subject` = quote document number or SystemId (GUID) of the `Sales Header`
- Resolved document **must** have `Document Type = Quote`; any other type returns an error

```json
{ "specversion": "1.0", "type": "Sales.Quote.MakeOrder", "source": "MyApp", "subject": "SQ-001" }
```

Success: `{ "status": "Success", "quoteNo": "SQ-001", "orderNo": "SO-005", "orderSystemId": "…", "customerNo": "10000", "customerName": "Adatum Corporation", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: `"Subject parameter is required."`, `"Sales header {No} not found."`, `"Sales document {No} is not a Quote (actual type: {Type})."`, or any BC validation error (callstack included as `callstack` field).

#### `Sales.BlanketOrder.MakeOrder`

Direction: **Inbound**. Creates a new sales order from an existing sales **blanket order** via BC codeunit 87 `"Blanket Sales Order to Order"`. Only lines with `Qty. to Ship > 0` are transferred; the blanket order remains and outstanding quantities are reduced.

- `subject` = blanket order document number or SystemId (GUID) of the `Sales Header`
- Resolved document **must** have `Document Type = Blanket Order`
- **Prerequisite:** at least one line must have `Qty. to Ship > 0` — set via `Data.Records.Set` if needed

```json
{ "specversion": "1.0", "type": "Sales.BlanketOrder.MakeOrder", "source": "MyApp", "subject": "SB-001" }
```

Success: `{ "status": "Success", "blanketOrderNo": "SB-001", "orderNo": "SO-006", "orderSystemId": "…", "customerNo": "10000", "customerName": "Adatum Corporation", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: same as `Sales.Quote.MakeOrder` but with "Blanket Order" wording; the BC codeunit also errors if no line qualifies for shipment.

#### `Sales.SalesInvoice.Correct`

Direction: **Inbound**. Wraps BC codeunit 1303 `Correct Posted Sales Invoice` method `CancelPostedInvoiceCreateNewInvoice`. Posts a corrective credit memo against a **posted** sales invoice and creates a new draft `Sales Header` (Document Type = Invoice) initialised from the original. Posting gate: **G/L**.

- `subject` = posted invoice `No.` or SystemId (GUID) of `Sales Invoice Header`
- Or `data` keys: `systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Correct", "source": "MyApp", "subject": "POST-INV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "POST-INV-000123", "originalInvoiceId": "…", "customerNo": "10000", "customerName": "Adatum", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" }, "newDraftInvoice": { "no": "SI-000789", "id": "…", "documentType": "Invoice" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Sales Header` (new draft), `Sales Cr.Memo Header` (cancelling credit memo), and `Sales Invoice Header` (original). Lines via `Sales Line` / `Sales Cr.Memo Line` by `Document No.`.

Linkage: original invoice has `Cancelled = true` and `Canceled By Cr. Memo No.`; credit memo has `Applies-to Doc. Type/No. = Invoice / <originalInvoiceNo>`; `Cancelled Document` row carries the formal link (`Source ID = 112`, `Cancelled Doc. No.`, `Cancelled By Doc. No.`). New draft has no field-level FK to the original.

Errors: `"Message subject or request data must contain a record identifier"`, invoice not found, invoice cannot be corrected (already cancelled, payments applied, posting period closed) — BC error text with `callstack` field.

#### `Sales.SalesInvoice.Cancel`

Direction: **Inbound**. Wraps BC codeunit 1303 method `CancelPostedInvoice`. Posts only the corrective credit memo — no new draft invoice. Same lookup, gate (G/L), and errors as `Sales.SalesInvoice.Correct`. Response omits `newDraftInvoice`.

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Cancel", "source": "MyApp", "subject": "POST-INV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "POST-INV-000123", "originalInvoiceId": "…", "customerNo": "10000", "customerName": "Adatum", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Sales Cr.Memo Header` (+ `Sales Cr.Memo Line` by `Document No.`) and `Sales Invoice Header` (original). Same linkage fields as `Sales.SalesInvoice.Correct` (`Cancelled`, `Canceled By Cr. Memo No.`, `Applies-to Doc.`, `Cancelled Document` with `Source ID = 112`).

#### `Sales.SalesInvoice.Send`

Direction: **Inbound**. Wraps BC standard `Sales Invoice Header.SendProfile(var "Document Sending Profile")`. Same behaviour as clicking **Send** on the posted sales invoice page in BC — exposed as a Bifrost so external systems and AI agents can trigger it without a UI. Channel selection (e-mail / print / disk / electronic document) is fully BC-configured via Document Sending Profiles; this message only decides *which* profile to use. Posting gate: **none** (sending produces no ledger entries).

**Sending flow (what happens when you call this):**

1. Resolve the `Sales Invoice Header` from the request (`invoiceId` GUID → `invoiceNo` → `subject`).
2. Resolve the `Document Sending Profile` using the chain below.
3. Call `Sales Invoice Header.SendProfile(DocumentSendingProfile)` — from here, behaviour is exactly the standard BC Send.
4. BC dispatches every channel the resolved profile has enabled: **Printer** (prints the report), **E-Mail** (renders + sends via the configured email account; sets `Sent as Email = true`), **Disk** (writes the file to user download location), **Electronic Document** (builds PEPPOL/OIOUBL/custom format, hands off to the Document Exchange Service, updates header tracking fields).
5. Return the success envelope (with resolved profile + source), or an error envelope with the original BC error text and callstack.

**Document lookup order:** `data.invoiceNo` → `data.invoiceId` (SystemId) → `subject` (number or SystemId GUID; GUIDs auto-detected).

**Profile resolution order:**

1. `data.documentSendingProfile` (request override) → `documentSendingProfileSource = "Request"`
2. `Customer."Document Sending Profile"` (customer's configured profile) → `documentSendingProfileSource = "Customer"`
3. First `Document Sending Profile` with `Default = true` → `documentSendingProfileSource = "Default"`
4. None of the above → error

**Tracking — where the status lives after sending.** The call does NOT return delivery confirmation. Delivery is asynchronous (especially for e-mail and electronic documents). Read these `Sales Invoice Header` (table 112) fields via `Data.Records.Get` to inspect what happened:

| Field | Type | Meaning |
|---|---|---|
| `Sent as Email` | Boolean | `true` once the e-mail channel handed the message to the mail server. |
| `No. Printed` | Integer | Incremented each time the printer channel produced the document. |
| `Document Exchange Status` | Option | E-document lifecycle at the Document Exchange Service: `Not Sent`, `Sent to Document Exchange Service`, `Sent to Recipient`, `Delivered to Recipient`, `Failed Delivery to Recipient`. Updated asynchronously by the DES connector job queue. |
| `Document Exchange Identifier` | Code[50] | DES-side identifier — used to trace the electronic document in the exchange service portal. |

Sent-email history (subject, recipients, attachment, timestamp) is in the BC base app `Sent Email` / `Email Outbox` tables. A `Success` response means BC accepted dispatch without throwing; it does NOT prove end-to-end delivery — query the tracking fields above for that.

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Send", "source": "MyApp", "subject": "POST-INV-000123", "data": { "documentSendingProfile": "EMAIL" } }
```

Success: `{ "status": "Success", "documentType": "PostedSalesInvoice", "documentNo": "POST-INV-000123", "documentId": "…", "customerNo": "10000", "customerName": "Adatum", "documentSendingProfileCode": "EMAIL", "documentSendingProfileSource": "Request", "message": "Document sent successfully." }`

Errors (returned as `{ "status": "Error", "error": "...", "callstack": "..." }`):
- `"Subject parameter is required. Provide the invoice number or SystemId."`
- `"Sales Invoice {no} not found."`
- `"Document Sending Profile \"{code}\" not found."` (request override does not exist)
- `"Document Sending Profile \"{code}\" referenced by customer {no} does not exist."` (dangling customer profile)
- `"No Document Sending Profile resolved for customer {no} and no system default profile exists."`
- Any error raised by BC's `SendProfile` (e.g., missing e-mail account, missing report selection, electronic document validation failure) — surfaced verbatim through `error` + `callstack`.

#### `Sales.SalesCreditMemo.Send`

Direction: **Inbound**. Wraps BC standard `Sales Cr.Memo Header.SendProfile(var "Document Sending Profile")`. Same sending flow, profile resolution, and tracking semantics as `Sales.SalesInvoice.Send` — read tracking fields from `Sales Cr.Memo Header` (table 114) instead of `Sales Invoice Header` (table 112).

**Document lookup order:** `data.creditMemoNo` → `data.creditMemoId` (SystemId) → `subject`.

```json
{ "specversion": "1.0", "type": "Sales.SalesCreditMemo.Send", "source": "MyApp", "subject": "POST-CRM-000456", "data": { "documentSendingProfile": "EMAIL" } }
```

Success: `{ "status": "Success", "documentType": "PostedSalesCreditMemo", "documentNo": "POST-CRM-000456", "documentId": "…", "customerNo": "10000", "customerName": "Adatum", "documentSendingProfileCode": "EMAIL", "documentSendingProfileSource": "Customer", "message": "Document sent successfully." }`

Errors: same as `Sales.SalesInvoice.Send` except `"Sales Credit Memo {no} not found."` is used when the credit memo is missing.
