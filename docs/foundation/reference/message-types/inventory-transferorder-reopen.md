---
id: inventory-transferorder-reopen
title: "Inventory.TransferOrder.Reopen"
sidebar_label: "Inventory.TransferOrder.Reopen"
sidebar_position: 92
description: "Request and response contract for the Inventory.TransferOrder.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Reopens a Released Transfer Order so it can be edited. Delegates to the isolated `Transfer Order Reopen Process` codeunit via `Codeunit.Run` (BC `LockTable` is not allowed inside the outer TryFunction, but is allowed inside `Codeunit.Run`).

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Idempotent. Reopening an already-`Open` order returns `Success` with `statusBefore = Open` and `statusAfter = Open` without touching BC.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Reopen", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Reopen",
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
  "statusBefore": "Released",
  "statusAfter": "Open"
}
```

| Property | Description |
|----------|-------------|
| status | `Success` (including the already-open no-op path); `Error` if `Transfer Order Reopen Process` failed. |
| documentNo | Transfer Order `No.`. |
| transferFromCode / transferToCode / directTransfer | Header echo. |
| statusBefore | `Released` or `Open` - value before reopen was attempted. |
| statusAfter | Always `Open` on success. |

## Errors
| Error | Cause |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied or lookup failed. |
| (BC validation error text) | `Transfer Order Reopen Process` failed (rare). |

## Related Message Types
- `Inventory.TransferOrder.Release` - return to Released.
- `Data.Records.Set` on `Transfer Line` - edit lines once Open.

