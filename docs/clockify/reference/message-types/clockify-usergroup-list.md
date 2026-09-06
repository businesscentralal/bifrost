---
id: clockify-usergroup-list
title: "Clockify.UserGroup.List"
sidebar_label: "Clockify.UserGroup.List"
sidebar_position: 39
description: "Request and response contract for the Clockify.UserGroup.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the user groups defined in a Clockify workspace.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/user-groups`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.name` | No | string | Filter: partial name match | — |
| `query.projectId` | No | string | Filter: groups assigned to this project | `Clockify.Project.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1 } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of user-group objects (each with `id`, `name`, `workspaceId`, `userIds`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use `id` values for project `userGroupIds`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Each group has a `userIds` array listing member Clockify user IDs.\- Use the `id` value as a member of `userGroupIds` in `Clockify.Project.Create` / `Clockify.Project.Update`. Group **names** are not accepted on those write paths.

## Related operations
- **Assign group to project:** `Clockify.Project.Create` or `Clockify.Project.Update` (body.userGroupIds)\- **List group members:** Check `userIds` array in response; resolve to names via `Clockify.User.List`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

