---
id: change-log-field-restore
title: "ChangeLog.Field.Restore"
sidebar_label: "ChangeLog.Field.Restore"
sidebar_position: 34
---

Restores a field value from the Business Central Change Log by writing a previous value back to the live record. Supports two modes: restore by a specific Change Log entry number, or restore to a point-in-time.

**Direction:** Inbound (Write)  |  **Typical workflow:** Call [ChangeLog.Field.History](/help/foundation/change-log-field-history/) first to browse the history, then restore.

## Workflow

1.  Call [ChangeLog.Field.History](/help/foundation/change-log-field-history/) to browse the change history for a field.
2.  Pick the desired `entryNo` from the history array.
3.  Call `ChangeLog.Field.Restore` with `{ "entryNo": <selected> }`.
4.  The `Old Value` from that Change Log entry is written back to the live record using `Validate()` and `Modify(true)`.

## Mode 1: By Entry Number

Restores the `Old Value` from a specific Change Log Entry.

```json
{
  "entryNo": 56789
}
```

| Parameter | Required | Description |
| --- | --- | --- |
| `entryNo` | Yes | The Change Log Entry number (from [ChangeLog.Field.History](/help/foundation/change-log-field-history/) response). Must be greater than 0. |

## Mode 2: By Point-in-Time

Finds the most recent `Modification` entry at or before the given timestamp and restores its `Old Value`. Useful when you know the approximate time of the unwanted change but not the exact entry number.

```json
{
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "restoreToDateTime": "2026-02-10T09:15:00Z"
}
```

| Parameter | Required | Description |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table — name (e.g. `"Customer"`) or number (e.g. `18`). |
| `recordSystemId` | Yes | SystemId (GUID) of the record to restore. |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to restore — by number, ID, or name. |
| `restoreToDateTime` | Yes | ISO 8601 timestamp. Restores to the most recent Modification entry at or before this time (e.g. `"2026-02-10T09:15:00Z"`). |

## Response

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
| --- | --- | --- |
| `status` | Text | `Success` or `Error`. |
| `tableNo` | Integer | Table number. |
| `tableName` | Text | Table name. |
| `recordSystemId` | Text | Record SystemId (GUID without braces). |
| `fieldNo` | Integer | Field number. |
| `fieldName` | Text | Field name. |
| `previousValue` | Text | The field value before the restore was applied. |
| `restoredValue` | Text | The value written back to the live record (the `Old Value` of the Change Log entry). |
| `fromEntryNo` | BigInteger | The Change Log Entry number used as the restore source. |
| `entryDateTime` | DateTime | Timestamp of the Change Log entry used (ISO 8601). |

## Safety Guards

-   Only **Modification** entries can be restored — Insertion and Deletion entries are rejected.
-   The target record must still exist.
-   The field must be a writable (Normal class) field — FlowFields and FlowFilters are rejected.
-   Write-restricted fields (via [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/)) are rejected.
-   The table must not be restricted from write operations via Bifrost Setup.
-   The field must be allowed by the Change Log Write Guard configured in [Bifrost Setup](/help/foundation/bifrost-setup/).
-   The restore value must be convertible to the field data type.
-   If the current value already equals the restore value, the operation returns an error — no write occurs.
-   `Validate()` and `Modify(true)` are always used to respect business logic triggers.

## Error Handling

| Error | Cause |
| --- | --- |
| Change log entry not found | Invalid `entryNo`. |
| No change log entry found for the specified record, field, and date | Mode 2: no Modification entry exists at or before the requested timestamp. |
| Only Modification entries can be restored | The entry is of type Insertion or Deletion. |
| Record not found | The target record no longer exists. |
| Field is write-restricted | Field blocked by Bifrost Field Accesses. |
| Field is not a writable field | The field is a FlowField or FlowFilter. |
| Cannot convert value to field type | Type mismatch — the stored text cannot be parsed into the field's data type. |
| Field already has the value — nothing to restore | Current value equals the restore value; no write attempted. |
| Table is restricted from write operations | Table blocked by Bifrost Setup data-record restrictions. |
| Field is not allowed by the change log write guard | Field blocked by the Change Log Write Guard in Bifrost Setup. |
| recordSystemId is required for point-in-time restore | Mode 2 called without a record identifier. |
| Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime | Neither Mode 1 nor Mode 2 parameters were provided. |

## Related Message Types

-   [ChangeLog.Field.History](/help/foundation/change-log-field-history/) — browse the change history before restoring
-   [ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/) — check if a field is tracked by Change Log
