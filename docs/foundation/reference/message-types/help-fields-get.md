---
id: help-fields-get
title: "Help.Fields.Get"
sidebar_label: "Help.Fields.Get"
sidebar_position: 53
description: "Request and response contract for the Help.Fields.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns field metadata for a BC table. Only enabled, non-obsolete fields whose `Class` is `Normal`, `FlowField`, or `FlowFilter` are included. Optionally restrict the result to a list of field numbers; option/enum fields include their full enum value list.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution (table required)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
Errors if no table can be resolved.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | Yes (via JSON or subject) | Target table |
| fieldNumbers | Array of Integer | No | Restricts result to those field numbers, preserving order |

## Request Example
```json
{
  "type": "Help.Fields.Get",
  "subject": "Customer",
  "data": { "fieldNumbers": [1, 2, 18] }
}
```

## Response Shape
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
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Field No. |
| name | Text | Field name |
| jsonName | Text | Name as used in Data.Records.* JSON keys (e.g. `No_`, `BalanceLCY`) |
| caption | Text | Field caption in current language |
| class | Text | `Normal`, `FlowField`, or `FlowFilter` |
| type | Text | Field type name (e.g. `Code`, `Decimal`, `Option`) |
| len | Integer | Max length for text/code fields, otherwise 0 |
| isPartOfPrimaryKey | Boolean | True if part of the primary key |
| hasTableRelation | Boolean | True if `Table Relations Metadata` defines a relation on this field |
| readRestricted | Boolean | True if the current user is read-restricted on this field via `Bifrost Field Access` (restriction type `Both` or `Read`). `Data.Records.Get` silently drops such fields from the response. |
| writeRestricted | Boolean | True if the current user is write-restricted on this field via `Bifrost Field Access` (restriction type `Both` or `Write`). `Data.Records.Set` rejects writes to such fields. |
| enum | Array | Only for `Option` fields. Each item: `{ value, caption, ordinal }` |

## Related Message Types
- `Help.Tables.Get`
- `Help.TableRelations.Get`
- `Data.Records.Get`

