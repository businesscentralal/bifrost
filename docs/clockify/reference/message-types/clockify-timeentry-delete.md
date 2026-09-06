---
id: clockify-timeentry-delete
title: "Clockify.TimeEntry.Delete"
sidebar_label: "Clockify.TimeEntry.Delete"
sidebar_position: 22
description: "Request and response contract for the Clockify.TimeEntry.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a Clockify time entry by ID.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The time entry ID to delete | `Clockify.TimeEntry.List → id` |

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
`data` contains empty body (HTTP 204 No Content on success).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `timeEntry`, `Clockify Id` = the deleted ID, `Reversed` = `false`) and set `Reversed` = `true` with `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 404 | Time entry not found | Verify timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- No archive step required — time entries can be deleted directly.\- If the entry was already synced to BC, consider reversing the Job Journal Line in BC as well.

## Related operations
- **Alternative:** Update with corrected times instead of deleting (`Clockify.TimeEntry.Update`)\- **After delete in BC context:** Reverse or delete the corresponding Job Journal Line

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

