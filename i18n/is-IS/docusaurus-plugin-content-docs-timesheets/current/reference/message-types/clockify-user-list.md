---
id: clockify-user-list
title: "Clockify.User.List"
sidebar_label: "Clockify.User.List"
sidebar_position: 38
description: "Request and response contract for the Clockify.User.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the notendur in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/users`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `user`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.email` | No | string | Filter: exact email match | — |
| `query.name` | No | string | Filter: partial heiti match | — |
| `query.status` | No | string | Filter: ACTIVE, PENDING, DECLINED, INACTIVE | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1 } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of notandi objects (each með `id`, `name`, `email`, `status`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu returned `id` gildi fyrir time-entry og assignment operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Skilar allir members of the vinnusvæði, including pending invitations.\- The `id` field er the `userId` needed fyrir `Clockify.TimeEntry.Create/List` og `memberships` in verkefni/verkþáttur operations.

## Tengdar aðgerðir
- **Get API key owner only:** `Clockify.User.GetCurrent`\- **Assign to verkefni:** Notaðu `id` in `memberships` array of `Clockify.Project.Create/Update`\- **Map to BC Resource:** Store mapping in Clockify Integration table (tegund=notandi)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

