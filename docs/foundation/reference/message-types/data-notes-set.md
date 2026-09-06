---
id: data-notes-set
title: "Data.Notes.Set"
sidebar_label: "Data.Notes.Set"
sidebar_position: 16
description: "Request and response contract for the Data.Notes.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Adds, edits, or deletes Notes (rows in the BC `Record Link` table where Type = Note) on a single target record. One request can mix add / edit / delete by entry.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Add is not idempotent** — re-sending creates duplicates. Persist the `lineNo` returned in the response if you need to re-issue.
- **Edit / delete are idempotent** (operate on a specific `lineNo`).
- The target is **one** record, located via `LocateSingleRecord`.
- If any entry fails (e.g. unknown `lineNo`), processing stops and the response is an error.

## Operation Selection (per note)

| `lineNo` | `note` text | Effect |
|---|---|---|
| absent | non-empty | **Add** new note |
| present | non-empty | **Edit** existing note (writes `note`; writes `description` only if non-empty) |
| present | empty `""` | **Delete** existing note |

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## Record Identification

One of the following must locate exactly one record (via `LocateSingleRecord`):
- `recordId` — SystemId GUID (preferred when known).
- `tableView` — BC `SetView` filter resolving to a single record, e.g. `"WHERE(No. = CONST(C00010))"`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| Table key (see above) | — | Yes | — |
| `recordId` *or* `tableView` | GUID / string | Yes | Must match a single record. |
| `notes` | object[] | Yes | Add/edit/delete instructions. |
| `notes[].note` | string | Yes | Note text. Empty `""` with `lineNo` deletes. |
| `notes[].description` | string (≤250) | No | Short subject line. Written on add; on edit only when non-empty. |
| `notes[].lineNo` | int | No | `Record Link.Link ID`. Required for edit/delete. |

## Response Shape

```json
{
  "status": "Success",
  "addedCount": 1,
  "modifiedCount": 1,
  "notes": [
    { "lineNo": 12347, "note": "New note", "action": "added" },
    { "lineNo": 12345, "note": "Updated text", "action": "modified" }
  ]
}
```

Note: delete operations are reported with `action: "modified"` and an empty `note` value.

## Examples (from unit tests)

### Add a note
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))",
  "notes": [ { "note": "Test note added via API" } ] }
```

### Edit a note (lineNo from `Data.Notes.Get`)
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))",
  "notes": [ { "lineNo": 42, "note": "Updated note text" } ] }
```

### Delete a note (empty note text + lineNo)
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))",
  "notes": [ { "lineNo": 42, "note": "" } ] }
```

### By recordId, with description
```json
{ "tableName": "Customer",
  "recordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": [ { "description": "Payment call",
               "note": "Called customer about delayed payment." } ] }
```

### Mixed batch (add + edit + delete)
```json
{ "tableName": "Customer",
  "recordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": [
    { "description": "New", "note": "Brand new note" },
    { "lineNo": 100, "note": "Edited text" },
    { "lineNo": 101, "note": "" }
  ] }
```

## Discovery Workflow

1. `Data.Notes.Get` on the target record → capture `lineNo` for any note you want to edit/delete.
2. `Data.Notes.Set` with the appropriate add/edit/delete payload.

## Errors

| Condition | Message |
|---|---|
| Table not found / unresolvable | `Table {name} not found.` |
| Table is internal to Bifrost | `Table {id} ({name}) cannot be written via Data.Notes.Set.` |
| Missing `notes` array | `Missing required 'notes' array in request.` |
| Record not located | populated by `LocateSingleRecord`. |
| `lineNo` not on this record or not Type=Note | `Note with lineNo {n} not found for the specified record or is not of type Note.` |

## Related Message Types

- **Data.Notes.Get** — list existing notes / discover `lineNo`.
- **Data.Records.Set** — for writing field values instead of notes.

