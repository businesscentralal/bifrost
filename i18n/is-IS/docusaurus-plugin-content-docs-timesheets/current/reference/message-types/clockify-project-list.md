---
id: clockify-project-list
title: "Clockify.Project.List"
sidebar_label: "Clockify.Project.List"
sidebar_position: 11
description: "Request and response contract for the Clockify.Project.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the verkefni in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/projects`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.archived` | No | boolean | Filter: true=archived only, false=active only, omit=all | — |
| `query.name` | No | string | Filter: partial heiti match (case-insensitive) | — |
| `query.clients` | No | string | Filter: comma-separated client IDs | `Clockify.Client.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1, "archived": false } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of verkefni objects (each með `id`, `name`, `clientId`, `archived`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu the returned `id` gildi fyrir verkþáttur/timeEntry operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Tengdar aðgerðir
- **Get single verkefni:** `Clockify.Project.Get`\- **Create verkefni:** `Clockify.Project.Create`\- **List verkþættir under verkefni:** `Clockify.Task.List` (requires verkefniId úr this response)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

