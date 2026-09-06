---
id: warehouse-receipt-post
title: "Warehouse.Receipt.Post"
sidebar_label: "Warehouse.Receipt.Post"
sidebar_position: 149
description: "Request and response contract for the Warehouse.Receipt.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts an existing Warehouse Receipt by running BC's `Whse.-Post Receipt` (codeunit 5760). Creates a `Posted Whse. Receipt` plus the underlying posted source documents (Posted Purchase Receipt, Posted Return Shipment, or Posted Transfer Receipt) and increases inventory.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Preconditions

- The Warehouse Receipt Header must exist (typically created by `Warehouse.Receipt.Create`).
- At least one Warehouse Receipt Line with `Qty. to Receive > 0`.
- For Directed Put-away & Pick locations the line `Bin Code` must be set before posting.
- Unlike Warehouse Shipment, there is **no `invoice` flag** — receipts only do the receive. Vendor invoicing on the Purchase Order is a separate later action.

## Identifier Resolution Order

1. `subject` field (GUID → `SystemId`, text → `No.`).
2. Request JSON `systemId` / `recordSystemId` / `id` (GUID).
3. Request JSON `receiptNo` / `no` (text).

## Idempotency / Safety Notes

- **Not** idempotent at the message-type level: re-posting the same receipt produces an error from BC (lines already posted / receipt no longer exists).
- The Warehouse Receipt Header is consumed by the post — after success it is deleted, the response carries the `postedWhseReceiptNo` to follow up.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | text/guid | One identifier required | Bifrost subject. GUID → SystemId lookup; text → `No.` lookup. |
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
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "AC903C2D-DF61-F111-B7A5-FCCA66B996D7",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo": "107242",
      "sourceDocument": "Purchase Order",
      "sourceNo": "106031"
    }
  ]
}
```

Number formats are example only — `postedWhseReceiptNo` is taken from the location's `Whse. Receipt Nos.` series, `postedSourceNo` from the source document's posting series (e.g. `P-RCPT` for Purchase Order). The `postedSourceDocument` enumeration is one of `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`.

## Posting Gate

Requires the `BIFROST WhsePost ori` permission set (always). No G/L gate — receipts do not write to G/L Register.

## Field Restrictions

None enforced by this message type. Standard BC validation applies on the warehouse receipt lines.

## Errors

| Error | Cause |
|---|---|
| `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).` | None of subject, systemId, recordSystemId, id, no, receiptNo resolved a header. (Exact wording — verified live.) |
| `Warehouse Receipt {No} has no lines to post.` | All lines have Qty. to Receive = 0 or header has no lines. |
| `The Warehouse Receipt Header does not exist. ...` | Re-posting the same receipt. After a successful post the header is deleted. |
| Any BC posting error (e.g. `Bin Code must have a value`) | Bubbled from `Whse.-Post Receipt`. |

## End-to-End Workflow

See `Warehouse.Receipt.Create` for the full create → release → receive → post sequence. Typical follow-ups after a successful post:

- Inspect `Posted Whse. Receipt` (table 7320) and `Posted Whse. Receipt Line` (table 7319) via `Data.Records.Get`.
- Inspect the resulting Posted Purchase Receipt / Posted Return Shipment / Posted Transfer Receipt via the `postedDocuments` array.
- Verify inventory via `Inventory.Item.GetInventory` or `Data.Records.Get` on `Item Ledger Entry`.

## Related Message Types

- `Warehouse.Receipt.Create` — create the receipt being posted.
- `Warehouse.Receipt.Post.Preview` — simulate the post without committing.
- `Warehouse.Shipment.Post` — outbound counterpart.

