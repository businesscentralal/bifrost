---
id: clockify-timeentry-syncrange
title: "Clockify.TimeEntry.SyncRange"
sidebar_label: "Clockify.TimeEntry.SyncRange"
sidebar_position: 27
description: "Request and response contract for the Clockify.TimeEntry.SyncRange Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Syncs allir of a notandi's finished Clockify tímafærslur in a dagsetning range to BC Job Journal Lines in a single call.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID whose entries to sync | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |
| `journalTemplate` | No | string | BC Job Journal Template heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Template on Clockify Stilltuup. | — |
| `journalBatch` | No | string | BC Job Journal Batch heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Batch on Clockify Stilltuup. | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "userId": "63...", "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "processed": 12, "created": 8, "skipped": 3, "updagsetningd": 1, "corrected": 0, "villur": 0, "niðurstöður": [ &#123; "entryId": "...", "niðurstaða": "Created", "message": "..." &#125; ] &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Each Clockify verkefni/verkþáttur/notandi in the range verður að vera mapped in the Clockify Integration table.\2. The journal template og batch verður exist in BC.\3. Only finished entries eru synced — running timers (`end` = null) eru excluded by the query.

## Samstillingarskráning
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` með filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Journal template/batch not stillt | Stilltu them on Clockify Stilltuup eða pass them in the request |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Lestus entries úr Clockify (paged), then writes Job Journal Lines in BC — combines `Clockify.TimeEntry.List` + `Clockify.TimeEntry.Sync`.\- Per-entry failures (e.g. a missing mapping) do NOT abort the batch; they eru counted under `errors` og listed in `results`.\- Safe to re-run: already-synced unchanged entries return `Skipped`.

## Tengdar aðgerðir
- **Resolve notandiId:** `Clockify.User.GetCurrent` eða `Clockify.User.List`\- **Sync one entry:** `Clockify.TimeEntry.Sync`\- **Inspect entries first:** `Clockify.TimeEntry.List`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

