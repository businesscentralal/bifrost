---
id: documentexchange-unimaze-addattachment
title: "DocumentExchange.Unimaze.AddAttachment"
sidebar_label: "DocumentExchange.Unimaze.AddAttachment"
sidebar_position: 53
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.AddAttachment Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Adds a skjal/attachment til an existing message on the exchange (Unimaze Aðeins).
Notað þegar sending additional files (PDF, images) alongside the core business skjal.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID (frá SubmitTransaction/CreateInvoice Svar) |
| content | string | **Yes** | Base64-encoded file content |
| contentType | string | No | MIME Gerð (default: application/pdf). E.g. image/png, text/xml |
| Heiti | string | No | skjal Heiti (default: skjal) |
| more | boolean | No | Ef true, more attachments mun follow. Ef false (default), message processing begins |

## Verkflæði
```
1. Submit main document: SubmitTransaction { ..., "more": true }
   → Note: more=true holds message for additional documents
2. Add attachment: AddAttachment { "messageId": "<id>", "content": "<base64>", "name": "invoice.pdf", "more": true }
3. Add final attachment: AddAttachment { "messageId": "<id>", "content": "<base64>", "name": "photo.png", "more": false }
   → more=false triggers message processing
```

## Data Mapping frá BC
| BC Source | Maps til |
|-----------|---------|
| Incoming skjal Attachment.Content (BLOB) | content (base64-encode the blob) |
| skjal Attachment.Content | content (base64-encode) |
| Sales Invoice Header → Report → PDF output | content |
| Incoming skjal Attachment."File Extension" | contentType (map: pdf→application/pdf, png→image/png, xml→text/xml) |
| Incoming skjal Attachment.Heiti | Heiti |


