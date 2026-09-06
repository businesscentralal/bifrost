---
id: documentexchange-inexchange-getdocumentinfo
title: "DocumentExchange.InExchange.GetDocumentInfo"
sidebar_label: "DocumentExchange.InExchange.GetDocumentInfo"
sidebar_position: 43
description: "Request and response contract for the DocumentExchange.InExchange.GetDocumentInfo Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves metadata/info for a document by ID from InExchange.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentId | string | Yes | The document identifier |

## Response
JSON object with document metadata (sender, receiver, type, dates).

