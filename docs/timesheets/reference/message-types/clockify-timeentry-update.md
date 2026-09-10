---
id: clockify-timeentry-update
title: "Clockify.TimeEntry.Update"
sidebar_label: "Clockify.TimeEntry.Update"
sidebar_position: 30
description: "Request and response contract for the Clockify.TimeEntry.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates an existing Clockify time entry from the request body.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The time entry ID to update | `Clockify.TimeEntry.List → id` |
| `body.start` | No | string | Start time (ISO-8601 UTC) | — |
| `body.end` | No | string | End time (ISO-8601 UTC). Setting this on an open entry **stops the timer**. | — |
| `body.description` | No | string | Free-text description | — |
| `body.projectId` | No | string | Clockify project ID | `Clockify.Project.List → id` |
| `body.taskId` | No | string | Clockify task ID | `Clockify.Task.List → id` |
| `body.tagIds` | No | array | Array of tag IDs. **Empty array clears all tags**; omit to keep current. | `Clockify.Tag.List → id` |
| `body.billable` | No | boolean | Override billable status | — |
| `body.customFields` | No | array | Array of &#123; customFieldId, value &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "timeEntryId": "64...", "body": { "start": "2026-06-09T08:00:00Z", "end": "2026-06-09T11:00:00Z", "description": "Consulting (revised)", "billable": true, "customFields": [ { "customFieldId": "65...", "value": "PO-1234" } ] } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the updated time-entry object.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
If this changes which Business Central record the timeEntry maps to, update the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `timeEntry`, `Clockify Id` = the ID, `Reversed` = `false`). Update `BC SystemId`, `BC Code`, and `Clockify Name` with `Data.Records.Set`.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Overlapping time entry | Adjust start/end to avoid overlap with existing entries |
| 404 | Time entry not found | Verify timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Setting `end` on an entry with no end **stops the running timer**.\- `tagIds: []` (empty array) **clears all tags**; omitting `tagIds` entirely leaves existing tags unchanged.\- Send only fields you want to change; omitted fields retain current values.\- `customFields` format: `{ "customFieldId": "...", "value": ... }`. Get IDs from `Clockify.CustomField.List`.

## Related operations
- **Stop running timer:** Send `{ "end": "<ISO-8601 UTC>" }`\- **Delete instead:** `Clockify.TimeEntry.Delete`\- **Sync updated entry to BC:** `Clockify.TimeEntry.Sync`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- Optional `body.*` fields omitted from the request are not sent to Clockify; existing Clockify values typically remain unchanged.
- A time entry without `end` is in-progress (running timer). Stop the timer (set `end`) before syncing to BC Job Journal.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

