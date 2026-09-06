---
id: data-recordids-get
title: "Data.RecordIds.Get"
sidebar_label: "Data.RecordIds.Get"
sidebar_position: 17
description: "Request and response contract for the Data.RecordIds.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns `{id, modifiedAt}` pairs for records in a BC table — a lightweight version of `Data.Records.Get` for incremental sync (drives a follow-up `Data.Records.Get` with `tableView` for the IDs that actually changed).

**Direction**: Outbound  **Content-Type**: `text/json`

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope (name or number).

## Request Parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| Table key (see above) | — | — | Required. |
| `startDateTime` / `endDateTime` | ISO 8601 UTC | `0DT` / `CurrentDateTime` | Filter on `SystemModifiedAt`. |
| `tableView` | string | — | BC `SetView` syntax, e.g. `"WHERE(Blocked = CONST( ))"`. |
| `skip` / `take` | int / int | 0 / 100 | Pagination. `noOfRecords` in response = unpaginated total. |

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "modifiedAt": "2026-02-15T14:30:00Z" }
  ]
}
```

## Examples (from unit tests)

### Incremental delta with table view
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2027-12-31T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))" }
```

### Paginated
```json
{ "tableName": "Customer", "skip": 0, "take": 100 }
```

## Typical Sync Loop

1. Call `Data.RecordIds.Get` with `startDateTime` = last successful sync time.
2. For each returned `id`, call `Data.Records.Get` with `tableView = "WHERE(SystemId = CONST({guid}))"` (or batch by composing an `IN` filter).
3. Persist max `modifiedAt` as the next high-water mark.

## Errors

| Condition | Message |
|---|---|
| Table not found | `Table {name} not found.` |
| Read permission denied | populated by `CheckTableReadPermission` |

## Related Message Types

- **Data.Records.Get** — full record data; follow-up step for changed IDs.
- **Deleted.RecordIds.Get** — same shape but for deleted records (`deletedAt` instead of `modifiedAt`).
- **Help.Tables.Get** — table discovery.

