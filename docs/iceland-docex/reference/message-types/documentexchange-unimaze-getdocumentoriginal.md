---
id: documentexchange-unimaze-getdocumentoriginal
title: "DocumentExchange.Unimaze.GetDocumentOriginal"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentOriginal"
sidebar_position: 59
description: "Request and response contract for the DocumentExchange.Unimaze.GetDocumentOriginal Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads the original (as-submitted) document content (Unimaze only).
Returns the document exactly as it was uploaded by the sender, before any transformation.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Response
```json
{ "messageId": "...", "variant": "original", "content": "<base64-encoded document>" }
```
Decode the `content` field from base64 to get the original XML/document.

## Related
- **GetDocument** — returns the core processing document (usually same as original for inbound)
- **GetDocumentTransformed** — returns the target-format version (if transformation occurred)

