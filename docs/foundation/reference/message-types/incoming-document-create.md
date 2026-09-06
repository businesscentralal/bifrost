---
id: incoming-document-create
title: "Incoming.Document.Create"
sidebar_label: "Incoming.Document.Create"
sidebar_position: 73
description: "Request and response contract for the Incoming.Document.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates a new `Incoming Document` from a file. The file is attached as the main attachment via the standard `Incoming Document.CreateIncomingDocument` + `AddAttachmentFromStream` flow.

## Direction
Inbound (write)

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fileName | Text | Yes | File name including extension (used to derive description and extension) |
| fileContent | Text (Base64) | Yes | Base64-encoded file bytes |

No `subject` is read. Other fields in `data` are ignored — populate vendor/date/etc. via subsequent `Data.Records.Set` or `Incoming.Document.Process`.

## Request Example
```json
{
  "type": "Incoming.Document.Create",
  "data": {
    "fileName": "invoice.pdf",
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
  "lineNo": 10000,
  "description": "invoice",
  "documentDate": "0001-01-01",
  "dueDate": "0001-01-01",
  "vendorNo": "",
  "vendorName": "",
  "documentStatus": "New",
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
| entryNo | Integer | New Incoming Document `Entry No.` (always positive) |
| id | Text | New Incoming Document `SystemId` (GUID without braces) |
| lineNo | Integer | `Line No.` of the created main attachment |
| description | Text | Derived from file name without extension |
| documentDate, dueDate | Text | Initially blank (`0001-01-01`) |
| vendorNo, vendorName | Text | Initially blank |
| documentStatus | Text | Initial status |
| dataExchangeType | Text | Initially blank |
| processed, posted | Boolean | Initially `false` |
| record | Object | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| error | Array | Initial error message entries (typically empty) |

## Errors
| Scenario | Error |
|----------|-------|
| Missing `fileName` | `fileName is required.` |
| Missing `fileContent` | `fileContent is required.` |

## Related Message Types
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

