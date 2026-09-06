---
id: clockify-project-update
title: "Clockify.Project.Update"
sidebar_label: "Clockify.Project.Update"
sidebar_position: 12
description: "Request and response contract for the Clockify.Project.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing Clockify project from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify project ID to update | `Clockify Integration table → Clockify Id (type=project)` |
| `body.name` | No | string | Project display name | — |
| `body.clientId` | No | string | Clockify client ID | `Clockify.Client.List → id` |
| `body.isPublic` | No | boolean | Visibility to all workspace members | — |
| `body.billable` | No | boolean | Default billable status for time entries | — |
| `body.color` | No | string | Hex colour code | — |
| `body.note` | No | string | Free-text description | — |
| `body.archived` | No | boolean | Set true to archive (required before delete) | — |
| `body.userGroupIds` | No | array | Array of Clockify user-group IDs | `Clockify.UserGroup.List → id` |
| `body.customFields` | No | array | Array of &#123; customFieldId, status, defaultValue &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "projectId": "60...", "body": { "name": "Implementation 2026", "archived": false, "billable": true, "customFields": [ { "customFieldId": "62...", "status": "VISIBLE", "defaultValue": "Iceland" } ] } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the updated project object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
If this changes which Business Central record the project maps to, update the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `project`, `Clockify Id` = the ID, `Reversed` = `false`). Update `BC SystemId`, `BC Code`, and `Clockify Name` with `Data.Records.Set`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Project name already exists | Choose a different name |
| 404 | Project not found | Verify projectId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- `clientId` and `userGroupIds` require Clockify IDs — names and BC keys are silently ignored.\- `customFields` format: `{ "customFieldId": "...", "status": "VISIBLE"|"INVISIBLE", "defaultValue": ... }`. Get `customFieldId` from `Clockify.CustomField.List`.\- Setting `archived: true` is the **required first step** before `Clockify.Project.Delete`.\- Send only fields you want to change; omitted fields retain current values.

## Related operations
- **Archive before delete:** Set `body.archived` = true, then `Clockify.Project.Delete`\- **Resolve customFieldId:** `Clockify.CustomField.List` → `id`\- **Resolve clientId:** `Clockify.Client.List` or Clockify Integration (type=client)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; existing Clockify values typically remain unchanged.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

