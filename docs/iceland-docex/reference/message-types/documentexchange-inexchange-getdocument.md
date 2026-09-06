---
id: documentexchange-inexchange-getdocument
title: "DocumentExchange.InExchange.GetDocument"
sidebar_label: "DocumentExchange.InExchange.GetDocument"
sidebar_position: 42
description: "Request and response contract for the DocumentExchange.InExchange.GetDocument Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads a document by ID from InExchange (binary content).

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentId | string | Yes | The document identifier to download |

## Response
Binary document content (base64-encoded).

