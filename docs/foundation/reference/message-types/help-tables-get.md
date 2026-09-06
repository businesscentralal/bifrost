---
id: help-tables-get
title: "Help.Tables.Get"
sidebar_label: "Help.Tables.Get"
sidebar_position: 70
description: "Request and response contract for the Help.Tables.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns metadata for normal (non-obsolete) BC tables from `Table Metadata`. When no table identifier is supplied, returns all matching tables. When a table identifier is supplied, returns just that one.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution (optional)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
3. If none resolve, all normal tables are returned

> ⚠️ **Context-window warning:** Calling `Help.Tables.Get` without a table identifier returns **all** non-obsolete BC tables (typically thousands of rows). This will overflow the AI context window and the call will fail with a token-limit error. **Always supply a table name or number** unless you are doing a deliberate bulk discovery task — and even then, expect the result to be too large to process in a single AI turn.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | No | Restricts result to a single table |
| namespaceFilter | Text | No | Filters tables by AL namespace. Supports BC wildcards: `Microsoft.Sales.*` matches all Sales tables. |

## Recommended Discovery Workflow
When you do not know which tables exist, use a two-step approach:
```
Step 1 — discover available namespaces (lightweight):
  { "type": "Help.Namespaces.Get" }
  → { "namespaces": ["Microsoft.Sales.Customer", "Microsoft.Finance.GeneralLedger", ...] }

Step 2 — list tables in a namespace:
  { "type": "Help.Tables.Get", "data": { "namespaceFilter": "Microsoft.Sales.*" } }
  → { "result": [ { "id": 18, "name": "Customer", ... }, ... ] }
```

## Request Examples
Single table by name:
```json
{ "type": "Help.Tables.Get", "subject": "Customer" }
```
All tables in a namespace:
```json
{ "type": "Help.Tables.Get", "data": { "namespaceFilter": "Microsoft.Sales.*" } }
```

## Response Shape
```json
{
  "status": "Success",
  "result": [
    { "id": 18, "name": "Customer", "caption": "Customer", "dataPerCompany": true, "namespace": "Microsoft.Sales.Customer", "readRestricted": false, "writeRestricted": false }
  ]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Table ID |
| name | Text | Table name |
| caption | Text | Table caption in current language |
| dataPerCompany | Boolean | True when the table is per-company |
| namespace | Text | AL namespace of the table |
| readRestricted | Boolean | True when the table is blocked from `Data.Records.Get` (internal system tables such as `Bifrost Setup`, `Change Log Setup`, etc.). Restricted tables cannot be read via the generic data API. |
| writeRestricted | Boolean | True when the table is blocked from `Data.Records.Set`. Includes the read-restricted set plus `Bifrost Message` (read-allowed, write-blocked). |

## Related Message Types
- `Help.Namespaces.Get` — discover available AL namespaces before calling this type
- `Help.Fields.Get`
- `Help.TableRelations.Get`
- `Help.Permissions.Get`

