---
id: inventory-assemblyorder-post
title: "Inventory.AssemblyOrder.Post"
sidebar_label: "Inventory.AssemblyOrder.Post"
sidebar_position: 78
description: "Request and response contract for the Inventory.AssemblyOrder.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts an Assembly Order by calling BC `Assembly-Post.Run`. Optionally overrides `Posting Date` and `Quantity to Assemble` before posting. After posting, the response includes the posted document number plus (when discoverable) the matching Posted Assembly Header `SystemId` and quantity.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Successful posting deletes the source `Assembly Header` row, writes a `Posted Assembly Header`, Item Ledger Entries, and Value Entries. `Commit()` is issued before posting. Posting failures roll back via `Codeunit.Run`/BC and return `status: "Error"` with the BC message.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| postingDate | Date | No | Overrides header `Posting Date`. Format `0,9` (`yyyy-MM-dd`). |
| quantityToAssemble | Decimal | No | Overrides `Quantity to Assemble` to support partial posting. Applied only when `> 0`. |

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Post", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Post",
  "data": { "documentNo": "AO000123", "quantityToAssemble": 2 }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "postedDocumentNo": "PA000045",
  "itemNo": "BICYCLE",
  "postingDate": "2026-04-15",
  "assembledQuantityBefore": 0,
  "assembleToOrder": false,
  "postedSystemId": "00000000-0000-0000-0000-000000000000",
  "postedQuantity": 5
}
```

| Property | Description |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| documentNo | Original Assembly Order `No.`. |
| postedDocumentNo | Header `Posting No.` (the posted document number assigned by BC). |
| itemNo | Parent item. |
| postingDate | Posting Date used (Format `0,9`). |
| assembledQuantityBefore | `Assembled Quantity` from the header just before posting. |
| assembleToOrder | Header `Assemble to Order` flag. |
| postedSystemId | Only present when the Posted Assembly Header could be located (Format `0,4`). |
| postedQuantity | Only present when the Posted Assembly Header could be located. |

## Posting Gate
Calling this message type requires the `BIFROST ItemPost ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Caller lacks the `BIFROST ItemPost ori` permission set. |
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied or lookup failed. |
| (BC posting error text) | `Assembly-Post.Run` threw (insufficient inventory, missing fields, etc.). |

## Related Message Types
- `Inventory.AssemblyOrder.PreviewPost` - dry run with predicted ledger entries.
- `Inventory.AssemblyOrder.Release` - release before posting.
- `Inventory.AssemblyOrder.Statistics` - inspect costs / quantities first.

