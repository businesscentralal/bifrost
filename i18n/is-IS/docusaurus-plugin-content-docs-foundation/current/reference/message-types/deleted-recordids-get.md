---
id: deleted-recordids-get
title: "Deleted.RecordIds.Get"
sidebar_label: "Deleted.RecordIds.Get"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir Deleted.RecordIds.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
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
| `startDateTime` / `endDateTime` | ISO 8601 with Z or an offset | — | Filter by deletion timestamp. Omitted: no range filter. A value without Z or an offset is read as UTC. A date only (`2026-09-26`) is rejected. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. Keep `take` ≤ 1000 for safety. |
| `tableView` | text | — | A BC table view on the Delete Log: `Entry No.`, `Record System Id`, `Deleted At`, `User ID`, for example `WHERE(User ID=CONST(ADMIN))`. The table key always wins over a `Table Id` in the view. An unknown field or unbalanced parentheses is an error (`InvalidFilterField`); nothing is returned. |

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
| `tableView` names a field that does not exist, or its parentheses do not balance | `Invalid tableView: field "{token}" does not exist in table 10077886. Did you mean ...` (`InvalidFilterField`, `parameter: tableView`, `received` is the field token) |
| Invalid table | `Table {name} not found.` |

## Pagination Limits
`skip` defaults to 0 and rejects negative values. `take` defaults to 100 when omitted or zero, rejects negative values, and is clamped to the hard maximum of 1000.

## Related Message Types

- **Deleted.Records.Get** — full snapshot per deleted record (requires Store Record).
- **Data.RecordIds.Get** — same shape for current (non-deleted) records.
- **CSV.DeletedRecords.Get** — CSV export for compliance.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

