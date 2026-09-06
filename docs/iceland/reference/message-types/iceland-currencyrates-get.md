---
id: iceland-currencyrates-get
title: "Iceland.CurrencyRates.Get"
sidebar_label: "Iceland.CurrencyRates.Get"
sidebar_position: 21
description: "Request and response contract for the Iceland.CurrencyRates.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves Seðlabanki Íslands (Central Bank of Iceland) currency rates from the
public XML data feed for a date or date span.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need official Icelandic central-bank currency rates for a business date.
- You want the rates as JSON without writing directly to BC currency tables.
- You need the official reference rate (with buying/mid/selling) or the registered mid-rate.
- You need *every* currency in one response — use `All` to merge both feeds.

## Rate types
| `rateType` | Seðlabanki feed | Coverage |
|---|---|---|
| `Reference` (default) | Opinbert viðmiðunargengi SÍ | Major currencies (USD, EUR, GBP, DKK, NOK, SEK, CHF, CAD, JPY, SDR). Carries buying/mid/selling; in practice mid is always populated. |
| `Mid` | Skráð miðgengi SÍ | Minor / exotic currencies. Mid rate only. |
| `All` | Both feeds merged | Every currency: reference majors (with buying/mid/selling) plus mid-rate exotics. Use when you need full coverage in one call. |

## Request
```json
{
  "date": "2026-06-18",         // (required) ISO date YYYY-MM-DD
  "dateTo": "2026-06-19",       // (optional) ISO date; end of an inclusive span (default: same as "date")
  "rateType": "Reference"       // (optional) Reference | Mid | All (default: Reference)
}
```

## Field notes
| Field | Notes |
|---|---|
| `date` | Required ISO date. For a single day, omit `dateTo`. |
| `dateTo` | Optional. When supplied, the response returns one row per currency *per date* in the span. |
| `rateType` | Optional. Defaults to `Reference`; use `Mid` for exotic currencies not in the reference list, or `All` to merge both feeds for full coverage. |

## AI/Agent playbook
Use this message type as a read-only lookup step before any update to BC exchange-rate data.
1. Pick one business date. Seðlabanki publishes on business days; weekends/holidays return no rates.
2. Use `Reference` for the majors, `Mid` for a currency only published in the exotic list, or `All` when you need every currency in one call.
3. Keep dates in ISO `YYYY-MM-DD` form.
4. Match `currencyCode` against the BC Currency table; skip rows whose `currencyCode` is empty (no known ISO mapping).
5. If the response is empty, treat it as a business-date/data-availability issue, not a parsing failure.
6. For LCY-aware sync, resolve BC LCY first. If LCY &lt;> ISK, compute cross-rates via LCY/ISK base before writing.
Capability boundary: this endpoint does not post or update BC by itself; apply updates explicitly in a separate write step.

## Manual update formulas (Currency Exchange Rate)
- Feed quote is ISK per 1 foreign unit (`midRate`).
- Storage convention in this app: `Exchange Rate Amount = 100`.
- If LCY = ISK: `normalizedRate = midRate`.
- If LCY &lt;> ISK: `normalizedRate = midRate / lcyMidRate` where `lcyMidRate` is the feed `midRate` for LCY.
- `Relational Exch. Rate Amount = normalizedRate * 100`.
- Primary key for manual upsert: `(CurrencyCode, StartingDate)`.

## Response
```json
{
  "status": "Success",
  "rateType": "Reference",
  "dateFrom": "2026-06-18",
  "dateTo": "2026-06-18",
  "count": 10,
  "rates": [
    {
      "currencyCode": "USD",
      "name": "Bandaríkjadalur",
      "rateDate": "2026-06-18",
      "buyingRate": 0,
      "midRate": 125.99,
      "sellingRate": 0
    }
  ]
}
```

### Response field notes
- `currencyCode` is the ISO 4217 code mapped from the feed's Icelandic `name`. It is empty when no mapping is known — the row is still returned.
- `name` is the Icelandic currency name exactly as published by Seðlabanki.
- A rate value of `0` means the feed did not publish that series for the currency/date.
- Seðlabanki rates are quoted as ISK per 1 unit of the foreign currency.

## Errors
- `Missing required 'date'` - the `date` property is missing or not a valid ISO date.
- `'rateType' must be one of ...` - the `rateType` value is unknown.
- `Seðlabanki returned no currency rates ...` - no rates exist for the supplied rate type and date.
- For non-business days: call again with a previous business date.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Seðlabanki was blocked ...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://sedlabanki.is`.

