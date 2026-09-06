---
id: clockify-client-create
title: "Clockify.Client.Create"
sidebar_label: "Clockify.Client.Create"
sidebar_position: 1
description: "Request and response contract for the Clockify.Client.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a client in a Clockify workspace from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/clients`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Client display name (must be unique in workspace) | — |
| `body.address` | No | string | Single-line address (concatenate BC Address + Address 2 + Post Code + City + Country) | — |
| `body.email` | No | string | Client contact email | — |
| `body.note` | No | string | Free-text note | — |
| `body.currencyId` | No | string | Clockify currency ID (NOT the ISO code). Omit for workspace default | `Clockify.Currency.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "body": { "name": "Acme Inc.", "address": "Main St 1, 101 Reykjavik, IS", "currencyId": "6a..." } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the created client object (includes `id`, `name`, `workspaceId`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Record the link: call `Data.Records.Set` on `Clockify Integration` with `BC Table No.`, `BC SystemId`, `BC Code` (the BC source record), `Clockify Type` = `client`, `Clockify Id` = the `id` from `data` in the response, `Clockify Workspace Id` = the workspace used, `Clockify Name` = display name. Set `Reversed` = `false`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Client name already exists in workspace | Use `Clockify.Client.List` to find existing client, or choose a different name |
| 401 | Unauthorized | Check API key on Clockify Setup |
| 403 | Forbidden | API key user lacks workspace admin role |

## Notes
- `currencyCode` is **silently ignored** — Clockify returns 201 but uses workspace default. Always use `currencyId`.\- `address` is a single free-text field; concatenate multi-line BC address fields before sending.

## Related operations
- **Resolve currencyId:** `Clockify.Currency.List` → match on `code` → use `id`\- **After creating:** Record integration link, then optionally create projects under this client\- **To update later:** `Clockify.Client.Update` (requires `clientId` from create response)\- **To delete later:** First archive (`Clockify.Client.Update` body `{ "archived": true }`), then `Clockify.Client.Delete`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; Clockify applies endpoint defaults.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

