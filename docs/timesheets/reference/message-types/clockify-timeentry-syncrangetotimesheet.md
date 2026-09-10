---
id: clockify-timeentry-syncrangetotimesheet
title: "Clockify.TimeEntry.SyncRangeToTimeSheet"
sidebar_label: "Clockify.TimeEntry.SyncRangeToTimeSheet"
sidebar_position: 28
description: "Request and response contract for the Clockify.TimeEntry.SyncRangeToTimeSheet Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs all of a user's finished Clockify time entries in a date range to their open BC Time Sheets in one call.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entries-timesheet`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID whose entries to sync | `Clockify.User.GetCurrent → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json

```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "processed": 12, "created": 8, "skipped": 3, "updated": 1, "errors": 0, "results": [ ... ] &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Project/task/user mappings must exist in the Clockify Integration table.\2. Each entry date must fall within an **open time sheet** for the resource — run `Clockify.TimeSheet.Create` first.\3. Only finished entries are synced (running timers are excluded).

## Integration tracking
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` with filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Notes
- Reads entries from Clockify (paged), then writes **BC Time Sheets** — combines `Clockify.TimeEntry.List` + `Clockify.TimeEntry.SyncToTimeSheet`.\- Per-entry failures (missing mapping, no open sheet) are counted under `errors` and do not abort the batch.\- Safe to re-run: unchanged entries return `Skipped`.

## Related operations
- **Populate sheets:** `Clockify.TimeSheet.Create`\- **Approve/post:** `Clockify.TimeSheet.Approve` → `Clockify.TimeSheet.Post`\- **Journal-direct alternative:** `Clockify.TimeEntry.SyncRange`

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

