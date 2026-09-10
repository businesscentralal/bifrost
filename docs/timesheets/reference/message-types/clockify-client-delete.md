---
id: clockify-client-delete
title: "Clockify.Client.Delete"
sidebar_label: "Clockify.Client.Delete"
sidebar_position: 2
description: "Request and response contract for the Clockify.Client.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a Clockify client by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to delete | `Clockify Integration table → Clockify Id (type=client)` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "clientId": "60..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the deleted client object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The client **must be archived first** — call `Clockify.Client.Update` with body `{ "archived": true }`.\2. Clockify rejects delete on active clients with HTTP 400.

## Integration tracking
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `client`, `Clockify Id` = the deleted ID, `Reversed` = `false`) and set `Reversed` = `true` with `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Cannot delete an active client | Archive first: `Clockify.Client.Update` with `{ "archived": true }` |
| 401 | Unauthorized | Check API key on Clockify Setup |
| 404 | Client not found | Verify clientId via `Clockify.Client.List` |

## Notes
- Two-step delete pattern: archive → delete. This is a Clockify platform requirement.\- After delete, mark the `Clockify Integration` row as reversed (do NOT delete it).

## Related operations
- **Step 1 (archive):** `Clockify.Client.Update` with `{ "archived": true }`\- **Step 2 (delete):** This message type\- **Step 3 (unlink):** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

