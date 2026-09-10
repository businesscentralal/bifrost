---
id: clockify-project-delete
title: "Clockify.Project.Delete"
sidebar_label: "Clockify.Project.Delete"
sidebar_position: 9
description: "Request and response contract for the Clockify.Project.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a Clockify project by ID. The project must be archived in Clockify before it can be deleted.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify project ID to delete | `Clockify Integration table → Clockify Id (type=project)` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the deleted project object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The project **must be archived first** — call `Clockify.Project.Update` with body `{ "archived": true }`.\2. Clockify rejects delete on active projects with HTTP 400.

## Integration tracking
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `project`, `Clockify Id` = the deleted ID, `Reversed` = `false`) and set `Reversed` = `true` with `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Cannot delete an active project | Archive first: `Clockify.Project.Update` with `{ "archived": true }` |
| 404 | Project not found | Verify projectId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Two-step delete pattern: archive → delete. This is a Clockify platform requirement.\- After delete, mark the `Clockify Integration` row as reversed (do NOT delete it).\- Tasks under this project are also deleted by Clockify.

## Related operations
- **Step 1 (archive):** `Clockify.Project.Update` with `{ "archived": true }`\- **Step 2 (delete):** This message type\- **Step 3 (unlink):** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

