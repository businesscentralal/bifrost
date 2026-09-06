---
id: landsbankinn-edoc-documents
title: "Landsbankinn.EDoc.Documents"
sidebar_label: "Landsbankinn.EDoc.Documents"
sidebar_position: 119
description: "Request and response contract for the Landsbankinn.EDoc.Documents Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists electronic documents received by the company (inbox).
Calls `GET /Documents` on the Landsbankinn Electronic Documents API.

**Direction:** Outbound
**Access Gate:** Lbi Statement Gate

## Request
```json
{ "ownerNationalId": "1234567890", "createdFrom": "2026-01-01", "createdTo": "2026-08-28", "skip": 0, "take": 5 }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ownerNationalId` | string | no | Recipient kennitala. Defaults to Company Information Registration No. |
| `createdFrom` | string | no | Inclusive lower bound (ISO date). |
| `createdTo` | string | no | Inclusive upper bound (ISO date). |
| `skip` | integer | no | Records to skip (default 0). |
| `take` | integer | no | Max records to return (default 10000). |

## Response
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

### Fields per document
| Field | Type | Description |
|---|---|---|
| `id` | string | Document ID. Use with `EDoc.DocumentGet` and `EDoc.DocumentContent`. |
| `ownerNationalId` | string | Recipient kennitala. |
| `description` | string | Document description (e.g. "Fasteignagjöld frá Reykjavíkurborg"). |
| `created` | string | Creation date-time (ISO). |
| `signatureType` | string | none, digitalApproval, paper, electronic. |
| `fileType` | string | pdf or html. |
| `senderNationalId` | string | Sender kennitala. |
| `senderName` | string | Sender name (e.g. "Landsbankinn hf.", "Reykjavíkurborg"). |
| `accountNumber` | string | Associated account number (if any). |
| `loanNumber` | string | Associated loan number (if any). |
| `reference` | string | Reference identifier (if any). |
| `isCrossReferenced` | boolean | Whether linked via cross-reference. |

## AI/Agent playbook
Call this to discover received documents. Then use:
- `EDoc.DocumentGet` — full metadata for a single document
- `EDoc.DocumentContent` — download the PDF/HTML content

