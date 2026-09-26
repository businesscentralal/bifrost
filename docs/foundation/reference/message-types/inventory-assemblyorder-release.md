---
id: inventory-assemblyorder-release
title: "Inventory.AssemblyOrder.Release"
sidebar_label: "Inventory.AssemblyOrder.Release"
sidebar_position: 81
description: "Request and response contract for the Inventory.AssemblyOrder.Release Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Releases an Open Assembly Order so it can be posted. Calls `Codeunit.Run` on the BC `Release Assembly Document` codeunit.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Idempotent. Releasing an already-`Released` order returns `Success` with `statusBefore = Released` and `statusAfter = Released` without touching BC.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Release", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Release",
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
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

| Property | Description |
|----------|-------------|
| status | `Success` (including the already-released no-op path); `Error` if `Release Assembly Document.Run` failed. |
| documentNo | Assembly Order `No.`. |
| systemId | Header `SystemId` (Format `0,4`). |
| itemNo | Parent item. |
| statusBefore | `Open` or `Released` - the value before release was attempted. |
| statusAfter | Always `Released` on success. |

## Errors
| Error | Cause |
|-------|-------|
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |
| (BC validation error text) | `Release Assembly Document.Run` failed (e.g. lines missing required fields, insufficient inventory). |

## Related Message Types
- `Inventory.AssemblyOrder.Reopen` - reverse the release.
- `Inventory.AssemblyOrder.Post` - post after release.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

