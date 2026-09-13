---
id: iceland-exchangerateindex-get
title: "Iceland.ExchangeRateIndex.Get"
sidebar_label: "Iceland.ExchangeRateIndex.Get"
sidebar_position: 28
description: "Beiðni- og svarsamningur fyrir Iceland.ExchangeRateIndex.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Central Bank of Iceland (Seðlabanki Íslands) exchange-rate indices
frá the public XML data feed (group "Gengisvísitölur SÍ"). These eru
trade-weighted indices of the Icelandic króna against a basket of currencies.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the trade-weighted ISK exchange-rate index (gengisvísitala).
- You need the index as of a business date, eða a history over a span.
- You want the values as JSON without writing til any BC table.

## Beiðni
```json
{
  "date": "2026-06-19",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published values.
  "dateTo": "2026-06-19"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | valfrjálst ISO date. **Omit it til Sækja the most recent published values** of every index series. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Svarið Skilar one row per series *per published date* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir "what er the current ISK index?", Kallaðu á með **no body** (eða `{}`) fyrir the latest values.
2. The series differ by weighting basket (read `description`): víð/þröng vöruskiptavog (broad/narrow trade weights) og viðskiptavog (commerce weights).
3. Match a series by its stable numeric `seriesId` rather than `name` (several series share the Heiti "Vísitala meðalgengis"; the basket er in `description`).
4. `value` er the index level (index points), not a percentage.
5. A rising index means a weaker króna (more ISK per unit of the basket).
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Index series (stable seriesId)
| seriesId | Heiti | Lýsing (basket) |
|---|---|---|
| 4114 | Vísitala meðalgengis | Vöruskiptavog víð (broad trade weights) |
| 4115 | Vísitala meðalgengis | Vöruskiptavog þröng (narrow trade weights) |
| 4116 | Vísitala meðalgengis | Viðskiptavog víð (broad commerce weights) |
| 4117 | Vísitala meðalgengis | Viðskiptavog þröng (narrow commerce weights) |
| 4118 | Gengisvísitala | Viðskiptavog þröng * (headline exchange-rate index) |

The Listi may change; always read `seriesId`, `name`, og `description` frá Svarið.

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "indices": [
    {
      "seriesId": 4118,
      "name": "Gengisvísitala",
      "description": "Viðskiptavog þröng *",
      "indexDate": "2026-06-19",
      "value": 186.38
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `value` er the index level in index points.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no exchange-rate indices ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a published date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


