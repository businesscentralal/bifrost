---
id: documentexchange-unimaze-addattachment
title: "DocumentExchange.Unimaze.AddAttachment"
sidebar_label: "DocumentExchange.Unimaze.AddAttachment"
sidebar_position: 53
description: "Request and response contract for the DocumentExchange.Unimaze.AddAttachment Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Adds a document/attachment to an existing message on the exchange (Unimaze only).
Use when sending additional files (PDF, images) alongside the core business document.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID (from SubmitTransaction/CreateInvoice response) |
| content | string | **Yes** | Base64-encoded file content |
| contentType | string | No | MIME type (default: application/pdf). E.g. image/png, text/xml |
| name | string | No | Document name (default: document) |
| more | boolean | No | If true, more attachments will follow. If false (default), message processing begins |

## Workflow
```
1. Submit main document: SubmitTransaction { ..., "more": true }
   → Note: more=true holds message for additional documents
2. Add attachment: AddAttachment { "messageId": "<id>", "content": "<base64>", "name": "invoice.pdf", "more": true }
3. Add final attachment: AddAttachment { "messageId": "<id>", "content": "<base64>", "name": "photo.png", "more": false }
   → more=false triggers message processing
```

## Data Mapping from BC
| BC Source | Maps to |
|-----------|---------|
| Incoming Document Attachment.Content (BLOB) | content (base64-encode the blob) |
| Document Attachment.Content | content (base64-encode) |
| Sales Invoice Header → Report → PDF output | content |
| Incoming Document Attachment."File Extension" | contentType (map: pdf→application/pdf, png→image/png, xml→text/xml) |
| Incoming Document Attachment.Name | name |

