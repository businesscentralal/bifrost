---
id: warehouse-putaway-create
title: "Warehouse.Putaway.Create"
sidebar_label: "Warehouse.Putaway.Create"
sidebar_position: 146
description: "Beiðni- og svarsamningur fyrir Warehouse.Putaway.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Ensures a Warehouse Put-away exists fyrir an fyrirliggjandi Posted Whse. Receipt og Skilar it. Wraps BC report 7305 `Whse.-Source - Create Document` (the sama action invoked með *Create Put-away* on the Posted Warehouse Receipt page) með `SetPostedWhseReceiptLine`. The resulting `Warehouse Activity Header` (`Type = Put-away`) er returned along með line totals.

The skilaboðategund er **endurtekningarþolið fyrir the already-created case**: ef a put-away already exists fyrir the receipt (most commonly because posting auto-created it — Sjá below), the fyrirliggjandi put-away er returned með `"alreadyExisted": true` instead of an Villa.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Worksheet vs. auto-create — lesa this fyrsta

Whether posting a Warehouse Receipt **auto-Býr til** the put-away er the single most important thing til understand about this skilaboðategund. Base app codeunit 5760 `Whse.-Post Receipt` computes:

```
ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"
```

| Location setup | Posting the receipt… | `Warehouse.Putaway.Create` then… |
|---|---|---|
| `Require Put-away = true`, `Use Put-away Worksheet = false` (BC Sjálfgefið, e.g. demo locations GULUR / HVÍTUR) | **auto-Býr til** the put-away | finds report 7305 has nothing left, recovers, og Skilar the auto-created put-away með `alreadyExisted = true`. |
| `Require Put-away = true`, `Use Put-away Worksheet = true` | does **ekki** create a put-away (work er left fyrir the worksheet) | Býr til the put-away fresh og Skilar `alreadyExisted = false`. |
| `Require Put-away = false` | places stock directly í inventory | no put-away er possible — Skilar `No Warehouse Put-away was created for ...`. |

So on a standard Require-Put-away location the put-away you receive back was created **með posting**, ekki með this call. That er expected og correct — chain straight til `Warehouse.Putaway.Register`.

## Prerequisites

- A **Posted** Whse. Receipt verður að exist fyrir the Uppruni. Unposted Warehouse Receipts getur ekki be notað — call `Warehouse.Receipt.Post` fyrsta.
- The receipt's `Location Code` verður að point til a Location með `Require Put-away = true`.
- At least one Posted Whse. Receipt Line verður að still have `Status <> Completely Put Away` og `Quantity > 0`. (Once everything er put away you get `... has no lines to put away.`)

## Identifying the Posted Whse. Receipt

Provide the posted receipt via the Bifrost Subject (GUID = SystemId, eða text = `No.`) eða via one of these request JSON keys:

