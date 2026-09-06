---
id: clockify-timeentry-create
title: "Clockify.TimeEntry.Create"
sidebar_label: "Clockify.TimeEntry.Create"
sidebar_position: 21
description: "Request and response contract for the Clockify.TimeEntry.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a time entry for a user in a Clockify workspace from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/user/{userId}/time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID (NOT the BC user name) | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `body.start` | **Yes** | string | Start time in ISO-8601 UTC (e.g. 2026-06-09T08:00:00Z) | — |
| `body.end` | No | string | End time in ISO-8601 UTC. Omit to start a running timer. | — |
| `body.description` | No | string | Free-text description of the work performed | — |
| `body.projectId` | No | string | Clockify project ID (NOT the BC project number) | `Clockify.Project.List → id` |
| `body.taskId` | No | string | Clockify task ID | `Clockify.Task.List → id` |
| `body.tagIds` | No | array | Array of Clockify tag IDs | `Clockify.Tag.List → id` |
| `body.billable` | No | boolean | true = billable (overrides project default) | — |
| `body.type` | No | string | REGULAR (default) or BREAK | — |
| `body.customFields` | No | array | Array of &#123; customFieldId, value &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "userId": "63...", "body": { "start": "2026-06-09T08:00:00Z", "end": "2026-06-09T10:00:00Z", "description": "Consulting", "projectId": "60...", "taskId": "61...", "tagIds": [ "62..." ], "billable": true, "customFields": [ { "customFieldId": "64...", "value": "PO-1234" } ] } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the created time-entry object (includes `id`, `start`, `end`, `duration`, `projectId`, `taskId`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Record the link: call `Data.Records.Set` on `Clockify Integration` with `BC Table No.`, `BC SystemId`, `BC Code` (the BC source record), `Clockify Type` = `timeEntry`, `Clockify Id` = the `id` from `data` in the response, `Clockify Workspace Id` = the workspace used, `Clockify Name` = display name. Set `Reversed` = `false`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Overlapping time entry | Check existing entries for the same period via `Clockify.TimeEntry.List` |
| 404 | User or workspace not found | Verify userId via `Clockify.User.GetCurrent` or `Clockify.User.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- `start` must be ISO-8601 UTC. Clockify rejects local-time strings without offset.\- Omit `end` to start a **running timer**; send a later `Clockify.TimeEntry.Update` with `end` to stop it.\- `projectId`, `taskId`, and `tagIds` entries are Clockify internal IDs — names are silently ignored.\- `customFields` format: `{ "customFieldId": "...", "value": ... }`. Get IDs from `Clockify.CustomField.List`.\- `userId` in the URL is the Clockify user ID, NOT the BC user name.

## Related operations
- **Resolve userId:** `Clockify.User.GetCurrent` (API key owner) or `Clockify.User.List`\- **Resolve projectId:** `Clockify.Project.List` or Clockify Integration (type=project)\- **Resolve taskId:** `Clockify.Task.List` (requires projectId)\- **Resolve tagIds:** `Clockify.Tag.List`\- **Stop running timer:** `Clockify.TimeEntry.Update` with `end` field\- **Sync to BC:** `Clockify.TimeEntry.Sync` (posts to Job Journal)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; Clockify applies endpoint defaults.
- A time entry without `end` is in-progress (running timer). Stop the timer (set `end`) before syncing to BC Job Journal.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

