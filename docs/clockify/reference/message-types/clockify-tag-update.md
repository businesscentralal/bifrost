---
id: clockify-tag-update
title: "Clockify.Tag.Update"
sidebar_label: "Clockify.Tag.Update"
sidebar_position: 16
description: "Request and response contract for the Clockify.Tag.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing Clockify tag from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/tags/{tagId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `tagId` | **Yes** | string | The tag ID to update | `Clockify.Tag.List → id` |
| `body.name` | No | string | Tag display name | — |
| `body.archived` | No | boolean | Set true to archive, false to unarchive | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "tagId": "62...", "body": { "name": "Non-billable", "archived": false } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the updated tag object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
If this changes which Business Central record the tag maps to, update the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `tag`, `Clockify Id` = the ID, `Reversed` = `false`). Update `BC SystemId`, `BC Code`, and `Clockify Name` with `Data.Records.Set`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Tag name already exists | Choose a different name |
| 404 | Tag not found | Verify tagId via `Clockify.Tag.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Send only fields you want to change; omitted fields retain current values.\- Unlike clients/projects, archiving a tag is NOT required before `Clockify.Tag.Delete`.

## Related operations
- **Resolve tagId:** `Clockify.Tag.List` or Clockify Integration (type=tag)\- **Delete tag:** `Clockify.Tag.Delete` (no archive step needed)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; existing Clockify values typically remain unchanged.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

