---
id: purchase-document-post
title: "Purchase.Document.Post"
sidebar_label: "Purchase.Document.Post"
sidebar_position: 110
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
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


## Idempotency / Safety
**Not idempotent and not retry-safe.** A successful post is irreversible; the source document is gone or its `Status` has advanced. Retrying may post the document again (if it is still present) or surface a not-found error.

Discovery of newly created posted documents uses a snapshot-then-compare pattern: `Last Posting No.`, `Last Receiving No.` and `Last Return Shipment No.` are captured before posting and the corresponding posted-document tables are looked up afterward by the **new** values. If `Last *No.` did not change, no entry is emitted in `postedDocuments` for that channel.

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → tried as each postable document type (Order, Invoice, Credit Memo, Return Order). One match is used; several give `AmbiguousRecord` - then send the number in `orderNo`, `invoiceNo`, `creditMemoNo` or `returnOrderNo`.
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Request Parameters
| Parameter | Type | Required | Notes |
|---|---|---|---|
| `receive` | bool | No | Orders: post the receipt (`Receive`). |
| `ship` | bool | No | Return orders: post the return shipment (`Ship`). |
| `invoice` | bool | No | Orders and return orders: post the invoice or credit memo (`Invoice`). |

## Receive and Invoice

An order posts what `receive` and `invoice` say (a return order: `ship` and `invoice`). When the request sends neither and the header has neither flag set, both are `true`, which is the "Receive and Invoice" choice of the Post dialog in Business Central. Send `"invoice": false` to receive only. Both `false` is `InvalidParameter`: nothing would be posted. Invoices and credit memos need no flags.


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
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Purchase Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| Underlying BC error text | Any error raised by `Purch.-Post` (missing `Vendor Invoice No.`, duplicate `Vendor Cr. Memo No.`, missing posting setup, blocked items, dimension errors, etc.). |

## Related Message Types
- `Purchase.Document.PreviewPost` — Simulate the post and inspect the would-be ledger entries.
- `Purchase.Document.Statistics` — Header totals without posting.
- `Purchase.Document.Release` / `Purchase.Document.Reopen` — Manage status before posting.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

