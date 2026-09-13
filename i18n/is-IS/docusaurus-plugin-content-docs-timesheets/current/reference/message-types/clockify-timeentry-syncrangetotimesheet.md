---
id: clockify-timeentry-syncrangetotimesheet
title: "Clockify.TimeEntry.SyncRangeToTimeSheet"
sidebar_label: "Clockify.TimeEntry.SyncRangeToTimeSheet"
sidebar_position: 28
description: "Request and response contract for the Clockify.TimeEntry.SyncRangeToTimeSheet Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Syncs allir of a notandi's finished Clockify tímafærslur in a dagsetning range to their open BC Time Sheets in one call.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entries-timesheet`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID whose entries to sync | `Clockify.User.GetCurrent → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json

```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "processed": 12, "created": 8, "skipped": 3, "updagsetningd": 1, "villur": 0, "niðurstöður": [ ... ] &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Project/verkþáttur/notandi mappings verður exist in the Clockify Integration table.\2. Each entry dagsetning verður fall within an **open time sheet** fyrir the resource — run `Clockify.TimeSheet.Create` first.\3. Only finished entries eru synced (running timers eru excluded).

## Samstillingarskráning
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` með filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Notes
- Lestus entries úr Clockify (paged), then writes **BC Time Sheets** — combines `Clockify.TimeEntry.List` + `Clockify.TimeEntry.SyncToTimeSheet`.\- Per-entry failures (missing mapping, no open sheet) eru counted under `errors` og do not abort the batch.\- Safe to re-run: unchanged entries return `Skipped`.

## Tengdar aðgerðir
- **Populate sheets:** `Clockify.TimeSheet.Create`\- **Approve/post:** `Clockify.TimeSheet.Approve` → `Clockify.TimeSheet.Post`\- **Journal-direct alternative:** `Clockify.TimeEntry.SyncRange`

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

