---
id: iceland-currencyrates-get
title: "Iceland.CurrencyRates.Get"
sidebar_label: "Iceland.CurrencyRates.Get"
sidebar_position: 21
description: "Beiðni- og svarsamningur fyrir Iceland.CurrencyRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Seðlabanki Íslands (Central Bank of Iceland) currency rates frá the
public XML data feed fyrir a date eða date span.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need official Icelandic central-bank currency rates fyrir a business date.
- You want the rates as JSON without writing directly til BC currency tables.
- You need the official reference rate (með buying/mid/selling) eða the registered mid-rate.
- You need *every* currency in one Svar — Notaðu `All` til merge both feeds.

## Rate types
| `rateType` | Seðlabanki feed | Coverage |
|---|---|---|
| `Reference` (default) | Opinbert viðmiðunargengi SÍ | Major currencies (USD, EUR, GBP, DKK, NOK, SEK, CHF, CAD, JPY, SDR). Carries buying/mid/selling; in practice mid er always populated. |
| `Mid` | Skráð miðgengi SÍ | Minor / exotic currencies. Mid rate Aðeins. |
| `All` | Both feeds merged | Every currency: reference majors (með buying/mid/selling) plus mid-rate exotics. Notað þegar you need fulla coverage in one Kallaðu á. |

## Beiðni
```json
{
  "date": "2026-06-18",         // (required) ISO date YYYY-MM-DD
  "dateTo": "2026-06-19",       // (optional) ISO date; end of an inclusive span (default: same as "date")
  "rateType": "Reference"       // (optional) Reference | Mid | All (default: Reference)
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | nauðsynlegt ISO date. fyrir a stakan day, omit `dateTo`. |
| `dateTo` | valfrjálst. Þegar supplied, Svarið Skilar one row per currency *per date* in the span. |
| `rateType` | valfrjálst. Defaults til `Reference`; Notaðu `Mid` fyrir exotic currencies not in the reference Listi, eða `All` til merge both feeds fyrir fulla coverage. |

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this message Gerð as a read-Aðeins lookup step áður en any update til BC exchange-rate data.
1. Pick one business date. Seðlabanki publishes on business days; weekends/holidays return no rates.
2. Notaðu `Reference` fyrir the majors, `Mid` fyrir a currency Aðeins published in the exotic Listi, eða `All` Þegar you need every currency in one Kallaðu á.
3. Keep dates in ISO `YYYY-MM-DD` form.
4. Match `currencyCode` against the BC Currency table; skip rows whose `currencyCode` er empty (no known ISO mapping).
5. Ef Svarið er empty, treat it as a business-date/data-availability issue, not a parsing failure.
6. fyrir LCY-aware sync, resolve BC LCY first. Ef LCY &lt;> ISK, compute cross-rates via LCY/ISK base áður en writing.
Capability boundary: this Endapunktur does not post eða update BC by itself; apply Uppfærir explicitly in a separate write step.

## Manual update formulas (Currency Exchange Rate)
- Feed quote er ISK per 1 foreign unit (`midRate`).
- Storage convention in this app: `Exchange Rate Amount = 100`.
- Ef LCY = ISK: `normalizedRate = midRate`.
- Ef LCY &lt;> ISK: `normalizedRate = midRate / lcyMidRate` where `lcyMidRate` er the feed `midRate` fyrir LCY.
- `Relational Exch. Rate Amount = normalizedRate * 100`.
- Primary key fyrir manual upsert: `(CurrencyCode, StartingDate)`.

## Svar
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

### Svar Reitur notes
- `currencyCode` er the ISO 4217 code mapped frá the feed's Icelandic `name`. It er empty Þegar no mapping er known — the row er still returned.
- `name` er the Icelandic currency Heiti exactly as published by Seðlabanki.
- A rate value of `0` means the feed did not publish that series fyrir the currency/date.
- Seðlabanki rates eru quoted as ISK per 1 unit of the foreign currency.

## Errors
- `Missing required 'date'` - the `date` property er missing eða not a valid ISO date.
- `'rateType' must be one of ...` - the `rateType` value er unknown.
- `Seðlabanki returned no currency rates ...` - no rates exist fyrir the supplied rate Gerð og date.
- fyrir non-business days: Kallaðu á again með a previous business date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


