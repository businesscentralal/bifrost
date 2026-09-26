---
id: inventory-transferorder-post
title: "Inventory.TransferOrder.Post"
sidebar_label: "Inventory.TransferOrder.Post"
sidebar_position: 89
description: "Request and response contract for the Inventory.TransferOrder.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts a Transfer Order via BC codeunit 5706 `TransferOrder-Post (Yes/No)`. Behaviour depends on the header `Direct Transfer` flag:

- **Non-direct transfer**: caller must supply `postingType = "Ship"` or `"Receive"`. BC posts only the requested side.
- **Direct transfer**: `postingType` is ignored. BC reads `Inventory Setup."Direct Transfer Posting"` and posts either a single Direct Transfer or Receipt + Shipment.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. `Commit()` is issued before posting. Successful posting writes Item Ledger Entries, Value Entries, and Posted Transfer Shipment / Receipt records, and increments `Last Shipment No.` / `Last Receipt No.` on the header. Posting failures roll back via `Codeunit.Run`/BC and return `status: "Error"` with the BC text.

Implementation binds the `Transfer Post Subscriber` to override `OnBeforeGetPostingOptions` so the StrMenu prompt is suppressed and the chosen ship/receive/transfer flags are injected.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| postingType | Text | Required for non-direct transfers, ignored for direct | `"Ship"` or `"Receive"` (case-insensitive). |

## Request Examples
```json
{
  "type": "Inventory.TransferOrder.Post",
  "subject": "TO000456",
  "data": { "postingType": "Ship" }
}
```
```json
{ "type": "Inventory.TransferOrder.Post", "subject": "TO000457" }
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "postingType": "Ship",
  "directTransfer": false,
  "postedShipmentNo": "PTS00012",
  "postedReceiptNo": "",
  "postingDate": "2026-04-15"
}
```

| Property | Description |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| documentNo | Original Transfer Order `No.`. |
| postingType | `Ship`, `Receive`, or `DirectTransfer` (for direct transfers). Echoes the supplied case for non-direct. |
| directTransfer | Header flag. |
| postedShipmentNo | Set when `Last Shipment No.` advanced during this post. Empty otherwise. |
| postedReceiptNo | Set when `Last Receipt No.` advanced during this post. Empty otherwise. |
| postingDate | Posting Date on the header after posting (Format `0,9`). |

## Posting Gate
Calling this message type requires the `BIFROST ItemPost ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Caller lacks the `BIFROST ItemPost ori` permission set. |
| `Transfer Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, transferOrderNo, no.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Transfer Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| `For a non-direct transfer order, postingType must be "Ship" or "Receive".` | Non-direct transfer and `postingType` omitted. |
| `postingType must be "Ship", "Receive", or "ShipReceive". Received: {value}` | `postingType` had an unsupported value, or `ShipReceive`/`Ship+Receive` was requested for a non-direct transfer (not supported by BC in one step). |
| (BC posting error text) | `TransferOrder-Post (Yes/No).Run` threw (e.g. insufficient inventory, unreleased order). |

## Related Message Types
- `Inventory.TransferOrder.PreviewPost` - simulate before posting.
- `Inventory.TransferOrder.Release` - release before posting.
- `Inventory.TransferOrder.Statistics` - inspect totals.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

