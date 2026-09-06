---
id: incoming-document-process
title: "Incoming.Document.Process"
sidebar_label: "Incoming.Document.Process"
sidebar_position: 75
description: "Request and response contract for the Incoming.Document.Process Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Processes an `Incoming Document` by invoking its standard BC processing — creating a linked purchase invoice, credit memo, or journal line according to the document's Data Exchange Type and configuration. Work runs inside `Codeunit.Run` so AL errors are captured and returned as a JSON `error` field rather than rolling back the outer transaction.

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

Request body is not read.

## Request Example
```json
{ "type": "Incoming.Document.Process", "subject": "1234" }
```

## Response Shape (success)
```json
{
  "status": "Success",
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "entryNo": 1234,
  "id": "..."
}
```

## Response Shape (BC processing produced errors)
```json
{
  "status": "Error",
  "error": [ { "id": "...", "message": "...", "type": "...", "table": { "id": 0, "name": "" }, "field": { "id": 0, "name": "" }, "context": { }, "additionalInformation": "" } ],
  "entryNo": 1234,
  "id": "..."
}
```

## Response Shape (AL runtime error caught by `Codeunit.Run`)
```json
{ "status": "Error", "error": "<message>" }
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| record | Object | Present on success — `{ tableNo, tableName, tableCaption, recordSystemId }` |
| error | Array or Text | Array of BC `Error Message` entries when standard processing fails; a single Text when `Codeunit.Run` traps an AL runtime error |
| entryNo | Integer | Incoming Document `Entry No.` (always set when the document was found) |
| id | Text | Incoming Document `SystemId` (always set when the document was found) |

## Errors
| Scenario | Surface | Message |
|----------|---------|---------|
| Subject does not resolve | AL error → `error` field | `Incoming Document {subject} not found.` |
| Document has no main attachment | AL error → `error` field | `Incoming Document {entryNo} has no main attachment.` |
| Document already posted | AL error → `error` field | `Incoming Document {entryNo} has already been posted.` |

## Related Message Types
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`

