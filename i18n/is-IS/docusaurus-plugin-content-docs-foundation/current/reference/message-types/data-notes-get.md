---
id: data-notes-get
title: "Data.Notes.Get"
sidebar_label: "Data.Notes.Get"
sidebar_position: 15
description: "Beiðni- og svarsamningur fyrir Data.Notes.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar user-entered Athugasemdir (færslur in the BC `Record Link` tafla where Gerð = Note) fyrir færslur in a given tafla. sama færsla-loop, filtering og pagination as `Data.Records.Get` — but hver result row contains a `notes[]` fylki instead of `fields`.

**Stefna**: Útgående  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope.

## Beiðnibreytur

| Færibreyta | Gerð | Sjálfgefið | Athugasemdir |
|---|---|---|---|
| tafla key (Sjá above) | — | — | áskilið. |
| `tableView` | strengur | — | BC `SetView` filter til scope which færslur til walk. |
| `startDateTime` / `endDateTime` | ISO 8601 | — | Filter færslur með `SystemModifiedAt`. |
| `skip` / `take` | int / int | 0 / 100 | færsla pagination. All Athugasemdir fyrir hver returned færsla eru included. |

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "notes": [
        { "lineNo": 12345,
          "description": "Call follow-up",
          "note": "Called customer about delayed payment.",
          "created": "2025-06-15T10:30:00Z",
          "userId": "USER001" }
      ]
    },
    { "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "notes": [] }
  ]
}
```

færslur með no Athugasemdir eru still returned með `notes: []`. `noOfRecords` counts færslur (ekki Athugasemdir) og er the unpaginated total.

### Note fields

| Reitur | Uppruni |
|---|---|
| `lineNo` | `Record Link."Link ID"` — pass back til `Data.Notes.Set` til edit/delete. |
| `description` | `Record Link.Description` (short subject, ≤250 chars). |
| `note` | BLOB content (`Note` Reitur). |
| `created` | `Record Link.Created`, ISO 8601 UTC. |
| `userId` | `Record Link."User ID"`. |

## Dæmi (úr einingaprófum)

### Athugasemdir fyrir a single viðskiptamanni
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))" }
```

### All customers, paginated
```json
{ "tableName": "Customer", "skip": 10, "take": 5 }
```

### dagsetning range
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2025-06-30T23:59:59Z" }
```

## Villur

| Condition | Message |
|---|---|
| tafla fannst ekki | `Table {name} not found.` |
| lesa heimild denied | populated með `CheckTableReadPermission`. |

## Tengdar skilaboðategundir

- **Data.Notes.Set** — add / edit / delete Athugasemdir (writes the sama `Record Link` rows).
- **Data.Records.Get** — sama iteration/filtering, Skilar Reitur values instead of Athugasemdir.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

