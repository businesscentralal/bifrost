---
id: documentexchange-advania-getdocumentlight
title: "DocumentExchange.Advania.GetDocumentLight"
sidebar_label: "DocumentExchange.Advania.GetDocumentLight"
sidebar_position: 10
description: "Request and response contract for the DocumentExchange.Advania.GetDocumentLight Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves document XML WITHOUT embedded base64 attachments. Faster than GetDocument for large documents with attachments.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Document UUID |

## Response
`{ messageId, contentType: "xml", content: "<base64-xml>" }`

The content is base64-encoded XML with all `<cbc:EmbeddedDocumentBinaryObject>` elements stripped.
Use GetAttachments separately if you need the binary attachments.

## When to use instead of GetDocument
- Document has large PDF attachments (payload_kb > 100 from GetUnread/GetInbox)
- You only need line items, amounts, and metadata — not embedded files
- Performance-sensitive batch processing

