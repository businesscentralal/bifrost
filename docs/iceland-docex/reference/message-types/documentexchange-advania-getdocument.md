---
id: documentexchange-advania-getdocument
title: "DocumentExchange.Advania.GetDocument"
sidebar_label: "DocumentExchange.Advania.GetDocument"
sidebar_position: 7
description: "Request and response contract for the DocumentExchange.Advania.GetDocument Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a document by message ID. Optionally creates a BC Incoming Document.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Document message ID (from GetUnread, GetInbox, etc.) |
| format | string | No | xml (default), pdf, html, json |
| createIncomingDocument | boolean | No | If true, creates a BC Incoming Document and returns its entry number |

## Response (createIncomingDocument = false, default)
`{ messageId, contentType, content }` where content is base64-encoded.
Decode the content field to get the original document (XML/PDF/HTML).

## Response (createIncomingDocument = true)
`{ incomingDocumentEntryNo: 123, messageId: "...", mappingSource: "document-minus-attachments" }`
— the document is stored in BC's Incoming Documents table.

## Workflow
1. Get messageId from GetUnread or GetInbox
2. Call GetDocument with createIncomingDocument=true for BC processing
3. Call UpdateStatus with status=3 to mark as delivered

## Partner Notes
- **Advania**: Supports `format` parameter (xml, pdf, html, json). Default: xml.
- **Unimaze**: Always returns XML format. The `format` parameter is ignored.

## Attachment handling (Advania, createIncomingDocument = true)
The attachment to an Incoming Document is what BC maps through the Data Exchange
Definition, and the XML reader stores every node value in `Data Exch. Field."Value"`
(Text[250]). Embedded PDF attachments (`<cbc:EmbeddedDocumentBinaryObject>`) are far
longer than that, get truncated, and the mapping then fails with
*"The input is not a valid Base-64 string…"*.

GetDocument therefore maps from `document-minus-attachments` and reports
`mappingSource: "document-minus-attachments"`. If that endpoint is unavailable it
falls back to the full `document` endpoint and reports `mappingSource: "document"`,
in which case documents carrying embedded attachments may still fail to map.
Retrieve the attachments themselves with `GetAttachments` or `GetDocumentPdf`.

## Encoding
The response body is stored byte for byte, never round-tripped through a Text
variable. Senders that transmit ISO-8859-15 (e.g. Skatturinn, Sýslumaðurinn) keep
their Icelandic characters and their `<?xml encoding="…"?>` declaration stays
consistent with the bytes. `content` is base64 of the raw bytes.

