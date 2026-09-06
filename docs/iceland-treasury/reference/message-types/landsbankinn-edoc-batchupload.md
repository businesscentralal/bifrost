---
id: landsbankinn-edoc-batchupload
title: "Landsbankinn.EDoc.BatchUpload"
sidebar_label: "Landsbankinn.EDoc.BatchUpload"
sidebar_position: 112
description: "Request and response contract for the Landsbankinn.EDoc.BatchUpload Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Uploads a batch of electronic documents via POST /DocumentCreationBatches.

## Request
```json
{
  "fileBase64": "<base64-encoded ZIP or XML file>",
  "fileName": "batch.zip",
  "senderNationalId": "<10-digit kennitala>",
  "documentType": "REIKNINGUR",
  "crossReferences": "[{\"key\":\"...\",\"keyType\":\"claim\",\"documentId\":\"...\"}]"
}
```

## File Format
Either:
- A single XML file representing one or more documents
- A ZIP archive containing PDF files and a manifest.json

## Response
HTTP 202 Accepted — batch is processed asynchronously.
Returns `{ "status": "Accepted", "httpStatus": 202, "logEntryNo": N }`.

## Notes
- `documentType` must be a value from GET /DocumentTypes where `documentType` field is non-null.
- `crossReferences` is optional — a JSON array string of CreateCrossReferenceRequest objects.

