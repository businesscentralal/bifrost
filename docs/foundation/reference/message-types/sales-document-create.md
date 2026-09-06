---
id: sales-document-create
title: "Sales.Document.Create"
sidebar_label: "Sales.Document.Create"
sidebar_position: 122
description: "Request and response contract for the Sales.Document.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates a new (header-only) Sales Header for a given customer and document type. The header is `Insert(true)` then validates `Sell-to Customer No.` and `Posting Date`. The full inserted record is returned in the `Data.Records.Get` shape so downstream calls can immediately add lines or modify fields.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: each call inserts a new header with a fresh `No.` from the relevant number series.
- No lines are created — use a follow-up call to add `Sales Line` records.

## Customer Resolution Order

Via `Argument.FindCustomer` — Subject first, then JSON:
1. `subject` — GUID = `Customer.SystemId`, otherwise `Customer.No.`.
2. JSON `no`.
3. JSON `id` / `systemId` / `recordSystemId` — `Customer.SystemId`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `documentType` | string | **Yes** | One of: `Quote`, `Order`, `Invoice`, `Credit Memo`, `Blanket Order`, `Return Order`. Matched case-insensitively against `Enum::"Sales Document Type".Names()`. |
| Customer keys | — | Yes (Subject or JSON) | See resolution order. |
| `postingDate` | date | No | Format 9. Default: `WorkDate`. |

### Request Example
```json
{
  "documentType": "Order",
  "no": "10000",
  "postingDate": "2026-01-15"
}
```

## Response Shape

### Success

Returns the inserted Sales Header in `Data.Records.Get` shape — `noOfRecords: 1` with a single `result[]` entry containing every accessible field (subject to `Bifrost Field Access` write-restriction rules).

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "tableName": "Sales Header",
      "tableNo": 36,
      "DocumentType": "Order",
      "No_": "PS-ORD103001",
      "SelltoCustomerNo_": "10000",
      "PostingDate": "2026-01-15"
    }
  ]
}
```

JSON field names follow the standard `RemoveNonAlphaNumericCharacters` rule (e.g. `No.` → `No_`, `Sell-to Customer No.` → `SelltoCustomerNo_`, `Balance (LCY)` → `BalanceLCY`).

## Examples (from unit tests)

From `Sales Document Create Tests` (`test/test/Sales/SalesDocumentCreateTests.Codeunit.al`) — covers each `documentType` value, customer by `no`/`subject`/SystemId, custom `postingDate`, the missing-`documentType` error and the invalid-`documentType` error.

## Errors

| Error | Cause |
|---|---|
| `Customer identifier must be specified in subject field or request JSON (no, id, systemId, recordSystemId).` | `FindCustomer` could not resolve a customer. |
| `documentType is required in request JSON. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` missing or empty. |
| `Invalid document type '{value}'. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` supplied but did not match any enum name. |
| BC validation errors | Bubble up from header field validation (e.g. blocked customer, invalid posting date). |

## Related Message Types

- `Data.Records.Set` — add `Sales Line` rows to the new header.
- `Sales.Document.Release` / `Sales.Document.Post` — downstream lifecycle.

