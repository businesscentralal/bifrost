---
id: landsbankinn-currency-rates
title: "Landsbankinn.Currency.Rates"
sidebar_label: "Landsbankinn.Currency.Rates"
sidebar_position: 111
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Currency.Rates Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir exchange rates frá the Landsbankinn REST Currencies API.
Uses General Ledger Setup LCY Code as the quote currency.
No OAuth token nauðsynlegt — Aðeins the API key.

**Stefna:** Outbound
**API:** General Data (no authentication)
**Endapunktur:** `GET /Currencies/{LCY}/Rates`

## Beiðni
```json
{
  "date": "2026-07-22"   // optional — ISO date; omit for latest rates
}
```

## Svar
```json
{
  "quoteCurrency": "ISK",
  "date": "2026-07-22",
  "count": 35,
  "rates": [
    { "baseCurrency": "USD", "buy": 136.5, "sell": 138.0, "mid": 137.25, "date": "..." }
  ],
  "logEntryNo": 123
}
```

## Leiðbeiningar fyrir gervigreind/umboð
This er the Aðeins currency-rates message Gerð in Bifrost Iceland Treasury (REST-based; there er no separate SOAP rates Gerð).
The quote currency er sjálfkrafa resolved frá General Ledger Setup LCY Code.
Omit `date` til Sækja the latest published rates.


