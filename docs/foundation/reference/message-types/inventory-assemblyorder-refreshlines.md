---
id: inventory-assemblyorder-refreshlines
title: "Inventory.AssemblyOrder.RefreshLines"
sidebar_label: "Inventory.AssemblyOrder.RefreshLines"
sidebar_position: 80
description: "Request and response contract for the Inventory.AssemblyOrder.RefreshLines Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Refreshes the component lines of an Open Assembly Order by re-validating the header `Item No.`. This re-creates `Assembly Line` rows from the current parent item BOM and discards any previous manual edits to those lines.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Functionally idempotent (re-running produces the same lines), but **destructive**: any manual changes to component lines are lost. The order must be `Open` - BC raises an error for `Released` orders.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.RefreshLines", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.RefreshLines",
  "data": { "documentNo": "AO000123" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "itemNo": "BICYCLE",
  "quantity": 5,
  "linesBefore": 0,
  "linesAfter": 3
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Failures (e.g. released order) use the error envelope. |
| documentNo | Assembly Order `No.`. |
| itemNo | Parent item. |
| quantity | Header `Quantity`. |
| linesBefore | Number of `Assembly Line` rows before the refresh. |
| linesAfter | Number of `Assembly Line` rows after the refresh. |

## Errors
| Error | Cause |
|-------|-------|
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied or lookup failed. |
| (BC validation error text) | Released order, missing BOM, or other BC validation failure on `Item No.`. |

## Related Message Types
- `Inventory.AssemblyOrder.Create` - create a new order.
- `Inventory.AssemblyOrder.Reopen` - return a Released order to Open before refreshing.

