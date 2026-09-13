---
id: help-tablerelations-get
title: "Help.TableRelations.Get"
sidebar_label: "Help.TableRelations.Get"
sidebar_position: 69
description: "Beiðni- og svarsamningur fyrir Help.TableRelations.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar foreign-key relationships defined on a specified BC tafla Reitur, þar á meðal all conditional branches that resolve til different target töflur based on a discriminator Reitur Gildi. Svarið einnig includes a `relatedTo` fylki listing reverse relations (fields in other töflur that reference the specified Reitur).

Backed með the `Table Relations Metadata` system tafla — the aðeins BC runtime Uppruni exposing every conditional relation branch (unlike the simpler `Field.RelationTableNo` property).

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution
tafla (áskilið):
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`

Reitur (áskilið):
1. Request JSON: `fieldId` eða `fieldNo` (heiltala)
2. Request JSON: `fieldName` (resolved against the tafla)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | Yes (via JSON eða subject) | Target tafla |
| fieldId / fieldNo | heiltala | Yes (one of) | Target Reitur númer |
| fieldName | Text | Yes (one of) | Target Reitur Heiti |

## Dæmi um beiðni
```json
{
  "type": "Help.TableRelations.Get",
  "data": { "tableName": "Sales Line", "fieldName": "No." }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "tableId": 37,
  "tableName": "Sales Line",
  "relationCount": 2,
  "relations": [
    {
      "tableId": 37, "fieldNo": 6, "fieldName": "No.", "fieldJsonName": "No_",
      "relationNo": 1,
      "relatedTableId": 15, "relatedTableName": "G/L Account",
      "relatedFieldNo": 0, "relatedFieldName": "(Primary Key)", "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "Const",
      "conditionFieldNo": 5, "conditionFieldName": "Type", "conditionFieldJsonName": "Type",
      "conditionValue": " "
    }
  ],
  "relatedToCount": 0,
  "relatedTo": []
}
```

## Top-Level Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` |
| tableId | heiltala | Resolved Uppruni tafla ID |
| tableName | Text | Uppruni tafla Heiti |
| relationCount | heiltala | númer of færslur in `relations` |
| relations | fylki | Outgoing foreign keys on the specified Reitur |
| relatedToCount | heiltala | númer of færslur in `relatedTo` |
| relatedTo | fylki | Reverse relations — other fields referencing this Reitur |

## Relation hlutur (sama shape in `relations` og `relatedTo`)
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| tableId | heiltala | Uppruni tafla ID (owner of the foreign key) |
| fieldNo | heiltala | Uppruni Reitur númer |
| fieldName | Text | Uppruni Reitur Heiti |
| fieldJsonName | Text | Uppruni Reitur Heiti as a JSON key (as notað in Data.Records.* JSON) |
| relationNo | heiltala | Branch númer distinguishing multiple conditional branches on the sama Reitur |
| relatedTableId | heiltala | Target tafla ID |
| relatedTableName | Text | Target tafla Heiti |
| relatedFieldNo | heiltala | Target Reitur númer (0 = primary key) |
| relatedFieldName | Text | Target Reitur Heiti; `(Primary Key)` þegar `relatedFieldNo = 0` |
| relatedFieldJsonName | Text | Target Reitur Heiti as a JSON key |
| conditionType | Text | `TableFilter`, `Const`, `Filter`, `Field`, eða empty (unconditional) |
| conditionFieldNo | heiltala | Condition Reitur númer (0 ef none) |
| conditionFieldName | Text | Condition Reitur Heiti (empty ef none) |
| conditionFieldJsonName | Text | Condition Reitur Heiti as a JSON key |
| conditionValue | Text | Gildi that triggers this relation branch |

## Examples úr Tests
- `{ "tableName": "Customer", "fieldName": "Country/Region Code" }` — one relation til `Country/Region`, `fieldJsonName = Country_RegionCode`
- `{ "tableName": "Sales Line", "fieldName": "No." }` — multiple conditional branches keyed off `Type`
- `{ "tableName": "Country/Region", "fieldName": "Code" }` — `relatedTo` populated (referenced með viðskiptamanni, birgi, etc.)
- `{ "tableName": "Customer", "fieldName": "Name" }` — `relationCount: 0`, empty `relations`

## Villur
Raised as AL runtime Villur (ekki returned as JSON).
| Scenario | Villa |
|----------|-------|
| tafla ekki resolved | Standard `EvaluateTableId` Villa |
| No Reitur identifier provided | Contains the text `field identifier` |
| `fieldName` fannst ekki in tafla | Standard `EvaluateFieldNo` Villa |

## Tengdar skilaboðategundir
- `Help.Tables.Get`
- `Help.Fields.Get`
- `Data.Records.Get`

