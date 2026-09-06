---
id: clockify-task-create
title: "Clockify.Task.Create"
sidebar_label: "Clockify.Task.Create"
sidebar_position: 17
description: "Request and response contract for the Clockify.Task.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a task in a Clockify project from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/projects/{projectId}/tasks`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent project ID (tasks belong to a project) | `Clockify.Project.List → id` |
| `body.name` | **Yes** | string | Task display name (must be unique within the project) | — |
| `body.status` | No | string | ACTIVE (default) or DONE | — |
| `body.assigneeIds` | No | array | Array of user IDs to assign | `Clockify.User.List → id` |
| `body.billable` | No | boolean | Override project billable default | — |
| `body.hourlyRate` | No | object | &#123; "amount": &lt;cents>, "currency": "USD" &#125; | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60...", "body": { "name": "Design" } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the created task object (includes `id`, `name`, `projectId`, `status`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Record the link: call `Data.Records.Set` on `Clockify Integration` with `BC Table No.`, `BC SystemId`, `BC Code` (the BC source record), `Clockify Type` = `task`, `Clockify Id` = the `id` from `data` in the response, `Clockify Workspace Id` = the workspace used, `Clockify Name` = display name. Set `Reversed` = `false`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Task name already exists in project | Choose a different name or find existing via `Clockify.Task.List` |
| 404 | Project not found | Verify projectId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Tasks are scoped to a project — you always need both workspaceId and projectId.\- Task names must be unique within a project but can repeat across projects.

## Related operations
- **Resolve projectId:** `Clockify.Project.List` or Clockify Integration (type=project)\- **List existing tasks:** `Clockify.Task.List`\- **Use in time entries:** Pass task `id` as `taskId` in `Clockify.TimeEntry.Create`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; Clockify applies endpoint defaults.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

