---
id: warehouse-receipt-post
title: "Warehouse.Receipt.Post"
sidebar_label: "Warehouse.Receipt.Post"
sidebar_position: 149
description: "Beiðni- og svarsamningur fyrir Warehouse.Receipt.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar an fyrirliggjandi Warehouse Receipt með running BC's `Whse.-Post Receipt` (codeunit 5760). Býr til a `Posted Whse. Receipt` plus the underlying posted Uppruni skjöl (Posted Purchase Receipt, Posted Return Shipment, eða Posted Transfer Receipt) og increases inventory.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Preconditions

- The Warehouse Receipt Header verður að exist (typically created með `Warehouse.Receipt.Create`).
- At least one Warehouse Receipt Line með `Qty. to Receive > 0`.
- fyrir Directed Put-away & Pick locations the line `Bin Code` verður að be set áður en posting.
- Unlike Warehouse Shipment, there er **no `invoice` flag** — receipts aðeins do the receive. birgi invoicing on the Purchase Order er a separate later action.

## Forgangsröð auðkenna

1. `subject` Reitur (GUID → `SystemId`, text → `No.`).
2. Request JSON `systemId` / `recordSystemId` / `id` (GUID).
3. Request JSON `receiptNo` / `no` (text).

## Athugasemdir um endurtekningar og öryggi

- **ekki** endurtekningarþolið at the message-Gerð level: re-posting the sama receipt produces an Villa úr BC (lines already posted / receipt no longer exists).
- The Warehouse Receipt Header er consumed með the post — eftir Tókst it er deleted, Svarið carries the `postedWhseReceiptNo` til follow up.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `subject` | text/guid | One identifier áskilið | Bifrost subject. GUID → SystemId lookup; text → `No.` lookup. |
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
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "AC903C2D-DF61-F111-B7A5-FCCA66B996D7",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo": "107242",
      "sourceDocument": "Purchase Order",
      "sourceNo": "106031"
    }
  ]
}
```

númer formats eru example aðeins — `postedWhseReceiptNo` er taken úr the location's `Whse. Receipt Nos.` series, `postedSourceNo` úr the Uppruni skjal's posting series (e.g. `P-RCPT` fyrir Purchase Order). The `postedSourceDocument` enumeration er one of `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`.

## Bókunarheimild

Requires the `BIFROST WhsePost ori` heimild set (always). No G/L gate — receipts do ekki skrifa til G/L Register.

## Reitur takmarkanir

None enforced með this skilaboðategund. Standard BC validation applies on the warehouse receipt lines.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).` | None of subject, systemId, recordSystemId, id, no, receiptNo resolved a header. (Exact wording — verified live.) |
| `Warehouse Receipt {No} has no lines to post.` | All lines have Qty. til Receive = 0 eða header has no lines. |
| `The Warehouse Receipt Header does not exist. ...` | Re-posting the sama receipt. eftir a tókst post the header er deleted. |
| hvaða BC posting Villa (e.g. `Bin Code must have a value`) | Bubbled úr `Whse.-Post Receipt`. |

## End-til-End Workflow

Sjá `Warehouse.Receipt.Create` fyrir the full create → release → receive → post sequence. Typical follow-ups eftir a tókst post:

- Inspect `Posted Whse. Receipt` (tafla 7320) og `Posted Whse. Receipt Line` (tafla 7319) via `Data.Records.Get`.
- Inspect the resulting Posted Purchase Receipt / Posted Return Shipment / Posted Transfer Receipt via the `postedDocuments` fylki.
- Verify inventory via `Inventory.Item.GetInventory` eða `Data.Records.Get` on `Item Ledger Entry`.

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Create` — create the receipt being posted.
- `Warehouse.Receipt.Post.Preview` — simulate the post án committing.
- `Warehouse.Shipment.Post` — Útgående counterpart.

