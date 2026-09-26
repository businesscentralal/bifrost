---
id: sales-document-statistics
title: "Sales.Document.Statistics"
sidebar_label: "Sales.Document.Statistics"
sidebar_position: 127
description: "Beiðni- og svarsamningur fyrir Sales.Document.Statistics Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Computes header totals og VAT breakdown fyrir an unposted Sales Header — the sama numbers shown in the BC Statistics page. Uses `Sales Line.CalcVATAmountLines(QtyType::General, ...)` og rounds via `Currency."Amount Rounding Precision"`.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

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
  "documentType": "Order",
  "documentNo": "PS-ORD103001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "currencyCode": "EUR",
  "documentDate": "2026-01-15",
  "order": {
    "amount": 5000.00,
    "lineDiscountAmount": 100.00,
    "invoiceDiscountAmount": 50.00,
    "totalExclVAT": 4850.00,
    "vatAmount": 1164.00,
    "totalInclVAT": 6014.00,
    "quantity": 10,
    "totalWeight": 25.5,
    "totalVolume": 0.4,
    "noOfVATLines": 1
  },
  "vat_totals": [
    {
      "vatIdentifier": "VAT24",
      "vatPct": 24,
      "lineAmount": 5000.00,
      "vatBase": 4850.00,
      "vatAmount": 1164.00,
      "amountInclVAT": 6014.00
    }
  ]
}
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `currencyCode` | `Sales Header."Currency Code"`, eða `General Ledger Setup."LCY Code"` þegar blank. |
| `documentDate` | `Sales Header."Order Date"`. |
| `totalWeight` / `totalVolume` | Sum of `(Gross Weight × Quantity)` / `(Unit Volume × Quantity)` across lines. |
| `vat_totals` | One færsla per `VAT Amount Line` (per VAT Identifier). |

## Dæmi (úr einingaprófum)

úr `Sales Doc Statistics Tests` (`test/test/Sales/SalesDocStatisticsTests.Codeunit.al`) — covers totals fyrir Order/reikningur/Credit Memo/Return Order/Blanket Order/Quote, multi-VAT-rate lines, line og reikningur discounts, og FCY headers.

## Villur

| Villa | Orsök |
|---|---|
| `Sales Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Sales Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | `FindSalesHeader` could ekki resolve a header. |

## Tengdar skilaboðategundir

- `Sales.Document.PreviewPost` — predicted G/L impact of posting.
- `Data.Records.Get` — raw `Sales Header` og `Sales Line` færslur.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

