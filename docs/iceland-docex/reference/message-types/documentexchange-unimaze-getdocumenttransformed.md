---
id: documentexchange-unimaze-getdocumenttransformed
title: "DocumentExchange.Unimaze.GetDocumentTransformed"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentTransformed"
sidebar_position: 61
description: "Request and response contract for the DocumentExchange.Unimaze.GetDocumentTransformed Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads the transformed (target-format) document content (Unimaze only).
Only available when `isTransformed: true` in the message documents array.
Returns 404 if no transformation was applied.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Response
```json
{ "messageId": "...", "variant": "transformed", "content": "<base64-encoded document>" }
```

## When is a document transformed?
Unimaze transforms documents when the receiver's registered profile requires a different
syntax than what the sender submitted. For example:
- Sender submits UBL 2.1 Invoice → Receiver only supports CII → document is transformed
- Check `willBeTransformed` in GetDocumentSupport response
- Check `isTransformed` in message documents[] array

