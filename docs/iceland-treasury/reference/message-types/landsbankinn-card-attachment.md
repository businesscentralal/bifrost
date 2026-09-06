---
id: landsbankinn-card-attachment
title: "Landsbankinn.Card.Attachment"
sidebar_label: "Landsbankinn.Card.Attachment"
sidebar_position: 78
description: "Request and response contract for the Landsbankinn.Card.Attachment Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads a transaction attachment (receipt) by its ID.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "attachmentId": "abc-123-def",         // (required)
  "createIncomingDocument": false         // (optional, default false)
}
```

## Response (createIncomingDocument: false)
```json
{
  "attachmentId": "abc-123-def",
  "contentType": "application/pdf",
  "content": "<base64-encoded>"
}
```

## Response (createIncomingDocument: true)
```json
{
  "status": "Success",
  "entryNo": 42,
  "id": "{guid}",
  "fileName": "receipt.pdf",
  "contentType": "application/pdf"
}
```

## AI/Agent playbook
Use createIncomingDocument=true when you want BC to store and process the receipt. Use false when you just need the raw binary (e.g. for display or forwarding).

