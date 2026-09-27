---
id: sales-document-post
title: "Sales.Document.Post"
sidebar_label: "Sales.Document.Post"
sidebar_position: 123
description: "Beiðni- og svarsamningur fyrir Sales.Document.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview

Posts a Sales Header by running BC codeunit `Sales-Post` with `SetHideValidationDialog(true)`. After posting it discovers the newly created posted documents (Invoice / Credit Memo / Shipment / Return Receipt) by snapshotting `Last Posting No.` / `Last Shipping No.` / `Last Return Receipt No.` before posting and looking them up afterwards, with `Pre-Assigned No.` / `Order No.` / `Return Order No.` keys as fallback.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`


## Idempotency / Safety Notes

- Not idempotent: each successful call creates ledger entries and posted documents.
- All BC standard posting validation runs (number series availability, dimensions, ...). BC errors are returned as `status: Error` with the BC `GetLastErrorText()` message.
- Pre-flight: refuses headers with no `Sales Line` rows.

## Subject Identification Order

Same as `Sales.Document.Release` (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | string | See above | Typed `No.` lookup. |
| `ship` | bool | No | Orders: post the shipment (`Ship`). |
| `receive` | bool | No | Return orders: post the return receipt (`Receive`). |
| `invoice` | bool | No | Orders and return orders: post the invoice or credit memo (`Invoice`). |

## Ship and Invoice

An order posts what `ship` and `invoice` say (a return order: `receive` and `invoice`). When the request sends neither and the header has neither flag set, both are `true`, which is the "Ship and Invoice" choice of the Post dialog in Business Central. Send `"invoice": false` to ship only. Both `false` is `InvalidParameter`: nothing would be posted. Invoices and credit memos need no flags.

### Request Example
```json
{ "orderNo": "PS-ORD103001" }
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "no": "PS-INV103001",
      "recordSystemId": "11111111-2222-3333-4444-555555555555",
      "postingDate": "2026-01-15",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 12345
    },
    {
      "type": "Posted Sales Shipment",
      "no": "PS-SHIP103001",
      "recordSystemId": "...",
      "postingDate": "2026-01-15"
    }
  ]
}
```

### Failure
```json
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `documentNo` | The pre-posting `Sales Header."No."` — the unposted document is removed after a successful post but the pre-assigned number is preserved for traceability. |
| `postedDocuments[].type` | One of `Posted Sales Invoice`, `Posted Sales Credit Memo`, `Posted Sales Shipment`, `Posted Return Receipt`. |
| `postedDocuments[]` shape | Order → Invoice + Shipment. Invoice → Invoice. Credit Memo → Credit Memo. Return Order → Credit Memo + Return Receipt. |
| `custLedgerEntryNo` | Emitted on Invoice/Credit Memo entries when a `Cust. Ledger Entry` exists. |

## Examples (from unit tests)

From `Sales Document Post Tests` (`test/test/Sales/SalesDocumentPostTests.Codeunit.al`) — covers Order/Invoice/Credit Memo/Return Order posting, verifies `postedDocuments[]` entries and `custLedgerEntryNo` linkage, and exercises BC errors (no lines, missing posting date).

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Sales Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| `Sales document {no} has no lines to post.` | Header has no `Sales Line` rows. |
| BC posting errors | Bubble up from `Sales-Post` (e.g. missing posting date, invalid dimensions, customer blocked). |

## Related Message Types

- `Sales.Document.PreviewPost` — preview the same posting without committing.
- `Sales.Document.Release` — required before posting if `Status = Open`.
- `Sales.SalesInvoice.Pdf` / `Sales.SalesCreditMemo.Pdf` / `Sales.SalesShipment.Pdf` / `Sales.ReturnReceipt.Pdf` — fetch a PDF of the resulting posted document by `no`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

