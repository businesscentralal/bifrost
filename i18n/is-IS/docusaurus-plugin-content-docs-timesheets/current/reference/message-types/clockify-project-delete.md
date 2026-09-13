---
id: clockify-project-delete
title: "Clockify.Project.Delete"
sidebar_label: "Clockify.Project.Delete"
sidebar_position: 9
description: "Request and response contract for the Clockify.Project.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a Clockify verkefni by ID. The verkefni verður að vera archived in Clockify áður en it getur be deleted.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify verkefni ID to delete | `Clockify Integration table → Clockify Id (type=project)` |

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
`data` inniheldur the deleted verkefni object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The verkefni **verður að vera archived first** — call `Clockify.Project.Update` með body `{ "archived": true }`.\2. Clockify rejects delete on active verkefni með HTTP 400.

## Samstillingarskráning
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `project`, `Clockify Id` = the deleted ID, `Reversed` = `false`) og set `Reversed` = `true` með `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Cannot delete an active verkefni | Archive first: `Clockify.Project.Update` með `{ "archived": true }` |
| 404 | Project fannst ekki | Staðfestu verkefniId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Two-step delete pattern: archive → delete. This er a Clockify platform requirement.\- After delete, mark the `Clockify Integration` row as reversed (do NOT delete it).\- Tasks under this verkefni eru also deleted by Clockify.

## Tengdar aðgerðir
- **Step 1 (archive):** `Clockify.Project.Update` með `{ "archived": true }`\- **Step 2 (delete):** This message tegund\- **Step 3 (unlink):** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

