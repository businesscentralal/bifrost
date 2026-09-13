---
id: help-fields-get
title: "Help.Fields.Get"
sidebar_label: "Help.Fields.Get"
sidebar_position: 53
description: "Beiðni- og svarsamningur fyrir Help.Fields.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar Reitur metadata fyrir a BC tafla. aðeins enabled, non-obsolete fields whose `Class` er `Normal`, `FlowField`, eða `FlowFilter` eru included. Optionally restrict the result til a list of Reitur numbers; option/enum fields include their full enum Gildi list.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution (tafla áskilið)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
Villur ef no tafla getur be resolved.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | Yes (via JSON eða subject) | Target tafla |
| fieldNumbers | fylki of heiltala | No | Restricts result til those Reitur numbers, preserving order |

## Dæmi um beiðni
```json
{
  "type": "Help.Fields.Get",
  "subject": "Customer",
  "data": { "fieldNumbers": [1, 2, 18] }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "result": [
    {
      "id": 1, "name": "No.", "jsonName": "No_", "caption": "No.",
      "class": "Normal", "type": "Code", "len": 20,
      "isPartOfPrimaryKey": true, "hasTableRelation": false,
      "readRestricted": false, "writeRestricted": false
    },
    {
      "id": 132, "name": "Application Method", "jsonName": "ApplicationMethod", "caption": "Application Method",
      "class": "Normal", "type": "Option", "len": 0,
      "isPartOfPrimaryKey": false, "hasTableRelation": false,
      "readRestricted": false, "writeRestricted": true,
      "enum": [
        { "value": "Manual", "caption": "Manual", "ordinal": 0 },
        { "value": "Apply to Oldest", "caption": "Apply to Oldest", "ordinal": 1 }
      ]
    }
  ]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| id | heiltala | Reitur No. |
| Heiti | Text | Reitur Heiti |
| jsonName | Text | Heiti as notað in Data.Records.* JSON keys (e.g. `No_`, `BalanceLCY`) |
| caption | Text | Reitur caption in current language |
| class | Text | `Normal`, `FlowField`, eða `FlowFilter` |
| Gerð | Text | Reitur Gerð Heiti (e.g. `Code`, `Decimal`, `Option`) |
| len | heiltala | Max length fyrir text/code fields, otherwise 0 |
| isPartOfPrimaryKey | sanngildi | True ef part of the primary key |
| hasTableRelation | sanngildi | True ef `Table Relations Metadata` defines a relation on this Reitur |
| readRestricted | sanngildi | True ef the current user er lesa-restricted on this Reitur via `Bifrost Field Access` (takmörkun Gerð `Both` eða `Read`). `Data.Records.Get` silently drops such fields úr Svarið. |
| writeRestricted | sanngildi | True ef the current user er skrifa-restricted on this Reitur via `Bifrost Field Access` (takmörkun Gerð `Both` eða `Write`). `Data.Records.Set` rejects writes til such fields. |
| enum | fylki | aðeins fyrir `Option` fields. hver vöru: `{ value, caption, ordinal }` |

## Tengdar skilaboðategundir
- `Help.Tables.Get`
- `Help.TableRelations.Get`
- `Data.Records.Get`

