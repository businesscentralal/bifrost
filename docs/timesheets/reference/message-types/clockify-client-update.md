---
id: clockify-client-update
title: "Clockify.Client.Update"
sidebar_label: "Clockify.Client.Update"
sidebar_position: 5
description: "Request and response contract for the Clockify.Client.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing Clockify client from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to update | `Clockify Integration table → Clockify Id (type=client)` |
| `body.name` | No | string | Client display name | — |
| `body.address` | No | string | Single-line address | — |
| `body.email` | No | string | Client contact email | — |
| `body.note` | No | string | Free-text note | — |
| `body.currencyId` | No | string | Clockify currency ID (NOT the ISO code) | `Clockify.Currency.List → id` |
| `body.archived` | No | boolean | Set true to archive, false to unarchive | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "clientId": "60...", "body": { "name": "Acme Ltd.", "currencyId": "6a...", "archived": false } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the updated client object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
If this changes which Business Central record the client maps to, update the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `client`, `Clockify Id` = the ID, `Reversed` = `false`). Update `BC SystemId`, `BC Code`, and `Clockify Name` with `Data.Records.Set`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Client name already exists | Choose a different name or use existing client |
| 401 | Unauthorized | Check API key on Clockify Setup |
| 404 | Client not found | Verify clientId via `Clockify.Client.List` |

## Notes
- `currencyCode` is **silently ignored** — Clockify returns 200 but the currency is unchanged. Always use `currencyId`.\- Setting `archived: true` is the **required first step** before `Clockify.Client.Delete`.\- Send only the fields you want to change; omitted fields retain their current values.

## Related operations
- **Archive before delete:** Set `body.archived` = true, then call `Clockify.Client.Delete`\- **Resolve currencyId:** `Clockify.Currency.List` → match on `code` → use `id`\- **Unarchive:** Set `body.archived` = false

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; existing Clockify values typically remain unchanged.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

