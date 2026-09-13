---
id: purchase-document-post
title: "Purchase.Document.Post"
sidebar_label: "Purchase.Document.Post"
sidebar_position: 110
description: "Beiðni- og svarsamningur fyrir Purchase.Document.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar a purchase skjal via Microsoft codeunit `Purch.-Post` og Skilar the list of posted skjöl that were created. styður Order, reikningur, Credit Memo, og Return Order. The Uppruni skjal er consumed (deleted) fyrir Orders og Return Orders þegar posting completes fully.

| Uppruni | Posted skjöl created |
|--------|--------------------------|
| Order | Posted Purchase reikningur + Posted Purchase Receipt |
| reikningur | Posted Purchase reikningur |
| Credit Memo | Posted Purchase Credit Memo |
| Return Order | Posted Purchase Credit Memo + Posted Return Shipment |

**Stefna**: Innkomandi  **Efnisgerð**: text/json

> ⚠️ **Receive/reikningur flags eru ekki set automatically via the API.**
> Unlike the BC UI, the API Les `Receive` og `Invoice` (fyrir Orders) og `Ship` og `Invoice` (fyrir Return Orders) exactly as stored on the header.
> Orders created via API have all flags `false` með Sjálfgefið. You **verður að** set them með `Data.Records.Set` áður en calling this skilaboðategund.
> Sjá **Posting Mode Flags** below fyrir the áskilið two-step pattern.

## Idempotency / Safety
**ekki endurtekningarþolið og ekki retry-safe.** A tókst post er irreversible; the Uppruni skjal er gone eða its `Status` has advanced. Retrying may post the skjal again (ef it er still present) eða surface a ekki-fannst Villa.

Discovery of newly created posted skjöl uses a snapshot-then-compare pattern: `Last Posting No.`, `Last Receiving No.` og `Last Return Shipment No.` eru captured áður en posting og the corresponding posted-skjal töflur eru looked up afterward með the **ný** values. ef `Last *No.` did ekki change, no færsla er emitted in `postedDocuments` fyrir that channel.

## Posting Mode Flags
fyrir Orders og Return Orders, BC requires at least one of `Receive`/`Invoice` (orders) eða `Ship`/`Invoice` (return orders) til be `true` on the header. This impl does **ekki** set these flags automatically — set them via `Data.Records.Set` áður en calling, eða BC mun return `Enter Yes in Receive and/or Invoice and/or Ship.`.

**áskilið two-step pattern (sequential — do ekki parallelize):**

**Step 1 — Set flags on the header**
```json
{
  "type": "Data.Records.Set",
  "tableName": "Purchase Header",
  "primaryKey": { "DocumentType": 1, "No_": "PO-001" },
  "fields": { "Receive": true, "Invoice": true }
}
```

**Step 2 — Post**
```json
{ "type": "Purchase.Document.Post", "subject": "PO-001" }
```

| Flag | Reitur No. | Order | Return Order |
|---|---|---|---|
| `Receive` | 77 | Create a Posted Receipt | — |
| `Ship` | 78 | — | Create a Posted Return Shipment |
| `Invoice` | 79 | Create a Posted reikningur | Create a Posted Credit Memo |

Other BC-side prerequisites that verður að be satisfied áður en calling:
- reikningur / Order → reikningur: `Vendor Invoice No.` verður að be filled.
- Credit Memo / Return Order → Credit Memo: `Vendor Cr. Memo No.` verður að be filled og unique per birgi.

## Forgangsröð auðkenna
Resolved með `Argument.FindPurchaseHeader`:
1. `subject` as GUID → `PurchaseHeader.GetBySystemId`.
2. `subject` as text → `PurchaseHeader.Get(Order, <subject>)` (Order aðeins).
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `orderNo`, `quoteNo`, `invoiceNo`, `creditMemoNo`, `blanketOrderNo`, `returnOrderNo`.

## Beiðnibreytur
Request body er valfrjálst. No additional fields eru lesa.

## Dæmi um beiðni
```json
{ "type": "Purchase.Document.Post", "subject": "PO-001" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "postedDocuments": [
    {
      "type": "Posted Purchase Invoice",
      "recordSystemId": "<systemId>",
      "no": "PI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "vendorLedgerEntryNo": 1001
    },
    { "type": "Posted Purchase Receipt", "recordSystemId": "<systemId>", "no": "R-001", "postingDate": "2026-03-16" }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| documentType | Localised enum Heiti of the **Uppruni** skjal. |
| documentNo | The Uppruni (pre-assigned) skjal númer. |
| postedDocuments[].Gerð | One of `Posted Purchase Invoice`, `Posted Purchase Receipt`, `Posted Purchase Credit Memo`, `Posted Return Shipment`. |
| postedDocuments[].recordSystemId | GUID of the posted færsla (án braces, lowercase). |
| postedDocuments[].no | skjal númer of the posted færsla. |
| postedDocuments[].postingDate | Posting dagsetning of the posted færsla. |
| postedDocuments[].upphæð / amountIncludingVAT / vendorLedgerEntryNo | Present **aðeins** fyrir reikningur og credit memo færslur, omitted fyrir receipts og return shipments. |

Discovery fallback: þegar `Get(Last Posting No.)` misses (númer-series quirk), the impl falls back til `Pre-Assigned No.` fyrir reikningur / Credit Memo sources, og til `Order No.` / `Return Order No.` fyrir Order / Return Order sources.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Purchase document {no} has no lines to post.` | The Uppruni header has no `Purchase Line` rows. |
| `Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo).` | No skjal resolved með `FindPurchaseHeader`. |
| Underlying BC Villa text | hvaða Villa raised með `Purch.-Post` (vantar `Vendor Invoice No.`, duplicate `Vendor Cr. Memo No.`, both posting flags false, vantar posting setup, blocked items, dimension Villur, etc.). |

## Tengdar skilaboðategundir
- `Purchase.Document.PreviewPost` — Simulate the post og inspect the would-be bók færslur.
- `Purchase.Document.Statistics` — Header totals án posting.
- `Purchase.Document.Release` / `Purchase.Document.Reopen` — Manage status áður en posting.

