---
id: clockify-task-update
title: "Clockify.Task.Update"
sidebar_label: "Clockify.Task.Update"
sidebar_position: 20
description: "Request and response contract for the Clockify.Task.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing Clockify task from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent project ID | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | The task ID to update | `Clockify.Task.List → id` |
| `body.name` | No | string | Task display name | — |
| `body.status` | No | string | ACTIVE or DONE | — |
| `body.assigneeIds` | No | array | Array of user IDs | `Clockify.User.List → id` |
| `body.billable` | No | boolean | Override project billable default | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60...", "taskId": "61...", "body": { "name": "Design v2", "status": "ACTIVE" } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the updated task object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
If this changes which Business Central record the task maps to, update the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `task`, `Clockify Id` = the ID, `Reversed` = `false`). Update `BC SystemId`, `BC Code`, and `Clockify Name` with `Data.Records.Set`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Task name already exists in project | Choose a different name |
| 404 | Task or project not found | Verify IDs via `Clockify.Task.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Send only fields you want to change; omitted fields retain current values.\- To mark a task complete, set `status` to `DONE`.

## Related operations
- **Resolve taskId:** `Clockify.Task.List` or Clockify Integration (type=task)\- **Delete task:** `Clockify.Task.Delete` (no archive step needed for tasks)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; existing Clockify values typically remain unchanged.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

