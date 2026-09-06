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
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order only).
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

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
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No document resolved by `FindPurchaseHeader`. |

## Related Message Types
- `Purchase.Document.PreviewPost` — Adds predicted document numbers and full ledger preview.
- `Purchase.Document.Post` — Commit the document.
- `Data.Records.Get` on `Purchase Line` — Read individual lines.

