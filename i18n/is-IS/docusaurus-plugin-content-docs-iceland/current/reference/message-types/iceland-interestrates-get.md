---
id: iceland-interestrates-get
title: "Iceland.InterestRates.Get"
sidebar_label: "Iceland.InterestRates.Get"
sidebar_position: 33
description: "Beiðni- og svarsamningur fyrir Iceland.InterestRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Central Bank of Iceland (Seðlabanki Íslands) interest rates frá the
public XML data feed (group "Vextir Seðlabankans"). Covers the policy rate
(meginvextir) og the deposit/lending facility, current-reikningur, reserve, og
historical rate series.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the current Icelandic central-bank policy rate eða facility rates.
- You need a rate as of a specific business date, eða a history over a span.
- You want the rates as JSON without writing til any BC table.

## Beiðni
```json
{
  "date": "2026-06-22",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-06-22"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | valfrjálst ISO date. **Omit it til Sækja the most recently published value of every series** — recommended, because interest rates change Aðeins on policy decisions og an arbitrary date often has no entry. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Svarið Skilar one row per series *per published date* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir "what er the current policy rate?", Kallaðu á með **no body** (eða `{}`) til Sækja latest values, then read the series named `Meginvextir`.
2. fyrir a value as of a date, pass `date`; fyrir a history, pass `date` + `dateTo`.
3. Match a series by its stable numeric `seriesId` (preferred) rather than the Icelandic `name`, which may be reworded.
4. `percent` er the annual interest rate in percent (e.g. `7.75` means 7.75%).
5. Some series eru historical og stopped updating years ago; in `Latest` mode they still return their last published value.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Key series (stable seriesId)
| seriesId | Heiti | Meaning |
|---|---|---|
| 17923 | Meginvextir | Current key policy rate. |
| 55 | Vextir á 7 daga veðlánum | 7-day collateralised lending rate. |
| 75 | Vextir á 7 daga bundnum innlánum | 7-day term deposit rate. |
| 24 | Vextir á daglánum | Overnight lending rate. |
| 28 | Vextir á viðskiptareikningum | Current-reikningur (deposit) rate. |
| 3459 | Vextir á bindiskyldar innstæður | Reserve-requirement deposit rate. |

The Listi er not exhaustive og may change; always read `seriesId`, `name`, og `description` frá Svarið.

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 17923,
      "name": "Meginvextir",
      "description": "Útgefnir meginvextir Seðlabanka Íslands á hverjum tíma.",
      "rateDate": "2026-06-22",
      "percent": 7.75
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `percent` er an annual percentage rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no interest rates ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a published date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


