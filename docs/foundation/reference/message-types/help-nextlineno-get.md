---
id: help-nextlineno-get
title: "Help.NextLineNo.Get"
sidebar_label: "Help.NextLineNo.Get"
sidebar_position: 66
description: "Request and response contract for the Help.NextLineNo.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the next available `Line No.` for a table whose last primary-key field is an Integer (Sales Line, Gen. Journal Line, Job Journal Line, etc.). Resolves the parent record either by an `id` (SystemId) or by supplying the parent primary key fields, then finds the highest existing line number and adds the increment.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution
1. Table: `tableName` / `tableNumber` / `tableNo` / `tableId` in request JSON, or `subject` (required)
2. Parent record: `id` in request JSON (takes precedence) **or** `primaryKey` object whose keys match parent PK field JSON names

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | Yes (via JSON or subject) | Target line table |
| id | GUID | One of `id` or `primaryKey` | SystemId of any existing line under the parent |
| primaryKey | Object | One of `id` or `primaryKey` | Parent PK fields keyed by JSON field name (e.g. `DocumentType`, `DocumentNo_`) |
| increment | Integer | No | Step added to the last line number, default 10000, must be > 0 |

## Request Examples
Mode A (primaryKey):
```json
{
  "type": "Help.NextLineNo.Get",
  "subject": "Sales Line",
  "data": {
    "primaryKey": { "DocumentType": "Order", "DocumentNo_": "SO-1023" }
  }
}
```
Mode B (id of any existing line):
```json
{
  "type": "Help.NextLineNo.Get",
  "subject": "Sales Line",
  "data": { "id": "a1b2c3d4-...", "increment": 1000 }
}
```

## Response Shape
`primaryKey` should echo the parent PK fields and adds the resolved line number field with the next value.
```json
{
  "status": "Success",
  "primaryKey": { "DocumentType": "Order", "DocumentNo_": "SO-1023", "LineNo_": 50000 }
}
```

> ⚠️ **Known behavior — parent not found:** When the parent document does not exist (no lines match the filter), `LineNo_` is correctly returned as `increment` (default 10000). However, the other `primaryKey` fields in the response reflect BC default field values — e.g. the first enum ordinal for Option fields (such as `"DocumentType": "Quote"`) and an empty string for Code/Text — rather than the values you supplied. **Always use your input `primaryKey` values as the canonical parent key, not the echoed response values.** This is a known implementation limitation.


## Errors
| Condition | Error message |
|-----------|---------------|
| Last PK field is not Integer | `The last primary key field of table '{table}' ({field}) is not an Integer field.` |
| Less than 2 PK fields | `Table '{table}' must have at least two primary key fields.` |
| Neither `primaryKey` nor `id` supplied | `Either 'primaryKey' or 'id' must be provided.` |
| Missing required PK field in `primaryKey` | `Missing value for primary key field '{field}'.` |
| SystemId not found | `Record with SystemId '{guid}' not found in table '{table}'.` |
| `increment` &lt;= 0 | `Increment must be greater than zero.` |
| No read permission | `You do not have read permission on table '{table}'.` |
| Unknown enum value in PK | `Invalid value '{value}' for enum field '{field}'.` |

## Related Message Types
- `Data.Records.Set`
- `Help.Fields.Get`

