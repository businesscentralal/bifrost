---
id: changelog-field-history
title: "ChangeLog.Field.History"
sidebar_label: "ChangeLog.Field.History"
sidebar_position: 4
description: "Request and response contract for the ChangeLog.Field.History Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the current value of a field plus its full change history from BC Change Log Entry (table 405). The current value is emitted as `entryNo: 0` with `typeOfChange: "Current"`; historical entries follow, ordered by date/time descending.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution
1. `recordSystemId` in request JSON (via `EvaluateSystemId`)
2. Bifrost `subject` (GUID)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int or Text | Yes | Identifies the table |
| fieldNo / fieldName | Int or Text | Yes | Identifies the field |
| recordSystemId | GUID | Yes | SystemId of the record |

## Request Example
```json
{
  "type": "ChangeLog.Field.History",
  "data": {
    "tableId": 18, "fieldNo": 2,
    "recordSystemId": "a1b2c3d4-..."
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "tableNo": 18, "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-...",
  "fieldNo": 2, "fieldName": "Name", "fieldType": "Text",
  "history": [
    { "entryNo": 0, "dateAndTime": "2024-06-10T14:30:00Z", "typeOfChange": "Current", "oldValue": "", "newValue": "Acme Inc.", "userId": "JANE" },
    { "entryNo": 42, "dateAndTime": "2024-06-09T09:00:00Z", "typeOfChange": "Modification", "oldValue": "Acme", "newValue": "Acme Inc.", "userId": "JANE" }
  ],
  "totalCount": 2
}
```

## History Entry Fields
| Field | Type | Description |
|-------|------|-------------|
| entryNo | BigInteger | Change Log Entry No., or 0 for the current live value |
| dateAndTime | DateTime | Change Log Entry timestamp (or SystemModifiedAt for `entryNo: 0`) |
| typeOfChange | Text | `Current`, `Insertion`, `Modification`, or `Deletion` |
| oldValue / newValue | Text | Field values as stored in Change Log Entry |
| userId | Text | BC User Name (or SystemModifiedBy for `entryNo: 0`) |

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing identifier | `recordSystemId or a subject GUID is required.` |
| Unsupported field type | `Field type is not supported for change log tracking.` |
| Field read-restricted | `Field {fieldNo} in table {tableName} is read-restricted.` |
| Table read-restricted | `Read permission denied for table {tableId}.` |
| Record not found | `Record with SystemId {systemId} in table {tableName} not found.` |

## Related Message Types
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.Restore`
- `ChangeLog.Records.Delta`

