---
id: deleted-recordids-get
title: "Deleted.RecordIds.Get"
sidebar_label: "Deleted.RecordIds.Get"
sidebar_position: 22
description: "Request and response contract for the Deleted.RecordIds.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns `{id, deletedAt}` pairs from the Bifrost Delete Log — the deletion equivalent of `Data.RecordIds.Get`, intended to drive incremental delete-sync without payload cost. **Does not require Store Record** to be enabled.

**Direction**: Outbound  **Content-Type**: `text/json`

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## Request Parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| Table key (see above) | — | — | Required. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | — | Filter by deletion timestamp. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. Keep `take` ≤ 1000 for safety. |

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 250,
  "result": [
    { "id": "a1b2c3d4-...", "deletedAt": "2024-01-15T14:30:00Z" }
  ]
}
```

`noOfRecords` is the unpaginated total. `deletedAt` is ISO 8601 UTC.

## Typical Delete-Sync Loop

1. Call `Deleted.RecordIds.Get` with `startDateTime` = last delete-sync high-water mark.
2. For each returned `id`, remove the matching row from the consumer.
3. Persist the max `deletedAt` as the next high-water mark.
4. If you also need the deleted **field values** for those IDs (and Store Record is enabled), follow up with `Deleted.Records.Get`.

## Examples

### Deleted customers in date range
```json
{ "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime":   "2024-01-31T23:59:59Z" }
```

### Pagination
```json
{ "tableNo": 18, "skip": 100, "take": 100 }
```

## Errors

| Condition | Message |
|---|---|
| Read permission denied | populated by `CheckTableReadPermission` |
| Invalid table | `Table {name} not found.` |

## Related Message Types

- **Deleted.Records.Get** — full snapshot per deleted record (requires Store Record).
- **Data.RecordIds.Get** — same shape for current (non-deleted) records.
- **CSV.DeletedRecords.Get** — CSV export for compliance.

