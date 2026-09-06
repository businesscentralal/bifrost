---
id: purchase-quote-makeorder
title: "Purchase.Quote.MakeOrder"
sidebar_label: "Purchase.Quote.MakeOrder"
sidebar_position: 117
description: "Request and response contract for the Purchase.Quote.MakeOrder Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Converts a Purchase Quote into a Purchase Order using BC codeunit `96 "Purch.-Quote to Order"`.
The source quote is consumed by the BC conversion routine and a new Purchase Order header is created.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: once converted, the original quote no longer exists, so retrying with the same `quoteNo` returns an error.
- The header must be of Document Type `Quote`. Other types are rejected with an error.

## Subject Identification Order

Same as other Purchase document message types (via `FindPurchaseHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | string/GUID | Optional | Quote `No.` or `Purchase Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Purchase Header.SystemId` of the quote. |
| `quoteNo` | string | See above | Typed `No.` lookup for a Purchase Quote. |

### Request Example
```json
{
  "specversion": "1.0",
  "type": "Purchase.Quote.MakeOrder",
  "source": "MyApp",
  "subject": "PQ-001"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "quoteNo": "PQ-001",
  "orderNo": "PO-001",
  "orderSystemId": "a1b2c3d4-1234-1234-1234-123456789012",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
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
| `quoteNo` | Original Purchase Quote `No.` before conversion. |
| `orderNo` | New Purchase Order `No.` returned by `GetPurchOrderHeader`. |
| `orderSystemId` | New Purchase Order `SystemId`. |

## Errors

| Error | Cause |
|---|---|
| Document identifier missing | `FindPurchaseHeader` could not resolve a header. |
| `Purchase document {no} is not a Quote (actual type: ...).` | Document Type is not `Quote`. |
| BC conversion errors | Bubble up from `Purch.-Quote to Order` (e.g., missing vendor data). |

## Related Message Types

- `Purchase.Document.Create` — create the quote first.
- `Purchase.BlanketOrder.MakeOrder` — analogous conversion from a blanket order.
- `Purchase.Document.Release` / `Purchase.Document.Post` — next steps on the resulting order.

