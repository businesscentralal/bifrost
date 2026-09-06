---
id: changelog-field-restore
title: "ChangeLog.Field.Restore"
sidebar_label: "ChangeLog.Field.Restore"
sidebar_position: 5
description: "Request and response contract for the ChangeLog.Field.Restore Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Restores a single field value from BC Change Log Entry by writing the entry's `Old Value` back via `FieldRef.Validate`. Only `Modification` entries are restorable. The write goes through the Bifrost change-log write guard, field/table write restrictions, and field-restriction checks. The actual write runs inside an isolated `Codeunit.Run` for clean error handling.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Not idempotent. If the current field value already equals the value to restore, the call fails with `ValueAlreadyMatchesErr`.

## Modes
Provide **one** of:
- **Mode 1 — by entry**: `entryNo` (table/field/record are derived from the Change Log Entry)
- **Mode 2 — point-in-time**: `tableId`/`tableName` + `fieldNo`/`fieldName` + `recordSystemId` + `restoreToDateTime` (restores from the latest Modification entry at or before that timestamp)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entryNo | BigInteger | Mode 1 | Change Log Entry No. to restore from |
| tableId / tableNumber / tableName | Int or Text | Mode 2 | Identifies the table |
| fieldNo / fieldName | Int or Text | Mode 2 | Identifies the field |
| recordSystemId | GUID | Mode 2 | SystemId of the record |
| restoreToDateTime | DateTime | Mode 2 | Point-in-time anchor |

## Request Examples
Mode 1:
```json
{ "type": "ChangeLog.Field.Restore", "data": { "entryNo": 42 } }
```
Mode 2:
```json
{
  "type": "ChangeLog.Field.Restore",
  "data": {
    "tableId": 18, "fieldNo": 2,
    "recordSystemId": "a1b2c3d4-...",
    "restoreToDateTime": "2024-06-09T12:00:00Z"
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "tableNo": 18, "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-...",
  "fieldNo": 2, "fieldName": "Name",
  "previousValue": "Acme Inc.",
  "restoredValue": "Acme",
  "fromEntryNo": 42,
  "entryDateTime": "2024-06-09T09:00:00Z"
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing required params | `Provide either entryNo (Mode 1) or tableName + recordSystemId + fieldNo + restoreToDateTime (Mode 2).` |
| recordSystemId missing in Mode 2 | `recordSystemId is required for point-in-time restore.` |
| Entry not found | `Change log entry {entryNo} not found.` |
| No entry for date | `No change log entry found for the specified record, field, and date.` |
| Not a Modification entry | `Only Modification entries can be restored.` |
| Field write-restricted | `Field {fieldNo} in table {tableId} is write-restricted.` |
| Table write-restricted | `Table {tableId} ({tableName}) is restricted from write operations.` |
| Field not writable | `Field {fieldNo} is not a writable field.` |
| Record not found | `Record with SystemId {systemId} in table {tableName} not found.` |
| No-op | `Field {fieldName} already has the value {currentValue} — nothing to restore.` |
| Blocked by write guard | `Field {fieldNo} in table {tableId} is not allowed by the change log write guard.` |
| Value conversion failure | `Cannot convert value to field type.` |

## Related Message Types
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.History`
- `ChangeLog.Records.Delta`

