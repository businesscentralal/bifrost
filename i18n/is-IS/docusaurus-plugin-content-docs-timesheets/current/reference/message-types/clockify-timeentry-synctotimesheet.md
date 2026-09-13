---
id: clockify-timeentry-synctotimesheet
title: "Clockify.TimeEntry.SyncToTimeSheet"
sidebar_label: "Clockify.TimeEntry.SyncToTimeSheet"
sidebar_position: 29
description: "Request and response contract for the Clockify.TimeEntry.SyncToTimeSheet Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Syncs a Clockify tímafærsla to the resource's open BC Time Sheet (lína + detail) með deduplication og updagsetning detection.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entry-timesheet`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID (mapped to a BC Resource) | `Clockify.User.GetCurrent → id` |
| `entryId` | **Yes** | string | Clockify tímafærsla ID | `Clockify.TimeEntry.List → id` |
| `projectId` | **Yes** | string | Clockify verkefni ID (mapped to BC Job No.) | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | Clockify verkþáttur ID (mapped to BC Job Task No.) | `Clockify.Task.List → id` |
| `description` | No | string | Work description (becomes the time-sheet lína description) | — |
| `start` | **Yes** | string | Start time in ISO-8601 UTC | — |
| `end` | **Yes** | string | End time in ISO-8601 UTC | — |
| `billable` | No | boolean | Whether the time er billable | — |
| `tagIds` | No | array | Clockify tag IDs used to resolve the Work Type | `Clockify.Tag.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json

```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "niðurstaða": "Created|Updagsetningd|Skipped|Villa", "message": "...", "entryId": "...", "hours": 4, "postingDate": "2026-06-09" &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The Clockify verkefni/verkþáttur/notandi verður að vera mapped in the Clockify Integration table.\2. The resource verður have an **open time sheet covering the entry dagsetning** — run `Clockify.TimeSheet.Create` first.

## Samstillingarskráning
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` með filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Missing mapping | Gakktu úr skugga um verkefni/verkþáttur/notandi mappings exist in the Clockify Integration table |
| 400 | No open time sheet | Run `Clockify.TimeSheet.Create`, then retry |

## Notes
- Writes to a **BC Time Sheet** (lína + detail), not the Job Journal.\- Deduplicated by `entryId`: re-running returns `Skipped` þegar unchanged, `Updated` þegar hours/dagsetning changed.\- After approval, post the sheet með `Clockify.TimeSheet.Post`.

## Tengdar aðgerðir
- **Populate sheets:** `Clockify.TimeSheet.Create`\- **Approve/post:** `Clockify.TimeSheet.Approve` → `Clockify.TimeSheet.Post`\- **Journal-direct alternative:** `Clockify.TimeEntry.Sync`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

