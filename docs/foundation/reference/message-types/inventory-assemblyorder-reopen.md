---
id: inventory-assemblyorder-reopen
title: "Inventory.AssemblyOrder.Reopen"
sidebar_label: "Inventory.AssemblyOrder.Reopen"
sidebar_position: 82
description: "Request and response contract for the Inventory.AssemblyOrder.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Reopens a Released Assembly Order so it can be edited again. Internally delegates to the isolated `Assembly Order Reopen Process` codeunit via `Codeunit.Run` (so BC can `LockTable` outside the outer TryFunction context).

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Idempotent. Reopening an already-`Open` order returns `Success` with `statusBefore = Open` and `statusAfter = Open` without touching BC.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Reopen", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Reopen",
  "data": { "documentNo": "AO000123" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "itemNo": "BICYCLE",
  "statusBefore": "Released",
  "statusAfter": "Open"
}
```

| Property | Description |
|----------|-------------|
| status | `Success` (including the already-open no-op path); `Error` if `Assembly Order Reopen Process` failed. |
| documentNo | Assembly Order `No.`. |
| systemId | Header `SystemId` (Format `0,4`). |
| itemNo | Parent item. |
| statusBefore | `Released` or `Open` - the value before reopen was attempted. |
| statusAfter | Always `Open` on success. |

## Errors
| Error | Cause |
|-------|-------|
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied or lookup failed. |
| (BC validation error text) | `Assembly Order Reopen Process` failed. |

## Related Message Types
- `Inventory.AssemblyOrder.Release` - return to Released.
- `Inventory.AssemblyOrder.RefreshLines` - refresh BOM lines once Open again.

