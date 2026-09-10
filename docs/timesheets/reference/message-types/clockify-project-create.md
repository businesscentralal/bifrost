---
id: clockify-project-create
title: "Clockify.Project.Create"
sidebar_label: "Clockify.Project.Create"
sidebar_position: 8
description: "Request and response contract for the Clockify.Project.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a project in a Clockify workspace from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/projects`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Project display name (must be unique in workspace) | — |
| `body.clientId` | No | string | Clockify client ID to associate (NOT the BC customer number) | `Clockify.Client.List → id` |
| `body.isPublic` | No | boolean | true = visible to all workspace members (default true) | — |
| `body.billable` | No | boolean | true = time entries default to billable | — |
| `body.color` | No | string | Hex colour code (e.g. #f44336) | — |
| `body.note` | No | string | Free-text project description | — |
| `body.hourlyRate` | No | object | &#123; "amount": &lt;cents>, "currency": "USD" &#125; | — |
| `body.userGroupIds` | No | array | Array of Clockify user-group IDs | `Clockify.UserGroup.List → id` |
| `body.memberships` | No | array | Array of &#123; "userId": "...", "hourlyRate": &#123;...&#125; &#125; | `Clockify.User.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "body": { "name": "Implementation", "clientId": "60...", "isPublic": false, "billable": true, "color": "#f44336", "userGroupIds": [ "61..." ] } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the created project object (includes `id`, `name`, `clientId`, `workspaceId`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Record the link: call `Data.Records.Set` on `Clockify Integration` with `BC Table No.`, `BC SystemId`, `BC Code` (the BC source record), `Clockify Type` = `project`, `Clockify Id` = the `id` from `data` in the response, `Clockify Workspace Id` = the workspace used, `Clockify Name` = display name. Set `Reversed` = `false`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Project name already exists | Use `Clockify.Project.List` to find existing, or choose a different name |
| 401 | Unauthorized | Check API key on Clockify Setup |
| 403 | Forbidden | API key user lacks workspace admin role |

## Notes
- `clientId` must be the Clockify internal ID (from `Clockify.Client.List`), not a BC customer number.\- `userGroupIds` requires Clockify group IDs; group names are silently ignored.\- Custom field defaults cannot be set at creation — create the project first, then call `Clockify.Project.Update` with `customFields` array.

## Related operations
- **Resolve clientId:** `Clockify.Client.List` or Clockify Integration (type=client)\- **Resolve userGroupIds:** `Clockify.UserGroup.List` → `id`\- **Set custom fields after create:** `Clockify.Project.Update` with `customFields`\- **Add tasks:** `Clockify.Task.Create` (requires project `id` from response)\- **To delete later:** Archive first (`Clockify.Project.Update` → `archived: true`), then `Clockify.Project.Delete`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; Clockify applies endpoint defaults.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

