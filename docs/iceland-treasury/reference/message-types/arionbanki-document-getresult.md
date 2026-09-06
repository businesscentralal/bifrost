---
id: arionbanki-document-getresult
title: "Arionbanki.Document.GetResult"
sidebar_label: "Arionbanki.Document.GetResult"
sidebar_position: 19
description: "Request and response contract for the Arionbanki.Document.GetResult Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Polls the processing result of a previously uploaded document.

Direction: Outbound  
Content-Type: text/json

## Request
```json
{ "documentId": "<bank-assigned ID from Upload>" }
```

## Response
```json
{
  "status": "Success",
  "result": {
    "documentId": "abc123",
    "personId": "1234567890",
    "documentType": "LAUN",
    "documentName": "Launaseðill Jan 2026",
    "processingStatus": "Completed",
    "recordsProcessed": 1,
    "recordsSkipped": 0,
    "uploadDate": "2026-01-15"
  }
}
```

Processing statuses: Received, InProgress, Completed, CompletedWithErrors, Failed.

