---
id: landsbankinn-edoc-documentget
title: "Landsbankinn.EDoc.DocumentGet"
sidebar_label: "Landsbankinn.EDoc.DocumentGet"
sidebar_position: 118
description: "Request and response contract for the Landsbankinn.EDoc.DocumentGet Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets metadata for a single received electronic document.
Calls `GET /Documents/{id}` on the Landsbankinn Electronic Documents API.

**Direction:** Outbound
**Access Gate:** Lbi Statement Gate

## Request
```json
{ "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47" }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Document ID from `EDoc.Documents`. |

## Response
```json
{
  "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47",
  "ownerNationalId": "1234567890",
  "description": "Kvittun vegna gjaldtöku - Innheimta",
  "created": "2026-07-02T00:00:00",
  "signatureType": "none",
  "fileType": "pdf",
  "senderNationalId": "6543210980",
  "senderName": "Landsbankinn hf.",
  "isCrossReferenced": false,
  "logEntryNo": 30
}
```

## AI/Agent playbook
Use after `EDoc.Documents` to get full details for a specific document.
Use `EDoc.DocumentContent` to download the actual PDF/HTML.

