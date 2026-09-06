---
id: clockify-user-list
title: "Clockify.User.List"
sidebar_label: "Clockify.User.List"
sidebar_position: 38
description: "Request and response contract for the Clockify.User.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the users in a Clockify workspace.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/users`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `user`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.email` | No | string | Filter: exact email match | — |
| `query.name` | No | string | Filter: partial name match | — |
| `query.status` | No | string | Filter: ACTIVE, PENDING, DECLINED, INACTIVE | — |

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
`data` contains an array of user objects (each with `id`, `name`, `email`, `status`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use returned `id` values for time-entry and assignment operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Returns all members of the workspace, including pending invitations.\- The `id` field is the `userId` needed for `Clockify.TimeEntry.Create/List` and `memberships` in project/task operations.

## Related operations
- **Get API key owner only:** `Clockify.User.GetCurrent`\- **Assign to projects:** Use `id` in `memberships` array of `Clockify.Project.Create/Update`\- **Map to BC Resource:** Store mapping in Clockify Integration table (type=user)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

