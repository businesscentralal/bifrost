---
id: clockify-timeentry-list
title: "Clockify.TimeEntry.List"
sidebar_label: "Clockify.TimeEntry.List"
sidebar_position: 24
description: "Request and response contract for the Clockify.TimeEntry.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists a user's time entries in a Clockify workspace, with optional date/project filters via the query object.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/user/{userId}/time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID whose entries to list | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.start` | No | string | Filter: entries starting at or after this ISO-8601 UTC timestamp | — |
| `query.end` | No | string | Filter: entries ending at or before this ISO-8601 UTC timestamp | — |
| `query.project` | No | string | Filter: Clockify project ID | `Clockify.Project.List → id` |
| `query.task` | No | string | Filter: Clockify task ID | `Clockify.Task.List → id` |
| `query.in-progress` | No | boolean | Filter: true returns running timers only (`end` = null), false returns finished entries only (`end` is set). | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "userId": "63...", "query": { "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "in-progress": false, "page-size": 50, "page": 1 } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of time-entry objects (each with `id`, `start`, `end`, `duration`, `projectId`, `taskId`, `tagIds`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use `id` values for Get/Update/Delete/Sync.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | User not found | Verify userId via `Clockify.User.GetCurrent` or `Clockify.User.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Time entries are **per-user** — you must specify whose entries to list.\- Use `start` and `end` filters to scope to a date range (ISO-8601 UTC).\- `query.in-progress = true` returns only running timers (`end` = null).\- `query.in-progress = false` returns only finished entries (`end` has a value).\- For `Clockify.TimeEntry.Sync`, prefer finished entries only (set `query.in-progress = false`).

## Related operations
- **Resolve userId:** `Clockify.User.GetCurrent` (API key owner) or `Clockify.User.List`\- **Get single entry:** `Clockify.TimeEntry.Get`\- **Sync entries to BC:** `Clockify.TimeEntry.Sync`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.
- `query.in-progress = true` returns running timers (`end` = null). `query.in-progress = false` returns finished entries (`end` has a value).

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

