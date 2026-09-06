---
id: csv-deletedrecords-get
title: "CSV.DeletedRecords.Get"
sidebar_label: "CSV.DeletedRecords.Get"
sidebar_position: 7
description: "Request and response contract for the CSV.DeletedRecords.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Exports deleted record audit data from the Bifrost Delete Log as a UTF-8 CSV file. This message type is optimized for audit trails and compliance reporting.

**Direction**: Outbound (response to request)
**Content-Type**: text/csv

## Key Features
- **CSV Format**: RFC 4180 compliant CSV with proper quoting and escaping
- **Plain CSV Response**: CSV content is returned directly with content type text/csv
- **Audit Fields**: Includes systemId, tableId, tableName, deletedAt, userId
- **Compliance Ready**: Suitable for regulatory reporting and data archival

## CSV Column Structure

| Column | Type | Description |
|--------|------|-------------|
| `systemId` | string | GUID identifier of the deleted record |
| `tableId` | number | Table ID where record was deleted |
| `tableName` | string | Human-readable table name |
| `deletedAt` | datetime | ISO 8601 timestamp of deletion |
| `userId` | string | User ID who performed the deletion |
| `$Company` | string | Company name (only for per-company tables) |
| `__rowMarker__` | number | Open Mirroring row marker — always `2` (deleted record) |

## Request Format

**Bifrost Parameters:**
- `data`: (required) JSON object containing query parameters

**Request JSON Structure:**
```json
{
  "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime": "2024-01-31T23:59:59Z"
}
```

All fields optional: `tableName` (alias `tableNo`/`tableId` for the number, e.g. `18`), and `startDateTime` / `endDateTime` to filter on the deletion timestamp (ISO 8601).

## Response Format

When records match, a UTF-8 encoded CSV file is returned with content type `text/csv`. The first row is the header row; subsequent rows are data rows, one per deleted record.
**If no records match the filters, no CSV is written.** Both `data` and `datacontenttype` in the Bifrost response will be empty string. The task still completes successfully — check whether `data` is empty before attempting to download.

### Response Data Format

The **data** field in the Bifrost response contains a download URL to retrieve the CSV file:

- **Format**: `/api/origo/bifrost/v1.0/responses({guid})`
- **Usage**: Call the URL to download the full CSV response. If `data` is empty, no records matched the filters.

## Usage Example

### Export all deleted customers from January 2024
```json
{
  "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime": "2024-01-31T23:59:59Z"
}
```

## Performance Considerations

- **Large exports**: May take longer depending on record count
- **Recommended**: Use date range filters to limit result set size

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| Read permission denied | Caller lacks read permission on source table | Request access from administrator |
| Invalid table | Table does not exist or is inaccessible | Verify table name/number exists |

## Related Message Types

- **Deleted.Records.Get** - Get full record data in JSON format
- **Deleted.RecordIds.Get** - Get lightweight ID + timestamp list
- **CSV.Records.Get** - Export current (non-deleted) records as CSV

## Implementation Details

- Records retrieved from Bifrost Delete Log table
- CSV follows RFC 4180 standard with proper field quoting and escaping
- Dates exported in ISO 8601 format (culture-invariant)
- Content type: `text/csv`

## $Company Column

For per-company tables (most Business Central tables), a `$Company` column is included after `userId`.
The value is double-quoted and escaped. For non-company tables, this column is omitted.

The exact value is controlled by the **Export Company Name Type** setup field (Bifrost Setup):

| Setup value | $Company value |
|-------------|----------------|
| `Company Name` (default) | `CompanyName()` — the technical Company.Name |
| `Company Display Name` | `Company."Display Name"`, falling back to `CompanyName()` when blank |

The value is resolved once per request and reused for every row in the export.
The enum is extensible via the `Bifrost Company Name Type` enum (65601) and `Bifrost Company Name` interface.

## __rowMarker__ Column (Open Mirroring)

The `__rowMarker__` column is **always** the last column in every row.
For `CSV.DeletedRecords.Get`, the value is always `2`, indicating a **deleted record**.

When combined with `CSV.Records.Get` exports (rowMarker = `4`), downstream systems can merge both CSV exports to maintain a complete record lifecycle view.

This follows the Open Mirroring convention used by bc2adls and Azure Data Lake sync pipelines.

