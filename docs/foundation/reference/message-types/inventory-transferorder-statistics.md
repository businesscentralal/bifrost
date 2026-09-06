---
id: inventory-transferorder-statistics
title: "Inventory.TransferOrder.Statistics"
sidebar_label: "Inventory.TransferOrder.Statistics"
sidebar_position: 93
description: "Request and response contract for the Inventory.TransferOrder.Statistics Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns Transfer Order line totals - matching what BC Page 5755 "Transfer Statistics" displays. Iterates `Transfer Line` rows where `Derived From Line No. = 0` and aggregates `Quantity`, `Net Weight`, `Gross Weight`, `Unit Volume`, and `Units per Parcel`.

**Direction**: Inbound (read-only)  **Content-Type**: `text/json`

## Idempotency / Safety
Safe and idempotent. No writes occur.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Statistics", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Statistics",
  "data": { "documentNo": "TO000456" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusValue": "Open",
  "postingDate": "2026-04-15",
  "shipmentDate": "2026-05-01",
  "receiptDate": "2026-05-03",
  "totals": {
    "lineCount": 2,
    "quantity": 30,
    "parcels": 3,
    "netWeight": 45,
    "grossWeight": 60,
    "volume": 0.9
  }
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Lookup failures use the error envelope. |
| documentNo / transferFromCode / transferToCode / directTransfer | Header echo. |
| statusValue | `Open` or `Released`. Field is `statusValue` (not `status`) because `status` is reserved for the response envelope. |
| postingDate / shipmentDate / receiptDate | Format `0,9`. |
| totals.lineCount | Number of `Transfer Line` rows considered (excludes derived-from lines). |
| totals.quantity | Sum of `Quantity` across lines. |
| totals.parcels | Sum of `ceil(Quantity / "Units per Parcel")` across lines that have a positive Units per Parcel. |
| totals.netWeight / totals.grossWeight | Sum of `Quantity * Net Weight` / `Quantity * Gross Weight`. |
| totals.volume | Sum of `Quantity * Unit Volume`. |

## Errors
| Error | Cause |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied or lookup failed. |

## Related Message Types
- `Inventory.TransferOrder.PreviewPost` - see predicted ledger entries.
- `Inventory.TransferOrder.Post` - ship and/or receive.

