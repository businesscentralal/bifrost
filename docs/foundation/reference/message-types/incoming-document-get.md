---
id: incoming-document-get
title: "Incoming.Document.Get"
sidebar_label: "Incoming.Document.Get"
sidebar_position: 74
description: "Request and response contract for the Incoming.Document.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns header fields for an `Incoming Document` together with its main attachment (if any) and any additional attachments. Attachment file content is returned as Base64.

## Direction
Outbound

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
{ "type": "Incoming.Document.Get", "subject": "1234" }
```

## Response Shape
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "...",
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
  "error": [],
  "mainAttachment": { "lineNo": 10000, "fileName": "invoice.pdf", "fileContent": "..." },
  "additionalAttachments": [
    { "lineNo": 20000, "fileName": "supplement.pdf", "fileContent": "..." }
  ]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` |
| entryNo | Integer | Incoming Document `Entry No.` |
| id | Text | Incoming Document `SystemId` (GUID without braces) |
| description | Text | Document description |
| documentDate, dueDate | Text | Culture-invariant dates |
| vendorNo, vendorName | Text | Vendor info |
| documentStatus, dataExchangeType | Text | Status fields |
| processed, posted | Boolean | Status flags |
| record | Object | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| error | Array | Incoming Document `Error Message` entries (see Error Object below) |
| mainAttachment | Object | Present only when a main attachment exists |
| additionalAttachments | Array | All non-main attachments (may be empty) |

## Attachment Object
| Field | Type | Description |
|-------|------|-------------|
| lineNo | Integer | Attachment `Line No.` |
| fileName | Text | `Name` + `.` + `File Extension` |
| fileContent | Text (Base64) | Base64-encoded file bytes |

## Error Object (entries in `error` array)
| Field | Type | Description |
|-------|------|-------------|
| id | Text | Error entry identifier |
| message | Text | Error description |
| type | Text | Error category |
| table | Object | `{ id, name }` of the related table |
| field | Object | `{ id, name }` of the related field |
| context | Object | `{ tableNumber, fieldNumber, fieldName }` of the context record |
| additionalInformation | Text | Extra details if available |

## Errors
| Scenario | Error |
|----------|-------|
| Subject does not resolve | `Incoming Document {subject} not found.` |

## Related Message Types
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

