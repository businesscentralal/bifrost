---
id: deleted-records-get
title: "Deleted.Records.Get"
sidebar_label: "Deleted.Records.Get"
sidebar_position: 23
description: "Beiðni- og svarsamningur fyrir Deleted.Records.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar full færsla snapshots fyrir færslur previously deleted úr a BC tafla. Snapshots come úr the Bifrost Delete Log; the Uppbygging svars matches `Data.Records.Get` so fyrirliggjandi parsers work unchanged.

**Stefna**: Útgående  **Efnisgerð**: `text/json`

## Prerequisite Setup

In **Bifrost Delete Setup**, the Uppruni tafla verður að have **Store færsla** enabled — án it no snapshot er captured og Svarið mun be empty fyrir that tafla. Reitur-level access takmarkanir (`Bifrost Field Access`) eru honoured.

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## Beiðnibreytur

| Færibreyta | Gerð | Sjálfgefið | Athugasemdir |
|---|---|---|---|
| tafla key (Sjá above) | — | — | áskilið. |
| `fieldNumbers` | int[] | — | Restrict Svarreitir. Omit fyrir all stored fields. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | — | Filter með deletion timestamp. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. |

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 25,
  "result": [
    { "id": "a1b2c3d4-...",
      "primaryKey": { "No_": "CUST001" },
      "fields": { "Name": "John Smith", "EMail": "john@example.com" } }
  ]
}
```

Identical shape til `Data.Records.Get`. sama Reitur-Heiti normalization rules apply (`No.` → `No_`, etc.).

## Examples

### Deleted customers in a dagsetning range
```json
{ "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime":   "2024-01-31T23:59:59Z" }
```

### Specific fields aðeins
```json
{ "tableNo": 18, "fieldNumbers": [1, 2, 5, 6], "take": 50 }
```

### Page through deletions
```json
{ "tableName": "Sales Header", "skip": 100, "take": 50 }
```

## Villur

| Condition | Resolution |
|---|---|
| lesa heimild denied on Uppruni tafla | Grant tafla lesa til the calling user. |
| Empty result fyrir deleted færslur you know existed | Enable **Store færsla** in Bifrost Delete Setup fyrir the tafla. Snapshots eru aðeins captured úr the moment Store færsla er enabled. |
| `Table {x} cannot be read via this API` | The tafla er innri til Bifrost. |

## Tengdar skilaboðategundir

- **Deleted.RecordIds.Get** — lighter; Skilar aðeins `id` + `deletedAt`. Works even þegar Store færsla er off.
- **Data.Records.Get** — current (non-deleted) færslur, sama shape.
- **CSV.DeletedRecords.Get** — sama data as CSV fyrir compliance exports.

