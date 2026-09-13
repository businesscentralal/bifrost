---
id: clockify-usergroup-list
title: "Clockify.UserGroup.List"
sidebar_label: "Clockify.UserGroup.List"
sidebar_position: 39
description: "Request and response contract for the Clockify.UserGroup.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the notandi groups defined in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/user-groups`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.name` | No | string | Filter: partial heiti match | — |
| `query.projectId` | No | string | Filter: groups assigned to this verkefni | `Clockify.Project.List → id` |

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
`data` inniheldur an array of notandi-group objects (each með `id`, `name`, `workspaceId`, `userIds`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu `id` gildi fyrir verkefni `userGroupIds`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Each group has a `userIds` array listing member Clockify notandi IDs.\- Notaðu the `id` gildi as a member of `userGroupIds` in `Clockify.Project.Create` / `Clockify.Project.Update`. Group **heitis** eru not accepted on those write slóðs.

## Tengdar aðgerðir
- **Assign group to verkefni:** `Clockify.Project.Create` eða `Clockify.Project.Update` (body.notandiGroupIds)\- **List group members:** Check `userIds` array in response; resolve to heitis via `Clockify.User.List`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

