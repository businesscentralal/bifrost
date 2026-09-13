---
id: warehouse-pick-create
title: "Warehouse.Pick.Create"
sidebar_label: "Warehouse.Pick.Create"
sidebar_position: 144
description: "Beiðni- og svarsamningur fyrir Warehouse.Pick.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til a Warehouse Pick úr an fyrirliggjandi Warehouse Shipment. Wraps BC report 7318 `Whse.-Shipment - Create Pick` (the sama action invoked með *Create Pick* on the Warehouse Shipment page). The resulting `Warehouse Activity Header` (`Type = Pick`) er returned along með line totals.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Prerequisites

- The Warehouse Shipment verður að exist og have at least one line.
- The shipment's `Location Code` verður að point til a Location með `Require Pick = true` (typically a Directed Put-away og Pick / WMS location). On Locations með `Require Shipment = true, Require Pick = false`, no pick er needed — call `Warehouse.Shipment.Post` directly.
- Sufficient inventory verður að exist in the Uppruni bins so BC has something til pick.

## Identifying the Warehouse Shipment

Provide the shipment via the Bifrost Subject (GUID = SystemId, eða text = `No.`) eða via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Shipment Header`. |
| `whseShipmentNo` / `shipmentNo` / `no` | `No.` of the `Warehouse Shipment Header`. |

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `whseShipmentNo` | code[20] | One identifier áskilið | eða nota `shipmentNo` / `no` / `systemId` / Subject. |
| `assignedUserId` | code[50] | No | Applied til the created Warehouse Pick. Subject til skrifa-takmörkun on `Warehouse Activity Header."Assigned User ID"`. |
| `sortingMethod` | strengur | No | Case-insensitive Heiti úr BC enum `Whse. Activity Sorting Method` — currently: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). The Villa response Sýnir lista yfir the exact set gilt on your build. Subject til skrifa-takmörkun on `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | sanngildi | No (Sjálfgefið false) | ekki stutt in this API version. Sending `true` Skilar an Villa. |
| `doNotFillQtyToHandle` | sanngildi | No (Sjálfgefið false) | ekki stutt in this API version. Sending `true` Skilar an Villa. |

### Dæmi um beiðni
```json
{
  "whseShipmentNo": "WS001001",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "whseShipmentNo": "WS001001",
  "pickNo": "WPK000123",
  "pickSystemId": "00000000-0000-0000-0000-000000000000",
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking",
  "totalPickLines": 4,
  "totalQtyToHandle": 12,
  "message": "Warehouse Pick WPK000123 created from Shipment WS001001 with 4 lines."
}
```

