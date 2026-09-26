---
id: warehouse-receipt-post-preview
title: "Warehouse.Receipt.Post.Preview"
sidebar_label: "Warehouse.Receipt.Post.Preview"
sidebar_position: 150
description: "Beiðni- og svarsamningur fyrir Warehouse.Receipt.Post.Preview Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting a Warehouse Receipt og Skilar the captured bók færslur (vöru bók og Gildi færsla — Sjá Captured töflur below) án committing. The post er driven through `Whse.-Post Receipt (Yes/No)` (codeunit 5761) bound með `EventSubscriberInstance = Manual`, whose `OnRunPreview` subscriber Stillir preview mode on `Whse.-Post Receipt` (5760). The transaction er rolled back eftir capture via BC's Posting Preview Event Handler.

nota this til verify what `Warehouse.Receipt.Post` would produce — predicted posted skjal numbers, bók impact, balanced/unbalanced — áður en committing.

**Stefna**: Innkomandi (no state change — rolled back)  **Efnisgerð**: `text/json`

## Captured töflur

BC's Posting Preview aðeins captures inserts í a fixed whitelist of töflur. fyrir a Warehouse Receipt post the captured set er:

| tafla ID | tafla | Always present? |
|---|---|---|
| 32 | vöru bók færsla | Yes — one færsla per receipt line. |
| 5802 | Gildi færsla | Yes — one Direct Cost færsla per receipt line. |
| 17 | G/L færsla | aðeins ef cost adjustment runs inline. Receipts normally produce **none**. |

`Posted Whse. Receipt Header` (tafla 7320) er **ekki** in BC's preview whitelist — so the impl never observes its insert during preview. As a result `predictedNumbers.postedWhseReceiptNo` er always emitted but er **always empty** in Svarið. (Confirmed via live MCP test.)

## Preconditions

sama as `Warehouse.Receipt.Post`: the Warehouse Receipt Header verður að exist, contain at least one line með `Qty. to Receive > 0`, og hvaða directed put-away bin requirements verður að already be satisfied.

## Forgangsröð auðkenna

1. `subject` Reitur (GUID → `SystemId`, text → `No.`).
2. Request JSON `systemId` / `recordSystemId` / `id` (GUID).
3. Request JSON `receiptNo` / `no` (text).

## Athugasemdir um endurtekningar og öryggi

- **lesa-aðeins**: BC's Gen. Jnl.-Post Preview always rolls back the transaction eftir capturing færslur. No data er persisted.
- No Bókunarheimild áskilið (no state change).
- númer series advance og then roll back — the predicted posted skjal numbers eru the numbers BC would have assigned but eru released back til the series.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | text/guid | One identifier áskilið | Bifrost subject. |
| `systemId` / `recordSystemId` / `id` | guid | (alternative) | In request JSON. |
| `receiptNo` / `no` | code[20] | (alternative) | In request JSON. |

### Dæmi um beiðni
```json
{ "receiptNo": "WR001001" }
```

## Uppbygging svars

Verified live (Purchase Order receipt at GULUR, 5 × vöru 1896-S):

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 0.0,
    "totalCreditLCY": 0.0
  },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] },
    { "tableId": 5802, "tableName": "Value Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] }
  ]
}
```

### númer Redaction (`***`)

BC's Posting Preview redacts assigned skjal numbers til `***` til signal they were rolled back rather than persisted. Affects:

- `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` — always `***` fyrir Posting Preview.
- `preview[].entries[].fields.DocumentNo_` on vöru bók færsla / Gildi færsla rows — einnig `***`.

Treat `***` as "the system would have assigned a númer úr the corresponding No. Series". nota `Warehouse.Receipt.Post` til obtain the actual númer.

### Predicted Numbers — which key appears

| Uppruni on the receipt | Key in `predictedNumbers` | Gildi in preview |
|---|---|---|
| Purchase Order | `postedPurchaseReceiptNo` | `***` (redacted með BC) |
| Sales Return Order | `postedReturnReceiptNo` | `***` (redacted með BC) |
| Innkomandi Transfer Order | `postedTransferReceiptNo` | `***` (redacted með BC) |

`postedWhseReceiptNo` er always emitted but er **always empty** in preview because BC's Posting Preview does ekki capture inserts í `Posted Whse. Receipt Header` (tafla 7320). til obtain the real númer, run `Warehouse.Receipt.Post`.

### Totals — balanced flag

Warehouse Receipts typically have **no direct G/L impact** (inventory recognised at cost, ekki at booking) — `balanced = true` með `totalDebitLCY = totalCreditLCY = 0`. ef the receipt triggers an automatic cost adjustment, the captured G/L færslur mun appear in `preview` og the totals mun reflect them.

## Bókunarheimild

None — preview does ekki commit.

## Reitur takmarkanir

None.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Receipt Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, receiptNo, no.` (`MissingParameter`); gefið en fannst ekki: `Warehouse Receipt Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | None of subject, systemId, recordSystemId, id, no, receiptNo resolved a header. (Exact wording — verified live.) |
| `Warehouse Receipt {No} has no lines to post.` | No lines eða all Qty. til Receive = 0. |
| `Posting preview failed and no entries were captured ...` | Underlying `Whse.-Post Receipt` raised an Villa áður en capturing færslur (e.g. vantar Bin Code, blocked vöru). The original BC Villa text er bubbled through. |

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — commit the actual posting eftir preview looks correct.
- `Warehouse.Receipt.Create` — create the receipt áður en previewing it.
- `Inventory.TransferOrder.PreviewPost` — analogous preview fyrir transfer orders.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

