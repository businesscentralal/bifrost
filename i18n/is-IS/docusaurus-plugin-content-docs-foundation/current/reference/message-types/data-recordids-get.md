---
id: data-recordids-get
title: "Data.RecordIds.Get"
sidebar_label: "Data.RecordIds.Get"
sidebar_position: 17
description: "Beiðni- og svarsamningur fyrir Data.RecordIds.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar `{id, modifiedAt}` pairs fyrir færslur in a BC tafla — a lightweight version of `Data.Records.Get` fyrir incremental sync (drives a follow-up `Data.Records.Get` með `tableView` fyrir the IDs that actually changed).

**Stefna**: Útgående  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope (Heiti eða númer).

## Beiðnibreytur

| Færibreyta | Gerð | Sjálfgefið | Athugasemdir |
|---|---|---|---|
| tafla key (Sjá above) | — | — | áskilið. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | `0DT` / `CurrentDateTime` | Filter on `SystemModifiedAt`. |
| `tableView` | strengur | — | BC `SetView` syntax, e.g. `"WHERE(Blocked = CONST( ))"`. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. `noOfRecords` in response = unpaginated total. |

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "modifiedAt": "2026-02-15T14:30:00Z" }
  ]
}
```

## Dæmi (úr einingaprófum)

### Incremental delta með tafla view
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2027-12-31T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))" }
```

### Paginated
```json
{ "tableName": "Customer", "skip": 0, "take": 100 }
```

## Typical Sync Loop

1. Call `Data.RecordIds.Get` með `startDateTime` = síðasta tókst sync time.
2. fyrir hver returned `id`, call `Data.Records.Get` með `tableView = "WHERE(SystemId = CONST({guid}))"` (eða batch með composing an `IN` filter).
3. Persist max `modifiedAt` as the next high-water mark.

## Villur

| Condition | Message |
|---|---|
| tafla fannst ekki | `Table {name} not found.` |
| lesa heimild denied | populated með `CheckTableReadPermission` |

## Tengdar skilaboðategundir

- **Data.Records.Get** — full færsla data; follow-up step fyrir changed IDs.
- **Deleted.RecordIds.Get** — sama shape but fyrir deleted færslur (`deletedAt` instead of `modifiedAt`).
- **Help.Tables.Get** — tafla discovery.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