þegar no `sortingMethod` er supplied, Svarið Skilar `"sortingMethod": "None"` (the BC enum's blank/whitespace caption er normalised til `None`).

## Bókunarheimild

None — pick creation does ekki register stock movement. The companion `Warehouse.Pick.Register` requires the `BIFROST WhsePost ori` heimild set.

## Reitur takmarkanir

áður en applying Kallandi-supplied values til the created Warehouse Pick, the implementation calls `Bifrost Field Access.IsFieldWriteRestricted` on:

- `Warehouse Activity Header."Assigned User ID"` (þegar `assignedUserId` er supplied)
- `Warehouse Activity Header."Sorting Method"` (þegar `sortingMethod` er supplied)

A restricted Reitur aborts Beiðnin með an Villa response — the pick still exists on disk; remove eða rerun án the restricted Færibreyta.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Shipment identifier must be specified ...` | No Subject og no identifier key in request JSON. |
| `Warehouse Shipment {id} does not exist.` | Supplied SystemId eða No. fannst ekki. |
| `Warehouse Shipment {n} has no lines to pick.` | Shipment header exists but has zero lines. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Gildi ekki in `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `assignedUserId` eða `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` eða `doNotFillQtyToHandle` supplied as `true`. |
| `No Warehouse Pick was created for ...` | BC report ran án Villur but produced no activity header (nothing til pick, pick already exists, location does ekki require a pick). |
| `Nothing to handle.` / `There is nothing to create.` | BC report Villa surfaced as Bifrost Villa — no available inventory in Uppruni bins. |

## Pitfalls

- **Pick already exists**: BC report 7318 silently produces nothing ef an opið Warehouse Pick fyrir the Shipment er already on disk. The wrapper surfaces this as `No Warehouse Pick was created for ...`. Inspect `Warehouse Activity Header` (`Type = Pick`, `Whse. Document No.` = your shipment) áður en deciding til retry.
- **No-pick locations**: ef the Shipment's `Location Code` has `Require Pick = false`, BC mun ekki create a pick — you get the sama `No Warehouse Pick was created for ...` Villa. Call `Warehouse.Shipment.Post` directly.
- **Insufficient inventory**: BC report 7318 aðeins Býr til lines fyrir what er currently available in the Uppruni bins, þar á meðal reservations against other skjöl. A shipment með `Quantity = 5` may produce a pick með `totalQtyToHandle < 5`. Always compare `totalQtyToHandle` against the shipment line totals áður en treating the call as fully tókst.
- **Bin-mandatory / WMS locations**: Locations með `Bin Mandatory = true` eða `Directed Put-away and Pick = true` require Uppruni bins til be configured og items til be put away. án put-away, the pick er empty og you get `No Warehouse Pick was created for ...`.
- **heimild fyrir `assignedUserId`**: The target user verður að already exist as a `Warehouse Employee` at the pick's `Location Code`. Otherwise BC raises `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Sorting list drift**: The enum `Whse. Activity Sorting Method` er extensible — Microsoft has historically added values. The list above reflects BC 27. ef `sortingMethod` er rejected, the Villa response contains the authoritative list fyrir your tenant.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC report 7318 exposes these on its request page aðeins. The wrapper rejects `true` til avoid silent loss; omit the keys (eða send `false`) fyrir Sjálfgefið BC behaviour.

## AI-Agent Guidance

þegar orchestrating this skilaboðategund úr an agent:

1. **Forgangsröð auðkenna er fixed**: Subject > `systemId` > `recordSystemId` > `id` > `whseShipmentNo` > `shipmentNo` > `no`. Pick exactly one; do ekki mix.
2. **Prefer SystemId over `No.`** fyrir repeatable calls — the No. series changes þegar a Warehouse Shipment er posted/deleted.
3. **Treat `status: "Success"` plus `totalPickLines == 0` as a soft Mistókst** — it means the pick exists but getur ekki move stock; do ekki chain til `Warehouse.Pick.Register`.
4. **Idempotency**: This skilaboðategund er **ekki** endurtekningarþolið. ef a transient Villa occurs eftir BC report 7318 ran but áður en Svarið was returned, a retry may create a second pick. Always look up fyrirliggjandi picks fyrir the Shipment áður en retrying.
5. **fyrir partial picks**: Pre-update `Quantity` / `Qty. Outstanding` on the Warehouse Shipment Lines áður en calling Pick.Create, eða modify the resulting Warehouse Activity Lines' `Qty. to Handle` via `Data.Records.Set` áður en calling `Warehouse.Pick.Register`.

## Workflow Chain

1. `Sales.Document.Release` (eða Transfer Order release)
2. `Warehouse.Shipment.Create`
3. **`Warehouse.Pick.Create`** — this skilaboðategund
4. `Warehouse.Pick.Register`
5. `Warehouse.Shipment.Post`

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — produces the input.
- `Warehouse.Pick.Register` — registers the pick eftir the warehouse worker has picked the items.
- `Warehouse.Shipment.Post` — final step eftir the pick er registered.
- `Data.Records.Get` — load hvaða Reitur on the resulting `Warehouse Activity Header` / `Warehouse Activity Line`.

