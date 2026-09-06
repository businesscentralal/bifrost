---
id: warehouse-receipt-post-preview
title: "Warehouse.Receipt.Post.Preview"
sidebar_label: "Warehouse.Receipt.Post.Preview"
sidebar_position: 150
description: "Request and response contract for the Warehouse.Receipt.Post.Preview Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting a Warehouse Receipt and returns the captured ledger entries (Item Ledger and Value Entry — see Captured Tables below) without committing. The post is driven through `Whse.-Post Receipt (Yes/No)` (codeunit 5761) bound with `EventSubscriberInstance = Manual`, whose `OnRunPreview` subscriber sets preview mode on `Whse.-Post Receipt` (5760). The transaction is rolled back after capture via BC's Posting Preview Event Handler.

Use this to verify what `Warehouse.Receipt.Post` would produce — predicted posted document numbers, ledger impact, balanced/unbalanced — before committing.

**Direction**: Inbound (no state change — rolled back)  **Content-Type**: `text/json`

## Captured Tables

BC's Posting Preview only captures inserts into a fixed whitelist of tables. For a Warehouse Receipt post the captured set is:

| Table ID | Table | Always present? |
|---|---|---|
| 32 | Item Ledger Entry | Yes — one entry per receipt line. |
| 5802 | Value Entry | Yes — one Direct Cost entry per receipt line. |
| 17 | G/L Entry | Only if cost adjustment runs inline. Receipts normally produce **none**. |

`Posted Whse. Receipt Header` (table 7320) is **NOT** in BC's preview whitelist — so the impl never observes its insert during preview. As a result `predictedNumbers.postedWhseReceiptNo` is always emitted but is **always empty** in the response. (Confirmed via live MCP test.)

## Preconditions

Same as `Warehouse.Receipt.Post`: the Warehouse Receipt Header must exist, contain at least one line with `Qty. to Receive > 0`, and any directed put-away bin requirements must already be satisfied.

## Identifier Resolution Order

1. `subject` field (GUID → `SystemId`, text → `No.`).
2. Request JSON `systemId` / `recordSystemId` / `id` (GUID).
3. Request JSON `receiptNo` / `no` (text).

## Idempotency / Safety Notes

- **Read-only**: BC's Gen. Jnl.-Post Preview always rolls back the transaction after capturing entries. No data is persisted.
- No Posting Gate required (no state change).
- Number series advance and then roll back — the predicted posted document numbers are the numbers BC would have assigned but are released back to the series.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | text/guid | One identifier required | Bifrost subject. |
| `systemId` / `recordSystemId` / `id` | guid | (alternative) | In request JSON. |
| `receiptNo` / `no` | code[20] | (alternative) | In request JSON. |

### Request Example
```json
{ "receiptNo": "WR001001" }
```

## Response Shape

Verified live (Purchase Order receipt at GULUR, 5 × item 1896-S):

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 0.0,
    "totalCreditLCY": 0.0
  },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] },
    { "tableId": 5802, "tableName": "Value Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] }
  ]
}
```

### Number Redaction (`***`)

BC's Posting Preview redacts assigned document numbers to `***` to signal they were rolled back rather than persisted. Affects:

- `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` — always `***` for Posting Preview.
- `preview[].entries[].fields.DocumentNo_` on Item Ledger Entry / Value Entry rows — also `***`.

Treat `***` as "the system would have assigned a number from the corresponding No. Series". Use `Warehouse.Receipt.Post` to obtain the actual number.

### Predicted Numbers — which key appears

| Source on the receipt | Key in `predictedNumbers` | Value in preview |
|---|---|---|
| Purchase Order | `postedPurchaseReceiptNo` | `***` (redacted by BC) |
| Sales Return Order | `postedReturnReceiptNo` | `***` (redacted by BC) |
| Inbound Transfer Order | `postedTransferReceiptNo` | `***` (redacted by BC) |

`postedWhseReceiptNo` is always emitted but is **always empty** in preview because BC's Posting Preview does not capture inserts into `Posted Whse. Receipt Header` (table 7320). To obtain the real number, run `Warehouse.Receipt.Post`.

### Totals — balanced flag

Warehouse Receipts typically have **no direct G/L impact** (inventory recognised at cost, not at booking) — `balanced = true` with `totalDebitLCY = totalCreditLCY = 0`. If the receipt triggers an automatic cost adjustment, the captured G/L entries will appear in `preview` and the totals will reflect them.

## Posting Gate

None — preview does not commit.

## Field Restrictions

None.

## Errors

| Error | Cause |
|---|---|
| `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).` | None of subject, systemId, recordSystemId, id, no, receiptNo resolved a header. (Exact wording — verified live.) |
| `Warehouse Receipt {No} has no lines to post.` | No lines or all Qty. to Receive = 0. |
| `Posting preview failed and no entries were captured ...` | Underlying `Whse.-Post Receipt` raised an error before capturing entries (e.g. missing Bin Code, blocked item). The original BC error text is bubbled through. |

## Related Message Types

- `Warehouse.Receipt.Post` — commit the actual posting after preview looks correct.
- `Warehouse.Receipt.Create` — create the receipt before previewing it.
- `Inventory.TransferOrder.PreviewPost` — analogous preview for transfer orders.

