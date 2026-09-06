---
id: clockify-task-delete
title: "Clockify.Task.Delete"
sidebar_label: "Clockify.Task.Delete"
sidebar_position: 18
description: "Request and response contract for the Clockify.Task.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a Clockify task by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent project ID | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | The task ID to delete | `Clockify.Task.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60...", "taskId": "61..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the deleted task object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `task`, `Clockify Id` = the deleted ID, `Reversed` = `false`) and set `Reversed` = `true` with `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Task or project not found | Verify IDs via `Clockify.Task.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Unlike clients and projects, tasks do NOT require archiving before delete.\- Time entries referencing this task retain their data but the task link becomes orphaned.

## Related operations
- **Alternative to delete:** Set status to DONE via `Clockify.Task.Update`\- **After delete:** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

