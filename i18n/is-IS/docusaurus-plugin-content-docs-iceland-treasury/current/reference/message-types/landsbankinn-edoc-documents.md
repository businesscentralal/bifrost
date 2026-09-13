---
id: landsbankinn-edoc-documents
title: "Landsbankinn.EDoc.Documents"
sidebar_label: "Landsbankinn.EDoc.Documents"
sidebar_position: 119
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.skjöl Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists electronic skjöl received by the fyrirtæki (inbox).
Calls `GET /Documents` on the Landsbankinn Electronic skjöl API.

**Stefna:** Outbound
**Access Gate:** Lbi Statement Gate

## Beiðni
```json
{ "ownerNationalId": "1234567890", "createdFrom": "2026-01-01", "createdTo": "2026-08-28", "skip": 0, "take": 5 }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `ownerNationalId` | string | no | Recipient kennitala. Defaults til fyrirtæki Information Registration No. |
| `createdFrom` | string | no | Inclusive lower bound (ISO date). |
| `createdTo` | string | no | Inclusive upper bound (ISO date). |
| `skip` | integer | no | færslur til skip (default 0). |
| `take` | integer | no | Max færslur til return (default 10000). |

## Svar
```json
{
  "data": [
    {
      "id": "1234567890:6543210980:123456789012345678901234:20260901",
      "ownerNationalId": "1234567890",
      "description": "Fasteignagjöld frá Reykjavíkurborg",
      "created": "2026-09-01T00:00:00",
      "signatureType": "none",
      "fileType": "html",
      "senderNationalId": "6543210980",
      "senderName": "Reykjavíkurborg",
      "reference": "123456789012345678901234",
      "isCrossReferenced": false
    }
  ],
  "page": 1, "perPage": 5, "totalItems": 35, "logEntryNo": 29
}
```

### Fields per skjal
| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string | skjal ID. Notaðu með `EDoc.DocumentGet` og `EDoc.DocumentContent`. |
| `ownerNationalId` | string | Recipient kennitala. |
| `description` | string | skjal Lýsing (e.g. "Fasteignagjöld frá Reykjavíkurborg"). |
| `created` | string | Creation date-time (ISO). |
| `signatureType` | string | none, digitalApproval, paper, electronic. |
| `fileType` | string | pdf eða html. |
| `senderNationalId` | string | Sender kennitala. |
| `senderName` | string | Sender Heiti (e.g. "Landsbankinn hf.", "Reykjavíkurborg"). |
| `accountNumber` | string | Associated reikningur number (Ef any). |
| `loanNumber` | string | Associated loan number (Ef any). |
| `reference` | string | Reference identifier (Ef any). |
| `isCrossReferenced` | boolean | Whether linked via cross-reference. |

## Leiðbeiningar fyrir gervigreind/umboð
Kallaðu á this til discover received skjöl. Then Notaðu:
- `EDoc.DocumentGet` — fulla metadata fyrir a stakan skjal
- `EDoc.DocumentContent` — download the PDF/HTML content


