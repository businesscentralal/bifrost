---
id: clockify-timeentry-synctotimesheet
title: "Clockify.TimeEntry.SyncToTimeSheet"
sidebar_label: "Clockify.TimeEntry.SyncToTimeSheet"
sidebar_position: 29
description: "Request and response contract for the Clockify.TimeEntry.SyncToTimeSheet Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs a Clockify time entry to the resource's open BC Time Sheet (line + detail) with deduplication and update detection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entry-timesheet`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID (mapped to a BC Resource) | `Clockify.User.GetCurrent → id` |
| `entryId` | **Yes** | string | Clockify time entry ID | `Clockify.TimeEntry.List → id` |
| `projectId` | **Yes** | string | Clockify project ID (mapped to BC Job No.) | `Clockify.Project.List → id` |
| `taskId` | **Yes** | string | Clockify task ID (mapped to BC Job Task No.) | `Clockify.Task.List → id` |
| `description` | No | string | Work description (becomes the time-sheet line description) | — |
| `start` | **Yes** | string | Start time in ISO-8601 UTC | — |
| `end` | **Yes** | string | End time in ISO-8601 UTC | — |
| `billable` | No | boolean | Whether the time is billable | — |
| `tagIds` | No | array | Clockify tag IDs used to resolve the Work Type | `Clockify.Tag.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json

```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "result": "Created|Updated|Skipped|Error", "message": "...", "entryId": "...", "hours": 4, "postingDate": "2026-06-09" &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The Clockify project/task/user must be mapped in the Clockify Integration table.\2. The resource must have an **open time sheet covering the entry date** — run `Clockify.TimeSheet.Create` first.

## Integration tracking
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` with filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Missing mapping | Ensure project/task/user mappings exist in the Clockify Integration table |
| 400 | No open time sheet | Run `Clockify.TimeSheet.Create`, then retry |

## Notes
- Writes to a **BC Time Sheet** (line + detail), not the Job Journal.\- Deduplicated by `entryId`: re-running returns `Skipped` when unchanged, `Updated` when hours/date changed.\- After approval, post the sheet with `Clockify.TimeSheet.Post`.

## Related operations
- **Populate sheets:** `Clockify.TimeSheet.Create`\- **Approve/post:** `Clockify.TimeSheet.Approve` → `Clockify.TimeSheet.Post`\- **Journal-direct alternative:** `Clockify.TimeEntry.Sync`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

