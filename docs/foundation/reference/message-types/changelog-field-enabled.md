---
id: changelog-field-enabled
title: "ChangeLog.Field.Enabled"
sidebar_label: "ChangeLog.Field.Enabled"
sidebar_position: 3
description: "Request and response contract for the ChangeLog.Field.Enabled Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Reports whether a specific table field is covered by the BC Change Log Setup, and whether the Bifrost change-log write guard would allow restoring it.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int or Text | Yes | Identifies the table |
| fieldNo / fieldName | Int or Text | Yes | Identifies the field |

## Request Example
```json
{
  "type": "ChangeLog.Field.Enabled",
  "data": { "tableId": 18, "fieldNo": 2 }
}
```

## Response Shape
```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": true,
  "tableNo": 18, "tableName": "Customer",
  "fieldNo": 2, "fieldName": "Name",
  "fieldCovered": true,
  "fieldWriteGuardBypassed": false
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| changeLogEnabled | Boolean | BC global Change Log Activated flag |
| changelogWriteGuardEnabled | Boolean | Bifrost change-log write guard is enabled |
| fieldCovered | Boolean | Field is tracked by Change Log Setup (Insert/Modify/Delete) |
| fieldWriteGuardBypassed | Boolean | The write guard would allow writes to this field |

## Errors
| Condition | Error message |
|-----------|---------------|
| Unsupported field type | `Field type is not supported for change log tracking.` |

## Related Message Types
- `ChangeLog.Field.History`
- `ChangeLog.Field.Restore`
- `ChangeLog.Records.Delta`

