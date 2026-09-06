---
id: sales-quote-makeorder
title: "Sales.Quote.MakeOrder"
sidebar_label: "Sales.Quote.MakeOrder"
sidebar_position: 128
description: "Request and response contract for the Sales.Quote.MakeOrder Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Converts a Sales Quote into a Sales Order using BC codeunit `86 "Sales-Quote to Order"`.
The source quote is consumed by the BC conversion routine (deleted by default per BC behaviour) and a new Sales Order header is created.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: once converted, the original quote no longer exists, so retrying with the same `quoteNo` returns an error.
- The header must be of Document Type `Quote`. Other types are rejected with an error.

## Subject Identification Order

Same as other Sales document message types (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | string/GUID | Optional | Quote `No.` (plain text) or `Sales Header.SystemId` (GUID). |
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId` of the quote. |
| `quoteNo` | string | See above | Typed `No.` lookup for a Sales Quote. |

### Request Example
```json
{
  "specversion": "1.0",
  "type": "Sales.Quote.MakeOrder",
  "source": "MyApp",
  "subject": "SQ-001"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "quoteNo": "SQ-001",
  "orderNo": "SO-001",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "documentDate": "2026-01-15",
  "orderDate": "2026-01-15"
}
```

### Failure
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `quoteNo` | Original Sales Quote `No.` before conversion. |
| `orderNo` | New Sales Order `No.` returned by `GetSalesOrderHeader`. |
| `orderSystemId` | New Sales Order `SystemId` (use to retrieve the order via `Data.Records.Get`). |
| `customerNo` / `customerName` | Copied from the new Sales Order header. |

## Errors

| Error | Cause |
|---|---|
| Document identifier missing | `FindSalesHeader` could not resolve a header. |
| `Sales document {no} is not a Quote (actual type: ...).` | Document Type is not `Quote`. |
| BC conversion errors | Bubble up from `Sales-Quote to Order` (e.g., missing customer data, blocked items). |

## Related Message Types

- `Sales.Document.Create` — create the quote first.
- `Sales.BlanketOrder.MakeOrder` — analogous conversion from a blanket order.
- `Sales.Document.Release` / `Sales.Document.Post` — next steps on the resulting order.

