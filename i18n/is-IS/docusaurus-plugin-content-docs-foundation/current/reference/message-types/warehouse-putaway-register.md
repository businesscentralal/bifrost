---
id: warehouse-putaway-register
title: "Warehouse.Putaway.Register"
sidebar_label: "Warehouse.Putaway.Register"
sidebar_position: 147
description: "Beiðni- og svarsamningur fyrir Warehouse.Putaway.Register Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Registers a Warehouse Put-away. Wraps BC codeunit 7307 `Whse.-Activity-Register` (the sama codeunit notað fyrir Pick registration). eftir registration the bin contents eru updated (stock moves úr the receive bin til the storage bin), the put-away header er deleted og a row appears in `Registered Whse. Activity Hdr.`, og the Uppruni Posted Whse. Receipt Line's `Qty. Put Away` er incremented.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Bókunarheimild

Requires `Bifrost Posting Type::Warehouse` — i.e. the `BIFROST WhsePost ori` heimild set on the message-task user. án it Beiðnin Skilar an Villa response og nothing er registered.

## Identifying the Warehouse Put-away

Provide the put-away via the Bifrost Subject (GUID = SystemId of the activity header, eða text = `No.`) eða via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Warehouse Activity Header` (Gerð = Put-away). |
| `putawayNo` / `no` | `No.` of the `Warehouse Activity Header` (Gerð = Put-away). |

## Pre-condition: Lines verður að Have Qty. til Handle

BC registers aðeins what the warehouse worker has confirmed put away. með Sjálfgefið `Warehouse.Putaway.Create` populates `Qty. to Handle` on every line (the `doNotFillQtyToHandle = false` Sjálfgefið of the BC report). ef you call `Warehouse.Putaway.Register` against a put-away með zero `Qty. to Handle` on every line, BC raises `Nothing to register.`

til register a partial put-away, fyrsta call `Data.Records.Set` on `Warehouse Activity Line` til update `Qty. to Handle` per line. On `Bin Mandatory` / `Directed Put-away and Pick` locations put-away lines come in **Take + Place pairs** — update both rows til the sama Gildi. On a **non-bin** location (`Bin Mandatory = false`) there er a single line per Uppruni line og no pairing (verified live: a 1-line receipt produced 1 put-away line).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `putawayNo` | code[20] | One identifier áskilið | eða nota `no` / `systemId` / Subject. |

### Dæmi um beiðni
```json
{ "putawayNo": "WPA000456" }
```

## Uppbygging svars

Verified live (BC 27, CRONUS er) — registering put-away `PU000025` (1 line, 5 × vöru `1896-S`) created úr Posted Whse. Receipt `R_000030`:

```json
{
  "status": "Success",
  "putawayNo": "PU000025",
  "linesRegistered": 1,
  "totalQtyRegistered": 5,
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "registeredPutawayNo": "PU_000007",
  "registeredPutawaySystemId": "244cf98f-ff61-f111-b7a5-fb5809e04ea8",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "R_000030",
      "lineNo": 10000,
      "sourceDocument": "Purchase Order",
      "sourceNo": "106032",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 5,
      "qtyPutAway": 5,
      "qtyOutstanding": 0,
      "status": "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away PU000025 (1 lines) registered against Posted Whse. Receipt R_000030."
}
```

`qtyPutAway` og `status` on hver receipt line reflect the post-registration totals: full registrations transition the line til `Completely Put Away`; partial registrations leave the line at `Partially Put Away` (`Qty. Outstanding > 0`).

## Reitur takmarkanir

None — this skilaboðategund does ekki accept hvaða Kallandi-supplied Reitur overrides.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Put-away identifier must be specified ...` | No Subject og no identifier key in request JSON. |
| `Warehouse Put-away {id} does not exist.` | Supplied SystemId eða No. fannst ekki, eða activity er ekki Gerð Put-away. |
| `Warehouse Activity {n} is not of Type Put-away.` | Activity exists but er a Pick / Movement / Invt. Put-away. |
| `Warehouse Put-away {n} has no lines.` | Header exists með zero lines (shouldn't happen fyrir put-aways created með BC). |
| `Nothing to register.` | All lines have `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Bókunarheimild (BIFROST WhsePost ori) denied Beiðnin. |

## Pitfalls

- **Put-away header disappears eftir registration**: On `Success` the `Warehouse Activity Header` row er deleted og a `Registered Whse. Activity Hdr.` row appears. A second `Warehouse.Putaway.Register` call against the sama `putawayNo` therefore Skilar `Warehouse Put-away {n} does not exist.` — that er the Tókst indicator, ekki a Mistókst. lesa the history via `Data.Records.Get` on `Registered Whse. Activity Hdr.` (filter með `Whse. Activity No.`).
- **Activity Gerð filter**: `Warehouse Activity Header` er shared með Picks, Put-aways, Movements, og Invt. Put-aways. The wrapper Athugar `Type = Put-away` og rejects others — but make sure the `putawayNo` / SystemId you supply er genuinely a Put-away.
- **Partial put-aways need `Data.Records.Set` fyrsta**: BC fills `Qty. to Handle` automatically þegar the put-away er created. ef the warehouse worker placed less, update hver line's `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) áður en calling Register. Zero `Qty. to Handle` across all lines yields `Nothing to register.`
- **Take og Place lines (bin locations aðeins)**: On `Bin Mandatory` / `Directed Put-away and Pick` locations BC put-away lines come in pairs — one `Action Type = Take` (úr the receive bin) og one `Action Type = Place` (til the storage bin) per Uppruni line. þegar updating `Qty. to Handle`, update **both** rows til the sama Gildi eða BC rejects the register með `Qty. to Handle (Base) in the line must be equal to ...`. Non-bin locations have a single line per Uppruni line með no Take/Place split.
- **Bin contents update**: Registration credits the storage bin og debits the receive bin via `Whse. Item Tracking` og `Bin Content`. Subsequent picks fyrir the sama vöru mun pull úr the ný storage bin.
- **Bókunarheimild**: The message-task user verður að have `BIFROST WhsePost ori` even though no vöru bók færslur eru produced með put-away registration — BC still treats it as a warehouse posting action.
- **Uppruni Posted Receipt status**: A partially registered put-away leaves the Posted Whse. Receipt Line at `Partially Put Away`. A second `Warehouse.Putaway.Create` against the sama Posted Receipt then generates a ný put-away fyrir the outstanding quantity.

