---
id: clockify-task-create
title: "Clockify.Task.Create"
sidebar_label: "Clockify.Task.Create"
sidebar_position: 17
description: "Request and response contract for the Clockify.Task.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a verkþáttur in a Clockify verkefni úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/projects/{projectId}/tasks`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent verkefni ID (verkþættir belong to a verkefni) | `Clockify.Project.List → id` |
| `body.name` | **Yes** | string | Task display heiti (verður að vera unique within the verkefni) | — |
| `body.status` | No | string | ACTIVE (sjálfgefið) eða DONE | — |
| `body.assigneeIds` | No | array | Array of notandi IDs to assign | `Clockify.User.List → id` |
| `body.billable` | No | boolean | Override verkefni billable sjálfgefið | — |
| `body.hourlyRate` | No | object | &#123; "fjárhæð": &lt;cents>, "currency": "USD" &#125; | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60...", "body": { "name": "Design" } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the created verkþáttur object (includes `id`, `name`, `projectId`, `status`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Record the link: call `Data.Records.Set` on `Clockify Integration` með `BC Table No.`, `BC SystemId`, `BC Code` (the BC source færsla), `Clockify Type` = `task`, `Clockify Id` = the `id` úr `data` in the response, `Clockify Workspace Id` = the vinnusvæði used, `Clockify Name` = display heiti. Stilltu `Reversed` = `false`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Task heiti already er til in verkefni | Choose a different heiti eða find existing via `Clockify.Task.List` |
| 404 | Project fannst ekki | Staðfestu verkefniId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Tasks eru scoped to a verkefni — you always need both vinnusvæðiId og verkefniId.\- Task heitis verður að vera unique within a verkefni but getur repeat across verkefni.

## Tengdar aðgerðir
- **Resolve verkefniId:** `Clockify.Project.List` eða Clockify Integration (tegund=verkefni)\- **List existing verkþættir:** `Clockify.Task.List`\- **Notaðu in tímafærslur:** Sendu verkþáttur `id` as `taskId` in `Clockify.TimeEntry.Create`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; Clockify applies endpoint sjálfgefiðs.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

