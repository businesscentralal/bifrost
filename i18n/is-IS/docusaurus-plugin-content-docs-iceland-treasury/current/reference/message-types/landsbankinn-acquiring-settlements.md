---
id: landsbankinn-acquiring-settlements
title: "Landsbankinn.Acquiring.Settlements"
sidebar_label: "Landsbankinn.Acquiring.Settlements"
sidebar_position: 76
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Acquiring.Settlements Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists acquiring settlement batches. Defaults til past month Ef no dates specified.

## Beiðni
```json
{
  "dateFrom": "2026-07-01",        // optional
  "dateTo": "2026-07-22",          // optional
  "contractNumber": "...",          // optional — merchant contract
  "skip": 0, "take": 100           // optional
}
```

## Svar
Skilar `data` (array of settlements), `page`, `perPage`, `totalItems`, `logEntryNo`.


