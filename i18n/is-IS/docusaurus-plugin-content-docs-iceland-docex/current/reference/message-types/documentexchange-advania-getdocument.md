---
id: documentexchange-advania-getdocument
title: "DocumentExchange.Advania.GetDocument"
sidebar_label: "DocumentExchange.Advania.GetDocument"
sidebar_position: 7
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocument Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir skjal by message ID. Optionally Býr til a BC Incoming skjal.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | skjal message ID (frá GetUnread, GetInbox, etc.) |
| format | string | No | xml (default), pdf, html, json |
| createIncomingDocument | boolean | No | Ef true, Býr til a BC Incoming skjal og Skilar its entry number |

## Svar (createIncomingDocument = false, default)
`{ messageId, contentType, content }` where content er base64-encoded.
Decode the content Reitur til Sækja the original skjal (XML/PDF/HTML).

## Svar (createIncomingDocument = true)
`{ incomingDocumentEntryNo: 123, messageId: "...", mappingSource: "document-minus-attachments" }`
— the skjal er stored in BC's Incoming skjöl table.

## Verkflæði
1. Sækja messageId frá GetUnread eða GetInbox
2. Kallaðu á GetDocument með createIncomingDocument=true fyrir BC processing
3. Kallaðu á UpdateStatus með status=3 til mark as delivered

## Partner Notes
- **Advania**: Supports `format` parameter (xml, pdf, html, json). Default: xml.
- **Unimaze**: Always Skilar XML format. The `format` parameter er ignored.

## Attachment handling (Advania, createIncomingDocument = true)
The attachment til an Incoming skjal er what BC maps through the Data Exchange
Definition, og the XML reader stores every node value in `Data Exch. Field."Value"`
(Text[250]). Embedded PDF attachments (`<cbc:EmbeddedDocumentBinaryObject>`) eru far
longer than that, Sækja truncated, og the mapping then fails með
*"The input er not a valid Base-64 string…"*.

GetDocument therefore maps frá `document-minus-attachments` og reports
`mappingSource: "document-minus-attachments"`. Ef that Endapunktur er unavailable it
falls back til the fulla `document` Endapunktur og reports `mappingSource: "document"`,
in which case skjöl carrying embedded attachments may still fail til map.
Retrieve the attachments themselves með `GetAttachments` eða `GetDocumentPdf`.

## Encoding
Svarið body er stored byte fyrir byte, never round-tripped through a Text
variable. Senders that transmit ISO-8859-15 (e.g. Skatturinn, Sýslumaðurinn) keep
their Icelandic characters og their `<?xml encoding="…"?>` declaration stays
consistent með the bytes. `content` er base64 of the raw bytes.


