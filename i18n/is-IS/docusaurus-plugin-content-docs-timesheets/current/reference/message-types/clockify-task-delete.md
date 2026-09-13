---
id: clockify-task-delete
title: "Clockify.Task.Delete"
sidebar_label: "Clockify.Task.Delete"
sidebar_position: 18
description: "Request and response contract for the Clockify.Task.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a Clockify verkþáttur by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent verkefni ID | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | The verkþáttur ID to delete | `Clockify.Task.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60...", "taskId": "61..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the deleted verkþáttur object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `task`, `Clockify Id` = the deleted ID, `Reversed` = `false`) og set `Reversed` = `true` með `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Task eða verkefni fannst ekki | Staðfestu IDs via `Clockify.Task.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Unlike clients og verkefni, verkþættir do NOT require archiving áður en delete.\- Time entries referencing this verkþáttur retain their data but the verkþáttur link becomes orphaned.

## Tengdar aðgerðir
- **Alternative to delete:** Stilltu status to DONE via `Clockify.Task.Update`\- **After delete:** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

