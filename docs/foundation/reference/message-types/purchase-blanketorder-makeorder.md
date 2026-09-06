---
id: purchase-blanketorder-makeorder
title: "Purchase.BlanketOrder.MakeOrder"
sidebar_label: "Purchase.BlanketOrder.MakeOrder"
sidebar_position: 108
description: "Request and response contract for the Purchase.BlanketOrder.MakeOrder Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Converts a Purchase Blanket Order into a Purchase Order using BC codeunit `97 "Blanket Purch. Order to Order"`.
The blanket order is preserved; only the lines flagged for conversion are turned into a new Purchase Order.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: each call creates a new Purchase Order for the convertible lines on the blanket order.
- The header must be of Document Type `Blanket Order`. Other types are rejected with an error.
- BC requires at least one line with `Qty. to Receive` (or equivalent) > 0; otherwise the conversion errors.

## Subject Identification Order

Same as other Purchase document message types (via `FindPurchaseHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | string/GUID | Optional | Blanket Order `No.` or `Purchase Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Purchase Header.SystemId` of the blanket order. |
| `blanketOrderNo` | string | See above | Typed `No.` lookup for a Purchase Blanket Order. |

### Request Example
```json
{
  "specversion": "1.0",
  "type": "Purchase.BlanketOrder.MakeOrder",
  "source": "MyApp",
  "subject": "PBO-001"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "blanketOrderNo": "PBO-001",
  "orderNo": "PO-002",
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
| `blanketOrderNo` | Original Purchase Blanket Order `No.`. |
| `orderNo` | New Purchase Order `No.` returned by `GetPurchOrderHeader`. |
| `orderSystemId` | New Purchase Order `SystemId`. |
| `vendorNo` | Buy-from Vendor No. copied from the new Purchase Order header. |
| `vendorName` | Buy-from Vendor Name copied from the new Purchase Order header. |
| `documentDate` | Document Date on the new Purchase Order (Format 0,9). |
| `orderDate` | Order Date on the new Purchase Order (Format 0,9). |

## Qty. to Receive Behaviour

BC only converts lines where `Qty. to Receive > 0`. When you add a Purchase Line with a `Quantity`, BC automatically sets `Qty. to Receive = Quantity` by default — so freshly created lines are immediately convertible without additional setup. After conversion, the blanket order line's `Qty. to Receive` is reset to 0 and `Quantity Received` increases. To create another release order from the same blanket line, set `Qty. to Receive` again via `Data.Records.Set` before calling `Purchase.BlanketOrder.MakeOrder` a second time.

## Errors

| Error | Cause |
|---|---|
| Document identifier missing | `FindPurchaseHeader` could not resolve a header. |
| `Purchase document {no} is not a Blanket Order (actual type: ...).` | Document Type is not `Blanket Order`. |
| `Nothing to create` or related | No lines have a Qty. to Receive > 0. |
| BC conversion errors | Bubble up from `Blanket Purch. Order to Order`. |

## Related Message Types

- `Purchase.Document.Create` — create the blanket order first.
- `Purchase.Quote.MakeOrder` — analogous conversion from a quote.
- `Purchase.Document.Release` / `Purchase.Document.Post` — next steps on the resulting order.

