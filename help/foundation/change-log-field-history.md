---
id: change-log-field-history
title: "ChangeLog.Field.History"
sidebar_label: "ChangeLog.Field.History"
sidebar_position: 33
---

Returns the current live value of a specific field on a record together with its full change history from the Business Central Change Log Entry table. The response includes a synthetic _Current_ entry (entryNo = 0) representing the field's live value, followed by real Change Log entries ordered most-recent first.

**Direction:** Outbound (Read)  |  **Typical use:** Audit review, before calling [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/)

## Workflow

1.  Call `ChangeLog.Field.History` with table name, record SystemId, and fieldNo.
2.  Review the `history` array — entry 0 is the live value; entries 1+ are recorded changes.
3.  Note the `entryNo` of the version you want to restore to.
4.  Call [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) with `{ "entryNo": <selected> }`.

## Request Parameters

```json
{
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2
}
```

| Parameter | Required | Description |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table — name (e.g. `"Customer"`) or number (e.g. `18`). |
| `recordSystemId` / `systemId` / `id` | Yes\* | SystemId (GUID) of the record. Can also be passed as a GUID in the message `subject` field. |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to retrieve history for — by number, ID, or name. |

\* If `recordSystemId` is absent from the JSON body, the Bifrost `subject` field is used as a GUID fallback.

## Response

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldType": "Text",
  "history": \[
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
    }
  \],
  "totalCount": 2
}
```

### Top-Level Fields

| Field | Type | Description |
| --- | --- | --- |
| `status` | Text | `Success` or `Error`. |
| `tableNo` | Integer | Table number. |
| `tableName` | Text | Table name. |
| `recordSystemId` | Text | Record SystemId (GUID, no braces). |
| `fieldNo` | Integer | Field number. |
| `fieldName` | Text | Field name. |
| `fieldType` | Text | Field data type (Text, Code, Decimal, Date, etc.). |
| `history` | Array | History entries, most recent first. Index 0 is always the live current state. |
| `totalCount` | Integer | Number of entries in the history array (includes the current-state entry). |

### History Entry Fields

| Field | Type | Description |
| --- | --- | --- |
| `entryNo` | BigInteger | Change Log Entry number. `0` = current live state (not a real entry). Use entryNo > 0 with [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/). |
| `dateAndTime` | DateTime | When the change was recorded (ISO 8601). For entryNo = 0 this is the record `SystemModifiedAt`. |
| `typeOfChange` | Text | `Current` for entryNo = 0; `Insertion`, `Modification`, or `Deletion` for real entries. |
| `oldValue` | Text | Value before the change. Empty for the current-state entry. |
| `newValue` | Text | Value after the change. For the current-state entry this is the live field value. |
| `userId` | Text | User who made the change. For entryNo = 0 this is resolved from the record `SystemModifiedBy` GUID. |

## Error Handling

| Error | Cause |
| --- | --- |
| Table not found | Invalid table name or number. |
| recordSystemId or a subject GUID is required | No record identifier provided. |
| Field identifier required | No fieldNo, fieldId, or fieldName provided. |
| Field read-restricted | Field is blocked by [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/). |
| Record not found | No record with the given SystemId exists. |

## Related Message Types

-   [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) — restore a field to a previous value from this history
-   [ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/) — check whether a field is tracked by Change Log
