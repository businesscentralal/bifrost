---
id: landsbankinn-funds-list
title: "Landsbankinn.Funds.List"
sidebar_label: "Landsbankinn.Funds.List"
sidebar_position: 125
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Funds.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir market data fyrir Landsbréf funds frá the REST API.
Skilar both ETFs og Mutual Funds in a stakan Svar.
No OAuth token nauðsynlegt — Aðeins the API key.

## Beiðni
```json
{}   // no parameters required
```

## Svar
```json
{
  "etfs": [...],
  "mutualFunds": [...],
  "etfCount": 5,
  "mutualFundCount": 12,
  "logEntryNo": 123
}
```


