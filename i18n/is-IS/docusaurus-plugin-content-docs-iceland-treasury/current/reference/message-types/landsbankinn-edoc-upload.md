---
id: landsbankinn-edoc-upload
title: "Landsbankinn.EDoc.Upload"
sidebar_label: "Landsbankinn.EDoc.Upload"
sidebar_position: 121
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.Upload Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uploads a stakan electronic skjal via POST /skjöl (multipart/form-data).

## Beiðni
```json
{
  "fileBase64": "<base64-encoded file>",
  "fileName": "invoice.pdf",
  "recipientNationalId": "<10-digit kennitala>",
  "senderNationalId": "<10-digit kennitala>",
  "documentTypeCode": "REIKNINGUR",
  "effectiveDate": "2026-01-15",
  "externalId": "INV-001",
  "reference": "Optional note"
}
```

## Svar
Skilar `{ "id": "<document-id>", "logEntryNo": N }`.

## Notes
- `senderNationalId` defaults til fyrirtæki Information "Registration No." Ef omitted.
- Notaðu `Landsbankinn.EDoc.DocumentTypes` til discover valid `documentTypeCode` values.
- `effectiveDate` er the gildistökudagur of the skjal.
- fyrir XML uploads, `externalId` verður að match the User4 Reitur in the XML content.