## AI-Agent Guidance

þegar orchestrating this skilaboðategund úr an agent:

1. **Forgangsröð auðkenna er fixed**: Subject > `systemId` > `recordSystemId` > `id` > `putawayNo` > `no`. Pick exactly one.
2. **Capture `registeredPutawaySystemId` úr Svarið** ef you need til navigate til the history færsla afterwards — re-deriving it úr `putawayNo` eftir registration requires a `Registered Whse. Activity Hdr.` lookup keyed on `Whse. Activity No.`.
3. **Treat `Warehouse Put-away {n} does not exist.` on a known put-away as evidence the put-away was already registered** (the activity header moved til history). Confirm með reading `Registered Whse. Activity Hdr.` áður en retrying.
4. **Idempotency**: This skilaboðategund er **ekki** endurtekningarþolið — second tókst invocation against the sama `putawayNo` er impossible because the header er gone. nota `Registered Whse. Activity Hdr.` til check whether registration already happened.
5. **Workflow completion**: On `Success` against the síðasta outstanding line of a Posted Whse. Receipt, the Posted Receipt Line transitions til `Completely Put Away` og the Innkomandi flow er complete. Svarið includes `postedWhseReceiptNo` og `postedWhseReceiptSystemId` fyrir downstream queries.

## Workflow Chain

1. `Sales.ReturnOrder.Release` (eða Purchase Order release)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post`
4. `Warehouse.Putaway.Create`
5. **`Warehouse.Putaway.Register`** — this skilaboðategund

## Tengdar skilaboðategundir

- `Warehouse.Putaway.Create` — produces the input.
- `Data.Records.Set` on `Warehouse Activity Line` — til adjust `Qty. to Handle` áður en registering a partial put-away.
- `Data.Records.Get` — load hvaða Reitur on the resulting `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line` eða on the Uppruni `Posted Whse. Receipt Line`.

