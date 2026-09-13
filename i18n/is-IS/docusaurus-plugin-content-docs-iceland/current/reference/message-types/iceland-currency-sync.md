---
id: iceland-currency-sync
title: "Iceland.Currency.Sync"
sidebar_label: "Iceland.Currency.Sync"
sidebar_position: 20
description: "Beiðni- og svarsamningur fyrir Iceland.Currency.Sync Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Samstillir BC currency master/rate data frá Seðlabanki feeds.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## What it getur sync
- Currency descriptions frá `Iceland.CurrencyRates.Get` names
- Currency symbols frá `Iceland.Currency.Get` ISO Listi
- Currency Exchange Rates með `Exchange Rate Amount = 100`
- LCY-aware normalization: Þegar LCY &lt;> ISK, rates eru rebased using LCY/ISK as base

## Beiðni
```json
{
  "date": "2026-06-19",              // required, ISO date YYYY-MM-DD
  "dateTo": "2026-06-19",            // optional, inclusive span end (default: date)
  "rateType": "All",                // optional: Mid | Reference | All (default: All)
  "syncCurrencies": true,             // optional (default: true)
  "syncMetadata": true,               // optional (default: true)
  "syncExchangeRates": true           // optional (default: true)
}
```

## AI/Agent runbook
1. Notaðu this message Gerð as the default write operation fyrir currency sync.
2. Select `date` as a business day; Ef no rates eru returned, retry með previous business day.
3. Prefer `rateType = All` fyrir fulla coverage.
4. Keep `syncExchangeRates = true` Þegar you need posting-ready rates.
5. Notaðu targeted runs Þegar needed:
   - metadata Aðeins: `syncMetadata = true`, others false
   - exchange rates Aðeins: `syncExchangeRates = true`, others false
6. Validate counts in Svar (`currencyCount`, `metadataCount`, `exchangeRateCount`).
7. Ef LCY er not ISK, ensure LCY rate exists in the same feed/date (nauðsynlegt fyrir normalization).

## Implemented sync rules
- Feed source rates eru ISK-based.
- `Exchange Rate Amount` er fixed til `100`.
- `Relational Exch. Rate Amount = normalizedRate * 100`.
- Ef LCY = ISK: `normalizedRate = midRate`.
- Ef LCY &lt;> ISK: `normalizedRate = midRate / lcyMidRate`.
- Currency og exchange-rate sync skip the LCY code row itself.

## Manual update fallback
Ef direct sync er disabled, do this sequence manually:
1. `Iceland.CurrencyRates.Get` (source rates)
2. `Iceland.Currency.Get` (ISO metadata)
3. Upsert Currency descriptions/symbols
4. Upsert Currency Exchange Rate using key `(CurrencyCode, StartingDate)` og 100-based formula
5. Verify LCY normalization assumption áður en posting

## Svar
```json
{
  "status": "Success",
  "rateType": "All",
  "dateFrom": "2026-06-19",
  "dateTo": "2026-06-19",
  "syncCurrencies": true,
  "syncMetadata": true,
  "syncExchangeRates": true,
  "currencyCount": 30,
  "metadataCount": 30,
  "exchangeRateCount": 30
}
```

## Errors
- Missing/invalid `date` eða `dateTo`
- Invalid `rateType`
- No rates returned fyrir date/rateType
- No ISO currencies returned fyrir metadata sync
- LCY base rate missing in feed Þegar LCY er not ISK
- Allt sync flags false (`syncCurrencies`, `syncMetadata`, `syncExchangeRates`)

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með outbound HTTP blocked errors:
1. Open **Extension Management** og open **Bifrost Iceland** settings.
2. Turn on **Allow HttpClient Requests**.
3. Ef allowlisting er enabled, allow Seðlabanki, SIX Group, og REST Countries endpoints.


