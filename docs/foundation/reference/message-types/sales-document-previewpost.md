---
id: sales-document-previewpost
title: "Sales.Document.PreviewPost"
sidebar_label: "Sales.Document.PreviewPost"
sidebar_position: 124
description: "Request and response contract for the Sales.Document.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Predicts the entries a `Sales.Document.Post` call would create — without committing any changes. Uses BC 's `Gen. Jnl.-Post Preview` framework: `Sales-Post (Yes/No)` runs under preview, throws `Error('')` after the `Posting Preview Event Handler` has captured every populated table, and the whole transaction rolls back.

**Direction**: Inbound (rollback — preview only)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Always rolls back** — no posted documents, no ledger entries, no number-series consumption are persisted. Safe to call repeatedly.
- `predictedNumbers` shows the document numbers the post **would** use; they are not actually consumed.
- Field-name curation per preview table comes from `Bifrost Preview Helper.GetPreviewFieldNames` (extensible event) — fields not listed are omitted from the per-row payload.

## Subject Identification Order

Same as `Sales.Document.Release` (via `FindSalesHeader`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | See above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | string | See above | Typed `No.` lookup. |

### Request Example
```json
{ "orderNo": "PS-ORD103001" }
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview only; no data was committed.",
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "lcyCode": "EUR",
  "documentCurrencyCode": "USD",
  "documentExchangeRate": 1.10,
  "predictedNumbers": {
    "postedInvoiceNo": "PS-INV103001",
    "postedShipmentNo": "PS-SHIP103001"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 6200.00,
    "totalCreditLCY": 6200.00,
    "totalDebitFCY": 5636.36,
    "totalCreditFCY": 5636.36
  },
  "preview": [
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "fields": ["PostingDate", "DocumentNo_", "GLAccountNo_", "Amount", "Description"],
      "rows": [
        { "PostingDate": "2026-01-15", "DocumentNo_": "PS-INV103001", "GLAccountNo_": "1320", "Amount": 6200.00, "Description": "Adatum Corporation" }
      ]
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
| `lcyCode` | `General Ledger Setup."LCY Code"`. |
| `documentCurrencyCode` / `documentExchangeRate` | `Sales Header."Currency Code"` / `"Currency Factor"`. |
| `predictedNumbers` | Keys depend on `documentType`: Order → `postedInvoiceNo` + `postedShipmentNo`. Invoice → `postedInvoiceNo`. Credit Memo → `postedCreditMemoNo`. Return Order → `postedCreditMemoNo` + `postedReturnReceiptNo`. |
| `totals` LCY | `G/L Entry.CalcSums("Debit Amount", "Credit Amount")` from the captured preview. |
| `totals` FCY | `Detailed Cust. Ledg. Entry` totals, excluding `Entry Type::Application` and `Entry Type::"Appln. Rounding"`. |
| `preview[]` | One entry per table that the posting preview populated (e.g. `G/L Entry`, `Cust. Ledger Entry`, `VAT Entry`, `Item Ledger Entry`, `Value Entry`, `Detailed Cust. Ledg. Entry`). `fields[]` comes from the curated list for that table. |

## Examples (from unit tests)

From `Sales Doc Preview Post Tests` (`test/test/Sales/SalesDocPrevPostTests.Codeunit.al`) — covers preview for each document type, verifies `rollback: true`, asserts no posted document is persisted, validates `predictedNumbers` keys, and exercises BC posting errors surfaced via the preview pipeline.

## Errors

| Error | Cause |
|---|---|
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | `FindSalesHeader` could not resolve a header. |
| `Sales document {no} has no lines to post.` | Header has no `Sales Line` rows. |
| `Posting preview failed and no entries were captured. The document cannot be posted in its current state.` | The preview pipeline finished without populating any tables — `Sales.Document.Post` would also fail. |
| BC preview errors | Bubble up from `Sales-Post (Yes/No)` running under `Gen. Jnl.-Post Preview`. |

## Related Message Types

- `Sales.Document.Post` — actually commit the posting.
- `Sales.Document.Statistics` — header-level totals without running a preview.
- `Sales.Document.Release` — required before posting if `Status = Open`.

