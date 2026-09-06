---
id: documentexchange-unimaze-creategenericmessage
title: "DocumentExchange.Unimaze.CreateGenericMessage"
sidebar_label: "DocumentExchange.Unimaze.CreateGenericMessage"
sidebar_position: 54
description: "Request and response contract for the DocumentExchange.Unimaze.CreateGenericMessage Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a generic (non-structured) message for sending EDI, PDF, or other document types
that do not fit the standard transaction types (Unimaze only).
Documents sent via this method bypass validation.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payload | object | **Yes** | Message envelope and content (see below) |
| messageId | string | No | Custom GUID (auto-generated if omitted) |
| more | boolean | No | If true, hold for AddAttachment calls |

## Payload Structure
```json
{
  "envelope": {
    "senderIdentifier": "0196:2020202222",
    "receiverIdentifier": "0196:1010101111",
    "service": "urn:custom:service",
    "action": "SubmitDocument",
    "conversationIdentifier": "conv-001"
  },
  "content": "<base64-encoded document>",
  "contentType": "text/plain",
  "encoding": "utf-8"
}
```

## Important
Both sender and receiver must agree on the `service` and `action` parameters beforehand.
Generic messages are NOT validated — ensure content is correct before sending.
The API expects the content in the request body directly (not as JSON).  
If HTTP 415 is returned, the content-type may need multipart encoding.

