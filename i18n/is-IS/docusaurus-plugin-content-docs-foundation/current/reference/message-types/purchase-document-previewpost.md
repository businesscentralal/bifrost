---
id: purchase-document-previewpost
title: "Purchase.Document.PreviewPost"
sidebar_label: "Purchase.Document.PreviewPost"
sidebar_position: 111
description: "Beiðni- og svarsamningur fyrir Purchase.Document.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Simulates posting a purchase skjal via the BC `Gen. Jnl.-Post Preview` framework driving `Purch.-Post (Yes/No)` in preview mode, captures every bók row that **would** be written, then rolls the transaction back. The header er unchanged eftir the call.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
Safe og endurtekningarþolið — the wrapping `Gen. Jnl.-Post Preview.Run()` always Villur out internally til trigger rollback, so no data er persisted. Repeat calls return the sama shape (modulo predicted skjal numbers, which advance ef the No. Series er consumed með another transaction between calls).

## Forgangsröð auðkenna
Resolved með `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order aðeins).
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Posting Mode Flags
The preview uses whatever `Receive`/`Invoice` (orders) eða `Ship`/`Invoice` (return orders) values eru currently on the header. This impl does **ekki** force them til `true`. The mix of populated `preview[]` töflur depends on those flags exactly as fyrir `Purchase.Document.Post`.

## Beiðnibreytur
Request body er valfrjálst. No additional fields eru lesa.

## Dæmi um beiðni
```json
{ "type": "Purchase.Document.PreviewPost", "subject": "PO-001" }
```

## Uppbygging svars
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

| Property | Lýsing |
|----------|-------------|
| rollback | Always `true`. |
| summary | One-line natural-language summary built með `Bifrost Preview Helper`. |
| documentCurrencyCode | `Currency Code` úr the header. Empty strengur means the skjal er in LCY. |
| documentExchangeRate | FCY → LCY rate computed as `Round(1 / Currency Factor, 0.00001)`. **Always `1` þegar `documentCurrencyCode` er empty**, og `0` þegar the skjal has a currency but no factor yet. |
| predictedNumbers | skjal numbers that would be assigned. Informational aðeins — ekki reserved against the No. Series. Keys depend on `documentType`: Order → `postedInvoiceNo` + `postedReceiptNo`; reikningur → `postedInvoiceNo`; Credit Memo → `postedCreditMemoNo`; Return Order → `postedCreditMemoNo` + `postedReturnShipmentNo`. |
| totals.balanced | `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Balanced er always computed in LCY. |
| totals.totalDebitLCY / totalCreditLCY | Sum of G/L færsla `Debit Amount` / `Credit Amount`. |
| totals.totalDebitFCY / totalCreditFCY | Uppruni-currency totals derived úr captured `Detailed Vendor Ledg. Entry.Amount` (excluding `Application` / `Appln. Rounding` rows). birgi postings eru one-sided in FCY, so FCY totals surface the skjal upphæð in skjal currency rather than a balanced view. Equal til the LCY totals þegar the skjal er in LCY. |
| preview[] | One element per bók tafla populated með the BC posting routine. töflur eru discovered dynamically via `Posting Preview Event Handler.FillDocumentEntry` — extensions getur add töflur through the `OnAfterFillDocumentEntry` event. |
| preview[].færslur | Curated Reitur set úr `Bifrost Preview Helper`. Extensions getur add Reitur-Heiti blocks via `OnGetPreviewFieldNames` og FlowField precalculation via `OnPrecalculateFlowFields`. Fields restricted via `Bifrost Field Access` eru omitted. |

Reitur names nota the sama mechanical normalisation as `Data.Records.Get`: `No.` → `No_`, `Amount (LCY)` → `AmountLCY`, etc.

## Villur
| Villa | Orsök |
|-------|-------|
| `Purchase document {no} has no lines to post.` | The Uppruni header has no `Purchase Line` rows. |
| `Posting preview failed and no entries were captured. The document cannot be posted in its current state.` | The preview ran but the inner posting raised an Villa that left no færslur. |
| Underlying BC Villa text | hvaða Villa raised með `Purch.-Post (Yes/No)` during the simulated post (vantar setup, validation failures, etc.). |
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No skjal resolved með `FindPurchaseHeader`. |

## Tengdar skilaboðategundir
- `Purchase.Document.Post` — Commit the post (no rollback).
- `Purchase.Document.Statistics` — Header totals án simulating posting.
- `Sales.Document.PreviewPost` — sama mechanism fyrir sales skjöl.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

