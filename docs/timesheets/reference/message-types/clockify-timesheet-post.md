---
id: clockify-timesheet-post
title: "Clockify.TimeSheet.Post"
sidebar_label: "Clockify.TimeSheet.Post"
sidebar_position: 34
description: "Request and response contract for the Clockify.TimeSheet.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Transfers approved, unposted time-sheet detail into a Job Journal batch and posts the lines.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-post`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `journalTemplate` | No | string | Job Journal Template name (Code[10]). Defaults to the Clockify Job Journal Template on Clockify Setup. | — |
| `journalBatch` | No | string | Job Journal Batch name (Code[10]). Defaults to the Clockify Job Journal Batch on Clockify Setup. | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "status": "Success", "postedLines": 24 &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
This message type is not tracked in the Clockify Integration table.

## Notes
- Posts approved time-sheet detail to the Job Journal via `Job Jnl.-Post Line`.\- BC-side only; does not call Clockify.\- Only lines with `Type = Job`, `Status = Approved`, and not yet posted are included.

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

