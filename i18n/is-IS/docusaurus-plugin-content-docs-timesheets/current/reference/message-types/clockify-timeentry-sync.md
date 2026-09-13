---
id: clockify-timeentry-sync
title: "Clockify.TimeEntry.Sync"
sidebar_label: "Clockify.TimeEntry.Sync"
sidebar_position: 25
description: "Request and response contract for the Clockify.TimeEntry.Sync Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Syncs a Clockify tímafærsla to a BC Job Journal Line með deduplication, updagsetning detection, og correction posting.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entry`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID | `Clockify.User.GetCurrent → id` |
| `entryId` | **Yes** | string | Clockify tímafærsla ID to sync | `Clockify.TimeEntry.List → id` |
| `projectId` | **Yes** | string | Clockify verkefni ID (mapped to BC Job No.) | `Clockify.Project.List → id` |
| `taskId` | No | string | Clockify verkþáttur ID (mapped to BC Job Task No.) | `Clockify.Task.List → id` |
| `description` | No | string | Work description (becomes Journal Line Lýsing) | — |
| `start` | **Yes** | string | Start time in ISO-8601 UTC | — |
| `end` | **Yes** | string | End time in ISO-8601 UTC | — |
| `billable` | No | boolean | Whether the time er billable | — |
| `tagIds` | No | array | Clockify tag IDs. The first tag linked to a Work Type (TAG integration row) sets the Job Journal Line Work Type; otherwise the Clockify Default Work Type on Clockify Stilltuup er used. | `Clockify.Tag.List → id` |
| `journalTemplate` | No | string | BC Job Journal Template heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Template on Clockify Stilltuup. | — |
| `journalBatch` | No | string | BC Job Journal Batch heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Batch on Clockify Stilltuup. | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "userId": "63...", "entryId": "68...", "projectId": "6a...", "taskId": "6a...", "description": "Testing", "start": "2026-06-09T12:00:00Z", "end": "2026-06-09T16:00:00Z", "billable": true, "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "niðurstaða": "Created|Skipped|Updagsetningd|Corrected|Villa", "message": "..." &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The Clockify verkefni verður að vera mapped to a BC Job (via Clockify Integration table, tegund=verkefni).\2. The Clockify verkþáttur verður að vera mapped to a BC Job Task (via Clockify Integration table, tegund=verkþáttur).\3. The journal template og batch verður exist in BC.\4. The Clockify notandi verður að vera mapped to a BC Resource (via Clockify Integration table, tegund=notandi).

## Samstillingarskráning
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` með filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Missing required mapping | Gakktu úr skugga um verkefni/verkþáttur/notandi mappings exist in Clockify Integration table |
| 400 | Journal template/batch fannst ekki | Staðfestu template og batch heitis exist in BC |
| 400 | In-progress entry | Stop the timer first; `Clockify.TimeEntry.Sync` requires `end` to be set |

## Notes
- This er a **BC-side** operation — it does NOT call the Clockify API. It creates/updagsetnings a Job Journal Line in BC.\- **Deduplication:** Notaðus `entryId` to detect ef already synced. Skilar `Skipped` ef unchanged.\- **Updagsetning detection:** Ef the entry was previously synced but Clockify data changed, returns `Updated`.\- **Correction posting:** Ef the entry was already posted to a Job Ledger Entry, posts a correction (reversal + new). Skilar `Corrected`.\- **In-progress protection:** Entries með `end` = null eru rejected og never written to Job Journal.\- **Result gildi:** `Created` (new lína), `Skipped` (already synced, unchanged), `Updated` (journal lína updagsetningd), `Corrected` (posted entry corrected), `Error` (failed með message).

## Tengdar aðgerðir
- **Get entries to sync:** `Clockify.TimeEntry.List` (filter by dagsetning range)\- **Staðfestu mappings:** `Data.Records.Get` on Clockify Integration (tegund=verkefni/verkþáttur/notandi)\- **Stilltu up mappings:** `Data.Records.Set` on Clockify Integration

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- In-progress entries (`end` missing/null) eru rejected by design og never written to BC Job Journal.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

