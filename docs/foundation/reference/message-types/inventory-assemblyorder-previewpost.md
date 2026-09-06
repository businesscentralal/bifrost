---
id: inventory-assemblyorder-previewpost
title: "Inventory.AssemblyOrder.PreviewPost"
sidebar_label: "Inventory.AssemblyOrder.PreviewPost"
sidebar_position: 79
description: "Request and response contract for the Inventory.AssemblyOrder.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Simulates posting an Assembly Order and returns the captured ledger entries (Item Ledger, Value Entry, G/L Entry where applicable) without committing. Uses BC `Gen. Jnl.-Post Preview.SetContext(Assembly-Post, AssemblyHeader)` then `Run()` and the `Posting Preview Event Handler` to capture entries before BC rolls back.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Safe and idempotent. The transaction is always rolled back. No `Posted Assembly Header`, ledger entries, or No. Series numbers persist after the call. `rollback: true` is included in every successful response to make this explicit.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.PreviewPost", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.PreviewPost",
  "data": { "documentNo": "AO000123" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Assembly Order AO000123 (BICYCLE x 5) preview produced 4 entries (balanced).",
  "documentNo": "AO000123",
  "itemNo": "BICYCLE",
  "locationCode": "BLUE",
  "quantityToAssemble": 5,
  "lcyCode": "USD",
  "predictedNumbers": { "postedAssemblyNo": "PA000045" },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 4, "entries": [] }
  ]
}
```

| Property | Description |
|----------|-------------|
| status | `Success` whenever the preview completed; `Error` if preview itself threw. |
| rollback | Always `true` - reminder that nothing was persisted. |
| summary | Human-readable one-liner combining document, item, quantity, entry count, and balance state. |
| documentNo / itemNo / locationCode / quantityToAssemble | Echo of header fields. |
| lcyCode | `General Ledger Setup."LCY Code"`. |
| predictedNumbers.postedAssemblyNo | First captured `Posted Assembly Header.No.` (the document number that would be assigned at real post). |
| totals.balanced | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| totals.totalDebitLCY / totals.totalCreditLCY | Sums of G/L Entry debit/credit (LCY) - typically zero for non-stockkeeping/non-cost-accounting items. |
| preview[] | One element per captured table. Each contains `tableId`, `tableName`, `entryCount`, `entries` (subset of fields configured by `Bifrost Preview Helper`). |

## Errors
| Error | Cause |
|-------|-------|
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied or lookup failed. |
| `Assembly order %1 has no lines to post.` | Order had zero `Assembly Line` rows. `%1` is the document `No.`. |
| `Posting preview failed and no entries were captured. The assembly order cannot be posted in its current state.` | `Gen. Jnl.-Post Preview.Run` failed without surfacing a specific BC error text. |
| (BC posting error text) | Preview captured a real BC posting error - returned verbatim. |

## Related Message Types
- `Inventory.AssemblyOrder.Post` - actually post once preview is clean.
- `Inventory.AssemblyOrder.Statistics` - inspect costs without simulation.

