---
id: purchase-document-previewpost
title: "Purchase.Document.PreviewPost"
sidebar_label: "Purchase.Document.PreviewPost"
sidebar_position: 111
description: "Request and response contract for the Purchase.Document.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Simulates posting a purchase document via the BC `Gen. Jnl.-Post Preview` framework driving `Purch.-Post (Yes/No)` in preview mode, captures every ledger row that **would** be written, then rolls the transaction back. The header is unchanged after the call.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
Safe and idempotent — the wrapping `Gen. Jnl.-Post Preview.Run()` always errors out internally to trigger rollback, so no data is persisted. Repeat calls return the same shape (modulo predicted document numbers, which advance if the No. Series is consumed by another transaction between calls).

## Identifier Resolution Order
Resolved by `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order only).
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Posting Mode Flags
The preview uses whatever `Receive`/`Invoice` (orders) or `Ship`/`Invoice` (return orders) values are currently on the header. This impl does **not** force them to `true`. The mix of populated `preview[]` tables depends on those flags exactly as for `Purchase.Document.Post`.

## Request Parameters
Request body is optional. No additional fields are read.

## Request Example
```json
{ "type": "Purchase.Document.PreviewPost", "subject": "PO-001" }
```

## Response Shape
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order PO-001 for vendor V01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "V01",
  "vendorName": "Acme Supplies",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": { "postedInvoiceNo": "PI-00045", "postedReceiptNo": "PR-00045" },
  "totals": { "balanced": true, "totalDebitLCY": 1080.00, "totalCreditLCY": 1080.00, "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00 },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "tableCaption": "G/L Entry", "description": "...", "entryCount": 3, "entries": [ { "EntryNo_": 0, "GLAccountNo_": "...", "Amount": 1080.00, "DebitAmount": 1080.00, "CreditAmount": 0, "DocumentNo_": "PI-00045", "PostingDate": "2026-03-16" } ] },
    { "tableId": 254, "tableName": "VAT Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 5802, "tableName": "Value Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 25, "tableName": "Vendor Ledger Entry", "entryCount": 1, "entries": [ { "Amount": -1000.00, "AmountLCY": -1080.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 379, "tableName": "Detailed Vendor Ledg. Entry", "entryCount": 1, "entries": [ ] }
  ]
}
```

| Property | Description |
|----------|-------------|
| rollback | Always `true`. |
| summary | One-line natural-language summary built by `Bifrost Preview Helper`. |
| documentCurrencyCode | `Currency Code` from the header. Empty string means the document is in LCY. |
| documentExchangeRate | FCY → LCY rate computed as `Round(1 / Currency Factor, 0.00001)`. **Always `1` when `documentCurrencyCode` is empty**, and `0` when the document has a currency but no factor yet. |
| predictedNumbers | Document numbers that would be assigned. Informational only — not reserved against the No. Series. Keys depend on `documentType`: Order → `postedInvoiceNo` + `postedReceiptNo`; Invoice → `postedInvoiceNo`; Credit Memo → `postedCreditMemoNo`; Return Order → `postedCreditMemoNo` + `postedReturnShipmentNo`. |
| totals.balanced | `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Balanced is always computed in LCY. |
| totals.totalDebitLCY / totalCreditLCY | Sum of G/L Entry `Debit Amount` / `Credit Amount`. |
| totals.totalDebitFCY / totalCreditFCY | Source-currency totals derived from captured `Detailed Vendor Ledg. Entry.Amount` (excluding `Application` / `Appln. Rounding` rows). Vendor postings are one-sided in FCY, so FCY totals surface the document amount in document currency rather than a balanced view. Equal to the LCY totals when the document is in LCY. |
| preview[] | One element per ledger table populated by the BC posting routine. Tables are discovered dynamically via `Posting Preview Event Handler.FillDocumentEntry` — extensions can add tables through the `OnAfterFillDocumentEntry` event. |
| preview[].entries | Curated field set from `Bifrost Preview Helper`. Extensions can add field-name blocks via `OnGetPreviewFieldNames` and FlowField precalculation via `OnPrecalculateFlowFields`. Fields restricted via `Bifrost Field Access` are omitted. |

Field names use the same mechanical normalisation as `Data.Records.Get`: `No.` → `No_`, `Amount (LCY)` → `AmountLCY`, etc.

## Errors
| Error | Cause |
|-------|-------|
| `Purchase document {no} has no lines to post.` | The source header has no `Purchase Line` rows. |
| `Posting preview failed and no entries were captured. The document cannot be posted in its current state.` | The preview ran but the inner posting raised an error that left no entries. |
| Underlying BC error text | Any error raised by `Purch.-Post (Yes/No)` during the simulated post (missing setup, validation failures, etc.). |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No document resolved by `FindPurchaseHeader`. |

## Related Message Types
- `Purchase.Document.Post` — Commit the post (no rollback).
- `Purchase.Document.Statistics` — Header totals without simulating posting.
- `Sales.Document.PreviewPost` — Same mechanism for sales documents.

