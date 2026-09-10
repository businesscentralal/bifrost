---
id: clockify-project-get
title: "Clockify.Project.Get"
sidebar_label: "Clockify.Project.Get"
sidebar_position: 10
description: "Request and response contract for the Clockify.Project.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single Clockify project by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify project ID to retrieve | `Clockify Integration table → Clockify Id (type=project)` |

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
`data` contains the project object (includes `id`, `name`, `clientId`, `memberships`, `archived`, `customFields`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Project not found | Verify projectId exists via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Related operations
- **Find projectId:** `Clockify.Project.List` or `Data.Records.Get` on Clockify Integration (type=project)\- **List tasks under this project:** `Clockify.Task.List` (requires projectId)\- **Update this project:** `Clockify.Project.Update`

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

