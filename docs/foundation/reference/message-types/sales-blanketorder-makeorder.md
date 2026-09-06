---
id: sales-blanketorder-makeorder
title: "Sales.BlanketOrder.MakeOrder"
sidebar_label: "Sales.BlanketOrder.MakeOrder"
sidebar_position: 121
description: "Request and response contract for the Sales.BlanketOrder.MakeOrder Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Converts a Sales Blanket Order into a Sales Order using BC codeunit `87 "Blanket Sales Order to Order"`.
The blanket order is preserved; only the lines flagged for conversion are turned into a new Sales Order.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: each call creates a new Sales Order for the convertible lines on the blanket order.
- The header must be of Document Type `Blanket Order`. Other types are rejected with an error.
- BC requires at least one line with `Qty. to Ship` (or equivalent) > 0; otherwise the conversion errors.

## Subject Identification Order

Same as other Sales document message types (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | string/GUID | Optional | Blanket Order `No.` or `Sales Header.SystemId`. |
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId` of the blanket order. |
| `blanketOrderNo` | string | See above | Typed `No.` lookup for a Sales Blanket Order. |

### Request Example
```json
{
  "specversion": "1.0",
  "type": "Sales.BlanketOrder.MakeOrder",
  "source": "MyApp",
  "subject": "SBO-001"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "blanketOrderNo": "SBO-001",
  "orderNo": "SO-002",
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
| `blanketOrderNo` | Original Sales Blanket Order `No.`. |
| `orderNo` | New Sales Order `No.` returned by `GetSalesOrderHeader`. |
| `orderSystemId` | New Sales Order `SystemId`. |
| `customerNo` | Sell-to Customer No. copied from the new Sales Order header. |
| `customerName` | Sell-to Customer Name copied from the new Sales Order header. |
| `documentDate` | Document Date on the new Sales Order (Format 0,9). |
| `orderDate` | Order Date on the new Sales Order (Format 0,9). |

## Qty. to Ship Behaviour

BC only converts lines where `Qty. to Ship > 0`. When you add a Sales Line with a `Quantity`, BC automatically sets `Qty. to Ship = Quantity` by default — so freshly created lines are immediately convertible without additional setup. After conversion, the blanket order line's `Qty. to Ship` is reset to 0 and `Quantity Shipped` increases. To create another release order from the same blanket line, set `Qty. to Ship` again via `Data.Records.Set` before calling `Sales.BlanketOrder.MakeOrder` a second time.

## Errors

| Error | Cause |
|---|---|
| Document identifier missing | `FindSalesHeader` could not resolve a header. |
| `Sales document {no} is not a Blanket Order (actual type: ...).` | Document Type is not `Blanket Order`. |
| `Nothing to create` or related | No lines have a Qty. to Ship > 0; set up lines first. |
| BC conversion errors | Bubble up from `Blanket Sales Order to Order`. |

## Related Message Types

- `Sales.Document.Create` — create the blanket order first.
- `Sales.Quote.MakeOrder` — analogous conversion from a quote.
- `Sales.Document.Release` / `Sales.Document.Post` — next steps on the resulting order.

