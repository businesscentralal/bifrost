---
id: help-tablerelations-get
title: "Help.TableRelations.Get"
sidebar_label: "Help.TableRelations.Get"
sidebar_position: 69
description: "Request and response contract for the Help.TableRelations.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns foreign-key relationships defined on a specified BC table field, including all conditional branches that resolve to different target tables based on a discriminator field value. The response also includes a `relatedTo` array listing reverse relations (fields in other tables that reference the specified field).

Backed by the `Table Relations Metadata` system table — the only BC runtime source exposing every conditional relation branch (unlike the simpler `Field.RelationTableNo` property).

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution
Table (required):
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`

Field (required):
1. Request JSON: `fieldId` or `fieldNo` (integer)
2. Request JSON: `fieldName` (resolved against the table)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | Yes (via JSON or subject) | Target table |
| fieldId / fieldNo | Integer | Yes (one of) | Target field number |
| fieldName | Text | Yes (one of) | Target field name |

## Request Example
```json
{
  "type": "Help.TableRelations.Get",
  "data": { "tableName": "Sales Line", "fieldName": "No." }
}
```

## Response Shape
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
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` |
| tableId | Integer | Resolved source table ID |
| tableName | Text | Source table name |
| relationCount | Integer | Number of entries in `relations` |
| relations | Array | Outgoing foreign keys on the specified field |
| relatedToCount | Integer | Number of entries in `relatedTo` |
| relatedTo | Array | Reverse relations — other fields referencing this field |

## Relation Object (same shape in `relations` and `relatedTo`)
| Field | Type | Description |
|-------|------|-------------|
| tableId | Integer | Source table ID (owner of the foreign key) |
| fieldNo | Integer | Source field number |
| fieldName | Text | Source field name |
| fieldJsonName | Text | Source field name as a JSON key (as used in Data.Records.* JSON) |
| relationNo | Integer | Branch number distinguishing multiple conditional branches on the same field |
| relatedTableId | Integer | Target table ID |
| relatedTableName | Text | Target table name |
| relatedFieldNo | Integer | Target field number (0 = primary key) |
| relatedFieldName | Text | Target field name; `(Primary Key)` when `relatedFieldNo = 0` |
| relatedFieldJsonName | Text | Target field name as a JSON key |
| conditionType | Text | `TableFilter`, `Const`, `Filter`, `Field`, or empty (unconditional) |
| conditionFieldNo | Integer | Condition field number (0 if none) |
| conditionFieldName | Text | Condition field name (empty if none) |
| conditionFieldJsonName | Text | Condition field name as a JSON key |
| conditionValue | Text | Value that triggers this relation branch |

## Examples from Tests
- `{ "tableName": "Customer", "fieldName": "Country/Region Code" }` — one relation to `Country/Region`, `fieldJsonName = Country_RegionCode`
- `{ "tableName": "Sales Line", "fieldName": "No." }` — multiple conditional branches keyed off `Type`
- `{ "tableName": "Country/Region", "fieldName": "Code" }` — `relatedTo` populated (referenced by Customer, Vendor, etc.)
- `{ "tableName": "Customer", "fieldName": "Name" }` — `relationCount: 0`, empty `relations`

## Errors
Raised as AL runtime errors (not returned as JSON).
| Scenario | Error |
|----------|-------|
| Table not resolved | Standard `EvaluateTableId` error |
| No field identifier provided | Contains the text `field identifier` |
| `fieldName` not found in table | Standard `EvaluateFieldNo` error |

## Related Message Types
- `Help.Tables.Get`
- `Help.Fields.Get`
- `Data.Records.Get`

