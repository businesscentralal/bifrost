---
id: deleted-recordids-get
title: "Deleted.RecordIds.Get"
sidebar_label: "Deleted.RecordIds.Get"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir Deleted.RecordIds.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar `{id, deletedAt}` pairs úr the Bifrost Delete Log — the deletion equivalent of `Data.RecordIds.Get`, intended til drive incremental delete-sync án payload cost. **Does ekki require Store færsla** til be enabled.

**Stefna**: Útgående  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## Beiðnibreytur

| Færibreyta | Gerð | Sjálfgefið | Athugasemdir |
|---|---|---|---|
| tafla key (Sjá above) | — | — | áskilið. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | — | Filter með deletion timestamp. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. Keep `take` ≤ 1000 fyrir safety. |

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 250,
  "result": [
    { "id": "a1b2c3d4-...", "deletedAt": "2024-01-15T14:30:00Z" }
  ]
}
```

`noOfRecords` er the unpaginated total. `deletedAt` er ISO 8601 UTC.

## Typical Delete-Sync Loop

1. Call `Deleted.RecordIds.Get` með `startDateTime` = síðasta delete-sync high-water mark.
2. fyrir hver returned `id`, remove the matching row úr the consumer.
3. Persist the max `deletedAt` as the next high-water mark.
4. ef you einnig need the deleted **Reitur values** fyrir those IDs (og Store færsla er enabled), follow up með `Deleted.Records.Get`.

## Examples

### Deleted customers in dagsetning range
```json
{ "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime":   "2024-01-31T23:59:59Z" }
```

### Pagination
```json
{ "tableNo": 18, "skip": 100, "take": 100 }
```

## Villur

| Condition | Message |
|---|---|
| lesa heimild denied | populated með `CheckTableReadPermission` |
| ógilt tafla | `Table {name} not found.` |

## Tengdar skilaboðategundir

- **Deleted.Records.Get** — full snapshot per deleted færsla (requires Store færsla).
- **Data.RecordIds.Get** — sama shape fyrir current (non-deleted) færslur.
- **CSV.DeletedRecords.Get** — CSV export fyrir compliance.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

