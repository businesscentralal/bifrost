---
id: clockify-timesheet-approve
title: "Clockify.TimeSheet.Approve"
sidebar_label: "Clockify.TimeSheet.Approve"
sidebar_position: 31
description: "Request and response contract for the Clockify.TimeSheet.Approve Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits and approves open time-sheet lines whose sheet ends on or before a cut-off date.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-approve`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `endingDateTo` | No | string | Only approve sheets ending on or before this ISO date (YYYY-MM-DD). Defaults to the work date. | — |

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
`data` contains &#123; "status": "Success", "approvedLines": 24 &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
This message type is not tracked in the Clockify Integration table.

## Notes
- Runs the time-sheet approval engine (Submit + Approve) per line — not a Status field write.\- BC-side only; does not call Clockify.

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

