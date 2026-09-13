---
id: clockify-timeentry-list
title: "Clockify.TimeEntry.List"
sidebar_label: "Clockify.TimeEntry.List"
sidebar_position: 24
description: "Request and response contract for the Clockify.TimeEntry.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists a notandi's tímafærslur in a Clockify vinnusvæði, með optional dagsetning/verkefni filters via the query object.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/user/{userId}/time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID whose entries to list | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.start` | No | string | Filter: entries starting at eða eftir this ISO-8601 UTC timestamp | — |
| `query.end` | No | string | Filter: entries ending at eða áður en this ISO-8601 UTC timestamp | — |
| `query.project` | No | string | Filter: Clockify verkefni ID | `Clockify.Project.List → id` |
| `query.task` | No | string | Filter: Clockify verkþáttur ID | `Clockify.Task.List → id` |
| `query.in-progress` | No | boolean | Filter: true returns running timers aðeins (`end` = null), false returns finished entries aðeins (`end` er set). | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "userId": "63...", "query": { "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "in-progress": false, "page-size": 50, "page": 1 } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of time-entry objects (each með `id`, `start`, `end`, `duration`, `projectId`, `taskId`, `tagIds`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu `id` gildi fyrir Get/Updagsetning/Delete/Sync.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Notaður fannst ekki | Staðfestu notandiId via `Clockify.User.GetCurrent` eða `Clockify.User.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Time entries eru **per-notandi** — you verður specify whose entries to list.\- Notaðu `start` og `end` filters to scope to a dagsetning range (ISO-8601 UTC).\- `query.in-progress = true` returns aðeins running timers (`end` = null).\- `query.in-progress = false` returns aðeins finished entries (`end` has a gildi).\- For `Clockify.TimeEntry.Sync`, prefer finished entries aðeins (set `query.in-progress = false`).

## Tengdar aðgerðir
- **Resolve notandiId:** `Clockify.User.GetCurrent` (API key owner) eða `Clockify.User.List`\- **Get single entry:** `Clockify.TimeEntry.Get`\- **Sync entries to BC:** `Clockify.TimeEntry.Sync`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.
- `query.in-progress = true` returns running timers (`end` = null). `query.in-progress = false` returns finished entries (`end` has a gildi).

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

