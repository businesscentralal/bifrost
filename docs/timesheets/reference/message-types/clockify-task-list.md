---
id: clockify-task-list
title: "Clockify.Task.List"
sidebar_label: "Clockify.Task.List"
sidebar_position: 19
description: "Request and response contract for the Clockify.Task.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the tasks of a Clockify project.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/projects/{projectId}/tasks`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `task`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | Parent project ID | `Clockify.Project.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.is-active` | No | boolean | Filter: true=active only, false=done only | — |
| `query.name` | No | string | Filter: partial name match | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60...", "query": { "page-size": 50, "page": 1 } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of task objects (each with `id`, `name`, `projectId`, `status`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use returned `id` values for time-entry or update calls.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Project not found | Verify projectId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Related operations
- **Create task:** `Clockify.Task.Create`\- **Use in time entries:** Pass task `id` as `taskId` in `Clockify.TimeEntry.Create`\- **Update task:** `Clockify.Task.Update`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

