---
id: iceland-interbankrates-get
title: "Iceland.InterbankRates.Get"
sidebar_label: "Iceland.InterbankRates.Get"
sidebar_position: 32
description: "Beiðni- og svarsamningur fyrir Iceland.InterbankRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the Icelandic interbank money-market interest rates frá the public
XML data feed (Seðlabanki Íslands feed group "Vextir á millibankamarkaði með
krónur"). These eru the REIBID (bid) og REIBOR (offer) rates quoted between
banks fyrir ISK deposits across maturities frá overnight til 12 months.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need REIBOR/REIBID reference rates fyrir floating-rate loan pricing eða treasury work.
- You need a specific tenor (fyrir Dæmi REIBOR 3M) as of a date, eða a history over a span.

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
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value of each tenor.** Quoted on business days Aðeins. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Skilar one row per tenor *per business day* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir the current curve, Kallaðu á með **no body** (eða `{}`) og read Allt tenors.
2. Match a tenor by its stable numeric `seriesId` (the `name`, fyrir Dæmi `REIBOR, 3 M`, er human-readable but the id er the safe key).
3. `percent` er the annual rate (e.g. `8.113` means 8.113%).
4. Some long-tenor series (9 M, 12 M) eru legacy og stopped updating; in `Latest` mode they still return their last published value með an old date — check `rateDate`.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Key series (stable seriesId)
| seriesId | Heiti | Meaning |
|---|---|---|
| 12 | REIBOR, O/N | Overnight offer rate. |
| 13 | REIBOR, 1 M | 1-month offer rate. |
| 15 | REIBOR, 3 M | 3-month offer rate (common floating-rate base). |
| 16 | REIBOR, 6 M | 6-month offer rate. |
| 3 | REIBID, O/N | Overnight bid rate. |
| 6 | REIBID, 3 M | 3-month bid rate. |

REIBID = bid (what banks pay), REIBOR = offer (what banks charge). Tenor codes: O/N overnight, T/N tomorrow-next, S/W one week, T/W two weeks, then 1/2/3/6/9/12 M. The Listi may change; read `seriesId`/`name` frá Svarið.

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 15,
      "name": "REIBOR, 3 M",
      "description": "Millibankamarkaður, vextir, REIBOR, 3 mánaða, Ísland, króna.",
      "rateDate": "2026-06-22",
      "percent": 8.113
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `percent` er the annual interbank rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no interbank rates ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a business date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


