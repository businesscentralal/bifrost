---
id: arionbanki-document-upload
title: "Arionbanki.Document.Upload"
sidebar_label: "Arionbanki.Document.Upload"
sidebar_position: 21
description: "Request and response contract for the Arionbanki.Document.Upload Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Uploads an electronic document (PDF or XML) to Arion banki for
distribution through all Icelandic netbanks via RB.

Direction: Inbound  
Content-Type: text/json

## Request
```json
{
  "personId": "1234567890",
  "documentType": "LAUN",
  "documentName": "Launaseðill Jan 2026",
  "fileContent": "<base64-encoded PDF or XML>"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| personId | Yes | Kennitala of the document recipient |
| documentType | Yes | 1–4 char type code (bank-defined) |
| documentName | Yes | Display name of the document |
| fileContent | Yes | Base64-encoded file (PDF or XML) |

## Response
```json
{ "status": "Success", "documentId": "<bank-assigned ID>" }
```

Use the returned `documentId` with `Arionbanki.Document.GetResult` to poll processing status.

