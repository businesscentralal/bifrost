---
id: clockify-timeentry-syncallusers
title: "Clockify.TimeEntry.SyncAllUsers"
sidebar_label: "Clockify.TimeEntry.SyncAllUsers"
sidebar_position: 26
description: "Request and response contract for the Clockify.TimeEntry.SyncAllUsers Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Syncs finished Clockify tímafærslur in a dagsetning range fyrir every mapped notandi, to time sheets (sjálfgefið) eða the Job Journal.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-all-users`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source vinnusvæði ID | `Clockify.Workspace.List → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |
| `target` | No | string | 'timesheet' (sjálfgefið) writes BC Time Sheets; 'journal' writes Job Journal línur. | — |
| `journalTemplate` | No | string | Job Journal Template (Code[10]) — used þegar target=journal. Sjálfgefið er Clockify Stilltuup. | — |
| `journalBatch` | No | string | Job Journal Batch (Code[10]) — used þegar target=journal. Sjálfgefið er Clockify Stilltuup. | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "target": "timesheet" }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "target": "timesheet", "notendur": 5, "created": 40, "skipped": 3, "updagsetningd": 2, "villur": 1, "notandiResults": [ &#123; "notandiId": "63...", "processed": 9, "created": 8, ... &#125; ] &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Each Clockify notandi verður að vera mapped to a BC Resource (USER integration row).\2. For target=timesheet, hver entry dagsetning needs an open time sheet — run `Clockify.TimeSheet.Create` first.\3. Project/verkþáttur mappings verður exist.

## Samstillingarskráning
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` með filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Notes
- Restores the legacy per-notandi auto-discovery: iterates every USER mapping, no need to pass `userId`.\- Per-notandi og per-entry failures eru counted og reported; they never abort the batch.\- Safe to re-run: unchanged entries return `Skipped`.

## Tengdar aðgerðir
- **Single notandi, time sheet:** `Clockify.TimeEntry.SyncRangeToTimeSheet`\- **Single notandi, journal:** `Clockify.TimeEntry.SyncRange`\- **Seed sheets:** `Clockify.TimeSheet.Create`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

