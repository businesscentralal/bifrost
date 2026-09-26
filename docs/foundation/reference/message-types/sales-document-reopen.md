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
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
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
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Sales Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| `Sales Document {no} is already open.` | Header `Status` is already `Open`. |
| BC reopen errors | Bubble up from `Sales Manual Reopen`. |

## Related Message Types

- `Sales.Document.Release` — reverse this operation.
- `Sales.Document.Post` — post a released document (requires release first).

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