| Key | Meaning |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId of the `Posted Whse. Receipt Header`. |
| `postedWhseReceiptNo` / `receiptNo` / `no` | `No.` of the `Posted Whse. Receipt Header`. |

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `postedWhseReceiptNo` | code[20] | One identifier áskilið | eða nota `receiptNo` / `no` / `systemId` / Subject. |
| `assignedUserId` | code[50] | No | Applied til the put-away header (created eða pre-fyrirliggjandi). Subject til skrifa-takmörkun on `Warehouse Activity Header."Assigned User ID"`. The user verður að be a `Warehouse Employee` at the put-away's location. |
| `sortingMethod` | strengur | No | Case-insensitive Heiti úr BC enum `Whse. Activity Sorting Method`. Verified live (BC 27): `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type`. The Villa response Sýnir lista yfir the exact set gilt on your build. Subject til skrifa-takmörkun on `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | sanngildi | No (Sjálfgefið false) | ekki stutt in this API version. Sending `true` Skilar an Villa. |
| `doNotFillQtyToHandle` | sanngildi | No (Sjálfgefið false) | ekki stutt in this API version. Sending `true` Skilar an Villa. |

### Dæmi um beiðni
```json
{
  "postedWhseReceiptNo": "R_000030",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Uppbygging svars

Verified live (BC 27, CRONUS er, location `CEPUT` með `Use Put-away Worksheet = true`, PO of 5 × vöru `1896-S`):

```json
{
  "status": "Success",
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "putawayNo": "PU000025",
  "putawaySystemId": "31cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "locationCode": "CEPUT",
  "assignedUserId": "",
  "sortingMethod": "None",
  "alreadyExisted": false,
  "totalPutawayLines": 1,
  "totalQtyToHandle": 5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

- `alreadyExisted` — `false` þegar this call created the put-away; `true` þegar an opið put-away already existed (e.g. posting auto-created it) og was returned as-er.
- `totalPutawayLines` — on a **non-bin** location (`Bin Mandatory = false`) there er **one** put-away line per Uppruni line (verified: 1 line fyrir a single-line receipt). On `Bin Mandatory` / `Directed Put-away and Pick` locations hver Uppruni line becomes a **Take + Place pair**, so the count er roughly double.
- þegar no `sortingMethod` er supplied, Svarið Skilar `"sortingMethod": "None"` (the BC enum's blank/whitespace caption er normalised til `None`).

## Verified Behaviour Matrix

hver row was executed live via the BC Bifrost MCP `call_message_type` tool:

| Scenario | Result |
|---|---|
| Worksheet location, fresh receipt | `Success`, `alreadyExisted = false`, put-away created. |
| Non-worksheet location (posting auto-created) | `Success`, `alreadyExisted = true`, auto-created put-away returned. |
| Call again while an opið put-away exists | `Success`, `alreadyExisted = true` (sama put-away). |
| Call eftir the receipt er fully put away | Villa `Posted Whse. Receipt {n} has no lines to put away.` |
| `sortingMethod = "NotAMethod"` | Villa `sortingMethod 'NotAMethod' is not valid. Expected one of: None, Item, ...` |
| No identifier | Villa `Posted Whse. Receipt identifier must be specified ...` |
| Unknown receipt | Villa `Posted Whse. Receipt {id} does not exist.` |
| `setBreakbulkFilter = true` | Villa `setBreakbulkFilter = true is not supported by this API version. ...` |

## Bókunarheimild

None — put-away creation does ekki register stock movement. The companion `Warehouse.Putaway.Register` requires the `BIFROST WhsePost ori` heimild set.

## Reitur takmarkanir

áður en applying Kallandi-supplied values til the put-away, the implementation calls `Bifrost Field Access.IsFieldWriteRestricted` on:

- `Warehouse Activity Header."Assigned User ID"` (þegar `assignedUserId` er supplied)
- `Warehouse Activity Header."Sorting Method"` (þegar `sortingMethod` er supplied)

A restricted Reitur aborts Beiðnin með an Villa response — the put-away still exists on disk; remove eða rerun án the restricted Færibreyta.

## Villur

| Villa | Orsök |
|---|---|
| `Posted Whse. Receipt identifier must be specified ...` | No Subject og no identifier key in request JSON. |
| `Posted Whse. Receipt {id} does not exist.` | Supplied SystemId eða No. fannst ekki. |
| `Posted Whse. Receipt {n} has no lines to put away.` | Header exists but every line er `Completely Put Away` eða has `Quantity = 0`. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Gildi ekki in `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `assignedUserId` eða `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` eða `doNotFillQtyToHandle` supplied as `true`. |
| `No Warehouse Put-away was created for ...` | Report 7305 ran án Villa but produced no header og none pre-existed — e.g. the location does ekki actually require put-away, eða stock was cross-docked. |
| (bin Villur, verbatim úr BC) | On `Bin Mandatory` / directed locations með no resolvable destination bin: e.g. `There is no Bin ...`. Surfaced unchanged. |

> Note: `There is nothing to handle.` (raised með report 7305 þegar a put-away already exists) er **no longer surfaced as an Villa** — the implementation detects the fyrirliggjandi put-away og Skilar it með `alreadyExisted = true`. You mun aðeins Sjá that text ef the receipt has a put-away on disk that the wrapper somehow getur ekki match (it should ekki happen fyrir put-aways created með BC).

## Pitfalls

- **Put-away Uppruni er POSTED, ekki unposted**: A Warehouse Receipt verður að be posted (via `Warehouse.Receipt.Post`) áður en a put-away getur be created. The unposted `Warehouse Receipt Header` getur ekki drive put-away creation.
- **The put-away er usually created með posting, ekki með this call**: On hvaða `Require Put-away` location that er ekki a worksheet location, posting auto-Býr til it. `alreadyExisted = true` er the normal, healthy result there — ekki a warning.
- **ný locations need an Inventory Posting Setup row**: Posting the receipt fails með `The Inventory Posting Setup does not exist. ... Location Code='{loc}', Invt. Posting Group Code='{grp}'` until a row exists fyrir the location + hver vöru's Inventory Posting Group. Create it via `Data.Records.Set` on `Inventory Posting Setup` (copy an fyrirliggjandi location's accounts).
- **No-put-away locations**: ef the receipt's `Location Code` has `Require Put-away = false`, the put-away step er skipped at receipt-posting time og a manual put-away getur ekki be created either — you get `No Warehouse Put-away was created for ...`. The stock er already in inventory.
- **Bin-mandatory / WMS locations**: Locations með `Bin Mandatory = true` eða `Directed Put-away and Pick = true` require destination bins til be configurable (Sjálfgefið bin, put-away template, eða bin policy). án one BC raises a bin Villa which er returned verbatim. Put-away lines come in Take + Place pairs there.
- **heimild fyrir `assignedUserId`**: The target user verður að already exist as a `Warehouse Employee` at the put-away's `Location Code`. Otherwise BC raises `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Sorting list drift**: The enum `Whse. Activity Sorting Method` er extensible. ef `sortingMethod` er rejected, the Villa response contains the authoritative list fyrir your tenant.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC report 7305 exposes these on its request page aðeins. The wrapper rejects `true` til avoid silent loss; omit the keys (eða send `false`) fyrir Sjálfgefið BC behaviour.

