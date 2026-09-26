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
2. `subject` as text → tried as every document type. One match is used; several give `AmbiguousRecord` - then send the number in the key of the type you mean (`orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`).
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

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
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Purchase Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| Underlying BC error text | Any error raised by `Purchase Manual Reopen`. |

## Related Message Types
- `Purchase.Document.Release` — Move back to `Released`.
- `Data.Records.Set` — Modify header / line fields once reopened.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

