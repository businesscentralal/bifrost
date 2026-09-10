---
id: clockify-timesheet-reject
title: "Clockify.TimeSheet.Reject"
sidebar_label: "Clockify.TimeSheet.Reject"
sidebar_position: 35
description: "Request and response contract for the Clockify.TimeSheet.Reject Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Rejects submitted time-sheet lines whose sheet ends on or before a cut-off date.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-reject`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `endingDateTo` | No | string | Only reject sheets ending on or before this ISO date (YYYY-MM-DD). Defaults to the work date. | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "endingDateTo": "2026-06-30" }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "status": "Success", "rejectedLines": 3 &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
This message type is not tracked in the Clockify Integration table.

## Notes
- Runs the time-sheet approval engine (Reject) on submitted lines — not a Status field write.\- BC-side only; does not call Clockify.

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

