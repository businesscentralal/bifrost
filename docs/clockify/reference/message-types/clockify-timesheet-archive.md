---
id: clockify-timesheet-archive
title: "Clockify.TimeSheet.Archive"
sidebar_label: "Clockify.TimeSheet.Archive"
sidebar_position: 32
description: "Request and response contract for the Clockify.TimeSheet.Archive Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Archives fully posted time sheets and removes empty posted sheets ending before the work date.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-archive`

## Request example
```json

```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains &#123; "status": "Success", "archived": 6 &#125;.

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
This message type is not tracked in the Clockify Integration table.

## Notes
- Moves fully posted, non-open sheets to the archive; deletes empty posted sheets.\- BC-side only; does not call Clockify.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

