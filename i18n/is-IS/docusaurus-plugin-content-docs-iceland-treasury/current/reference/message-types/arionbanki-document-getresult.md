---
id: arionbanki-document-getresult
title: "Arionbanki.Document.GetResult"
sidebar_label: "Arionbanki.Document.GetResult"
sidebar_position: 19
description: "Beiðni- og svarsamningur fyrir Arionbanki.skjal.GetResult Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Polls the processing result of a previously uploaded skjal.

Stefna: Outbound  
Efnisgerð: text/json

## Beiðni
```json
{ "documentId": "<bank-assigned ID from Upload>" }
```

## Svar
```json
{
  "status": "Success",
  "result": {
    "documentId": "abc123",
    "personId": "1234567890",
    "documentType": "LAUN",
    "documentName": "Launaseðill Jan 2026",
    "processingStatus": "Completed",
    "recordsProcessed": 1,
    "recordsSkipped": 0,
    "uploadDate": "2026-01-15"
  }
}
```

Processing statuses: Received, InProgress, Completed, CompletedWithErrors, Failed.


