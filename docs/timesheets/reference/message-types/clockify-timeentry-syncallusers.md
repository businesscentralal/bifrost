---
id: clockify-timeentry-syncallusers
title: "Clockify.TimeEntry.SyncAllUsers"
sidebar_label: "Clockify.TimeEntry.SyncAllUsers"
sidebar_position: 26
description: "Request and response contract for the Clockify.TimeEntry.SyncAllUsers Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs finished Clockify time entries in a date range for every mapped user, to time sheets (default) or the Job Journal.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-all-users`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source workspace ID | `Clockify.Workspace.List → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |
| `target` | No | string | 'timesheet' (default) writes BC Time Sheets; 'journal' writes Job Journal lines. | — |
| `journalTemplate` | No | string | Job Journal Template (Code[10]) — used when target=journal. Defaults to Clockify Setup. | — |
| `journalBatch` | No | string | Job Journal Batch (Code[10]) — used when target=journal. Defaults to Clockify Setup. | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "target": "timesheet" }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "target": "timesheet", "users": 5, "created": 40, "skipped": 3, "updated": 2, "errors": 1, "userResults": [ &#123; "userId": "63...", "processed": 9, "created": 8, ... &#125; ] &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Each Clockify user must be mapped to a BC Resource (USER integration row).\2. For target=timesheet, each entry date needs an open time sheet — run `Clockify.TimeSheet.Create` first.\3. Project/task mappings must exist.

## Integration tracking
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` with filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Notes
- Restores the legacy per-user auto-discovery: iterates every USER mapping, no need to pass `userId`.\- Per-user and per-entry failures are counted and reported; they never abort the batch.\- Safe to re-run: unchanged entries return `Skipped`.

## Related operations
- **Single user, time sheet:** `Clockify.TimeEntry.SyncRangeToTimeSheet`\- **Single user, journal:** `Clockify.TimeEntry.SyncRange`\- **Seed sheets:** `Clockify.TimeSheet.Create`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

