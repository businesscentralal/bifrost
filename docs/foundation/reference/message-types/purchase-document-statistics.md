---
id: purchase-document-statistics
title: "Purchase.Document.Statistics"
sidebar_label: "Purchase.Document.Statistics"
sidebar_position: 114
description: "Request and response contract for the Purchase.Document.Statistics Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns header totals (amounts, VAT breakdown, total quantity / weight / volume) for a single purchase document. Mirrors the data shown on the Purchase Statistics page — derived by iterating the document's `Purchase Line` rows and calling `CalcVATAmountLines`.

**Direction**: Outbound  **Content-Type**: text/json

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → tried as every document type. One match is used; several give `AmbiguousRecord` - then send the number in the key of the type you mean (`orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`).
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Request Parameters
Request body is optional. No additional fields are read.

## Request Example
```json
{ "type": "Purchase.Document.Statistics", "subject": "PO-001" }
```

## Response Shape
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "currencyCode": "USD",
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
    { "vatIdentifier": "STANDARD", "vatPct": 25.00, "lineAmount": 4750.00, "vatBase": 4750.00, "vatAmount": 1187.50, "amountInclVAT": 5937.50 }
  ]
}
```

| Property | Description |
|----------|-------------|
| currencyCode | Document `Currency Code`; falls back to the LCY code from General Ledger Setup when the header is in LCY. **Never empty in the response.** |
| documentDate | `Order Date` from the header. |
| order.amount | `Purchase Header.Amount` FlowField (line totals excluding VAT, before invoice discount). |
| order.lineDiscountAmount | Sum of `Line Discount Amount` over all `Purchase Line` rows. |
| order.invoiceDiscountAmount | Sum of `Invoice Discount Amount` from the temporary `VAT Amount Line` set. |
| order.totalExclVAT | Sum of `Line Amount` after invoice discount across VAT lines. |
| order.vatAmount | Sum of `VAT Amount` across VAT lines. |
| order.totalInclVAT | Sum of `Amount Including VAT` across VAT lines. |
| order.quantity | Sum of `Quantity` across `Purchase Line` rows. |
| order.totalWeight | Sum of `Gross Weight × Quantity` across lines. |
| order.totalVolume | Sum of `Unit Volume × Quantity` across lines. |
| order.noOfVATLines | Number of distinct VAT lines (i.e. distinct VAT Identifier / VAT % combinations). |
| vat_totals[] | One entry per VAT line returned by `CalcVATAmountLines`. |

All decimal amounts are rounded using the precision of the document currency (or LCY when the header has no currency).

## Errors
| Error | Cause |
|-------|-------|
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Purchase Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |

## Related Message Types
- `Purchase.Document.PreviewPost` — Adds predicted document numbers and full ledger preview.
- `Purchase.Document.Post` — Commit the document.
- `Data.Records.Get` on `Purchase Line` — Read individual lines.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

