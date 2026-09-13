---
id: landsbankinn-fees-list
title: "Landsbankinn.Fees.List"
sidebar_label: "Landsbankinn.Fees.List"
sidebar_position: 122
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Fees.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir current bank fees og prices frá the Landsbankinn REST API.
No OAuth token nauðsynlegt — Aðeins the API key.

## Beiðni
```json
{}   // no parameters required
```

## Svar
Skilar fee Listi as-er frá the bank API, plus `count` og `logEntryNo`.


