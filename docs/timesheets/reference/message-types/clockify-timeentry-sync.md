---
id: clockify-timeentry-sync
title: "Clockify.TimeEntry.Sync"
sidebar_label: "Clockify.TimeEntry.Sync"
sidebar_position: 25
description: "Request and response contract for the Clockify.TimeEntry.Sync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs a Clockify time entry to a BC Job Journal Line with deduplication, update detection, and correction posting.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entry`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID | `Clockify.User.GetCurrent → id` |
| `entryId` | **Yes** | string | Clockify time entry ID to sync | `Clockify.TimeEntry.List → id` |
| `projectId` | **Yes** | string | Clockify project ID (mapped to BC Job No.) | `Clockify.Project.List → id` |
| `taskId` | No | string | Clockify task ID (mapped to BC Job Task No.) | `Clockify.Task.List → id` |
| `description` | No | string | Work description (becomes Journal Line Description) | — |
| `start` | **Yes** | string | Start time in ISO-8601 UTC | — |
| `end` | **Yes** | string | End time in ISO-8601 UTC | — |
| `billable` | No | boolean | Whether the time is billable | — |
| `tagIds` | No | array | Clockify tag IDs. The first tag linked to a Work Type (TAG integration row) sets the Job Journal Line Work Type; otherwise the Clockify Default Work Type on Clockify Setup is used. | `Clockify.Tag.List → id` |
| `journalTemplate` | No | string | BC Job Journal Template name (Code[10]). Defaults to the Clockify Job Journal Template on Clockify Setup. | — |
| `journalBatch` | No | string | BC Job Journal Batch name (Code[10]). Defaults to the Clockify Job Journal Batch on Clockify Setup. | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "userId": "63...", "entryId": "68...", "projectId": "6a...", "taskId": "6a...", "description": "Testing", "start": "2026-06-09T12:00:00Z", "end": "2026-06-09T16:00:00Z", "billable": true, "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "result": "Created|Skipped|Updated|Corrected|Error", "message": "..." &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The Clockify project must be mapped to a BC Job (via Clockify Integration table, type=project).\2. The Clockify task must be mapped to a BC Job Task (via Clockify Integration table, type=task).\3. The journal template and batch must exist in BC.\4. The Clockify user must be mapped to a BC Resource (via Clockify Integration table, type=user).

## Integration tracking
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` with filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Missing required mapping | Ensure project/task/user mappings exist in Clockify Integration table |
| 400 | Journal template/batch not found | Verify template and batch names exist in BC |
| 400 | In-progress entry | Stop the timer first; `Clockify.TimeEntry.Sync` requires `end` to be set |

## Notes
- This is a **BC-side** operation — it does NOT call the Clockify API. It creates/updates a Job Journal Line in BC.\- **Deduplication:** Uses `entryId` to detect if already synced. Returns `Skipped` if unchanged.\- **Update detection:** If the entry was previously synced but Clockify data changed, returns `Updated`.\- **Correction posting:** If the entry was already posted to a Job Ledger Entry, posts a correction (reversal + new). Returns `Corrected`.\- **In-progress protection:** Entries with `end` = null are rejected and never written to Job Journal.\- **Result values:** `Created` (new line), `Skipped` (already synced, unchanged), `Updated` (journal line updated), `Corrected` (posted entry corrected), `Error` (failed with message).

## Related operations
- **Get entries to sync:** `Clockify.TimeEntry.List` (filter by date range)\- **Verify mappings:** `Data.Records.Get` on Clockify Integration (type=project/task/user)\- **Set up mappings:** `Data.Records.Set` on Clockify Integration

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- In-progress entries (`end` missing/null) are rejected by design and never written to BC Job Journal.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

