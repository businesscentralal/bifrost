---
id: arionbanki-document-getresults
title: "Arionbanki.Document.GetResults"
sidebar_label: "Arionbanki.Document.GetResults"
sidebar_position: 20
description: "Request and response contract for the Arionbanki.Document.GetResults Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries processing results for all documents uploaded in a date range.

Direction: Outbound  
Content-Type: text/json

## Request
```json
{ "dateFrom": "2026-01-01", "dateTo": "2026-01-31" }
```

## Response
```json
{
  "status": "Success",
  "count": 2,
  "results": [
    { "documentId": "abc", "processingStatus": "Completed", ... },
    { "documentId": "def", "processingStatus": "Failed", ... }
  ]
}
```

