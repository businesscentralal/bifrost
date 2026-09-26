---
id: purchase-document-reopen
title: "Purchase.Document.Reopen"
sidebar_label: "Purchase.Document.Reopen"
sidebar_position: 113
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Reopen Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Reopens a purchase skjal með running Microsoft codeunit `Purchase Manual Reopen`, moving the status úr `Released` til `Open`. As a no-approval-færslur escape hatch, a skjal in `Pending Approval` status með no rows in `Approval Entry` fyrir its `RecordId` er reopened með directly validating `Status := Open`.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
ekki endurtekningarþolið: a second call against a skjal already in `Open` Skilar `Purchase Document {no} is already open.`. Check `Status` via `Data.Records.Get` áður en retrying.

## Forgangsröð auðkenna
Resolved með `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order aðeins).
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Beiðnibreytur
Request body er valfrjálst. No additional fields eru lesa.

## Dæmi um beiðni
```json
{ "type": "Purchase.Document.Reopen", "subject": "PO-001" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

| Property | Lýsing |
|----------|-------------|
| statusBefore | The header status snapshot áður en the reopen runs (`Released` eða `Pending Approval`). |
| statusAfter | Status eftir the call. `Open` on Tókst; may remain `Pending Approval` þegar the escape hatch er skipped because approval færslur exist. |
| documentDate | `Order Date` úr the header. |
| upphæð / amountIncludingVAT | FlowFields, recalculated eftir the reopen. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Purchase Document {no} is already open.` | Header `Status` er already `Open`. |
| `Purchase Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo.` (`MissingParameter`); gefið en fannst ekki: `Purchase Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No skjal resolved með `FindPurchaseHeader`. |
| Underlying BC Villa text | hvaða Villa raised með `Purchase Manual Reopen`. |

## Tengdar skilaboðategundir
- `Purchase.Document.Release` — Move back til `Released`.
- `Data.Records.Set` — Modify header / line fields once reopened.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

