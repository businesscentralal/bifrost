---
id: sales-document-reopen
title: "Sales.Document.Reopen"
sidebar_label: "Sales.Document.Reopen"
sidebar_position: 126
description: "Request and response contract for the Sales.Document.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Reopens a released (or pending-approval) Sales Header so it can be edited again.
- Released → uses BC codeunit `Sales Manual Reopen` (raises `OnAfterReopenSalesDoc`).
- Pending Approval with no `Approval Entry` rows for the record → directly sets `Status = Open` and `Modify(true)` (escape hatch for stuck approvals).

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: re-calling on an already-`Open` document errors.
- The Pending Approval fast path is only taken when **no** `Approval Entry` exists for the record. If an active approval workflow exists you must cancel/approve it via the standard approval message types first.

## Subject Identification Order

Same as `Sales.Document.Release` (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | string | See above | Typed `No.` lookup. |

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
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2026-01-15",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

### Failure
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `statusBefore` | The actual prior status (`"Released"` or `"Pending Approval"`). |
| `documentDate` | `Sales Header."Order Date"`. |

## Examples (from unit tests)

From `Sales Document Reopen Tests` (`test/test/Sales/SalesDocumentReopenTests.Codeunit.al`) — covers released-to-open across document types, the already-open error, and the Pending Approval escape hatch.

## Errors

| Error | Cause |
|---|---|
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could not resolve a header. |
| `Sales Document {no} is already open.` | Header `Status` is already `Open`. |
| BC reopen errors | Bubble up from `Sales Manual Reopen`. |

## Related Message Types

- `Sales.Document.Release` — reverse this operation.
- `Sales.Document.Post` — post a released document (requires release first).

