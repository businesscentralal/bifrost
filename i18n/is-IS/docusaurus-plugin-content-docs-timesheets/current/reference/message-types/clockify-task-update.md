---
id: clockify-task-update
title: "Clockify.Task.Update"
sidebar_label: "Clockify.Task.Update"
sidebar_position: 20
description: "Request and response contract for the Clockify.Task.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Uppfærir an existing Clockify verkþáttur úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent verkefni ID | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | The verkþáttur ID to updagsetning | `Clockify.Task.List → id` |
| `body.name` | No | string | Task display heiti | — |
| `body.status` | No | string | ACTIVE eða DONE | — |
| `body.assigneeIds` | No | array | Array of notandi IDs | `Clockify.User.List → id` |
| `body.billable` | No | boolean | Override verkefni billable sjálfgefið | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60...", "taskId": "61...", "body": { "name": "Design v2", "status": "ACTIVE" } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the updagsetningd verkþáttur object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Ef this changes which Business Central færsla the verkþáttur maps to, updagsetning the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `task`, `Clockify Id` = the ID, `Reversed` = `false`). Updagsetning `BC SystemId`, `BC Code`, og `Clockify Name` með `Data.Records.Set`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Task heiti already er til in verkefni | Choose a different heiti |
| 404 | Task eða verkefni fannst ekki | Staðfestu IDs via `Clockify.Task.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Send aðeins fields you want to change; omitted fields retain current gildi.\- To mark a verkþáttur complete, set `status` to `DONE`.

## Tengdar aðgerðir
- **Resolve verkþátturId:** `Clockify.Task.List` eða Clockify Integration (tegund=verkþáttur)\- **Delete verkþáttur:** `Clockify.Task.Delete` (no archive step needed fyrir verkþættir)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; existing Clockify gildi typically remain unchanged.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

