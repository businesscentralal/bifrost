---
id: changelog-records-delta
title: "ChangeLog.Records.Delta"
sidebar_label: "ChangeLog.Records.Delta"
sidebar_position: 6
description: "Beiðni- og svarsamningur fyrir ChangeLog.Records.Delta Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the distinct SystemIds of færslur that were inserted eða modified in a given tafla within a datetime range. Useful fyrir incremental sync — pair með `Data.Records.Get` til fetch the changed rows. aðeins `Insertion` og `Modification` færslur eru considered; deletions eru ekki included.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int eða Text | Yes | Identifies the tafla |
| startDateTime | DateTime | No | Range start (Sjálfgefið 0DT — beginning of time) |
| endDateTime | DateTime | No | Range end (Sjálfgefið CurrentDateTime) |
| fieldNumbers | heiltala fylki | No | Limit til changes on these fields; omit fyrir hvaða tracked Reitur |

## Dæmi um beiðni
```json
{
  "type": "ChangeLog.Records.Delta",
  "data": {
    "tableId": 18,
    "startDateTime": "2024-06-01T00:00:00Z",
    "endDateTime":   "2024-06-30T23:59:59Z",
    "fieldNumbers": [2, 5]
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "tableNo": 18, "tableName": "Customer",
  "fieldNumbers": [2, 5],
  "startDateTime": "2024-06-01T00:00:00Z",
  "endDateTime":   "2024-06-30T23:59:59Z",
  "totalCount": 2,
  "systemIds": ["a1b2c3d4-...", "e5f6a7b8-..."]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| Empty fieldNumbers fylki | `fieldNumbers must contain at least one integer when supplied.` |

## Tengdar skilaboðategundir
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.History`
- `ChangeLog.Field.Restore`
- `Data.Records.Get`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

