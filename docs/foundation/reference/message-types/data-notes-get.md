---
id: data-notes-get
title: "Data.Notes.Get"
sidebar_label: "Data.Notes.Get"
sidebar_position: 15
description: "Request and response contract for the Data.Notes.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns user-entered Notes (entries in the BC `Record Link` table where Type = Note) for records in a given table. Same record-loop, filtering and pagination as `Data.Records.Get` — but each result row contains a `notes[]` array instead of `fields`.

**Direction**: Outbound  **Content-Type**: `text/json`

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope.

## Request Parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| Table key (see above) | — | — | Required. |
| `tableView` | string | — | BC `SetView` filter to scope which records to walk. |
| `startDateTime` / `endDateTime` | ISO 8601 | — | Filter records by `SystemModifiedAt`. |
| `skip` / `take` | int / int | 0 / 100 | Record pagination. All notes for each returned record are included. |

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "notes": [
        { "lineNo": 12345,
          "description": "Call follow-up",
          "note": "Called customer about delayed payment.",
          "created": "2025-06-15T10:30:00Z",
          "userId": "USER001" }
      ]
    },
    { "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "notes": [] }
  ]
}
```

Records with no notes are still returned with `notes: []`. `noOfRecords` counts records (not notes) and is the unpaginated total.

### Note fields

| Field | Source |
|---|---|
| `lineNo` | `Record Link."Link ID"` — pass back to `Data.Notes.Set` to edit/delete. |
| `description` | `Record Link.Description` (short subject, ≤250 chars). |
| `note` | BLOB content (`Note` field). |
| `created` | `Record Link.Created`, ISO 8601 UTC. |
| `userId` | `Record Link."User ID"`. |

## Examples (from unit tests)

### Notes for a single customer
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))" }
```

### All customers, paginated
```json
{ "tableName": "Customer", "skip": 10, "take": 5 }
```

### Date range
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2025-06-30T23:59:59Z" }
```

## Errors

| Condition | Message |
|---|---|
| Table not found | `Table {name} not found.` |
| Read permission denied | populated by `CheckTableReadPermission`. |

## Related Message Types

- **Data.Notes.Set** — add / edit / delete notes (writes the same `Record Link` rows).
- **Data.Records.Get** — same iteration/filtering, returns field values instead of notes.

