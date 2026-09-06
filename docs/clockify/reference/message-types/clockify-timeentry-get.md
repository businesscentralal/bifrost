---
id: clockify-timeentry-get
title: "Clockify.TimeEntry.Get"
sidebar_label: "Clockify.TimeEntry.Get"
sidebar_position: 23
description: "Request and response contract for the Clockify.TimeEntry.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single Clockify time entry by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The time entry ID to retrieve | `Clockify.TimeEntry.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "timeEntryId": "64..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the time-entry object (includes `id`, `start`, `end`, `duration`, `projectId`, `taskId`, `tagIds`, `billable`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Time entry not found | Verify timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Related operations
- **Find timeEntryId:** `Clockify.TimeEntry.List` (requires userId)\- **Update this entry:** `Clockify.TimeEntry.Update`\- **Sync to BC:** `Clockify.TimeEntry.Sync`

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

