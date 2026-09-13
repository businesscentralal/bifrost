---
id: clockify-project-get
title: "Clockify.Project.Get"
sidebar_label: "Clockify.Project.Get"
sidebar_position: 10
description: "Request and response contract for the Clockify.Project.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Retrieves a single Clockify verkefni by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify verkefni ID to retrieve | `Clockify Integration table → Clockify Id (type=project)` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the verkefni object (includes `id`, `name`, `clientId`, `memberships`, `archived`, `customFields`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Project fannst ekki | Staðfestu verkefniId er til via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Tengdar aðgerðir
- **Find verkefniId:** `Clockify.Project.List` eða `Data.Records.Get` on Clockify Integration (tegund=verkefni)\- **List verkþættir under this verkefni:** `Clockify.Task.List` (requires verkefniId)\- **Updagsetning this verkefni:** `Clockify.Project.Update`

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

