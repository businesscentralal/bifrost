---
id: clockify-client-list
title: "Clockify.Client.List"
sidebar_label: "Clockify.Client.List"
sidebar_position: 4
description: "Request and response contract for the Clockify.Client.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the clients in a Clockify workspace.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/clients`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.archived` | No | boolean | Filter: true=archived only, false=active only, omit=all | — |
| `query.name` | No | string | Filter: partial name match (case-insensitive) | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1, "archived": false } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of client objects (each with `id`, `name`, `workspaceId`, `archived`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use the returned `id` values for subsequent create/update/delete calls.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |
| 403 | Forbidden | API key user lacks workspace access |

## Related operations
- **Get single client:** `Clockify.Client.Get` (when you have the ID)\- **Create new client:** `Clockify.Client.Create`\- **Use for ID resolution:** Match response `name` to BC Customer Name → extract `id` for write operations

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

