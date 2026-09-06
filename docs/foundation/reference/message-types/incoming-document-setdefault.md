---
id: incoming-document-setdefault
title: "Incoming.Document.SetDefault"
sidebar_label: "Incoming.Document.SetDefault"
sidebar_position: 76
description: "Request and response contract for the Incoming.Document.SetDefault Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Promotes an existing attachment on an `Incoming Document` to become the main (default) attachment. The implementation deletes all attachments and re-inserts them, placing the requested `lineNo` first (so it becomes the new main attachment with `Line No. 10000`), then the remaining attachments in their original order. At least 2 attachments must exist.

## Direction
Inbound (write)

## Response Content Type
`text/json`

## Identifier Resolution
The `subject` identifies the target `Incoming Document`:
1. If `subject` is a valid GUID — interpreted as `SystemId`
2. Otherwise — interpreted as `Entry No.` (integer)

## Request Parameters
| Field | Location | Type | Required | Description |
|-------|----------|------|----------|-------------|
| subject | Bifrost | Text | Yes | Incoming Document `Entry No.` or `SystemId` GUID |
| lineNo | data | Integer | Yes | `Line No.` of the attachment to promote to main |

## Request Example
```json
{
  "type": "Incoming.Document.SetDefault",
  "subject": "1234",
  "data": { "lineNo": 20000 }
}
```

## Response Shape (success)
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "..."
}
```

## Response Shape (failure)
```json
{ "status": "Error", "error": "<message>" }
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| entryNo | Integer | Incoming Document `Entry No.` (on success) |
| id | Text | Incoming Document `SystemId` GUID without braces (on success) |
| error | Text | Error message (on failure) |

## Errors
| Scenario | Error |
|----------|-------|
| Missing `lineNo` | `lineNo is required.` |
| Subject does not resolve | `Incoming Document {subject} not found.` |
| Fewer than 2 attachments | `At least 2 attachments are required to set a default.` |
| `lineNo` does not exist on the document | `Attachment with lineNo {lineNo} not found.` |

## Notes
- The operation reassigns `Line No.` values — the promoted attachment becomes `10000`, the others follow.
- The operation runs through `Codeunit.Run` so any AL runtime error is captured into the `error` field rather than rolling back the outer transaction.

## Related Message Types
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.Process`

