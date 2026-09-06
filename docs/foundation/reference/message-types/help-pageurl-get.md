---
id: help-pageurl-get
title: "Help.PageUrl.Get"
sidebar_label: "Help.PageUrl.Get"
sidebar_position: 67
description: "Request and response contract for the Help.PageUrl.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns a deep-link URL to the card page for a specific record. Resolves the card page from the table's LookupPageId/DrillDownPageId and builds a client URL with the record's primary key in the filter.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution
1. Table: `tableName` / `tableNumber` / `tableNo` / `tableId` in JSON, or `subject` (required)
2. Record: `id` / `systemId` / `recordId` / `recordSystemId` in JSON, or a GUID `subject` (required)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | Yes (via JSON or subject) | Target table |
| id / systemId / recordId / recordSystemId | GUID | Yes (or GUID subject) | Record SystemId |

## Request Example
```json
{
  "type": "Help.PageUrl.Get",
  "subject": "Customer",
  "data": { "id": "a1b2c3d4-..." }
}
```

## Response Shape
```json
{ "status": "Success", "url": "https://businesscentral.dynamics.com/..." }
```

## Errors
Returned as `{ "status": "Error", "error": "..." }`.
| Condition | Error message |
|-----------|---------------|
| Table not supplied | `Table identifier is required. Provide tableName, tableNumber, tableNo, tableId, or subject.` |
| Record not supplied | `Record identifier is required. Provide id, systemId, recordId, recordSystemId, or a GUID subject.` |
| No card page or record not found | `No card page URL could be resolved for table '{table}' and record {systemId}.` |

## Related Message Types
- `Data.Records.Get`

