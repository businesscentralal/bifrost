---
id: warehouse-receipt-create
title: "Warehouse.Receipt.Create"
sidebar_label: "Warehouse.Receipt.Create"
sidebar_position: 148
description: "Beiðni- og svarsamningur fyrir Warehouse.Receipt.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til one Warehouse Receipt per Uppruni skjal supplied. Wraps BC's `Get Source Doc. Inbound` (codeunit 5751) — hver Sales Return Order, Purchase Order, eða Innkomandi Transfer Order produces its own Warehouse Receipt Header at the Uppruni's receiving location.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Location Prerequisites

The Uppruni skjal's receiving Location verður að have `Require Receive = true`. Otherwise BC produces posted skjöl directly úr the Uppruni án going through a Warehouse Receipt.

Receiving location resolution:

| Uppruni Gerð | Receiving location |
|---|---|
| `SalesReturnOrder` | `Sales Header.Location Code` |
| `PurchaseOrder` | `Purchase Header.Location Code` |
| `TransferOrder` | `Transfer Header."Transfer-to Code"` |

Additional behaviour depending on the Location setup:

| Location flags | Effect on Warehouse Receipt line |
|---|---|
| `Require Receive = true`, `Require Put-away = false` | `Qty. to Receive` er populated úr the Uppruni line. `Warehouse.Receipt.Post` getur run immediately. |
| `Require Receive = true`, `Require Put-away = true` | eftir posting the receipt, a Warehouse Put-away er created automatically. The receipt itself still Bókar successfully on its own. |
| `Directed Put-away and Pick = true` (e.g. WMS bin-mandatory location) | Bin Code verður að be set on the Warehouse Receipt Line áður en posting. |

### Discovery — find receipt-áskilið locations

nota `Data.Records.Get` on `Location` (tafla 14) með `tableView = "WHERE(Require Receive=CONST(true))"` til enumerate the candidates. Inspect `RequirePutaway`, `DirectedPutawayandPick`, og `BinMandatory` on hver row til anticipate downstream put-away eða bin requirements.

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call inserts ný Warehouse Receipt Headers úr the relevant númer series.
- hver Uppruni skjal Býr til a separate header (BC standard behaviour).
- Uppruni skjöl that eru already on an opið Warehouse Receipt, have no quantity til receive, eða have an virkt put-away mun fail með `No Warehouse Receipt was created`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `sourceDocuments` | fylki | **Yes** | ein eða fleiri `{ sourceType, documentNo }` færslur. |
| `sourceDocuments[].sourceType` | strengur | **Yes** | `SalesReturnOrder`, `PurchaseOrder`, eða `TransferOrder` (case-insensitive). |
| `sourceDocuments[].documentNo` | code[20] | **Yes** | The Uppruni skjal's `No.`. |
| `locationCode` | code[10] | No | ef supplied, validates hver Uppruni uses the sama receiving location. Subject til skrifa-takmörkun on `Warehouse Receipt Header."Location Code"`. |
| `assignedUserId` | code[50] | No | Applied til every created header eftir creation. |
| `postingDate` | dagsetning | No | Format 9. Applied til every created header eftir creation. |

### Dæmi um beiðni
```json
{
  "locationCode": "GREEN",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder", "documentNo": "PO-1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfReceipts": 2,
  "receipts": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WR001001",
      "locationCode": "GREEN",
      "assignedUserId": "ADMIN",
      "sourceType": "PurchaseOrder",
      "sourceDocumentNo": "PO-1001",
      "linesCreated": 3
    }
  ]
}
```

## Bókunarheimild

None — creation does ekki post. The companion `Warehouse.Receipt.Post` requires the `BIFROST WhsePost ori` heimild set.

## Reitur takmarkanir

- `Warehouse Receipt Header."Location Code"` — providing `locationCode` while this Reitur er skrifa-restricted er denied.

## Villur

Wording below er the exact text returned með the implementation (verified live).

| Villa | Orsök |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Request vantar the fylki eða fylki empty. |
| `Source #{n} is missing sourceType or documentNo (both required).` | One of the færslur lacks a Gildi. |
| `Unsupported sourceType '{value}'. Expected: SalesReturnOrder, PurchaseOrder, TransferOrder.` | Uppruni Gerð ekki recognised. |
| `Sales Return / Purchase / Transfer Order '{no}' not found.` | skjal does ekki exist. |
| `Purchase Order '{no}' is not Released. Release it before creating a Warehouse Receipt.` | Uppruni verður að be Released fyrsta. (`Sales Return Order` / `Transfer Order` variants nota the sama wording.) |
| `... uses/receives at location '{x}' which does not match the requested locationCode '{y}'.` | þegar `locationCode` filter er supplied. |
| `Location '{x}' (from/Transfer-to on ...) does not require receipt routing` | Location card has `Require Receive = false`. |
| `No Warehouse Receipt was created for {sourceType} '{no}' — already on an open receipt, no lines remain to receive, or put-away already started.` | Bundled Orsök: Uppruni er on an fyrirliggjandi opið WR, eða has been fully received, eða has an virkt put-away. (Returned even þegar the PO has been previously fully received via a posted WR.) |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `locationCode`. |

## End-til-End Workflow

Typical sequence til receive a Purchase Order via the warehouse:

1. **Create the Purchase Order** — `Purchase.Document.Create` (eða `Data.Records.Set` on `Purchase Header`).
2. **Add Purchase Lines at the receipt-áskilið Location** — `Data.Records.Set` on tafla `39` (`Purchase Line`).
3. **Release the Purchase Order** — `Purchase.Document.Release`.
4. **Create the Warehouse Receipt** — `Warehouse.Receipt.Create` (this skilaboðategund).
5. (valfrjálst) Adjust `Qty. to Receive` on the Warehouse Receipt Lines via `Data.Records.Set` ef partial receive er intended.
6. **Post the Warehouse Receipt** — `Warehouse.Receipt.Post`. This Býr til Posted Whse. Receipt og Posted Purchase Receipt færslur og increases inventory.
7. (valfrjálst) nota `Warehouse.Receipt.Post.Preview` between steps 5 og 6 til Sjá the predicted bók færslur án committing.

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — post the created Warehouse Receipt.
- `Warehouse.Receipt.Post.Preview` — simulate the post og inspect captured bók færslur.
- `Warehouse.Shipment.Create` / `Warehouse.Shipment.Post` — Útgående counterparts.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

