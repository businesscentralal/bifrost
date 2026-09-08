# Change Log and the Write Guard

Reading a field’s modification history, restoring a previous value, checking whether a field is tracked at all, listing the records that changed in a time window, and the three modes of the ChangeLog Write Guard that decide whether a write is allowed through at all.

[← back to SKILL.md](../SKILL.md) · originally sections 7.6 of the single-file skill.

---

### 7.6 CHANGELOG OPERATIONS

All three types use the BC Change Log Entry table (405). Authorization checks respect `Field Access ori` restrictions and the `ChangeLog Write Guard` setting in Bifrost Setup.

#### `ChangeLog.Field.History` — browse field change history

Direction: **Outbound**

Returns the current live field value (as a synthetic `entryNo=0` entry) followed by all Change Log Entry records for the field, newest first.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.History",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table — name or number |
| `recordSystemId` / `systemId` / `id` | Yes* | SystemId (GUID) of the record. May also be sent as GUID in the Bifrost `subject` field. |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to retrieve history for |

*If missing from `data`, the Bifrost `subject` attribute is used as a GUID fallback.

Response:
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
    { "entryNo": 0, "dateAndTime": "2026-03-28T14:22:00.000Z", "typeOfChange": "Current", "oldValue": "", "newValue": "Contoso Ltd.", "userId": "ADMIN" },
    { "entryNo": 56789, "dateAndTime": "2026-03-10T09:00:00.000Z", "typeOfChange": "Modification", "oldValue": "Contoso Inc.", "newValue": "Contoso Ltd.", "userId": "ADMIN" }
  ],
  "totalCount": 2
}
```

History entry fields:

| Field | Description |
|---|---|
| `entryNo` | Change Log Entry No. `0` = current live value (synthetic — not a real entry). Use `entryNo > 0` with `ChangeLog.Field.Restore`. |
| `dateAndTime` | ISO 8601 timestamp. For `entryNo=0` this is `SystemModifiedAt`. |
| `typeOfChange` | `Current` (index 0), `Insertion`, `Modification`, or `Deletion` |
| `oldValue` | Value before the change. Empty for `entryNo=0`. |
| `newValue` | Value after the change. For `entryNo=0` this is the live field value. |
| `userId` | Who made the change. For `entryNo=0` resolved from `SystemModifiedBy` GUID. |

**Errors:** Table not found · `recordSystemId or a subject GUID is required` · `Field identifier required` · Field read-restricted · Record not found

---

#### `ChangeLog.Field.Restore` — write a previous value back to a live record

Direction: **Inbound (Write)**

Supports two modes. The `Old Value` from the resolved Change Log entry is written back using `Validate()` + `Modify(true)`.

**Mode 1 — by entry number:**
```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"entryNo\":56789}"
}
```

**Mode 2 — by point-in-time:**
```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2,\"restoreToDateTime\":\"2026-02-10T09:15:00Z\"}"
}
```

| Parameter | Mode | Required | Description |
|---|---|---|---|
| `entryNo` | 1 | Yes | Change Log Entry No. from `ChangeLog.Field.History` |
| `tableName` / `tableNumber` | 2 | Yes | Target table |
| `recordSystemId` | 2 | Yes | SystemId (GUID) of the record |
| `fieldNo` / `fieldId` / `fieldName` | 2 | Yes | Field to restore |
| `restoreToDateTime` | 2 | Yes | ISO 8601 — finds most recent Modification at or before this time |

Response:
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

**Safety guards:**
- Only `Modification` entries can be restored (Insertion/Deletion entries rejected)
- Target record must exist; field must be writable (not FlowField/FlowFilter)
- Field must not be write-restricted (Field Access ori)
- Table must not be restricted from writes (Bifrost Setup)
- Field must be allowed by the ChangeLog Write Guard
- Current value ≠ restore value (no-op returns error)

**Key errors:** `Change log entry not found` · `Only Modification entries can be restored` · `Record not found` · `Field is write-restricted` · `Field already has the value — nothing to restore` · `Field is not allowed by the change log write guard` · `Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime`

---

#### `ChangeLog.Field.Enabled` — check if a field is tracked by Change Log

Direction: **Outbound**

Returns whether the BC Change Log feature is globally active and whether the specified field is covered by Change Log Setup for modification tracking.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Enabled",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table |
| `fieldNo` / `fieldId` / `fieldName` | Yes | Field to check |

Response:
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

| Field | Description |
|---|---|
| `changeLogEnabled` | Whether BC Change Log is activated globally |
| `changelogWriteGuardEnabled` | `false` = Open mode (no enforcement); `true` = Blocked or Via Force |
| `fieldCovered` | Whether the field is tracked in Change Log Setup for modification logging |
| `fieldWriteGuardBypassed` | `true` if this field has a Bypass entry in Field Access ori, allowing writes regardless of Change Log coverage |

**Errors:** Table not found · `Field identifier required` · `Field type is not supported for change log tracking`

---

#### `ChangeLog.Records.Delta` — distinct SystemIds of records changed in a time window

Direction: **Outbound**

Returns the distinct `SystemId`s of records in a table that were **Inserted** or **Modified** in the Change Log within a date/time range. Optionally narrows the search to specific fields. Deletions are not returned (use `Deleted.RecordIds.Get`). Designed as the source for incremental sync: get the changed ids, then fetch full payloads via `Data.Records.Get`.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Records.Delta",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[2,3],\"startDateTime\":\"2026-03-01T00:00:00Z\",\"endDateTime\":\"2026-03-31T23:59:59Z\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table (falls back to `subject`) |
| `fieldNumbers` | No | Integer array of field numbers to restrict the search to. Empty array is rejected. Omit to include any tracked field. |
| `startDateTime` | No | Inclusive lower bound. Default `0DT`. |
| `endDateTime` | No | Inclusive upper bound. Default = message `Date & Time`. |

Response:
```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNumbers": [2, 3],
  "startDateTime": "2026-03-01T00:00:00.000Z",
  "endDateTime": "2026-03-31T23:59:59.000Z",
  "totalCount": 42,
  "systemIds": ["a1b2c3d4-...", "e5f6a7b8-..."]
}
```

**Errors:** Table not found · `fieldNumbers must contain at least one integer when supplied.`

---

#### ChangeLog Write Guard (`ChangeLog Write Guard` field in Bifrost Setup)

Controls which fields `Data.Records.Set` may write to. Evaluated per-field before every write.

| Mode | Caption | Behaviour |
|---|---|---|
| 0 | Open | All fields writable — same as pre-guard behaviour |
| 1 | Blocked | Only fields covered by Change Log Modification tracking may be written |
| 2 | Via force | Same as Blocked but bypassed when `"force": true` is in the request **and** the caller has the `Force Access ori` permission set |

The `force` flag is a top-level boolean in the `data` JSON:
```json
{ "data": [...], "force": true }
```

Check coverage first with `ChangeLog.Field.Enabled`; browse history with `ChangeLog.Field.History`; restore with `ChangeLog.Field.Restore`.
