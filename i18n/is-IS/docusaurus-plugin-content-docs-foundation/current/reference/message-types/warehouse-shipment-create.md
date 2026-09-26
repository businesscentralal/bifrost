---
id: warehouse-shipment-create
title: "Warehouse.Shipment.Create"
sidebar_label: "Warehouse.Shipment.Create"
sidebar_position: 151
description: "Beiðni- og svarsamningur fyrir Warehouse.Shipment.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til one Warehouse Shipment per Uppruni skjal supplied. Wraps BC's `Get Source Doc. Outbound` (codeunit 5752) — hver Sales Order eða Útgående Transfer Order produces its own Warehouse Shipment Header at the Uppruni's location.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Location Prerequisites

The Uppruni skjal's `Location Code` verður að point til a Location where `Require Shipment = true`. Otherwise BC produces the Uppruni skjöl directly úr the Sales Order / Transfer Order án going through a Warehouse Shipment.

Additional behaviour depending on the Location setup:

| Location flags | Effect on Warehouse Shipment line |
|---|---|
| `Require Shipment = true`, `Require Pick = false` | `Qty. to Ship` er populated úr the Uppruni line. `Warehouse.Shipment.Post` getur run immediately. |
| `Require Shipment = true`, `Require Pick = true` | `Qty. to Ship` starts at 0. Create og register a Warehouse Pick með `Warehouse.Pick.Create` then `Warehouse.Pick.Register` áður en `Warehouse.Shipment.Post` mun accept the skjal. Trying til set `Qty. to Ship` manually er blocked með BC (`Qty. to Ship must not be greater than 0 units ...`). |
| `Directed Put-away and Pick = true` (e.g. WMS bin-mandatory location) | sama as Require Pick — nota `Warehouse.Pick.Create` then `Warehouse.Pick.Register` áður en posting. |

### Discovery — find shipment-áskilið locations

nota `Data.Records.Get` on `Location` (tafla 14) með `tableView` `WHERE(Require Shipment=CONST(true))` til enumerate the candidates. Inspect the `RequirePick` og `DirectedPutawayandPick` fields til anticipate whether posting needs a registered pick.

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call inserts ný Warehouse Shipment Headers úr the relevant númer series.
- hver Uppruni skjal Býr til a separate header (BC standard behaviour).
- Uppruni skjöl that eru already on an opið Warehouse Shipment, have no quantity til ship, eða have an virkt pick mun fail með `No Warehouse Shipment was created`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `sourceDocuments` | fylki | **Yes** | ein eða fleiri `{ sourceType, documentNo }` færslur. |
| `sourceDocuments[].sourceType` | strengur | **Yes** | `SalesOrder` eða `TransferOrder` (case-insensitive). |
| `sourceDocuments[].documentNo` | code[20] | **Yes** | The Uppruni skjal's `No.`. |
| `locationCode` | code[10] | No | ef supplied, validates hver Uppruni uses the sama location. Subject til skrifa-takmörkun on `Warehouse Shipment Header."Location Code"`. |
| `assignedUserId` | code[50] | No | Applied til every created header eftir creation. |
| `postingDate` | dagsetning | No | Format 9. Applied til every created header eftir creation. |

### Dæmi um beiðni
```json
{
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "SalesOrder", "documentNo": "1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfShipments": 2,
  "shipments": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WS001001",
      "locationCode": "WHITE",
      "assignedUserId": "ADMIN",
      "sourceType": "SalesOrder",
      "sourceDocumentNo": "1001",
      "linesCreated": 3
    }
  ]
}
```

## Bókunarheimild

None — creation does ekki post. The companion `Warehouse.Shipment.Post` requires the `BIFROST WhsePost ori` heimild set.

## Reitur takmarkanir

- `Warehouse Shipment Header."Location Code"` — providing `locationCode` while this Reitur er skrifa-restricted er denied.

## Villur

| Villa | Orsök |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Request vantar the fylki eða fylki empty. |
| `Source #{n} is missing sourceType or documentNo (both required).` | One of the færslur lacks a Gildi. |
| `Unsupported sourceType '{value}'. Expected: SalesOrder, TransferOrder.` | Uppruni Gerð ekki recognised. |
| `Sales Order/Transfer Order '{no}' not found.` | skjal does ekki exist. |
| `... is not Released.` | Uppruni verður að be Released áður en warehouse shipment creation. |
| `... uses location '{x}' which does not match the requested locationCode '{y}'.` | þegar `locationCode` filter er supplied. |
| `Location '{x}' (from ...) does not require shipment routing` | Location card has `Require Shipment = false`. |
| `No Warehouse Shipment was created for ...` | Uppruni already on a shipment, no qty remaining, eða virkt pick. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` blocks `locationCode`. |

## End-til-End Workflow

Concrete sequence til go úr a viðskiptamanni til a posted shipment (values úr a CRONUS-style demo).

1. **Create the Sales Order** — `Sales.Document.Create`
```json
{ "documentType": "Order", "no": "10000" }
```
Capture `result[0].primaryKey.No_` (e.g. `"101028"`).

2. **Add a Sales Line at the shipment-áskilið Location** — `Data.Records.Set` on tafla `37` (`Sales Line`).
```json
{
  "tableName": "Sales Line",
  "data": [{
    "primaryKey": { "DocumentType": "Order", "DocumentNo_": "101028", "LineNo_": 10000 },
    "fields": { "Type": "Item", "No_": "1896-S", "LocationCode": "GULUR", "Quantity": 2 }
  }]
}
```

3. **Release the order** — `Sales.Document.Release`
```json
{ "orderNo": "101028" }
```

4. **Create the Warehouse Shipment** — `Warehouse.Shipment.Create`
```json
{ "sourceDocuments": [ { "sourceType": "SalesOrder", "documentNo": "101028" } ] }
```
Capture `shipments[0].no` (e.g. `"SH000004"`).

5. **ef the location requires a pick** — call `Warehouse.Pick.Create` fyrir `SH000004`, optionally adjust line-level `Qty. to Handle` via `Data.Records.Set` on `Warehouse Activity Line`, then call `Warehouse.Pick.Register`. Both message types eru documented separately.

6. **Post the shipment** — `Warehouse.Shipment.Post`
```json
{ "shipmentNo": "SH000004", "invoice": false }
```

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Post` — post the created Warehouse Shipment.
- `Warehouse.Pick.Create` — create the Warehouse Pick þegar `Require Pick = true`.
- `Warehouse.Pick.Register` — register the pick so `Qty. to Ship` er populated.
- `Data.Records.Get` — load hvaða Reitur on the resulting `Warehouse Shipment Header` / `Warehouse Shipment Line`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

