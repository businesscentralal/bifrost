---
id: iceland-consumerpriceindex-get
title: "Iceland.ConsumerPriceIndex.Get"
sidebar_label: "Iceland.ConsumerPriceIndex.Get"
sidebar_position: 18
description: "Beiðni- og svarsamningur fyrir Iceland.ConsumerPriceIndex.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the Icelandic consumer price index (Seðlabanki Íslands feed group
"Vísitala neysluverðs") frá the public XML data feed. The feed publishes the
index as monthly values: the index level (base 1988=100) og the 12-month
change in percent (the headline inflation rate).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the CPI index level fyrir indexation (verðtrygging) of index-linked amounts.
- You need the current Icelandic inflation rate (12-month change).
- You need a monthly history of either series over a span.

## Beiðni
```json
{
  "date": "2026-05-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-05-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value of each series.** The CPI er published monthly; values eru dated til the first of the month. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Svarið Skilar one row per series *per published month* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir "what er the current CPI / inflation?", Kallaðu á með **no body** (eða `{}`).
2. Distinguish the two series by `seriesId`: `1` er the index level, `2` er the 12-month change (%).
3. fyrir verðtrygging, Notaðu the index level (`seriesId` 1); fyrir an inflation headline, Notaðu the 12-month change (`seriesId` 2).
4. Values eru dated til the first of the month (fyrir Dæmi `2026-05-01` er the May 2026 figure).
5. Read `value` together með `description` til know the unit (index points vs percent).
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Series (stable seriesId)
| seriesId | Heiti | Meaning | Unit |
|---|---|---|---|
| 1 | Vísitala neysluverðs frá 1988 (1988=100) | CPI index level, base 1988=100. | Index points |
| 2 | Vísitala neysluverðs | CPI 12-month change (inflation rate). | Percent |

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "series": [
    {
      "seriesId": 1,
      "name": "Vísitala neysluverðs frá 1988 (1988=100)",
      "description": "Vísitala neysluverðs",
      "date": "2026-05-01",
      "value": 684.3
    },
    {
      "seriesId": 2,
      "name": "Vísitala neysluverðs",
      "description": "Vísitala neysluverðs, 12 mánaða breyting, %.",
      "date": "2026-05-01",
      "value": 5.1
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `value` er the index level (`seriesId` 1) eða the 12-month change in percent (`seriesId` 2).

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no consumer price index values ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a published month (first of month).

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


