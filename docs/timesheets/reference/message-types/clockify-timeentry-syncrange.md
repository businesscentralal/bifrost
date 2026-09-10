---
id: clockify-timeentry-syncrange
title: "Clockify.TimeEntry.SyncRange"
sidebar_label: "Clockify.TimeEntry.SyncRange"
sidebar_position: 27
description: "Request and response contract for the Clockify.TimeEntry.SyncRange Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs all of a user's finished Clockify time entries in a date range to BC Job Journal Lines in a single call.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/sync-time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Source workspace ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify user ID whose entries to sync | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `start` | **Yes** | string | Range start in ISO-8601 UTC (inclusive) | — |
| `end` | **Yes** | string | Range end in ISO-8601 UTC (inclusive) | — |
| `journalTemplate` | No | string | BC Job Journal Template name (Code[10]). Defaults to the Clockify Job Journal Template on Clockify Setup. | — |
| `journalBatch` | No | string | BC Job Journal Batch name (Code[10]). Defaults to the Clockify Job Journal Batch on Clockify Setup. | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "userId": "63...", "start": "2026-06-01T00:00:00Z", "end": "2026-06-30T23:59:59Z", "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "processed": 12, "created": 8, "skipped": 3, "updated": 1, "corrected": 0, "errors": 0, "results": [ &#123; "entryId": "...", "result": "Created", "message": "..." &#125; ] &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. Each Clockify project/task/user in the range must be mapped in the Clockify Integration table.\2. The journal template and batch must exist in BC.\3. Only finished entries are synced — running timers (`end` = null) are excluded by the query.

## Integration tracking
Resolve existing links first: call `Data.Records.Get` on `Clockify Integration` with filter `Clockify Type` = `timeEntry`, `Reversed` = `false`. The `Clockify Id` field gives you the ID to pass to write operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 400 | Journal template/batch not configured | Set them on Clockify Setup or pass them in the request |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Reads entries from Clockify (paged), then writes Job Journal Lines in BC — combines `Clockify.TimeEntry.List` + `Clockify.TimeEntry.Sync`.\- Per-entry failures (e.g. a missing mapping) do NOT abort the batch; they are counted under `errors` and listed in `results`.\- Safe to re-run: already-synced unchanged entries return `Skipped`.

## Related operations
- **Resolve userId:** `Clockify.User.GetCurrent` or `Clockify.User.List`\- **Sync one entry:** `Clockify.TimeEntry.Sync`\- **Inspect entries first:** `Clockify.TimeEntry.List`

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

