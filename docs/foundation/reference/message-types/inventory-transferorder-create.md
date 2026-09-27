---
id: inventory-transferorder-create
title: "Inventory.TransferOrder.Create"
sidebar_label: "Inventory.TransferOrder.Create"
sidebar_position: 88
description: "Request and response contract for the Inventory.TransferOrder.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates a new Transfer Order header (`Transfer Header`) with from/to locations, posting/shipment/receipt dates, an optional `Direct Transfer` flag, and optional `lines`. Without `lines`, only the header is created.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Every call inserts a new `Transfer Header` row and consumes one number from the Transfer Order No. Series.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transferFromCode | Code[10] | Yes | Source location. |
| transferToCode | Code[10] | Yes | Destination location. |
| directTransfer | Boolean | No | When `true`, marks header as Direct Transfer (no in-transit step). Default `false`. `true` or `false`; any other value is an error. |
| inTransitCode | Code[10] | Required when `directTransfer = false` | In-transit location code. |
| postingDate | Date | No | `YYYY-MM-DD`. Omitted: `WorkDate()`. An invalid value is an error. |
| shipmentDate | Date | No | `YYYY-MM-DD`. Omitted: blank. An invalid value is an error. |
| receiptDate | Date | No | `YYYY-MM-DD`. Omitted: blank. An invalid value is an error. |
| externalDocumentNo | Code[35] | No | External Document No. |

## Request Example
```json
{
  "type": "Inventory.TransferOrder.Create",
  "data": {
    "transferFromCode": "BLUE",
    "transferToCode": "RED",
    "inTransitCode": "OUT-LOG",
    "shipmentDate": "2026-05-01",
    "receiptDate": "2026-05-03"
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "inTransitCode": "OUT-LOG",
  "directTransfer": false,
  "postingDate": "2026-04-15",
  "shipmentDate": "2026-05-01",
  "receiptDate": "2026-05-03",
  "externalDocumentNo": "",
  "statusAfter": "Open"
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Validation failures use the error envelope. |
| documentNo | New `Transfer Header.No.` (from No. Series). |
| systemId | New header `SystemId` (Format `0,4`). |
| transferFromCode / transferToCode / inTransitCode / directTransfer | Echo after BC validation. |
| postingDate / shipmentDate / receiptDate | Format `0,9`. |
| externalDocumentNo | Echo (empty when not supplied). |
| statusAfter | Always `Open` for newly created orders. |

## Errors
| Error | Cause |
|-------|-------|
| `transferFromCode must be specified in the request JSON.` | `transferFromCode` missing. |
| `transferToCode must be specified in the request JSON.` | `transferToCode` missing. |
| `inTransitCode must be specified when directTransfer is false.` | `directTransfer != true` and `inTransitCode` empty. |
| (BC validation error text) | Unknown location, equal from/to codes, location lacks Require Shipment/Receipt, etc. |

## Related Message Types
- `Data.Records.Set` — update header fields. Transfer lines belong on `Inventory.TransferOrder.Create`.
- `Inventory.TransferOrder.Release` - release once lines exist.
- `Inventory.TransferOrder.Post` - ship and/or receive.
- `Inventory.TransferOrder.PreviewPost` - dry run.
- `Inventory.TransferOrder.Statistics` - totals.
## Lines
Optional `lines` array. Field names are camelCase. Foundation assigns line numbers in steps of 10000. Do not send `lineNo`. The index in an error is 1-based (`lines[1]` is the first line).
The call is all-or-nothing: every problem is collected before any insert, and nothing is created when the pre-check fails. A validation error is reported as `lines[n].field: ...`, for example `lines[2].quantity: ...`.
A request can contain at most 200 lines.
Validation order: Item No., Variant Code, Unit of Measure Code, Quantity, Shipment Date, Description.
| Field | Type | Required | Description |
|---|---|---|---|
| itemNo | Text | Yes | Item number. |
| variantCode | Text | No | Item variant. |
| unitOfMeasureCode | Text | No | Unit of measure for the item. |
| quantity | Decimal | No | Decimal. |
| shipmentDate | Date | No | `YYYY-MM-DD`. |
| description | Text | No | Line description. |
Transfer lines have no type or price. When `lines` is sent the response adds `lines` and `totals` (`quantity`). Without `lines` the response is unchanged.
```json
{
  "type": "Inventory.TransferOrder.Create",
  "data": {
    "transferFromCode": "BLUE",
    "transferToCode": "RED",
    "inTransitCode": "OWN LOG.",
    "lines": [
      { "itemNo": "1896-S", "quantity": 2, "unitOfMeasureCode": "PCS" }
    ]
  }
}
```

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

