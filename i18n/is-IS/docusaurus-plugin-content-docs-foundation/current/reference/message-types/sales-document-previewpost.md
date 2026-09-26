---
id: sales-document-previewpost
title: "Sales.Document.PreviewPost"
sidebar_label: "Sales.Document.PreviewPost"
sidebar_position: 124
description: "Beiðni- og svarsamningur fyrir Sales.Document.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Predicts the færslur a `Sales.Document.Post` call would create — án committing hvaða changes. Uses BC 's `Gen. Jnl.-Post Preview` framework: `Sales-Post (Yes/No)` runs under preview, throws `Error('')` eftir the `Posting Preview Event Handler` has captured every populated tafla, og the whole transaction rolls back.

**Stefna**: Innkomandi (rollback — preview aðeins)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **Always rolls back** — no posted skjöl, no bók færslur, no númer-series consumption eru persisted. Safe til call repeatedly.
- `predictedNumbers` shows the skjal numbers the post **would** nota; they eru ekki actually consumed.
- Reitur-Heiti curation per preview tafla comes úr `Bifrost Preview Helper.GetPreviewFieldNames` (extensible event) — fields ekki listed eru omitted úr the per-row payload.

## Subject Identification Order

sama as `Sales.Document.Release` (via `FindSalesHeader`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `systemId` / `recordSystemId` / `id` | GUID | Sjá above | `Sales Header.SystemId`. |
| `orderNo` / `quoteNo` / `invoiceNo` / `creditMemoNo` / `blanketOrderNo` / `returnOrderNo` | strengur | Sjá above | Typed `No.` lookup. |

### Dæmi um beiðni
```json
{ "orderNo": "PS-ORD103001" }
```

## Uppbygging svars

### Tókst
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

### Mistókst
```json
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `lcyCode` | `General Ledger Setup."LCY Code"`. |
| `documentCurrencyCode` / `documentExchangeRate` | `Sales Header."Currency Code"` / `"Currency Factor"`. |
| `predictedNumbers` | Keys depend on `documentType`: Order → `postedInvoiceNo` + `postedShipmentNo`. reikningur → `postedInvoiceNo`. Credit Memo → `postedCreditMemoNo`. Return Order → `postedCreditMemoNo` + `postedReturnReceiptNo`. |
| `totals` LCY | `G/L Entry.CalcSums("Debit Amount", "Credit Amount")` úr the captured preview. |
| `totals` FCY | `Detailed Cust. Ledg. Entry` totals, excluding `Entry Type::Application` og `Entry Type::"Appln. Rounding"`. |
| `preview[]` | One færsla per tafla that the posting preview populated (e.g. `G/L Entry`, `Cust. Ledger Entry`, `VAT Entry`, `Item Ledger Entry`, `Value Entry`, `Detailed Cust. Ledg. Entry`). `fields[]` comes úr the curated list fyrir that tafla. |

## Dæmi (úr einingaprófum)

úr `Sales Doc Preview Post Tests` (`test/test/Sales/SalesDocPrevPostTests.Codeunit.al`) — covers preview fyrir hver skjal Gerð, verifies `rollback: true`, asserts no posted skjal er persisted, validates `predictedNumbers` keys, og exercises BC posting Villur surfaced via the preview pipeline.

## Villur

| Villa | Orsök |
|---|---|
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | `FindSalesHeader` could ekki resolve a header. |
| `Sales document {no} has no lines to post.` | Header has no `Sales Line` rows. |
| `Posting preview failed and no entries were captured. The document cannot be posted in its current state.` | The preview pipeline finished án populating hvaða töflur — `Sales.Document.Post` would einnig fail. |
| BC preview Villur | Bubble up úr `Sales-Post (Yes/No)` running under `Gen. Jnl.-Post Preview`. |

## Tengdar skilaboðategundir

- `Sales.Document.Post` — actually commit the posting.
- `Sales.Document.Statistics` — header-level totals án running a preview.
- `Sales.Document.Release` — áskilið áður en posting ef `Status = Open`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

