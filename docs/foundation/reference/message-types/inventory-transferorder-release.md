---
id: inventory-transferorder-release
title: "Inventory.TransferOrder.Release"
sidebar_label: "Inventory.TransferOrder.Release"
sidebar_position: 91
description: "Request and response contract for the Inventory.TransferOrder.Release Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Releases an Open Transfer Order so it can be posted. Calls `Codeunit.Run` on the BC `Release Transfer Document` codeunit.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Idempotent. Releasing an already-`Released` order returns `Success` with `statusBefore = Released` and `statusAfter = Released` without touching BC.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Release", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Release",
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
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

| Property | Description |
|----------|-------------|
| status | `Success` (including the already-released no-op path); `Error` if `Release Transfer Document.Run` failed. |
| documentNo | Transfer Order `No.`. |
| transferFromCode / transferToCode / directTransfer | Header echo. |
| statusBefore | `Open` or `Released` - value before release was attempted. |
| statusAfter | Always `Released` on success. |

## Errors
| Error | Cause |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied or lookup failed. |
| (BC validation error text) | `Release Transfer Document.Run` failed (missing in-transit code, invalid lines, etc.). |

## Related Message Types
- `Inventory.TransferOrder.Reopen` - reverse the release.
- `Inventory.TransferOrder.Post` - ship and/or receive after release.

