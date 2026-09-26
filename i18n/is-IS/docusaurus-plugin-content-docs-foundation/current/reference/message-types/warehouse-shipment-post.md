---
id: warehouse-shipment-post
title: "Warehouse.Shipment.Post"
sidebar_label: "Warehouse.Shipment.Post"
sidebar_position: 152
description: "Beiðni- og svarsamningur fyrir Warehouse.Shipment.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar a Warehouse Shipment (ship, optionally reikningur). Wraps BC's `Whse.-Post Shipment` (codeunit 5763) og Skilar the resulting Posted Whse. Shipment plus hvaða Posted Sales Shipments that were created.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Preconditions

Posting depends on the Location of the Warehouse Shipment lines:

- **`Require Pick = false`** — the Warehouse Shipment Line has `Qty. to Ship` already populated með `Warehouse.Shipment.Create`. Post immediately.
- **`Require Pick = true`** (þar á meðal Directed Put-away og Pick) — the Warehouse Shipment Line starts með `Qty. to Ship = 0`. A Warehouse Pick verður að be created, picked, og **registered** via `Warehouse.Pick.Create` then `Warehouse.Pick.Register` áður en this skilaboðategund mun succeed. án a registered pick BC Villur með `There is nothing to post because the document does not contain a quantity or amount.`

Manually writing `Qty. to Ship` on a `Warehouse Shipment Line` til bypass the pick step er rejected með BC (`Qty. to Ship must not be greater than 0 units ...`).

## Forgangsröð auðkenna

1. `subject` — GUID = `Warehouse Shipment Header.SystemId`, otherwise `Warehouse Shipment Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — `SystemId`.
3. JSON `shipmentNo` / `no` — `Warehouse Shipment Header."No."`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| identifier | various | **Yes** | Sjá Forgangsröð úrlausnar. |
| `invoice` | sanngildi | No | Sjálfgefið `false` (ship aðeins). þegar `true`, requires `BIFROST GL Post ori` in addition til `BIFROST WhsePost ori`. |

### Dæmi um beiðni
```json
{
  "shipmentNo": "WS001001",
  "invoice": true
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "shipmentNo": "WS001001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS001001",
  "postedWhseShipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo": "PS-SHP103001",
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001"
    }
  ]
}
```

`postedWhseShipmentNo` og `postedWhseShipmentSystemId` eru aðeins present þegar the underlying `Whse.-Post Shipment` produced a `Posted Whse. Shipment Header`. `postedDocuments` er derived úr `Posted Whse. Shipment Line`, de-duplicated með `(postedSourceDocument, postedSourceNo)`, og generalises across Uppruni types (Sales Order → Posted Sales Shipment, Transfer Order → Posted Transfer Shipment, etc.).

## Bókunarheimild

- **Always**: `BIFROST WhsePost ori` heimild set.
- **Additionally þegar `invoice = true`**: `BIFROST GL Post ori` heimild set.

## Reitur takmarkanir

No per-Reitur takmörkun check — the entire operation er gated með the heimild Stillir above.

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST WhsePost ori' permission set.` | Kallandi lacks the warehouse posting heimild. |
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | `invoice = true` og Kallandi lacks G/L posting. |
| `Warehouse Shipment Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, shipmentNo, no.` (`MissingParameter`); gefið en fannst ekki: `Warehouse Shipment Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Subject og JSON both empty. |
| `Warehouse Shipment {n} has no lines to post.` | Header exists með zero lines. |
| `There is nothing to post because the document does not contain a quantity or amount.` | All Warehouse Shipment Lines have `Qty. to Ship = 0`. At a `Require Pick = true` location this means no pick has been registered yet — Sjá Preconditions. |
| BC posting Villur | Bubble up úr `Whse.-Post Shipment` (e.g. opið pick exists, vöru tracking incomplete, posting dagsetning locked). |

## End-til-End Workflow

Sjá `Warehouse.Shipment.Create` help fyrir the full chain: `Sales.Document.Create` → `Data.Records.Set` (Sales Line) → `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` (þegar `Require Pick = true`) → `Warehouse.Shipment.Post`.

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — create the Warehouse Shipment úr Uppruni skjöl.
- `Warehouse.Pick.Create` — create the Warehouse Pick þegar `Require Pick = true`.
- `Warehouse.Pick.Register` — register the pick so `Qty. to Ship` er populated.
- `Sales.Document.Post` — fyrir the G/L reikningur side án the warehouse step.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

