---
id: landsbankinn-edoc-documentcontent
title: "Landsbankinn.EDoc.DocumentContent"
sidebar_label: "Landsbankinn.EDoc.DocumentContent"
sidebar_position: 117
description: "Request and response contract for the Landsbankinn.EDoc.DocumentContent Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads the content of a received electronic document.
Calls `GET /Documents/{id}/Content` on the Electronic Documents API.
Returns PDF as `application/pdf` or HTML as `text/html`.

**Direction:** Outbound
**Access Gate:** Lbi Statement Gate

## Request
```json
{ "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47", "createIncomingDocument": true }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Document ID from `EDoc.Documents`. |
| `createIncomingDocument` | boolean | no | If true, creates a BC Incoming Document with the file attached instead of returning content. Default false. |

## Response (createIncomingDocument: false)
```json
{ "id": "401fcb48-...", "contentType": "application/pdf", "content": "<base64>", "logEntryNo": 28 }
```

## Response (createIncomingDocument: true)
```json
{
  "status": "Success",
  "entryNo": 376,
  "id": "95503BF1-E8A2-F111-B7A5-BEEEDBAFFD54",
  "fileName": "401fcb48-44c8-44db-998a-4fdc9c5ddc47.pdf",
  "contentType": "application/pdf",
  "logEntryNo": 28
}
```
Populates Incoming Document fields: Description, Document Date, Vendor Name, Vendor No. (kennitala).

## Response (duplicate)
```json
{ "status": "AlreadyExists", "entryNo": 376, "id": "95503BF1-...", "logEntryNo": 0 }
```

## AI/Agent playbook
Use `createIncomingDocument=true` when you want BC to store and process the document.
Use `false` (default) when you just need the raw binary for display or forwarding.
Calling with the same document ID again returns `AlreadyExists` (dedup via URL field).

