---
id: arionbanki-document-upload
title: "Arionbanki.Document.Upload"
sidebar_label: "Arionbanki.Document.Upload"
sidebar_position: 21
description: "Beiðni- og svarsamningur fyrir Arionbanki.skjal.Upload Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uploads an electronic skjal (PDF eða XML) til Arion banki fyrir
distribution through Allt Icelandic netbanks via RB.

Stefna: Inbound  
Efnisgerð: text/json

## Beiðni
```json
{
  "personId": "1234567890",
  "documentType": "LAUN",
  "documentName": "Launaseðill Jan 2026",
  "fileContent": "<base64-encoded PDF or XML>"
}
```

| Reitur | nauðsynlegt | Lýsing |
|-------|----------|-------------|
| personId | Yes | Kennitala of the skjal recipient |
| documentType | Yes | 1–4 char Gerð code (bank-defined) |
| documentName | Yes | Display Heiti of the skjal |
| fileContent | Yes | Base64-encoded file (PDF eða XML) |

## Svar
```json
{ "status": "Success", "documentId": "<bank-assigned ID>" }
```

Notaðu the returned `documentId` með `Arionbanki.Document.GetResult` til poll processing status.


