---
id: incoming-document-attach
title: "Incoming.Document.Attach"
sidebar_label: "Incoming.Document.Attach"
sidebar_position: 72
description: "Request and response contract for the Incoming.Document.Attach Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Adds a supplemental file attachment to an existing `Incoming Document`. The file is appended as a new `Incoming Document Attachment` line; whether it becomes the main attachment is governed by standard BC `AddAttachmentFromStream` behavior (an additional attachment when a main attachment already exists).

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
| fileName | data | Text | Yes | File name including extension (e.g. `invoice.pdf`) |
| fileContent | data | Text (Base64) | Yes | Base64-encoded file bytes |

## Request Example
```json
{
  "type": "Incoming.Document.Attach",
  "subject": "1234",
  "data": {
    "fileName": "supplement.pdf",
    "fileContent": "JVBERi0xLjQK..."
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "...",
  "lineNo": 20000,
  "description": "...",
  "documentDate": "2025-01-15",
  "dueDate": "2025-02-15",
  "vendorNo": "V00010",
  "vendorName": "...",
  "documentStatus": "...",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "error": []
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` |
| entryNo | Integer | Incoming Document `Entry No.` |
| id | Text | Incoming Document `SystemId` (GUID without braces) |
| lineNo | Integer | `Line No.` of the newly added attachment |
| description | Text | Document description |
| documentDate | Text | Culture-invariant date |
| dueDate | Text | Culture-invariant date |
| vendorNo | Text | Vendor No. on the document |
| vendorName | Text | Vendor Name |
| documentStatus | Text | Document status |
| dataExchangeType | Text | Data Exchange Type |
| processed | Boolean | Re-read after attachment add |
| posted | Boolean | True if a posted document exists |
| record | Object | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| error | Array | Incoming Document `Error Message` entries (typically empty on success) |

## Errors
| Scenario | Error |
|----------|-------|
| Missing `fileName` | `fileName is required.` |
| Missing `fileContent` | `fileContent is required.` |
| Subject does not resolve | `Incoming Document {subject} not found.` |

## Related Message Types
- `Incoming.Document.Create`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

