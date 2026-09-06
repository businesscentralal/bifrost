---
id: csv-records-get
title: "CSV.Records.Get"
sidebar_label: "CSV.Records.Get"
sidebar_position: 30
---

Outbound  Content-Type: `text/csv`

Exports all matching records from a specified Business Central table as a UTF-8 encoded CSV file in Open Mirroring format. For large result sets that approach the 2 GB OutStream limit, a continuation pattern is supported via `continueFromRecordId`.

## Request Parameters

| Parameter | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `subject` | Bifrost envelope | string | One of table ID params | Table name (e.g. `"Customer"`) or table number (e.g. `"18"`) |
| `continueFromRecordId` | Bifrost envelope | GUID | No | SystemId of the record to resume from. Omit or leave empty for the first request. |
| `tableName` | JSON data | string | One of table ID params | Table name, e.g. `"Customer"` |
| `tableNumber` / `tableNo` / `tableId` | JSON data | integer | One of table ID params | Table number, e.g. `18` |
| `fieldNumbers` | JSON data | array of integers | No | Specific field numbers to include. If omitted, all supported normal fields are included. |
| `startDateTime` | JSON data | ISO 8601 datetime | No | Filter by `SystemModifiedAt >=` |
| `endDateTime` | JSON data | ISO 8601 datetime | No | Filter by `SystemModifiedAt <=` |
| `tableView` | JSON data | string | No | BC AL table view filter in SetView format |

**Note:** `skip` and `take` are **not** supported. Use the continuation pattern for large exports.

## Response Format

When records match, a UTF-8 encoded CSV text is returned with content type `text/csv`. The first row is the header; subsequent rows are data rows. If no records match, both `data` and `datacontenttype` are empty.

### Example CSV

```
No,Name,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"10000","Contoso Ltd.",0,"a1b2c3d4-...",2026-01-10T08:00:00.000Z,"user-guid",2026-03-01T12:30:00.000Z,"user-guid","CRONUS International Ltd.",4
```

## Column Naming Convention

Each column header is formed by stripping non-alphanumeric characters (except `%`) from the BC field name. Examples:

| BC Field Name | Column Header |
| --- | --- |
| `No.` | `No` |
| `Sell-to Customer No.` | `SelltoCustomerNo` |
| `SystemId` | `SystemId` |

## System Fields

Always appended at the end of every row, regardless of `fieldNumbers`:

| Column | Field No. | Description |
| --- | --- | --- |
| `timestamp` | 0 | Internal timestamp (BigInteger) |
| `SystemId` | 2000000000 | Record GUID |
| `SystemCreatedAt` | 2000000001 | Creation timestamp (UTC) |
| `SystemCreatedBy` | 2000000002 | Created by user GUID |
| `SystemModifiedAt` | 2000000003 | Last modified timestamp (UTC) |
| `SystemModifiedBy` | 2000000004 | Last modified by user GUID |

## Special Columns

-   **`$Company`** — appended for per-company tables (most BC tables). Value is the current company name.
-   **`__rowMarker__`** — always the last column. Value is `4` (upsert/active record). Combine with `CSV.DeletedRecords.Get` (rowMarker = `2`) for full lifecycle tracking.

## Continuation Pattern (Large Exports)

When the CSV response approaches the 2 GB OutStream limit, the export stops after the current 4 MB chunk and returns the `SystemId` of the **next unprocessed record** in the `continueFromRecordId` response field.

### Workflow

1.  Send a normal `CSV.Records.Get` request (no `continueFromRecordId`).
2.  Check the `continueFromRecordId` field in the response.
3.  If it contains a GUID, send another request with `continueFromRecordId` set to that value.
4.  Repeat until the response `continueFromRecordId` is empty (all records exported).

### Example — First Request

```
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Example — Continuation Request

```
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "continueFromRecordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Important Notes

-   Each continuation chunk includes the CSV header row — consumers should skip the header on subsequent chunks.
-   The same filters (`tableView`, `startDateTime`, `endDateTime`) must be sent on every continuation request.
-   If the continuation record was deleted between requests, an error is returned.

## Error Handling

| Condition | Response |
| --- | --- |
| Table not identified | Error raised by table evaluation |
| Table is internal/restricted | `Table {n} ({name}) cannot be read via CSV.Records.Get. This is an internal table.` |
| Read permission denied | `Read permission denied for table {n}.` |
| `continueFromRecordId` points to non-existent record | `Unable to locate the record in table {name} with System Id {guid}` |
| No records match filters | Task succeeds; `data` and `datacontenttype` are both empty |
| Unsupported field type | Field silently skipped |

## Related Message Types

-   **Data.Records.Get** — same filtering, returns JSON, supports skip/take pagination
-   **Data.RecordIds.Get** — returns only record IDs (SystemId + SystemModifiedAt) as JSON
-   **CSV.DeletedRecords.Get** — exports deleted record audit log entries as CSV (rowMarker = 2)
-   [**Data.Totals.Get**](/help/foundation/data-totals-get/) — aggregates Decimal SumIndexFields using CalcSums
