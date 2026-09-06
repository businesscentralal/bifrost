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
Creates a new Transfer Order header (`Transfer Header`) with from/to locations, posting/shipment/receipt dates, and an optional `Direct Transfer` flag. **Lines are not created** - add lines afterwards via `Data.Records.Set` on table `5741 Transfer Line`.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Every call inserts a new `Transfer Header` row and consumes one number from the Transfer Order No. Series.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transferFromCode | Code[10] | Yes | Source location. |
| transferToCode | Code[10] | Yes | Destination location. |
| directTransfer | Boolean | No | When `true`, marks header as Direct Transfer (no in-transit step). Default `false`. |
| inTransitCode | Code[10] | Required when `directTransfer = false` | In-transit location code. |
| postingDate | Date | No | Posting Date. Defaults to `WorkDate()` when omitted or `0D`. Format `0,9`. |
| shipmentDate | Date | No | Shipment Date. Format `0,9`. |
| receiptDate | Date | No | Receipt Date. Format `0,9`. |
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
- `Data.Records.Set` on `Transfer Line` (table 5741) - add lines.
- `Inventory.TransferOrder.Release` - release once lines exist.
- `Inventory.TransferOrder.Post` - ship and/or receive.
- `Inventory.TransferOrder.PreviewPost` - dry run.
- `Inventory.TransferOrder.Statistics` - totals.

