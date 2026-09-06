---
id: csv-records-get
title: "CSV.Records.Get"
sidebar_label: "CSV.Records.Get"
sidebar_position: 8
description: "Request and response contract for the CSV.Records.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Exports all matching records from a specified Business Central table as a CSV file in Open Mirroring format. For large result sets that approach the 2 GB OutStream limit, a continuation pattern is supported via `continueFromRecordId`.

**Direction**: Outbound (response to request)
**Content-Type**: text/csv

## Request Format

### Bifrost Parameters

- **source** (required): Identifies the calling application or system.
- **data** (optional): JSON object containing request parameters.

### Response Data Format

The **data** field in the response contains a download URL to retrieve the CSV file:

- **Format**: `/api/origo/bifrost/v1.0/responses({guid})`
- **Usage**: Call the URL to download the full CSV response

### Input Parameters (in data payload)
```json
{
  "tableName": "Customer",
  "fieldNumbers": [1, 2, 5, 7],
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-12-31T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))"
}
```

| Parameter | Notes |
|---|---|
| `tableName` | Table name. Use `tableNumber` (alias `tableNo` / `tableId`) instead to identify the table by number, e.g. `18`. |
| `fieldNumbers` | Optional. Specific field numbers to include. Omit for all Normal fields. |
| `startDateTime` / `endDateTime` | Optional. Filter on `SystemModifiedAt` (ISO 8601). |
| `tableView` | Optional. Additional BC SetView filter/sort. |

## Response Format

When records match, a UTF-8 encoded CSV file is returned with content type `text/csv`. The first row is the header row; subsequent rows are data rows, one per record.

**If no records match the filters, no CSV is written.** Both `data` and `datacontenttype` in the Bifrost response will be empty string. The task still completes successfully — check whether `data` is empty before attempting to download.

## Column Naming Convention

Each column header is formed by stripping non-alphanumeric characters (except `%`) from the BC field name.

- Non-alphanumeric characters (except `%`) are stripped from the field name

Examples:
- Field `No.` → `No`
- Field `Name` → `Name`
- Field `Sell-to Customer No.` → `SelltoCustomerNo`
- Field `SystemId` → `SystemId`

## System Fields

The following system fields are **always included** at the end of every row, regardless of `fieldNumbers`:

| Column | Field No. | Description |
|--------|-----------|-------------|
| `timestamp` | 0 | Internal timestamp (BigInteger) |
| `SystemId` | 2000000000 | Record GUID |
| `SystemCreatedAt` | 2000000001 | Creation timestamp (UTC) |
| `SystemCreatedBy` | 2000000002 | Created by user GUID |
| `SystemModifiedAt` | 2000000003 | Last modified timestamp (UTC) |
| `SystemModifiedBy` | 2000000004 | Last modified by user GUID |

## $Company Column

For per-company tables (most Business Central tables), a `$Company` column is appended after the system fields.
The value is double-quoted and escaped.

The exact value is controlled by the **Export Company Name Type** setup field (Bifrost Setup):

| Setup value | $Company value |
|-------------|----------------|
| `Company Name` (default) | `CompanyName()` — the technical Company.Name |
| `Company Display Name` | `Company."Display Name"`, falling back to `CompanyName()` when blank |

The value is resolved once per request and reused for every row in the export.
The enum is extensible via the `Bifrost Company Name Type` enum (65601) and `Bifrost Company Name` interface.

## __rowMarker__ Column (Open Mirroring)

The `__rowMarker__` column is **always** the last column in every row.
For `CSV.Records.Get`, the value is always `4`, indicating an **upsert/active record**.

When combined with `CSV.DeletedRecords.Get` exports (rowMarker = `2`), downstream systems can merge both CSV exports to maintain a complete record lifecycle view:

- `__rowMarker__ = 4`: Record is active (insert or update)
- `__rowMarker__ = 2`: Record has been deleted

This follows the Open Mirroring convention used by bc2adls and Azure Data Lake sync pipelines.

## Field Type Support

**Supported types** (included in output):
BigInteger, Boolean, Code, Date, DateFormula, DateTime, Decimal, Duration, Guid, Integer, Option, Text, Time

**Unsupported types** (silently skipped):
BLOB, Media, MediaSet, RecordID, OemCode, OemText, TableFilter

## Value Formatting

| Type | Format | Quoted |
|------|--------|--------|
| BigInteger, Integer, Decimal, Duration | Culture-invariant number | No |
| Boolean | `true` or `false` | No |
| Date | `YYYY-MM-DD` (blank date → empty string) | No |
| DateFormula | Culture-invariant | No |
| Time | `HH:mm:ss` | Yes |
| DateTime | ISO 8601 UTC with 3-digit ms, e.g. `2024-01-15T10:30:00.000Z` (zero DT → empty) | No |
| Option | Enum value name | Yes |
| Code, Text, Guid | String value | Yes |

String quoting and escaping:
- LF (char 10) and CR (char 13) are replaced with a space
- Backslash `\` is escaped as `\\`
- Double-quote `"` is escaped as `\"`
- The value is wrapped in double quotes: `"value"`

## Usage Example

### Request
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "tableView": "WHERE(Blocked = CONST( ))"
  }
}
```

### Response (CSV excerpt)
```
No,Name,Address,City,Blocked,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"C00001","Fabrikam, Inc.","123 Main St","Seattle","","",2024-01-15T10:30:00.000Z,...,"CRONUS International Ltd.",4
```

## Error Handling

| Condition | Response |
|-----------|----------|
| Table not identified in request | Error raised by table evaluation |
| Read permission denied | Error message with table number |
| No records match filters | Task succeeds; `data` and `datacontenttype` are both empty |
| Field of unsupported type | Field silently skipped |
| `continueFromRecordId` points to non-existent record | Error: "Unable to locate the record in table &#123;name&#125; with System Id &#123;guid&#125;" |

## Continuation Pattern (Large Exports)

When the CSV response approaches the 2 GB OutStream limit, the export stops after the current 4 MB chunk and returns the `SystemId` of the **next unprocessed record** in the `continueFromRecordId` response field.

### How It Works

1. Send a normal `CSV.Records.Get` request.
2. Check the `continueFromRecordId` field in the response.
3. If it contains a GUID, send another request with `continueFromRecordId` set to that value.
4. Repeat until the response `continueFromRecordId` is empty (all records exported).

### Request Parameter

`continueFromRecordId` is a **top-level Bifrost attribute** (like `subject`), not part of the JSON data payload.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `continueFromRecordId` | GUID | No | SystemId of the record to resume from. Omit or leave empty for the first request. |

### Continuation Example

**First request** (no continuation):
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "datacontenttype": "application/json",
  "data": {}
}
```

**Response** indicates more data available:
- CSV data in `data` field (download URL)
- `continueFromRecordId` = `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

**Next request** (with continuation):
```json
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

**Final response** (all records exported):
- CSV data in `data` field
- `continueFromRecordId` is empty

### Important Notes

- Each continuation chunk includes the CSV header row, so consumers should skip the header on subsequent chunks.
- The same filters (`tableView`, `startDateTime`, `endDateTime`) must be sent on every continuation request to ensure consistent results.
- `continueFromRecordId` uses `RecRef.GetBySystemId()` — if the record was deleted between requests, an error is returned.

## Related Message Types

- **Data.Records.Get** — same filtering, returns JSON instead of CSV, supports skip/take pagination
- **Data.Record.Ids.Get** — returns only record IDs (SystemId + SystemModifiedAt) as JSON
- **CSV.DeletedRecords.Get** — exports deleted record audit log entries as CSV (rowMarker = 2)

