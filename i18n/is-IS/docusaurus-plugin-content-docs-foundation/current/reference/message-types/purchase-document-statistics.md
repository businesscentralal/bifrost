---
id: purchase-document-statistics
title: "Purchase.Document.Statistics"
sidebar_label: "Purchase.Document.Statistics"
sidebar_position: 114
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Statistics Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar header totals (amounts, VAT breakdown, total quantity / weight / volume) fyrir a single purchase skjal. Mirrors the data shown on the Purchase Statistics page — derived með iterating the skjal's `Purchase Line` rows og calling `CalcVATAmountLines`.

**Stefna**: Útgående  **Efnisgerð**: text/json

## Forgangsröð auðkenna
Resolved með `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order aðeins).
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Beiðnibreytur
Request body er valfrjálst. No additional fields eru lesa.

## Dæmi um beiðni
```json
{ "type": "Purchase.Document.Statistics", "subject": "PO-001" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "currencyCode": "USD",
  "documentDate": "2026-03-07",
  "order": {
    "amount": 5000.00,
    "lineDiscountAmount": 150.00,
    "invoiceDiscountAmount": 250.00,
    "totalExclVAT": 4750.00,
    "vatAmount": 1187.50,
    "totalInclVAT": 5937.50,
    "quantity": 100,
    "totalWeight": 125.50,
    "totalVolume": 2.35,
    "noOfVATLines": 1
  },
  "vat_totals": [
    { "vatIdentifier": "STANDARD", "vatPct": 25.00, "lineAmount": 4750.00, "vatBase": 4750.00, "vatAmount": 1187.50, "amountInclVAT": 5937.50 }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| currencyCode | skjal `Currency Code`; falls back til the LCY code úr General bók Setup þegar the header er in LCY. **Never empty in Svarið.** |
| documentDate | `Order Date` úr the header. |
| order.amount | `Purchase Header.Amount` FlowField (line totals excluding VAT, áður en reikningur discount). |
| order.lineDiscountAmount | Sum of `Line Discount Amount` over all `Purchase Line` rows. |
| order.invoiceDiscountAmount | Sum of `Invoice Discount Amount` úr the temporary `VAT Amount Line` set. |
| order.totalExclVAT | Sum of `Line Amount` eftir reikningur discount across VAT lines. |
| order.vatAmount | Sum of `VAT Amount` across VAT lines. |
| order.totalInclVAT | Sum of `Amount Including VAT` across VAT lines. |
| order.quantity | Sum of `Quantity` across `Purchase Line` rows. |
| order.totalWeight | Sum of `Gross Weight × Quantity` across lines. |
| order.totalVolume | Sum of `Unit Volume × Quantity` across lines. |
| order.noOfVATLines | númer of distinct VAT lines (i.e. distinct VAT Identifier / VAT % combinations). |
| vat_totals[] | One færsla per VAT line returned með `CalcVATAmountLines`. |

All tugabrot amounts eru rounded using the precision of the skjal currency (eða LCY þegar the header has no currency).

## Villur
| Villa | Orsök |
|-------|-------|
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No skjal resolved með `FindPurchaseHeader`. |

## Tengdar skilaboðategundir
- `Purchase.Document.PreviewPost` — Adds predicted skjal numbers og full bók preview.
- `Purchase.Document.Post` — Commit the skjal.
- `Data.Records.Get` on `Purchase Line` — lesa individual lines.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

