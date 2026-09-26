---
id: warehouse-shipment-previewpost
title: "Warehouse.Shipment.PreviewPost"
sidebar_label: "Warehouse.Shipment.PreviewPost"
sidebar_position: 153
description: "Beiðni- og svarsamningur fyrir Warehouse.Shipment.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting a Warehouse Shipment og Skilar the bók færslur that **would** be produced — án writing anything til the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Whse.-Post Shipment (Yes/No)` subscriber, captures the in-memory færslur via `Posting Preview Event Handler`, then enumerates every populated tafla úr `FillDocumentEntry`. Typical previewed töflur include `Item Ledger Entry`, `Value Entry`, `Posted Whse. Shipment Header`, `Posted Whse. Shipment Line`, `Sales Shipment Header`, `Sales Shipment Line`, plus `Sales Invoice Header`, `Sales Invoice Line`, `G/L Entry`, `VAT Entry`, `Cust. Ledger Entry` fyrir the reikningur pass. hver row er serialized through `Bifrost Preview Helper` so consumers getur pick which fields they care about.

**Important — reikningur flag er fixed.** BC's `Whse.-Post Shipment (Yes/No)` preview subscriber forces `Invoice = true` fyrir the simulated post. This skilaboðategund therefore always reports the full **Ship + reikningur** impact regardless of the Warehouse Shipment header's settings. Svarið `invoice` Reitur er therefore always `true`.

Skilar `rollback: true` so callers know the database was untouched. einnig pre-computes the LCY balance og the distinct G/L `Document No.` values that would appear on the register.

**Stefna**: Innkomandi (lesa-aðeins — all changes rolled back)  **Efnisgerð**: `text/markdown`

Response er wrapped as a markdown skjal around a fenced ```json``` block so it renders inline in chat clients; the JSON inside er the structured payload below.

## Shipment Identification Order

fyrsta match wins:
1. `subject` envelope attribute er a GUID → header SystemId.
2. `subject` envelope attribute non-empty text → header `No.`.
3. `data.systemId` / `data.recordSystemId` / `data.id` → header SystemId.
4. `data.shipmentNo` / `data.no` → header `No.`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `shipmentNo` | strengur | Sjá above | Warehouse Shipment `No.` (Code[20]). |
| `no` | strengur | Sjá above | Alias fyrir `shipmentNo`. |
| `systemId` / `recordSystemId` / `id` | strengur (GUID) | Sjá above | Warehouse Shipment Header SystemId. |

### Dæmi um beiðni
```json
{ "shipmentNo": "WS00001" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting warehouse shipment WS00001 (2 lines, Ship + Invoice) would create 10 ledger entries across 6 tables. G/L impact is balanced.",
  "shipmentNo": "WS00001",
  "locationCode": "WHITE",
  "invoice": true,
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedNumbers": ["INV00012"],
  "totals": { "balanced": true, "totalDebitLCY": 250.0, "totalCreditLCY": 250.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "-5", "LocationCode": "WHITE" }
        }
      ]
    },
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "tableCaption": "G/L Entry",
      "entryCount": 4,
      "entries": []
    }
  ]
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `rollback` | bool | Always `true` fyrir this skilaboðategund. |
| `summary` | strengur | One-line human-readable recap. |
| `shipmentNo` / `locationCode` | strengur | Identifying header fields. |
| `invoice` | bool | Always `true` — BC's preview subscriber forces Ship + reikningur. |
| `linesToPost` | int | Warehouse Shipment Lines fed í the preview. |
| `postingDate` | strengur | `Posting Date` of the shipment header. |
| `lcyCode` | strengur | `GLSetup."LCY Code"`. |
| `predictedNumbers` | strengur[] | Distinct `Document No.` values across the previewed G/L færslur (typically the future Sales reikningur No., Posted Whse. Shipment No., etc.). May contain the literal `"***"` þegar BC's preview engine masks an unassigned númer-series Gildi. |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| `totals.totalDebitLCY` / `totalCreditLCY` | tugabrot | Aggregated úr the previewed G/L færslur. |
| `preview[]` | fylki | One element per populated bók / posted-skjal tafla that BC would skrifa til. |
| `preview[].tableId` / `tableName` | int / strengur | BC tafla identification. |
| `preview[].tableCaption` | strengur | BC `RecordRef.Caption` fyrir the tafla (display Heiti). |
| `preview[].entryCount` | int | númer of færslur that would be inserted í this tafla. |
| `preview[].entries[]` | fylki | Per-færsla objects með `id` (placeholder SystemId GUID), `primaryKey` (hlutur of PK Reitur-Heiti → Gildi), og `fields` (all serialized fields). Reitur names follow the sama normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` eru commonly `"***"` þegar BC masks an unassigned númer-series. Subscribe til `OnGetPreviewFieldNames` til control which fields appear; subscribe til `OnPrecalculateFlowFields` til pre-compute FlowFields áður en serialization. |

## Dæmi (úr einingaprófum)

úr `Whse Ship. Prev. Post Tests` (codeunit 95439):
- `PreviewPost_PostableShipment_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, og that the shipment lines remain eftir the preview (no commit).
- `PreviewPost_PostableShipment_DoesNotPostShipment` — verifies no `Posted Whse. Shipment Header` row er actually persisted.
- `PreviewPost_PostableShipment_ReturnsContextAndPreviewArray` — verifies the shipment context fields og that `preview[]` contains at least one populated tafla.

## Villur

**BC validation Villur propagate verbatim** til Kallandinn. The catch-all below er aðeins notað þegar the preview subscriber runs cleanly but produces zero captured færslur.

| Villa | Orsök |
|---|---|
| `Warehouse Shipment Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, shipmentNo, no.` (`MissingParameter`); gefið en fannst ekki: `Warehouse Shipment Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier was supplied. |
| `Warehouse Shipment {no} has no lines to post.` | Header exists but has no lines. |
| `There is nothing to post because the document does not contain a quantity or amount.` | Every line has `Qty. to Ship = 0`. On WMS locations (`Require Pick = true`) this happens þegar no warehouse pick has been registered yet — the pick registration er what populates `Qty. to Ship`. Sjá Operational Athugasemdir. |
| `Posting preview failed and no entries were captured. The shipment cannot be posted in its current state.` | Rare catch-all — aðeins fires þegar the BC subscriber completes án raising but writes no færslur. |

## Operational Athugasemdir

- **WMS locations require a registered pick fyrsta.** On a location með `Require Pick = true` (e.g. CRONUS `WHITE` / `GULUR`), the Warehouse Shipment lines start með `Qty. to Ship = 0`. The warehouse pick verður að be created **og registered** áður en previewing — pick registration er what writes `Qty. to Ship` back onto the shipment lines.
- **Locations með `Require Shipment = true` og `Require Pick = false`** behave like a basic shipping flow: `Qty. to Ship` er populated þegar the shipment line er created, so the preview runs directly án a pick step.
- **reikningur flag er fixed at `true`.** The Ship + reikningur impact er always reported regardless of how you would post in production. til preview Ship-aðeins behaviour, nota the Uppruni skjal's own posting preview (e.g. `Sales.Order.PreviewPost` once available, eða post the shipment með `Warehouse.Shipment.Post` eftir registering picks).

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — create a Warehouse Shipment úr a Uppruni skjal.
- `Warehouse.Shipment.Post` — commit the actual post (með eða án reikningur).
- `Finance.GeneralJournal.PreviewPost` — sama pattern fyrir the general dagbók.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

