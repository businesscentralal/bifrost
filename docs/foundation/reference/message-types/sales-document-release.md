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
1. `subject` — GUID = `Sales Header.SystemId`, otherwise `No.` tried as every document type (several matches give `AmbiguousRecord`; then send the number in the key of the type you mean).
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
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
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
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `Sales Header "{value}" matches more than one document. Pass it as one of: {keys}.` (`AmbiguousRecord`) | A plain subject matches several document types; send it in the key of the type you mean. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| `Sales Document {no} is already released.` | Header `Status` is already `Released`. |
| BC release/validation errors | Bubble up from `Release Sales Document` (e.g. missing posting date, blocked customer). |

## Related Message Types

- `Sales.Document.Reopen` — reverse this operation.
- `Sales.Document.Post` — post a released document.
- `Sales.Document.PreviewPost` — preview the posting without committing.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

