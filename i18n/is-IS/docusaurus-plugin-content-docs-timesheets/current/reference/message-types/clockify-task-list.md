---
id: clockify-task-list
title: "Clockify.Task.List"
sidebar_label: "Clockify.Task.List"
sidebar_position: 19
description: "Request and response contract for the Clockify.Task.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the verkþættir of a Clockify verkefni.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/projects/{projectId}/tasks`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent verkefni ID | `Clockify.Project.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.is-active` | No | boolean | Filter: true=active only, false=done aðeins | — |
| `query.name` | No | string | Filter: partial heiti match | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60...", "query": { "page-size": 50, "page": 1 } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of verkþáttur objects (each með `id`, `name`, `projectId`, `status`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu returned `id` gildi fyrir time-entry eða updagsetning calls.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Project fannst ekki | Staðfestu verkefniId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Tengdar aðgerðir
- **Create verkþáttur:** `Clockify.Task.Create`\- **Notaðu in tímafærslur:** Sendu verkþáttur `id` as `taskId` in `Clockify.TimeEntry.Create`\- **Updagsetning verkþáttur:** `Clockify.Task.Update`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

