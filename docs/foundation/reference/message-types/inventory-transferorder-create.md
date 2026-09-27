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

Creates a transfer order: the header with its from, to and in-transit locations and, when `lines` is sent, its lines in the same call. Without `lines` only the header is created.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

**Not idempotent**: each call creates a new transfer order and uses a number from the Transfer Order No. Series.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `transferFromCode` | string | Yes | Source location (Code[10]). |
| `transferToCode` | string | Yes | Destination location (Code[10]). |
| `directTransfer` | bool | No | `true` for a direct transfer without an in-transit step. Default `false`; `true` or `false`, any other value is an error. |
| `inTransitCode` | string | When `directTransfer` is `false` | In-transit location (Code[10]). |
| `postingDate` | date | No | `YYYY-MM-DD`. The work date when omitted. |
| `shipmentDate` | date | No | `YYYY-MM-DD`. Blank when omitted. |
| `receiptDate` | date | No | `YYYY-MM-DD`. Blank when omitted. |
| `externalDocumentNo` | string | No | External document number (Code[35]). |
| `lines` | object[] | No | The transfer lines, at most 200. See **With lines**. |

All three dates are read before the call stops, so every bad date is reported in one answer.

## With lines

The call is all-or-nothing. Every line is checked before the header is created, and every problem is reported in one answer, so nothing is created when one line is wrong. An error that BC raises while validating a line also rolls back the whole call: the header and the lines before it are not kept.

- Field names are camelCase. Foundation assigns the line numbers (10000, 20000, ...); do not send `lineNo`.
- A request can contain at most 200 lines.
- The index in an error is 1-based: `lines[1]` is the first line.
- Transfer lines have no type and no price.
- Validation order (the order BC validates the fields in): Item No., Variant Code, Unit of Measure Code, Quantity, Shipment Date, Description.
- A field you leave out keeps its BC default. A field you send overrides it.

| Field | Type | Required | Description |
|---|---|---|---|
| itemNo | Text | Yes | Item number. It must exist and not be blocked. |
| variantCode | Text | No | Item variant. It must exist for the item. |
| unitOfMeasureCode | Text | No | Unit of measure of the item. The base unit when omitted. |
| quantity | Decimal | Yes | Quantity in `unitOfMeasureCode`. |
| shipmentDate | Date | No | `YYYY-MM-DD`. The header shipment date when omitted. |
| description | Text | No | Line description. BC fills it from the item when omitted. |

```json
{
  "type": "Inventory.TransferOrder.Create",
  "data": {
    "transferFromCode": "BLUE",
    "transferToCode": "RED",
    "inTransitCode": "OWN LOG.",
    "lines": [
      { "itemNo": "1896-S", "quantity": 2, "unitOfMeasureCode": "PCS" },
      { "itemNo": "1900-S", "quantity": 1 }
    ]
  }
}
```

## Without lines

Only the header is created. A transfer order cannot be released without lines, so send them on this call when you have them.

```json
{
  "type": "Inventory.TransferOrder.Create",
  "data": { "transferFromCode": "BLUE", "transferToCode": "RED", "directTransfer": true }
}
```

## Response Shape

```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "systemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "inTransitCode": "OWN LOG.",
  "directTransfer": false,
  "postingDate": "2026-09-27",
  "shipmentDate": "2026-09-27",
  "receiptDate": "2026-09-27",
  "externalDocumentNo": "",
  "statusAfter": "Open",
  "lines": [
    { "lineNo": 10000, "itemNo": "1896-S", "description": "ATHENS Desk", "quantity": 2, "unitOfMeasureCode": "PCS" }
  ],
  "totals": { "quantity": 3 }
}
```

| Property | Description |
|---|---|
| `status` | `Success`. |
| `documentNo` / `systemId` | The new transfer order. |
| `transferFromCode` / `transferToCode` / `inTransitCode` / `directTransfer` | The header values after BC validation. |
| `postingDate` / `shipmentDate` / `receiptDate` | `YYYY-MM-DD`. |
| `externalDocumentNo` | Empty when not sent. |
| `statusAfter` | Always `Open`. |
| `lines[]` | Only with `lines`: each created line with `lineNo`, `itemNo`, `description`, `quantity` and `unitOfMeasureCode`. |
| `totals` | Only with `lines`: the total `quantity`. |

## Errors

| Code | Error | Cause |
|---|---|---|
| `MissingParameter` | `transferFromCode must be specified in the request JSON.` | `transferFromCode` was not sent. |
| `MissingParameter` | `transferToCode must be specified in the request JSON.` | `transferToCode` was not sent. |
| `MissingParameter` | `inTransitCode must be specified when directTransfer is false.` | No `inTransitCode` for a transfer that is not direct. |
| `InvalidParameterFormat` | `Parameter "{name}" has value "{value}", which is not a valid {type}. Expected {format}.` | A date is not `YYYY-MM-DD`, or `directTransfer` is not `true` or `false`. Several bad values are reported together. |
| `InvalidLine` | `{n} problem(s) in lines. Nothing was created.` | The pre-check found problems. `errors[]` lists each one with `parameter` `lines[n].<field>`: `MissingParameter` (`<field> is required.`), `InvalidParameterFormat` (not a number or not a date), `InvalidParameter` (not a valid option), `RecordNotFound` (the item, account or other record does not exist) or `PreconditionFailed` (it is blocked). With one problem, that problem is the answer and there is no `errors[]`. |
| `BusinessCentralError` | `lines[n].<field>: <BC error>` | BC rejected a value while validating line `n`. `parameter` is `lines[n].<field>`. Nothing was created, not even the header. |
| `LimitExceeded` | `A request can contain at most 200 lines. Received: {n}.` | More than 200 lines. `received` is the count, `expected` is `200`. |
| `InvalidParameterFormat` | `lines must be an array.` | `lines` is not a JSON array. |
| `BusinessCentralError` | (BC error text) | BC rejected the header, for example an unknown location or equal from and to codes. |

## Typical Workflow

1. `Inventory.TransferOrder.Create` with `lines`.
2. `Inventory.TransferOrder.Release`: release the order.
3. `Inventory.TransferOrder.PreviewPost`: optional, see the entries without posting.
4. `Inventory.TransferOrder.Post`: ship and receive.

## Related Message Types

- `Inventory.TransferOrder.Release`: release once the order has lines.
- `Inventory.TransferOrder.PreviewPost` / `Inventory.TransferOrder.Post`: simulate or post.
- `Inventory.TransferOrder.Statistics`: read the totals.
- `Data.Records.Set`: change header fields. Lines belong on `Inventory.TransferOrder.Create`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

