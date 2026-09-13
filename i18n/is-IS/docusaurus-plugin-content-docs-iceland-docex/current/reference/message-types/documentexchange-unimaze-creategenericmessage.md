---
id: documentexchange-unimaze-creategenericmessage
title: "DocumentExchange.Unimaze.CreateGenericMessage"
sidebar_label: "DocumentExchange.Unimaze.CreateGenericMessage"
sidebar_position: 54
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.CreateGenericMessage Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a generic (non-structured) message fyrir sending EDI, PDF, eða other skjal types
that do not fit the staðlaða færsla types (Unimaze Aðeins).
skjöl sent via this Aðferð bypass validation.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| payload | object | **Yes** | Message envelope og content (see below) |
| messageId | string | No | Custom GUID (auto-generated Ef omitted) |
| more | boolean | No | Ef true, hold fyrir AddAttachment calls |

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
Both sender og receiver verður að agree on the `service` og `action` parameters beforehand.
Generic messages eru NOT validated — ensure content er correct áður en sending.
The API expects the content in Beiðnin body directly (not as JSON).  
Ef HTTP 415 er returned, the Efnisgerð may need multipart encoding.


