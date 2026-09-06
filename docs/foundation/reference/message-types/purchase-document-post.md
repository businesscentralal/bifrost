---
id: purchase-document-post
title: "Purchase.Document.Post"
sidebar_label: "Purchase.Document.Post"
sidebar_position: 110
description: "Request and response contract for the Purchase.Document.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts a purchase document via Microsoft codeunit `Purch.-Post` and returns the list of posted documents that were created. Supports Order, Invoice, Credit Memo, and Return Order. The source document is consumed (deleted) for Orders and Return Orders when posting completes fully.

| Source | Posted documents created |
|--------|--------------------------|
| Order | Posted Purchase Invoice + Posted Purchase Receipt |
| Invoice | Posted Purchase Invoice |
| Credit Memo | Posted Purchase Credit Memo |
| Return Order | Posted Purchase Credit Memo + Posted Return Shipment |

**Direction**: Inbound  **Content-Type**: text/json

> ⚠️ **Receive/Invoice flags are NOT set automatically via the API.**
> Unlike the BC UI, the API reads `Receive` and `Invoice` (for Orders) and `Ship` and `Invoice` (for Return Orders) exactly as stored on the header.
> Orders created via API have all flags `false` by default. You **must** set them with `Data.Records.Set` before calling this message type.
> See **Posting Mode Flags** below for the required two-step pattern.

## Idempotency / Safety
**Not idempotent and not retry-safe.** A successful post is irreversible; the source document is gone or its `Status` has advanced. Retrying may post the document again (if it is still present) or surface a not-found error.

Discovery of newly created posted documents uses a snapshot-then-compare pattern: `Last Posting No.`, `Last Receiving No.` and `Last Return Shipment No.` are captured before posting and the corresponding posted-document tables are looked up afterward by the **new** values. If `Last *No.` did not change, no entry is emitted in `postedDocuments` for that channel.

## Posting Mode Flags
For Orders and Return Orders, BC requires at least one of `Receive`/`Invoice` (orders) or `Ship`/`Invoice` (return orders) to be `true` on the header. This impl does **not** set these flags automatically — set them via `Data.Records.Set` before calling, or BC will return `Enter Yes in Receive and/or Invoice and/or Ship.`.

**Required two-step pattern (sequential — do not parallelize):**

**Step 1 — Set flags on the header**
```json
{
  "type": "Data.Records.Set",
  "tableName": "Purchase Header",
  "primaryKey": { "DocumentType": 1, "No_": "PO-001" },
  "fields": { "Receive": true, "Invoice": true }
}
```

**Step 2 — Post**
```json
{ "type": "Purchase.Document.Post", "subject": "PO-001" }
```

| Flag | Field No. | Order | Return Order |
|---|---|---|---|
| `Receive` | 77 | Create a Posted Receipt | — |
| `Ship` | 78 | — | Create a Posted Return Shipment |
| `Invoice` | 79 | Create a Posted Invoice | Create a Posted Credit Memo |

Other BC-side prerequisites that must be satisfied before calling:
- Invoice / Order → Invoice: `Vendor Invoice No.` must be filled.
- Credit Memo / Return Order → Credit Memo: `Vendor Cr. Memo No.` must be filled and unique per vendor.

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order only).
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Request Parameters
Request body is optional. No additional fields are read.

## Request Example
```json
{ "type": "Purchase.Document.Post", "subject": "PO-001" }
```

## Response Shape
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
      "recordSystemId": "<systemId>",
      "no": "PI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "vendorLedgerEntryNo": 1001
    },
    { "type": "Posted Purchase Receipt", "recordSystemId": "<systemId>", "no": "R-001", "postingDate": "2026-03-16" }
  ]
}
```

| Property | Description |
|----------|-------------|
| documentType | Localised enum name of the **source** document. |
| documentNo | The source (pre-assigned) document number. |
| postedDocuments[].type | One of `Posted Purchase Invoice`, `Posted Purchase Receipt`, `Posted Purchase Credit Memo`, `Posted Return Shipment`. |
| postedDocuments[].recordSystemId | GUID of the posted record (without braces, lowercase). |
| postedDocuments[].no | Document number of the posted record. |
| postedDocuments[].postingDate | Posting date of the posted record. |
| postedDocuments[].amount / amountIncludingVAT / vendorLedgerEntryNo | Present **only** for invoice and credit memo entries, omitted for receipts and return shipments. |

Discovery fallback: when `Get(Last Posting No.)` misses (number-series quirk), the impl falls back to `Pre-Assigned No.` for Invoice / Credit Memo sources, and to `Order No.` / `Return Order No.` for Order / Return Order sources.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Purchase document {no} has no lines to post.` | The source header has no `Purchase Line` rows. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No document resolved by `FindPurchaseHeader`. |
| Underlying BC error text | Any error raised by `Purch.-Post` (missing `Vendor Invoice No.`, duplicate `Vendor Cr. Memo No.`, both posting flags false, missing posting setup, blocked items, dimension errors, etc.). |

## Related Message Types
- `Purchase.Document.PreviewPost` — Simulate the post and inspect the would-be ledger entries.
- `Purchase.Document.Statistics` — Header totals without posting.
- `Purchase.Document.Release` / `Purchase.Document.Reopen` — Manage status before posting.

