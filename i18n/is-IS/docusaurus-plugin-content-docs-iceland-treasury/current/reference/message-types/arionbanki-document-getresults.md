---
id: arionbanki-document-getresults
title: "Arionbanki.Document.GetResults"
sidebar_label: "Arionbanki.Document.GetResults"
sidebar_position: 20
description: "Beiðni- og svarsamningur fyrir Arionbanki.skjal.GetResults Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries processing results fyrir Allt skjöl uploaded in a date range.

Stefna: Outbound  
Efnisgerð: text/json

## Beiðni
```json
{ "dateFrom": "2026-01-01", "dateTo": "2026-01-31" }
```

## Svar
```json
{
  "status": "Success",
  "count": 2,
  "results": [
    { "documentId": "abc", "processingStatus": "Completed", ... },
    { "documentId": "def", "processingStatus": "Failed", ... }
  ]
}
```


