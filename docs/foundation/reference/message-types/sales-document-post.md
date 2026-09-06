---
id: sales-document-post
title: "Sales.Document.Post"
sidebar_label: "Sales.Document.Post"
sidebar_position: 123
description: "Request and response contract for the Sales.Document.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts a Sales Header by running BC codeunit `Sales-Post` with `SetHideValidationDialog(true)`. After posting it discovers the newly created posted documents (Invoice / Credit Memo / Shipment / Return Receipt) by snapshotting `Last Posting No.` / `Last Shipping No.` / `Last Return Receipt No.` before posting and looking them up afterwards, with `Pre-Assigned No.` / `Order No.` / `Return Order No.` keys as fallback.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

> ⚠️ **Ship and Invoice flags are NOT set automatically via the API.**
> Unlike the BC UI (which defaults to "Ship and Invoice" when you click Post), the API reads `Ship` and `Invoice` exactly as stored on the header.
> Orders created via API have both flags `false` by default. You **must** set them with `Data.Records.Set` before calling this message type, or posting will silently produce no posted documents.
> See **Required Pre-Flight** below.

## Idempotency / Safety Notes

- Not idempotent: each successful call creates ledger entries and posted documents.
- All BC standard posting validation runs (Ship/Invoice/Receive flags on the header, number series availability, dimensions, ...). BC errors are returned as `status: Error` with the BC `GetLastErrorText()` message.
- Pre-flight: refuses headers with no `Sales Line` rows.

## Subject Identification Order

Same as `Sales.Document.Release` (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | string | See above | Typed `No.` lookup. |

Ship/Invoice flags are taken from the header itself; this call does not override them.

## Required Pre-Flight: Ship and Invoice Flags

The BC UI sets `Ship = true` and `Invoice = true` implicitly when the user clicks **Post**. The API does **not** — it reads whatever is stored on the `Sales Header` record. For orders created via `Data.Records.Set` or any `Sales.*` message type, both flags default to `false`.

**Consequence:** calling `Sales.Document.Post` without setting these flags will succeed (status: Success) but produce **no posted documents** — the order remains open and no ledger entries are created. This is the most common silent failure when posting via API.

**Required two-step pattern (sequential — do not parallelize):**

**Step 1 — Set flags on the header**
```json
{
  "type": "Data.Records.Set",
  "tableName": "Sales Header",
  "primaryKey": { "DocumentType": 1, "No_": "PS-ORD103001" },
  "fields": { "Ship": true, "Invoice": true }
}
```

**Step 2 — Post**
```json
{ "type": "Sales.Document.Post", "orderNo": "PS-ORD103001" }
```

| Flag | Field No. | Meaning | Default for API-created orders |
|---|---|---|---|
| `Ship` | 75 | Create a Posted Shipment | `false` |
| `Invoice` | 76 | Create a Posted Invoice | `false` |

For Return Orders, the equivalent flag is `Receive` (field 79) instead of `Ship`. Set it the same way before posting.

### Request Example
```json
{ "orderNo": "PS-ORD103001" }
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "no": "PS-INV103001",
      "recordSystemId": "11111111-2222-3333-4444-555555555555",
      "postingDate": "2026-01-15",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 12345
    },
    {
      "type": "Posted Sales Shipment",
      "no": "PS-SHIP103001",
      "recordSystemId": "...",
      "postingDate": "2026-01-15"
    }
  ]
}
```

### Failure
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `documentNo` | The pre-posting `Sales Header."No."` — the unposted document is removed after a successful post but the pre-assigned number is preserved for traceability. |
| `postedDocuments[].type` | One of `Posted Sales Invoice`, `Posted Sales Credit Memo`, `Posted Sales Shipment`, `Posted Return Receipt`. |
| `postedDocuments[]` shape | Order → Invoice + Shipment. Invoice → Invoice. Credit Memo → Credit Memo. Return Order → Credit Memo + Return Receipt. |
| `custLedgerEntryNo` | Emitted on Invoice/Credit Memo entries when a `Cust. Ledger Entry` exists. |

## Examples (from unit tests)

From `Sales Document Post Tests` (`test/test/Sales/SalesDocumentPostTests.Codeunit.al`) — covers Order/Invoice/Credit Memo/Return Order posting, verifies `postedDocuments[]` entries and `custLedgerEntryNo` linkage, and exercises BC errors (no lines, missing posting date).

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could not resolve a header. |
| `Sales document {no} has no lines to post.` | Header has no `Sales Line` rows. |
| BC posting errors | Bubble up from `Sales-Post` (e.g. missing posting date, invalid dimensions, customer blocked). |
| `status: Success` but `postedDocuments` is empty | `Ship` and/or `Invoice` flags on the header are `false`. Run the two-step pre-flight in **Required Pre-Flight** above before posting. |

## Related Message Types

- `Sales.Document.PreviewPost` — preview the same posting without committing.
- `Sales.Document.Release` — required before posting if `Status = Open`.
- `Sales.SalesInvoice.Pdf` / `Sales.SalesCreditMemo.Pdf` / `Sales.SalesShipment.Pdf` / `Sales.ReturnReceipt.Pdf` — fetch a PDF of the resulting posted document by `no`.

