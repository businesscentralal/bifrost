---
id: clockify-workspace-list
title: "Clockify.Workspace.List"
sidebar_label: "Clockify.Workspace.List"
sidebar_position: 40
description: "Request and response contract for the Clockify.Workspace.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the Clockify workspaces the configured API key can access.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces`

## Request example
```json
{ }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of workspace objects (each with `id`, `name`, `memberships`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use the returned `id` as `workspaceId` in all other Clockify calls.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- No parameters needed — returns all workspaces accessible by the API key.\- Most Clockify operations require a `workspaceId`. Call this first to resolve it.\- The Clockify Setup stores a default workspace; this call is only needed to discover alternatives or verify the configured one.

## Related operations
- **Get current user:** `Clockify.User.GetCurrent` (also returns `activeWorkspace`)\- **All other operations:** Pass workspace `id` as `workspaceId` parameter

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

