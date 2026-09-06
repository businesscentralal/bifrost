---
id: clockify-client-get
title: "Clockify.Client.Get"
sidebar_label: "Clockify.Client.Get"
sidebar_position: 3
description: "Request and response contract for the Clockify.Client.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single Clockify client by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to retrieve | `Clockify Integration table → Clockify Id (type=client)` |

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
`data` contains the client object (includes `id`, `name`, `workspaceId`, `archived`, `currencyId`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Client not found | Verify clientId exists via `Clockify.Client.List` or check Clockify Integration table |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Related operations
- **Find clientId:** `Clockify.Client.List` or `Data.Records.Get` on Clockify Integration (type=client)\- **Update this client:** `Clockify.Client.Update`\- **Delete this client:** Archive first, then `Clockify.Client.Delete`

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

