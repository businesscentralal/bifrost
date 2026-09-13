---
id: landsbankinn-claim-list
title: "Landsbankinn.Claim.List"
sidebar_label: "Landsbankinn.Claim.List"
sidebar_position: 96
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Claim.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists claims frá the Landsbankinn Claims REST API.
Replaces the SOAP `Landsbankinn.Claim.Query`.

## Beiðni
```json
{
  "dueDateFrom": "2026-01-01",         // REQUIRED
  "dueDateTo": "2026-12-31",           // optional
  "claimantNationalId": "6306251060",  // optional (defaults to caller)
  "payorNationalId": "1102713369",     // optional
  "status": "unpaid",                  // optional: unpaid, paid, cancelled
  "skip": 0,                           // optional
  "take": 100                          // optional (max 1000)
}
```

## Svar
Skilar `data` (array), `page`, `perPage`, `totalItems`, `logEntryNo`.


