---
id: deleted-records-get
title: "Deleted.Records.Get"
sidebar_label: "Deleted.Records.Get"
sidebar_position: 23
description: "Request and response contract for the Deleted.Records.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns full record snapshots for records previously deleted from a BC table. Snapshots come from the Bifrost Delete Log; the response shape matches `Data.Records.Get` so existing parsers work unchanged.

**Direction**: Outbound  **Content-Type**: `text/json`

## Prerequisite Setup

In **Bifrost Delete Setup**, the source table must have **Store Record** enabled — without it no snapshot is captured and the response will be empty for that table. Field-level access restrictions (`Bifrost Field Access`) are honoured.

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## Request Parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| Table key (see above) | — | — | Required. |
| `fieldNumbers` | int[] | — | Restrict response fields. Omit for all stored fields. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | — | Filter by deletion timestamp. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. |

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 25,
  "result": [
    { "id": "a1b2c3d4-...",
      "primaryKey": { "No_": "CUST001" },
      "fields": { "Name": "John Smith", "EMail": "john@example.com" } }
  ]
}
```

Identical shape to `Data.Records.Get`. Same field-name normalization rules apply (`No.` → `No_`, etc.).

## Examples

### Deleted customers in a date range
```json
{ "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime":   "2024-01-31T23:59:59Z" }
```

### Specific fields only
```json
{ "tableNo": 18, "fieldNumbers": [1, 2, 5, 6], "take": 50 }
```

### Page through deletions
```json
{ "tableName": "Sales Header", "skip": 100, "take": 50 }
```

## Errors

| Condition | Resolution |
|---|---|
| Read permission denied on source table | Grant table read to the calling user. |
| Empty result for deleted records you know existed | Enable **Store Record** in Bifrost Delete Setup for the table. Snapshots are only captured from the moment Store Record is enabled. |
| `Table {x} cannot be read via this API` | The table is internal to Bifrost. |

## Related Message Types

- **Deleted.RecordIds.Get** — lighter; returns only `id` + `deletedAt`. Works even when Store Record is off.
- **Data.Records.Get** — current (non-deleted) records, same shape.
- **CSV.DeletedRecords.Get** — same data as CSV for compliance exports.

