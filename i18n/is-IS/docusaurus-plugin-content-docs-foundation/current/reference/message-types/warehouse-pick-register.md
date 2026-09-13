---
id: warehouse-pick-register
title: "Warehouse.Pick.Register"
sidebar_label: "Warehouse.Pick.Register"
sidebar_position: 145
description: "Beiðni- og svarsamningur fyrir Warehouse.Pick.Register Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Registers a Warehouse Pick. Wraps BC codeunit 7307 `Whse.-Activity-Register`. eftir registration the Uppruni `Warehouse Shipment Line` rows receive the picked quantity (`Qty. Picked` og `Qty. to Ship`), the pick header moves til history (`Registered Whse. Activity Hdr.`), og the originating Warehouse Shipment becomes eligible fyrir `Warehouse.Shipment.Post`.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Bókunarheimild

Requires `Bifrost Posting Type::Warehouse` — i.e. the `BIFROST WhsePost ori` heimild set on the message-task user. án it Beiðnin Skilar an Villa response og nothing er registered.

## Identifying the Warehouse Pick

Provide the pick via the Bifrost Subject (GUID = SystemId of the activity header, eða text = `No.`) eða via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Activity Header` (Gerð = Pick). |
| `pickNo` / `no` | `No.` of the `Warehouse Activity Header` (Gerð = Pick). |

## Pre-condition: Lines verður að Have Qty. til Handle

BC registers aðeins what the warehouse worker has confirmed picked. með Sjálfgefið `Warehouse.Pick.Create` populates `Qty. to Handle` on every line (the `doNotFillQtyToHandle = false` Sjálfgefið of the BC report). ef you call `Warehouse.Pick.Register` against a pick með zero `Qty. to Handle` on every line, BC raises `Nothing to register.`

til register a partial pick, fyrsta call `Data.Records.Set` on `Warehouse Activity Line` til update `Qty. to Handle` per line.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `pickNo` | code[20] | One identifier áskilið | eða nota `no` / `systemId` / Subject. |

### Dæmi um beiðni
```json
{ "pickNo": "WPK000123" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "pickNo": "WPK000123",
  "linesRegistered": 4,
  "totalQtyRegistered": 12,
  "shipmentNo": "WS001001",
  "shipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "registeredPickNo": "RWPK000123",
  "registeredPickSystemId": "00000000-0000-0000-0000-000000000000",
  "shipmentLines": [
    {
      "shipmentNo": "WS001001",
      "lineNo": 10000,
      "sourceDocument": "Sales Order",
      "sourceNo": "101028",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 2,
      "qtyPicked": 2,
      "qtyToShip": 2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK000123 (4 lines) registered against Warehouse Shipment WS001001."
}
```

`qtyOutstanding` mirrors the BC `Warehouse Shipment Line."Qty. Outstanding"` flow — it er `Quantity - Qty. Shipped`. Pick registration does **ekki** ship, so `qtyOutstanding` stays at the line `Quantity` until `Warehouse.Shipment.Post` runs.

## Reitur takmarkanir

None — this skilaboðategund does ekki accept hvaða Kallandi-supplied Reitur overrides.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Pick identifier must be specified ...` | No Subject og no identifier key in request JSON. |
| `Warehouse Pick {id} does not exist.` | Supplied SystemId eða No. fannst ekki, eða activity er ekki Gerð Pick. |
| `Warehouse Activity {n} is not of Type Pick.` | Activity exists but er a Put-away / Movement / Invt. Pick. |
| `Warehouse Pick {n} has no lines.` | Header exists með zero lines (shouldn't happen fyrir picks created með BC). |
| `Nothing to register.` | All lines have `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Bókunarheimild (BIFROST WhsePost ori) denied Beiðnin. |

## Pitfalls

- **Pick header disappears eftir registration**: On `Success` the `Warehouse Activity Header` row er deleted og a `Registered Whse. Activity Hdr.` row appears. A second `Warehouse.Pick.Register` call against the sama `pickNo` therefore Skilar `Warehouse Pick {n} does not exist.` — that er the Tókst indicator, ekki a Mistókst. lesa the history via `Data.Records.Get` on `Registered Whse. Activity Hdr.` (filter með `Whse. Activity No.`).
- **Activity Gerð filter**: `Warehouse Activity Header` er shared með Picks, Put-aways, Movements, og Invt. Picks. The wrapper Athugar `Type = Pick` og rejects others — but make sure the `pickNo` / SystemId you supply er genuinely a Pick.
- **Partial picks need `Data.Records.Set` fyrsta**: BC fills `Qty. to Handle` automatically þegar the pick er created. ef the warehouse worker picked less, update hver line's `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) áður en calling Register. Zero `Qty. to Handle` across all lines yields `Nothing to register.`
- **Both Take og Place lines**: BC pick lines come in pairs — one `Action Type = Take` og one `Action Type = Place` per Uppruni line. þegar updating `Qty. to Handle`, update **both** rows til the sama Gildi eða BC rejects the register með `Qty. to Handle (Base) in the line must be equal to ...`.
- **Uppruni Shipment verður að still be Released**: ef the Uppruni `Warehouse Shipment` was deleted/reopened eftir pick creation, registration fails. The wrapper surfaces the BC Villa text verbatim via `GetLastErrorText`.
- **Bókunarheimild**: The message-task user verður að have `BIFROST WhsePost ori` even though no inventory bók færslur eru produced með registration — BC still treats it as a warehouse posting action.
- **Does ekki ship**: Registration aðeins Uppfærir `Qty. Picked` og `Qty. to Ship` on the Warehouse Shipment Line — `Qty. Outstanding` er unchanged until `Warehouse.Shipment.Post` runs.

## AI-Agent Guidance

þegar orchestrating this skilaboðategund úr an agent:

1. **Forgangsröð auðkenna er fixed**: Subject > `systemId` > `recordSystemId` > `id` > `pickNo` > `no`. Pick exactly one.
2. **Capture `registeredPickSystemId` úr Svarið** ef you need til navigate til the history færsla afterwards — re-deriving it úr `pickNo` eftir registration requires a `Registered Whse. Activity Hdr.` lookup keyed on `Whse. Activity No.`.
3. **Treat `Warehouse Pick {n} does not exist.` on a known pick as evidence the pick was already registered** (the activity header moved til history). Confirm með reading `Registered Whse. Activity Hdr.` áður en retrying.
4. **Idempotency**: This skilaboðategund er **ekki** endurtekningarþolið — second tókst invocation against the sama `pickNo` er impossible because the header er gone. nota `Registered Whse. Activity Hdr.` til check whether registration already happened.
5. **Workflow continuation**: On `Success`, the originating Warehouse Shipment er ready fyrir `Warehouse.Shipment.Post`. Svarið includes `shipmentNo` og `shipmentSystemId` fyrir that chained call.

## Workflow Chain

1. `Sales.Document.Release` (eða Transfer Order release)
2. `Warehouse.Shipment.Create`
3. `Warehouse.Pick.Create`
4. **`Warehouse.Pick.Register`** — this skilaboðategund
5. `Warehouse.Shipment.Post`

## Tengdar skilaboðategundir

- `Warehouse.Pick.Create` — produces the input.
- `Warehouse.Shipment.Post` — call eftir registration til ship the Warehouse Shipment.
- `Data.Records.Set` on `Warehouse Activity Line` — til adjust `Qty. to Handle` áður en registering a partial pick.
- `Data.Records.Get` — load hvaða Reitur on the resulting `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line`.

