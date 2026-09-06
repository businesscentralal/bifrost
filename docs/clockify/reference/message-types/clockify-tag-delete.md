---
id: clockify-tag-delete
title: "Clockify.Tag.Delete"
sidebar_label: "Clockify.Tag.Delete"
sidebar_position: 14
description: "Request and response contract for the Clockify.Tag.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a Clockify tag by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/tags/{tagId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `tagId` | **Yes** | string | The tag ID to delete | `Clockify.Tag.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "tagId": "62..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the deleted tag object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `tag`, `Clockify Id` = the deleted ID, `Reversed` = `false`) and set `Reversed` = `true` with `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Tag not found | Verify tagId via `Clockify.Tag.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Unlike clients and projects, tags do NOT require archiving before delete.\- Time entries referencing this tag retain their data but the tag link becomes orphaned.

## Related operations
- **Alternative to delete:** Archive via `Clockify.Tag.Update` with `{ "archived": true }`\- **After delete:** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

