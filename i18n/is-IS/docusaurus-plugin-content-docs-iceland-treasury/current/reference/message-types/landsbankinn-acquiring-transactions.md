---
id: landsbankinn-acquiring-transactions
title: "Landsbankinn.Acquiring.Transactions"
sidebar_label: "Landsbankinn.Acquiring.Transactions"
sidebar_position: 77
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Acquiring.færslur Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists acquiring færslur. Ef `settlementId` er provided, Skilar
færslur fyrir that specific settlement (Sækja /Settlements/&#123;id&#125;/færslur).
Otherwise Skilar Allt færslur (Sækja /færslur).

## Beiðni
```json
{
  "settlementId": "<id>",          // optional — filter to one settlement
  "dateFrom": "2026-07-01",        // optional (for /Transactions only)
  "dateTo": "2026-07-22",          // optional
  "contractNumber": "...",          // optional
  "skip": 0, "take": 100           // optional
}
```

## Svar
Skilar `data` (array of færslur), `page`, `perPage`, `totalItems`, `logEntryNo`.


