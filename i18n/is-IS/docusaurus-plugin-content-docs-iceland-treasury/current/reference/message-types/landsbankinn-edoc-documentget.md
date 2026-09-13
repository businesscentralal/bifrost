---
id: landsbankinn-edoc-documentget
title: "Landsbankinn.EDoc.DocumentGet"
sidebar_label: "Landsbankinn.EDoc.DocumentGet"
sidebar_position: 118
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.DocumentGet Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir metadata fyrir a stakan received electronic skjal.
Calls `GET /Documents/{id}` on the Landsbankinn Electronic skjöl API.

**Stefna:** Outbound
**Access Gate:** Lbi Statement Gate

## Beiðni
```json
{ "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47" }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `id` | string | yes | skjal ID frá `EDoc.Documents`. |

## Svar
```json
{
  "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47",
  "ownerNationalId": "1234567890",
  "description": "Kvittun vegna gjaldtöku - Innheimta",
  "created": "2026-07-02T00:00:00",
  "signatureType": "none",
  "fileType": "pdf",
  "senderNationalId": "6543210980",
  "senderName": "Landsbankinn hf.",
  "isCrossReferenced": false,
  "logEntryNo": 30
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu eftir `EDoc.Documents` til Sækja fulla details fyrir a specific skjal.
Notaðu `EDoc.DocumentContent` til download the actual PDF/HTML.


