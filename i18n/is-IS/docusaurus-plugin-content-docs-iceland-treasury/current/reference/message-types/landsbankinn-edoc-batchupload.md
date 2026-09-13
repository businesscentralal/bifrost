---
id: landsbankinn-edoc-batchupload
title: "Landsbankinn.EDoc.BatchUpload"
sidebar_label: "Landsbankinn.EDoc.BatchUpload"
sidebar_position: 112
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.BatchUpload Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uploads a batch of electronic skjöl via POST /DocumentCreationBatches.

## Beiðni
```json
{
  "fileBase64": "<base64-encoded ZIP or XML file>",
  "fileName": "batch.zip",
  "senderNationalId": "<10-digit kennitala>",
  "documentType": "REIKNINGUR",
  "crossReferences": "[{\"key\":\"...\",\"keyType\":\"claim\",\"documentId\":\"...\"}]"
}
```

## File Format
Either:
- A stakan XML file representing eina eða fleiri skjöl
- A ZIP archive containing PDF files og a manifest.json

## Svar
HTTP 202 Accepted — batch er processed asynchronously.
Skilar `{ "status": "Accepted", "httpStatus": 202, "logEntryNo": N }`.

## Notes
- `documentType` verður að be a value frá Sækja /DocumentTypes where `documentType` Reitur er non-null.
- `crossReferences` er valfrjálst — a JSON array string of CreateCrossReferenceRequest objects.


