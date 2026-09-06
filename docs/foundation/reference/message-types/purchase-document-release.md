---
id: purchase-document-release
title: "Purchase.Document.Release"
sidebar_label: "Purchase.Document.Release"
sidebar_position: 112
description: "Request and response contract for the Purchase.Document.Release Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Releases an open purchase document by running Microsoft codeunit `Release Purchase Document`. Supports Order, Invoice, Credit Memo, Return Order, Quote, and Blanket Order. The status moves from `Open` to `Released`.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
Not idempotent: a second call against an already-released document returns an error (`Purchase Document {no} is already released.`). Check `Status` via `Data.Records.Get` before retrying.

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order only).
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Request Parameters
Request body is optional. No additional fields are read.

## Request Example
```json
{ "type": "Purchase.Document.Release", "subject": "PO-001" }
```

## Response Shape
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

| Property | Description |
|----------|-------------|
| documentType | Localised enum name from `Purchase Document Type`. |
| statusBefore | Hard-coded as `Open` — release is only invoked when the previous status was not `Released`. |
| statusAfter | Status after the call (typically `Released`; may show `Pending Approval` if an approval workflow intercepts the release). |
| documentDate | `Order Date` from the header. |
| amount / amountIncludingVAT | FlowFields, recalculated after the release. |

## Errors
| Error | Cause |
|-------|-------|
| `Purchase Document {no} is already released.` | Header `Status` is already `Released`. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No document resolved by `FindPurchaseHeader`. |
| Underlying BC error text | Any error raised by `Release Purchase Document` (missing required fields, approval workflow blocks, etc.). |

## Related Message Types
- `Purchase.Document.Reopen` — Move back to `Open`.
- `Purchase.Document.Post` — Posting handles its own release internally; explicit release is not required before posting.

