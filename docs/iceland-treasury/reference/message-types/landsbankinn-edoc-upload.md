---
id: landsbankinn-edoc-upload
title: "Landsbankinn.EDoc.Upload"
sidebar_label: "Landsbankinn.EDoc.Upload"
sidebar_position: 121
description: "Request and response contract for the Landsbankinn.EDoc.Upload Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Uploads a single electronic document via POST /Documents (multipart/form-data).

## Request
```json
{
  "fileBase64": "<base64-encoded file>",
  "fileName": "invoice.pdf",
  "recipientNationalId": "<10-digit kennitala>",
  "senderNationalId": "<10-digit kennitala>",
  "documentTypeCode": "REIKNINGUR",
  "effectiveDate": "2026-01-15",
  "externalId": "INV-001",
  "reference": "Optional note"
}
```

## Response
Returns `{ "id": "<document-id>", "logEntryNo": N }`.

## Notes
- `senderNationalId` defaults to Company Information "Registration No." if omitted.
- Use `Landsbankinn.EDoc.DocumentTypes` to discover valid `documentTypeCode` values.
- `effectiveDate` is the gildistökudagur of the document.
- For XML uploads, `externalId` must match the User4 field in the XML content.

