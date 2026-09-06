---
id: inventory-transferorder-previewpost
title: "Inventory.TransferOrder.PreviewPost"
sidebar_label: "Inventory.TransferOrder.PreviewPost"
sidebar_position: 90
description: "Request and response contract for the Inventory.TransferOrder.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Simulates posting a Transfer Order and returns the captured ledger entries (Item Ledger, Value Entry, G/L Entry where applicable) without committing. Uses BC `Gen. Jnl.-Post Preview.SetContext(TransferOrder-Post, TransferHeader)` then `Run()` with the `Transfer Post Subscriber` injecting the chosen ship/receive/transfer options.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Safe and idempotent. The transaction is always rolled back. No Posted Transfer Shipment / Receipt rows, ledger entries, or No. Series numbers persist after the call. `rollback: true` is included in every successful response to make this explicit.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| postingType | Text | Required for non-direct transfers, ignored for direct | `"Ship"` or `"Receive"` (case-insensitive). |

## Request Examples
```json
{
  "type": "Inventory.TransferOrder.PreviewPost",
  "subject": "TO000456",
  "data": { "postingType": "Ship" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Transfer Order TO000456 (BLUE -> RED) Ship preview produced 2 entries (balanced).",
  "documentNo": "TO000456",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "postingType": "Ship",
  "lcyCode": "USD",
  "predictedNumbers": { "postedShipmentNo": "PTS00012" },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 2, "entries": [] }
  ]
}
```

| Property | Description |
|----------|-------------|
| status | `Success` whenever the preview completed; `Error` if preview itself threw. |
| rollback | Always `true`. |
| summary | Human-readable one-liner combining document, from/to codes, posting type, entry count, and balance state. |
| documentNo / transferFromCode / transferToCode / directTransfer | Echo of header fields. |
| postingType | `Ship`, `Receive`, or `DirectTransfer`. |
| lcyCode | `General Ledger Setup."LCY Code"`. |
| predictedNumbers | One of `postedShipmentNo` / `postedReceiptNo` / `postedDirectTransferNo` depending on the posting type. Empty string when nothing predicted. |
| totals.balanced | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| totals.totalDebitLCY / totals.totalCreditLCY | Sums of G/L Entry debit/credit (LCY). |
| preview[] | One element per captured table (`tableId`, `tableName`, `entryCount`, `entries`). Field set per table is configured by `Bifrost Preview Helper`. |

## Errors
| Error | Cause |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied or lookup failed. |
| `Transfer order %1 has no lines to post.` | Order had zero `Transfer Line` rows. `%1` is the document `No.`. |
| `For a non-direct transfer order, postingType must be "Ship" or "Receive".` | Non-direct transfer and `postingType` omitted. |
| `postingType must be "Ship" or "Receive". Received: {value}` | `postingType` had an unsupported value. |
| `Posting preview failed and no entries were captured. The transfer order cannot be posted in its current state.` | `Gen. Jnl.-Post Preview.Run` failed without surfacing a specific BC error text. |
| (BC posting error text) | Preview captured a real BC posting error - returned verbatim. |

## Related Message Types
- `Inventory.TransferOrder.Post` - actually post once preview is clean.
- `Inventory.TransferOrder.Statistics` - inspect totals.

