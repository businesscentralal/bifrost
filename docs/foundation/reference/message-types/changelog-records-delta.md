---
id: changelog-records-delta
title: "ChangeLog.Records.Delta"
sidebar_label: "ChangeLog.Records.Delta"
sidebar_position: 6
description: "Request and response contract for the ChangeLog.Records.Delta Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the distinct SystemIds of records that were inserted or modified in a given table within a datetime range. Useful for incremental sync — pair with `Data.Records.Get` to fetch the changed rows. Only `Insertion` and `Modification` entries are considered; deletions are not included.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int or Text | Yes | Identifies the table |
| startDateTime | DateTime | No | Range start (default 0DT — beginning of time) |
| endDateTime | DateTime | No | Range end (default CurrentDateTime) |
| fieldNumbers | Integer Array | No | Limit to changes on these fields; omit for any tracked field |

## Request Example
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

## Response Shape
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

## Errors
| Condition | Error message |
|-----------|---------------|
| Empty fieldNumbers array | `fieldNumbers must contain at least one integer when supplied.` |

## Related Message Types
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.History`
- `ChangeLog.Field.Restore`
- `Data.Records.Get`

