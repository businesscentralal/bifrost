---
id: change-log
title: "Change log message types"
sidebar_position: 10
---

This document covers the three message types that expose Business Central's Change Log
for field-level audit browsing, restoration, and coverage checks.

---

## Overview

| Message Type | Direction | Description |
|---|---|---|
| `ChangeLog.Field.History` | Outbound (Read) | Returns current value + full modification history for a single field on a record |
| `ChangeLog.Field.Restore` | Inbound (Write) | Restores a field to a previous value from the Change Log (by entry number or point-in-time) |
| `ChangeLog.Field.Enabled` | Outbound (Read) | Checks whether a field is covered by BC Change Log modification tracking |
| `ChangeLog.Records.Delta` | Outbound (Read) | Returns distinct SystemIds of records changed (Insert/Modify) in a table within a date/time range, optionally filtered to fields |

**Prerequisite:** The BC Change Log feature must be configured for the relevant tables and fields
(`Administration → Change Log Setup → Tables`). Without Change Log entries there is no history to browse or restore.

**Typical workflow:**
1. Call `ChangeLog.Field.Enabled` to confirm a field is tracked.
2. Call `ChangeLog.Field.History` to browse modifications and pick the target `entryNo`.
3. Call `ChangeLog.Field.Restore` with that `entryNo` to write the value back.

---

## ChangeLog.Field.History

**Direction:** Outbound  
**Object IDs:** Codeunit 10078000 (`ChangeLog Field History Impl`), Codeunit 10078001 (`ChangeLog Field History Help`)

### Purpose

Returns the current live value of a field together with all Change Log Entry records for
that field on a specific record, ordered from the most recent to the oldest.

The response always starts with a synthetic **Current** entry at `entryNo = 0` showing the
live field value. This makes it easy for callers to compare the current state against the
historical entries without a separate lookup.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.History",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2}"
}
```

#### Input Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | string / integer | Yes | Target table — name (e.g. `"Customer"`) or number (e.g. `18`). |
| `recordSystemId` / `systemId` / `id` | GUID string | Yes* | SystemId of the record. |
| `fieldNo` / `fieldId` / `fieldName` | integer / string | Yes | The field to retrieve history for. |

*If `recordSystemId` is missing from the data payload, the Bifrost `subject` attribute is
used as a GUID fallback.

### Response Format

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldType": "Text",
  "history": [
    {
      "entryNo": 0,
      "dateAndTime": "2026-03-28T14:22:00.000Z",
      "typeOfChange": "Current",
      "oldValue": "",
      "newValue": "Contoso Ltd.",
      "userId": "ADMIN"
    },
    {
      "entryNo": 56789,
      "dateAndTime": "2026-03-10T09:00:00.000Z",
      "typeOfChange": "Modification",
      "oldValue": "Contoso Inc.",
      "newValue": "Contoso Ltd.",
      "userId": "ADMIN"
    },
    {
      "entryNo": 45001,
      "dateAndTime": "2025-11-15T11:30:00.000Z",
      "typeOfChange": "Modification",
      "oldValue": "Contoso",
      "newValue": "Contoso Inc.",
      "userId": "JANE"
    }
  ],
  "totalCount": 3
}
```

#### Top-Level Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | Text | `Success` or `Error` |
| `tableNo` | Integer | Table number |
| `tableName` | Text | Table name |
| `recordSystemId` | Text | Record SystemId (GUID without braces) |
| `fieldNo` | Integer | Field number |
| `fieldName` | Text | Field name |
| `fieldType` | Text | Data type (`Text`, `Code`, `Decimal`, `Date`, etc.) |
| `history` | Array | Change entries, newest first. Index 0 is always the current live state. |
| `totalCount` | Integer | Number of entries in `history` (including the `entryNo=0` synthetic entry) |

#### History Entry Fields

| Field | Type | Description |
|---|---|---|
| `entryNo` | BigInteger | Change Log Entry No. `0` = current live state (synthetic). Use `entryNo > 0` with `ChangeLog.Field.Restore`. |
| `dateAndTime` | DateTime | ISO 8601 timestamp. For `entryNo=0` this is `SystemModifiedAt` of the record. |
| `typeOfChange` | Text | `Current` (index 0 only), `Insertion`, `Modification`, or `Deletion` |
| `oldValue` | Text | Value before the change. Empty for `entryNo=0`. |
| `newValue` | Text | Value after the change. For `entryNo=0` this is the live field value. |
| `userId` | Text | User who made the change. For `entryNo=0` resolved from `SystemModifiedBy` GUID. |

#### Error Cases

| Error | Cause |
|---|---|
| `Table not found` | Invalid table name or number |
| `recordSystemId or a subject GUID is required` | No record identifier provided |
| `Field identifier required` | No `fieldNo`, `fieldId`, or `fieldName` given |
| `Field read-restricted` | Field is blocked in Field Access ori |
| `Record not found` | No record with the given SystemId |

---

## ChangeLog.Field.Restore

