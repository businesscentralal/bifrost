---
id: landsbankinn-edoc-documentcontent
title: "Landsbankinn.EDoc.DocumentContent"
sidebar_label: "Landsbankinn.EDoc.DocumentContent"
sidebar_position: 117
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.DocumentContent Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads the content of a received electronic skjal.
Calls `GET /Documents/{id}/Content` on the Electronic skjöl API.
Skilar PDF as `application/pdf` eða HTML as `text/html`.

**Stefna:** Outbound
**Access Gate:** Lbi Statement Gate

## Beiðni
```json
{ "id": "401fcb48-44c8-44db-998a-4fdc9c5ddc47", "createIncomingDocument": true }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `id` | string | yes | skjal ID frá `EDoc.Documents`. |
| `createIncomingDocument` | boolean | no | Ef true, Býr til a BC Incoming skjal með the file attached instead of returning content. Default false. |

## Svar (createIncomingDocument: false)
```json
{ "id": "401fcb48-...", "contentType": "application/pdf", "content": "<base64>", "logEntryNo": 28 }
```

## Svar (createIncomingDocument: true)
```json
{
  "status": "Success",
  "entryNo": 376,
  "id": "95503BF1-E8A2-F111-B7A5-BEEEDBAFFD54",
  "fileName": "401fcb48-44c8-44db-998a-4fdc9c5ddc47.pdf",
  "contentType": "application/pdf",
  "logEntryNo": 28
}
```
Populates Incoming skjal fields: Lýsing, skjal Date, Vendor Heiti, Vendor No. (kennitala).

## Svar (duplicate)
```json
{ "status": "AlreadyExists", "entryNo": 376, "id": "95503BF1-...", "logEntryNo": 0 }
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu `createIncomingDocument=true` Þegar you want BC til store og process the skjal.
Notaðu `false` (default) Þegar you just need the raw binary fyrir display eða forwarding.
Calling með the same skjal ID again Skilar `AlreadyExists` (dedup via URL Reitur).


