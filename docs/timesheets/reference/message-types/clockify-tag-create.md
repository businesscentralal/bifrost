---
id: clockify-tag-create
title: "Clockify.Tag.Create"
sidebar_label: "Clockify.Tag.Create"
sidebar_position: 13
description: "Request and response contract for the Clockify.Tag.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a tag in a Clockify workspace from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/tags`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Tag display name (must be unique in workspace) | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "body": { "name": "Billable" } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the created tag object (includes `id`, `name`, `workspaceId`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Record the link: call `Data.Records.Set` on `Clockify Integration` with `BC Table No.`, `BC SystemId`, `BC Code` (the BC source record), `Clockify Type` = `tag`, `Clockify Id` = the `id` from `data` in the response, `Clockify Workspace Id` = the workspace used, `Clockify Name` = display name. Set `Reversed` = `false`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Tag name already exists | Use `Clockify.Tag.List` to find existing tag |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Tags are workspace-scoped (not project-scoped). One tag can be used across all projects.\- Use tag `id` (not name) when attaching to time entries via `tagIds` array.

## Related operations
- **List existing tags:** `Clockify.Tag.List`\- **Use in time entries:** Pass tag `id` in `tagIds` array of `Clockify.TimeEntry.Create`/`Update`\- **Delete later:** `Clockify.Tag.Delete` (no archive step needed)

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

