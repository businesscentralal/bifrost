---
id: purchase-document-create
title: "Purchase.Document.Create"
sidebar_label: "Purchase.Document.Create"
sidebar_position: 109
description: "Request and response contract for the Purchase.Document.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates a new purchase header for the specified vendor and document type. Only the header is created — lines must be added separately via `Data.Records.Set` on `Purchase Line`.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
Not idempotent — each call inserts a new Purchase Header and consumes a number from the configured No. Series. Retrying after a successful response will create a duplicate document.

## Vendor Resolution Order
Resolved by `Argument.FindVendor`:
1. `subject` parsed as GUID → `Vendor.GetBySystemId`.
2. `subject` as text → `Vendor.Get` by `No.`.
3. Request JSON keys (first hit wins): `no`, `id` (GUID), `systemId` (GUID), `recordSystemId` (GUID).

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentType | Text | Yes | One of `Quote`, `Order`, `Invoice`, `Credit Memo`, `Blanket Order`, `Return Order`. Case-insensitive. |
| postingDate | Date | No | ISO date used for `Posting Date`. Invalid or missing → `WorkDate()`. |

## Request Example
```json
{
  "type": "Purchase.Document.Create",
  "subject": "10000",
  "data": { "documentType": "Order" }
}
```

## Response Shape
Returns the created header in `Data.Records.Get` shape (one record).
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "<systemId>",
      "primaryKey": { "DocumentType": "Order", "No_": "<assigned no.>" },
      "fields": { "DocumentType": "Order", "No_": "<assigned no.>", "BuyfromVendorNo_": "10000", "PostingDate": "2026-03-07", "Status": "Open" }
    }
  ]
}
```

| Property | Description |
|----------|-------------|
| status | Always `Success` for this shape; errors use the standard error envelope. |
| noOfRecords | Always `1`. |
| result[0].id | SystemId (GUID) of the new Purchase Header. |
| result[0].primaryKey | `DocumentType` and `No_`. |
| result[0].fields | Every Purchase Header field, unrestricted by `Bifrost Field Access` (creation responses bypass field read restrictions). |

## Field Naming
JSON field names follow `RemoveNonAlphaNumericCharacters` on the BC field name: `No.` → `No_`, `Buy-from Vendor No.` → `BuyfromVendorNo_`, `Amount (LCY)` → `AmountLCY`.

## Errors
| Error | Cause |
|-------|-------|
| `documentType is required in request JSON. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` missing from request JSON. |
| `Invalid document type '{value}'. Expected: Quote, Order, Invoice, Credit Memo, Blanket Order, Return Order.` | `documentType` did not match any enum name. |
| `Vendor identifier must be specified in subject field or request JSON (no, id, systemId, recordSystemId).` | No vendor resolved by `FindVendor`. |

## Related Message Types
- `Data.Records.Set` — Add lines or update header fields.
- `Purchase.Document.Release` / `Purchase.Document.Reopen` — Manage status.
- `Purchase.Document.PreviewPost` / `Purchase.Document.Post` — Simulate or commit posting.
- `Purchase.Document.Statistics` — Read totals.

