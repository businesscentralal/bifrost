---
id: iceland-currency-sync
title: "Iceland.Currency.Sync"
sidebar_label: "Iceland.Currency.Sync"
sidebar_position: 20
description: "Request and response contract for the Iceland.Currency.Sync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Synchronizes BC currency master/rate data from Seðlabanki feeds.

**Direction:** Outbound  
**Content-Type:** text/json

## What it can sync
- Currency descriptions from `Iceland.CurrencyRates.Get` names
- Currency symbols from `Iceland.Currency.Get` ISO list
- Currency Exchange Rates with `Exchange Rate Amount = 100`
- LCY-aware normalization: when LCY &lt;> ISK, rates are rebased using LCY/ISK as base

## Request
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
1. Use this message type as the default write operation for currency sync.
2. Select `date` as a business day; if no rates are returned, retry with previous business day.
3. Prefer `rateType = All` for full coverage.
4. Keep `syncExchangeRates = true` when you need posting-ready rates.
5. Use targeted runs when needed:
   - metadata only: `syncMetadata = true`, others false
   - exchange rates only: `syncExchangeRates = true`, others false
6. Validate counts in response (`currencyCount`, `metadataCount`, `exchangeRateCount`).
7. If LCY is not ISK, ensure LCY rate exists in the same feed/date (required for normalization).

## Implemented sync rules
- Feed source rates are ISK-based.
- `Exchange Rate Amount` is fixed to `100`.
- `Relational Exch. Rate Amount = normalizedRate * 100`.
- If LCY = ISK: `normalizedRate = midRate`.
- If LCY &lt;> ISK: `normalizedRate = midRate / lcyMidRate`.
- Currency and exchange-rate sync skip the LCY code row itself.

## Manual update fallback
If direct sync is disabled, do this sequence manually:
1. `Iceland.CurrencyRates.Get` (source rates)
2. `Iceland.Currency.Get` (ISO metadata)
3. Upsert Currency descriptions/symbols
4. Upsert Currency Exchange Rate using key `(CurrencyCode, StartingDate)` and 100-based formula
5. Verify LCY normalization assumption before posting

## Response
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
- Missing/invalid `date` or `dateTo`
- Invalid `rateType`
- No rates returned for date/rateType
- No ISO currencies returned for metadata sync
- LCY base rate missing in feed when LCY is not ISK
- All sync flags false (`syncCurrencies`, `syncMetadata`, `syncExchangeRates`)

## Troubleshooting - outbound HTTP blocked
If a call fails with outbound HTTP blocked errors:
1. Open **Extension Management** and open **Bifrost Iceland** settings.
2. Turn on **Allow HttpClient Requests**.
3. If allowlisting is enabled, allow Seðlabanki, SIX Group, and REST Countries endpoints.

