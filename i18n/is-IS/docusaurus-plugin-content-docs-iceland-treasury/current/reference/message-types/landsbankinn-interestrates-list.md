---
id: landsbankinn-interestrates-list
title: "Landsbankinn.InterestRates.List"
sidebar_label: "Landsbankinn.InterestRates.List"
sidebar_position: 126
description: "Beiðni- og svarsamningur fyrir Landsbankinn.InterestRates.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir current interest rates fyrir deposits og loans.
No OAuth token nauðsynlegt — Aðeins the API key.

## Beiðni
```json
{}   // no parameters required
```

## Svar
Skilar interest rates Listi as-er frá the bank API, plus `count` og `logEntryNo`.