**Direction:** Inbound (Write)  
**Object IDs:** Codeunit 10078071 (`ChgLog Field Restore Impl ori`), Codeunit 10077926 (`ChgLog Field Restore Help ori`)

### Purpose

Writes a previous field value back to the live Business Central record. The value is taken
from the `Old Value` of the chosen Change Log entry. The restore is performed using
`Validate()` + `Modify(true)` so all field-level business logic triggers fire normally.

Supports two modes:

| Mode | Identifier | Description |
|---|---|---|
| **1 — By Entry Number** | `entryNo` | Restores the `Old Value` of a specific Change Log Entry |
| **2 — By Point-in-Time** | `restoreToDateTime` | Finds the most recent `Modification` entry at or before the timestamp and restores its `Old Value` |

### Mode 1: By Entry Number

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"entryNo\":56789}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `entryNo` | Yes | Change Log Entry No. from `ChangeLog.Field.History`. Must be > 0. |

### Mode 2: By Point-in-Time

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2,\"restoreToDateTime\":\"2026-02-10T09:15:00Z\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table |
| `recordSystemId` | Yes | SystemId (GUID) of the record |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to restore |
| `restoreToDateTime` | Yes | ISO 8601 timestamp — finds the most recent `Modification` entry at or before this time |

### Response Format

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "previousValue": "Contoso Ltd.",
  "restoredValue": "Contoso Inc.",
  "fromEntryNo": 56789,
  "entryDateTime": "2026-02-10T09:15:00.000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `status` | Text | `Success` or `Error` |
| `tableNo` | Integer | Table number |
| `tableName` | Text | Table name |
| `recordSystemId` | Text | Record SystemId (GUID without braces) |
| `fieldNo` | Integer | Field number |
| `fieldName` | Text | Field name |
| `previousValue` | Text | Field value immediately before the restore |
| `restoredValue` | Text | Value written back to the record |
| `fromEntryNo` | BigInteger | Change Log Entry No. used as the restore source |
| `entryDateTime` | DateTime | Timestamp of the Change Log entry (ISO 8601) |

### Safety Guards

The following conditions must all be satisfied or the restore is rejected:

- Entry type must be `Modification` — Insertion and Deletion entries cannot be restored
- Target record must still exist
- Field must be a writable (Normal class) field — FlowFields and FlowFilters are rejected
- Field must not be write-restricted (Field Access ori)
- Table must not be restricted from write operations (Bifrost Setup)
- Field must be allowed by the ChangeLog Write Guard setting in Bifrost Setup
- Restore value must be convertible to the field data type
- Current field value must differ from the restore value (identical values return an error, no write occurs)

### Error Cases

| Error | Cause |
|---|---|
| `Change log entry not found` | Invalid `entryNo` |
| `No change log entry found for the specified record, field, and date` | Mode 2: no `Modification` entry at or before the requested timestamp |
| `Only Modification entries can be restored` | Entry type is `Insertion` or `Deletion` |
| `Record not found` | Target record no longer exists |
| `Field is write-restricted` | Field blocked by Field Access ori |
| `Field is not a writable field` | FlowField or FlowFilter |
| `Cannot convert value to field type` | Type mismatch during `Evaluate` |
| `Field already has the value — nothing to restore` | Current value equals restore value; no write attempted |
| `Table is restricted from write operations` | Blocked by Bifrost Setup data-record restrictions |
| `Field is not allowed by the change log write guard` | Blocked by the ChangeLog Write Guard in Bifrost Setup |
| `recordSystemId is required for point-in-time restore` | Mode 2 called without a record identifier |
| `Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime` | Neither Mode 1 nor Mode 2 parameters present |

---

## ChangeLog.Field.Enabled

**Direction:** Outbound  
**Object IDs:** Codeunit 10078069 (`ChgLog FieldEnabled Impl ori`), Codeunit 10077924 (`ChgLog FieldEnabled Help ori`)

### Purpose

Checks whether:
1. The BC Change Log feature is globally activated.
2. The ChangeLog Write Guard is in an enforcing mode (Blocked or Via force).
3. The specified field is covered by Change Log Setup for `Modification` tracking.

Useful before writing via `Data.Records.Set` when the ChangeLog Write Guard is active,
or before calling `ChangeLog.Field.Restore` to confirm the field has history.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Enabled",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}"
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | string / integer | Yes | Target table |
| `fieldNo` / `fieldId` / `fieldName` | integer / string | Yes | The field to check |

### Response Format

```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": true,
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldCovered": true,
  "fieldWriteGuardBypassed": false
}
```

| Field | Type | Description |
|---|---|---|
| `status` | Text | `Success` or `Error` |
| `changeLogEnabled` | Boolean | `true` if BC Change Log is globally activated |
| `changelogWriteGuardEnabled` | Boolean | `false` = Open mode (no enforcement); `true` = Blocked or Via Force |
| `tableNo` | Integer | Table number |
| `tableName` | Text | Table caption |
| `fieldNo` | Integer | Field number |
| `fieldName` | Text | Field name |
| `fieldCovered` | Boolean | `true` if the field is tracked by Change Log Setup for modification logging |
| `fieldWriteGuardBypassed` | Boolean | `true` if this field has a Bypass entry in Field Access ori, allowing writes regardless of Change Log coverage |