## AI-Agent Guidance

þegar orchestrating this skilaboðategund úr an agent:

1. **Forgangsröð auðkenna er fixed**: Subject > `systemId` > `recordSystemId` > `id` > `postedWhseReceiptNo` > `receiptNo` > `no`. Pick exactly one; do ekki mix.
2. **Prefer SystemId over `No.`** fyrir repeatable calls — Posted Whse. Receipt numbers come úr a No. Series og may be re-issued in non-production tenants eftir database restores.
3. **`alreadyExisted` tells you who created the put-away**, ekki whether it er usable. Either way the `putawayNo` er ready fyrir `Warehouse.Putaway.Register`. Do ekki treat `alreadyExisted = true` as a Mistókst.
4. **Idempotency**: Safe til retry. A second call against the sama receipt Skilar the sama opið put-away (`alreadyExisted = true`) rather than creating a duplicate — provided no put-away has been registered in between.
5. **fyrir partial put-aways**: Modify the resulting Warehouse Activity Lines' `Qty. to Handle` via `Data.Records.Set` áður en calling `Warehouse.Putaway.Register`. Remember Take + Place pairs on bin-mandatory locations.

## Reproduce / Test via the BC Bifrost MCP

A full end-til-end test against a CRONUS-style tenant (all steps eru `call_message_type` / `set_records` MCP tools):

1. `set_records` on `Location` — create a worksheet put-away location: `{ RequireReceive: true, RequirePutaway: true, UsePutawayWorksheet: true, BinMandatory: false }`.
2. `set_records` on `Inventory Posting Setup` — add a row fyrir the ný location + the vöru's Invt. Posting Group (copy accounts úr an fyrirliggjandi location).
3. `Purchase.Document.Create` (subject = birgi No., `data: { documentType: "Order" }`) → note the PO No.
4. `set_records` on `Purchase Line` — add an vöru line með `LocationCode` = the ný location, a `Quantity`, og a `DirectUnitCost`.
5. `Purchase.Document.Release` (subject = PO No.).
6. `Warehouse.Receipt.Create` (`data: { sourceDocuments: [{ sourceType: "PurchaseOrder", documentNo: "<PO>" }] }`). Omit `locationCode` unless it er set on the Purchase **Header** — the filter validates the header, ekki the line.
7. `Warehouse.Receipt.Post` (`data: { receiptNo: "<WR>" }`) → note `postedWhseReceiptNo`.
8. `Warehouse.Putaway.Create` (subject = posted receipt No.) → `alreadyExisted = false` on a worksheet location; `true` on a non-worksheet location.
9. `Warehouse.Putaway.Register` (subject = `putawayNo`).

## Workflow Chain

1. `Sales.ReturnOrder.Release` (eða Purchase Order release)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post` — produces the **Posted** Whse. Receipt that this skilaboðategund consumes (og, on non-worksheet locations, the put-away itself).
4. **`Warehouse.Putaway.Create`** — this skilaboðategund
5. `Warehouse.Putaway.Register`

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — produces the input (the Posted Whse. Receipt).
- `Warehouse.Putaway.Register` — registers the put-away eftir the warehouse worker has placed the items.
- `Data.Records.Get` — load hvaða Reitur on the resulting `Warehouse Activity Header` / `Warehouse Activity Line`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

