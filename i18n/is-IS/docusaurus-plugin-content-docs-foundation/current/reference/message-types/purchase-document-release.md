---
id: purchase-document-release
title: "Purchase.Document.Release"
sidebar_label: "Purchase.Document.Release"
sidebar_position: 112
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Release Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Releases an opið purchase skjal með running Microsoft codeunit `Release Purchase Document`. styður Order, reikningur, Credit Memo, Return Order, Quote, og Blanket Order. The status moves úr `Open` til `Released`.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
ekki endurtekningarþolið: a second call against an already-released skjal Skilar an Villa (`Purchase Document {no} is already released.`). Check `Status` via `Data.Records.Get` áður en retrying.

## Forgangsröð auðkenna
Resolved með `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order aðeins).
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Beiðnibreytur
Request body er valfrjálst. No additional fields eru lesa.

## Dæmi um beiðni
```json
{ "type": "Purchase.Document.Release", "subject": "PO-001" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Open",
  "statusAfter": "Released",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

| Property | Lýsing |
|----------|-------------|
| documentType | Localised enum Heiti úr `Purchase Document Type`. |
| statusBefore | Hard-coded as `Open` — release er aðeins invoked þegar the previous status was ekki `Released`. |
| statusAfter | Status eftir the call (typically `Released`; may show `Pending Approval` ef an approval workflow intercepts the release). |
| documentDate | `Order Date` úr the header. |
| upphæð / amountIncludingVAT | FlowFields, recalculated eftir the release. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Purchase Document {no} is already released.` | Header `Status` er already `Released`. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No skjal resolved með `FindPurchaseHeader`. |
| Underlying BC Villa text | hvaða Villa raised með `Release Purchase Document` (vantar áskilið fields, approval workflow blocks, etc.). |

## Tengdar skilaboðategundir
- `Purchase.Document.Reopen` — Move back til `Open`.
- `Purchase.Document.Post` — Posting handles its own release internally; explicit release er ekki áskilið áður en posting.

