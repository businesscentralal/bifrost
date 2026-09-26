---
id: data-notes-set
title: "Data.Notes.Set"
sidebar_label: "Data.Notes.Set"
sidebar_position: 16
description: "Beiðni- og svarsamningur fyrir Data.Notes.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Adds, edits, eða deletes Athugasemdir (rows in the BC `Record Link` tafla where Gerð = Note) on a single target færsla. One request getur mix add / edit / delete með færsla.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **Add er ekki endurtekningarþolið** — re-sending Býr til duplicates. Persist the `lineNo` returned in Svarið ef you need til re-issue.
- **Edit / delete eru endurtekningarþolið** (operate on a specific `lineNo`).
- The target er **one** færsla, located via `LocateSingleRecord`.
- ef hvaða færsla fails (e.g. unknown `lineNo`), processing stops og Svarið er an Villa.

## Operation Selection (per note)

| `lineNo` | `note` text | Effect |
|---|---|---|
| absent | non-empty | **Add** ný note |
| present | non-empty | **Edit** fyrirliggjandi note (writes `note`; writes `description` aðeins ef non-empty) |
| present | empty `""` | **Delete** fyrirliggjandi note |

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject`.

## færsla Identification

One of the following verður að locate exactly one færsla (via `LocateSingleRecord`):
- `recordId` — SystemId GUID (preferred þegar known).
- `tableView` — BC `SetView` filter resolving til a single færsla, e.g. `"WHERE(No. = CONST(C00010))"`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| tafla key (Sjá above) | — | Yes | — |
| `recordId` *eða* `tableView` | GUID / strengur | Yes | verður að match a single færsla. |
| `notes` | hlutur[] | Yes | Add/edit/delete instructions. |
| `notes[].note` | strengur | Yes | Note text. Empty `""` með `lineNo` deletes. |
| `notes[].description` | strengur (≤250) | No | Short subject line. Written on add; on edit aðeins þegar non-empty. |
| `notes[].lineNo` | int | No | `Record Link.Link ID`. áskilið fyrir edit/delete. |

## Uppbygging svars

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

Note: delete operations eru reported með `action: "modified"` og an empty `note` Gildi.

## Dæmi (úr einingaprófum)

### Add a note
```json
{ "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(C00010))",
  "notes": [ { "note": "Test note added via API" } ] }
```

### Edit a note (lineNo úr `Data.Notes.Get`)
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

### með recordId, með Lýsing
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

## Uppgötvunarferli

1. `Data.Notes.Get` on the target færsla → capture `lineNo` fyrir hvaða note you want til edit/delete.
2. `Data.Notes.Set` með the appropriate add/edit/delete payload.

## Villur

| Condition | Message |
|---|---|
| tafla fannst ekki / unresolvable | `Table {name} not found.` |
| tafla er innri til Bifrost | `Table {id} ({name}) cannot be written via Data.Notes.Set.` |
| vantar `notes` fylki | `Missing required 'notes' array in request.` |
| færsla ekki located | populated með `LocateSingleRecord`. |
| `lineNo` ekki on this færsla eða ekki Gerð=Note | `Note with lineNo {n} not found for the specified record or is not of type Note.` |

## Tengdar skilaboðategundir

- **Data.Notes.Get** — list fyrirliggjandi Athugasemdir / discover `lineNo`.
- **Data.Records.Set** — fyrir writing Reitur values instead of Athugasemdir.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