### Error Cases

| Error | Cause |
|---|---|
| `Table not found` | Invalid table name or number |
| `Field identifier required` | Missing `fieldNo`, `fieldId`, or `fieldName` |
| `Field type is not supported for change log tracking` | BLOB, Media, or similar type that BC cannot track |

---

## ChangeLog.Records.Delta

**Direction:** Outbound  
**Object IDs:** Codeunit 10078072 (`ChgLog Records Delta Impl ori`), Codeunit 10077927 (`ChgLog Records Delta Help ori`)

### Purpose

Returns the distinct `SystemId`s of records in a single table that were **Inserted** or **Modified** within a date/time range. Optionally narrows the search to a set of tracked fields. Use this as the source for an incremental sync: pull the changed ids, then fetch each record's full payload via `Data.Records.Get` and per-field history via `ChangeLog.Field.History`.

Deletions are **not** returned — use `Deleted.RecordIds.Get` for deleted records.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Records.Delta",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[2,3],\"startDateTime\":\"2026-03-01T00:00:00Z\",\"endDateTime\":\"2026-03-31T23:59:59Z\"}"
}
```

#### Input Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Text/Integer | Yes | Table to query. Falls back to `subject` if not in `data`. |
| `fieldNumbers` | Integer[] | No | Restricts results to changes on these field numbers. Omit (or empty array invalid) to include any tracked field. |
| `startDateTime` | DateTime | No | Inclusive lower bound. Defaults to `0DT` (no lower bound). |
| `endDateTime` | DateTime | No | Inclusive upper bound. Defaults to the message `Date & Time`. |

### Response Format

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNumbers": [2, 3],
  "startDateTime": "2026-03-01T00:00:00.000Z",
  "endDateTime": "2026-03-31T23:59:59.000Z",
  "totalCount": 42,
  "systemIds": [
    "a1b2c3d4-...",
    "e5f6a7b8-..."
  ]
}
```

#### Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | Text | `Success` or `Error` |
| `tableNo` | Integer | Resolved table number |
| `tableName` | Text | Resolved table name |
| `fieldNumbers` | Integer[] | Echo of the requested field filter (empty when no filter applied) |
| `startDateTime` / `endDateTime` | DateTime | Resolved range applied to Change Log Entry |
| `totalCount` | Integer | Number of distinct SystemIds returned |
| `systemIds` | Guid[] | Distinct SystemIds of changed records, formatted without braces |

#### Error Cases

| Error | Cause |
|---|---|
| `Table ... not found.` | `tableName` / `tableNumber` did not resolve to a known table |
| `fieldNumbers must contain at least one integer when supplied.` | `fieldNumbers` was supplied as an empty array |

### Typical Workflow

1. Call `ChangeLog.Records.Delta` with the table, range and (optionally) the field set to track.
2. For each returned SystemId, call `Data.Records.Get` to fetch the current row.
3. For deeper audit, call `ChangeLog.Field.History` per field of interest.

---

## ChangeLog Write Guard

The **ChangeLog Write Guard** is a field in Bifrost Setup (field 17) that controls which
fields `Data.Records.Set` may write to. It does not affect read operations.

| Mode | Caption | Enum Value | Behaviour |
|---|---|---|---|
| Open | Open | 0 | All fields may be written. Default. |
| Blocked | Blocked | 1 | Only fields covered by Change Log `Modification` tracking are writable. |
| Via force | Via force | 2 | Same as Blocked; bypassed when `force: true` is in the request and the caller has `Force Access ori` |

### Enabling the Guard

Changing to `Blocked` or `Via force` requires the BC Change Log to be active. The setup
validation ensures this and returns an error otherwise.

### Using `force` bypass (Via force mode only)

Include `"force": true` as a top-level key inside the `data` JSON alongside the `data` array:

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"force\":true,\"data\":[{\"id\":\"...\",\"fields\":{\"Name\":\"Updated Name\"}}]}"
}
```

The caller must hold the `Force Access ori` permission set (PermissionSet 10077888).
Without it, `force: true` is ignored and the request is rejected in the same way as `Blocked`.

### Checking field coverage before writing

To prevent rejected writes at runtime, call `ChangeLog.Field.Enabled` first:

```json
{ "type": "ChangeLog.Field.Enabled", "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}" }
```

If `fieldCovered` is `false` and the guard is `Blocked` or `Via force`, the write to
that field will be rejected unless `force: true` is used (Via force mode only).

---

## Related Documentation

- **Data_Message_Types.md** — `Data.Records.Set` request/response format and field naming
- **Setup_Reference.md** — Complete Bifrost Setup field reference including ChangeLog Write Guard
- **Field_Access_Restrictions.md** — User-level field read/write restrictions
