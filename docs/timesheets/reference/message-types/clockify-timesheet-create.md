---
id: clockify-timesheet-create
title: "Clockify.TimeSheet.Create"
sidebar_label: "Clockify.TimeSheet.Create"
sidebar_position: 33
description: "Request and response contract for the Clockify.TimeSheet.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates upcoming weekly time sheets for every time-sheet resource (No. Series + owner + period handled).

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-create`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `weeksAhead` | No | integer | Target number of upcoming sheets per resource (default 4). | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "weeksAhead": 4 }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "status": "Success", "created": 8 &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
This message type is not tracked in the Clockify Integration table.

## Notes
- BC-side only; does not call Clockify.\- Idempotent: only fills the gap up to `weeksAhead` sheets per resource.\- Requires Resources Setup `Time Sheet Nos.` and resources with `Use Time Sheet` = true.

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

