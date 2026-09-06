---
id: sales-document-release
title: "Sales.Document.Release"
sidebar_label: "Sales.Document.Release"
sidebar_position: 125
description: "Request and response contract for the Sales.Document.Release Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Releases an open Sales Header by running BC codeunit `Release Sales Document` with `SetHideValidationDialog(true)`. Returns the document's status transition and basic header context.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: re-calling on an already-`Released` document errors. There is no "release if open" mode.
- Standard BC release validation runs (Sell-to Customer No., Bill-to Customer No., Posting Date, Currency, Dimensions, ...). Any validation failure aborts the release and is returned as an error response.

## Subject Identification Order

Via `FindSalesHeader`. Subject is tried first, then request JSON:
1. `subject` — GUID = `Sales Header.SystemId`, otherwise `No.` (assumed `Document Type::Order`).
2. JSON `systemId` / `recordSystemId` / `id` — `Sales Header.SystemId`.
3. JSON `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` — typed lookup by Document Type + No.

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
  "statusBefore": "Open",
  "statusAfter": "Released",
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
| `statusBefore` | Always `"Open"` — the precondition for a successful call. |
| `documentDate` | `Sales Header."Order Date"`. |
| `amount` / `amountIncludingVAT` | Header FlowFields (CalcFields). |

## Examples (from unit tests)

From `Sales Document Release Tests` (`test/test/Sales/SalesDocumentReleaseTests.Codeunit.al`) — covers release of Order/Invoice/Credit Memo/Return Order/Blanket Order/Quote, the already-released error, and BC validation failures bubbled as `status: Error`.

## Errors

| Error | Cause |
|---|---|
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could not resolve a header. |
| `Sales Document {no} is already released.` | Header `Status` is already `Released`. |
| BC release/validation errors | Bubble up from `Release Sales Document` (e.g. missing posting date, blocked customer). |

## Related Message Types

- `Sales.Document.Reopen` — reverse this operation.
- `Sales.Document.Post` — post a released document.
- `Sales.Document.PreviewPost` — preview the posting without committing.

