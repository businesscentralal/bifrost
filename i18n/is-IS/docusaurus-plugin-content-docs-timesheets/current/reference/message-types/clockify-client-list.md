---
id: clockify-client-list
title: "Clockify.Client.List"
sidebar_label: "Clockify.Client.List"
sidebar_position: 4
description: "Request and response contract for the Clockify.Client.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the clients in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/clients`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.archived` | No | boolean | Filter: true=archived only, false=active only, omit=all | — |
| `query.name` | No | string | Filter: partial heiti match (case-insensitive) | — |

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
`data` inniheldur an array of client objects (each með `id`, `name`, `workspaceId`, `archived`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu the returned `id` gildi fyrir subsequent create/updagsetning/delete calls.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |
| 403 | Forbidden | API key notandi lacks vinnusvæði access |

## Tengdar aðgerðir
- **Get single client:** `Clockify.Client.Get` (when you have the ID)\- **Create new client:** `Clockify.Client.Create`\- **Notaðu fyrir ID resolution:** Match response `name` to BC Customer Name → extract `id` fyrir write operations

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

