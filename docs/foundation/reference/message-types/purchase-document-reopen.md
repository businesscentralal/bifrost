---
id: purchase-document-reopen
title: "Purchase.Document.Reopen"
sidebar_label: "Purchase.Document.Reopen"
sidebar_position: 113
description: "Request and response contract for the Purchase.Document.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Reopens a purchase document by running Microsoft codeunit `Purchase Manual Reopen`, moving the status from `Released` to `Open`. As a no-approval-entries escape hatch, a document in `Pending Approval` status with no rows in `Approval Entry` for its `RecordId` is reopened by directly validating `Status := Open`.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
Not idempotent: a second call against a document already in `Open` returns `Purchase Document {no} is already open.`. Check `Status` via `Data.Records.Get` before retrying.

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order only).
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Request Parameters
Request body is optional. No additional fields are read.

## Request Example
```json
{ "type": "Purchase.Document.Reopen", "subject": "PO-001" }
```

## Response Shape
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

| Property | Description |
|----------|-------------|
| statusBefore | The header status snapshot before the reopen runs (`Released` or `Pending Approval`). |
| statusAfter | Status after the call. `Open` on success; may remain `Pending Approval` when the escape hatch is skipped because approval entries exist. |
| documentDate | `Order Date` from the header. |
| amount / amountIncludingVAT | FlowFields, recalculated after the reopen. |

## Errors
| Error | Cause |
|-------|-------|
| `Purchase Document {no} is already open.` | Header `Status` is already `Open`. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No document resolved by `FindPurchaseHeader`. |
| Underlying BC error text | Any error raised by `Purchase Manual Reopen`. |

## Related Message Types
- `Purchase.Document.Release` — Move back to `Released`.
- `Data.Records.Set` — Modify header / line fields once reopened.

