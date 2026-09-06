---
id: change-log-field-enabled
title: "ChangeLog.Field.Enabled"
sidebar_label: "ChangeLog.Field.Enabled"
sidebar_position: 32
---

Checks whether Change Log modification logging is active for a specific table field. Returns the coverage status together with the current Change Log and Write Guard enabled flags.

**Direction:** Outbound (Read-only)  |  **Typical use:** Pre-flight check before calling [ChangeLog.Field.History](/help/foundation/change-log-field-history/) or [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/).

## Request

```json
{
  "tableName": "Customer",
  "fieldNo": 2
}
```

| Parameter | Required | Description |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table — name (e.g. `"Customer"`) or number (e.g. `18`). |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to check — by number, ID, or name. |

## Response

```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": false,
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldCovered": true
}
```

| Field | Type | Description |
| --- | --- | --- |
| `status` | Text | `Success` or `Error`. |
| `changeLogEnabled` | Boolean | `true` if Change Log is activated in Change Log Setup. |
| `changelogWriteGuardEnabled` | Boolean | `true` if the ChangeLog Write Guard in Bifrost Setup is set to Blocked or Via force. |
| `tableNo` | Integer | Table number. |
| `tableName` | Text | Table name. |
| `fieldNo` | Integer | Field number. |
| `fieldName` | Text | Field name. |
| `fieldCovered` | Boolean | `true` if the field is covered for modification logging in Change Log Setup. A field is covered if the table is set to _All Fields_, or if the table is set to _Some Fields_ and this specific field has **Log Modification** enabled. |

## Error Handling

| Error | Cause |
| --- | --- |
| Table not found | The specified table name or number does not exist. |
| Field identifier required | No `fieldNo`, `fieldId`, or `fieldName` provided. |
| Field type is not supported for change log tracking | FlowFields and FlowFilters cannot be tracked by the Change Log. |

## Related Message Types

-   [ChangeLog.Field.History](/help/foundation/change-log-field-history/) — retrieve the full modification history for a field
-   [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) — restore a field to a previous value
-   [Bifrost Setup](/help/foundation/bifrost-setup/) — configure the ChangeLog Write Guard
