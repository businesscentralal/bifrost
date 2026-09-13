---
id: iceland-loantermrates-get
title: "Iceland.LoanTermRates.Get"
sidebar_label: "Iceland.LoanTermRates.Get"
sidebar_position: 37
description: "Beiðni- og svarsamningur fyrir Iceland.LoanTermRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Icelandic fixed loan-term interest rates frá the public XML data
feed (Seðlabanki Íslands feed group "Fastir lánstímavextir"). These eru the
estimated par yields (FLVR) og annuity / stakan-greiðsla (eingreiðslu) rates fyrir
indexed (verðtryggt) og non-indexed (óverðtryggt) loans at 3, 5, og 10 year terms.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need benchmark fixed-term mortgage/loan yields fyrir pricing eða valuation.
- You need til compare indexed vs non-indexed term rates at 3/5/10 years.

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
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value of each series.** |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Skilar one row per series *per published date* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir the current term structure, Kallaðu á með **no body** (eða `{}`).
2. Match a series by its stable numeric `seriesId`; the term og Gerð eru in the `name`.
3. `percent` er the annual yield (e.g. `7.69` means 7.69%).
4. `name` encodes Gerð + indexation + term: `Par-vextir % (FLVR)` = par yield, `Eingreiðsluvextir %` = annuity/stakan-greiðsla; `verðtryggt` = indexed, `óverðtryggt` = non-indexed; trailing `3`/`5`/`10` = years.
5. The feed provides no `description`; rely on `name`.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Key series (stable seriesId)
| seriesId | Heiti | Meaning |
|---|---|---|
| 30101 | Par-vextir % (FLVR) óverðtryggt, 3 | Non-indexed par yield, 3 yr. |
| 30103 | Par-vextir % (FLVR) óverðtryggt, 10 | Non-indexed par yield, 10 yr. |
| 30104 | Par-vextir % (FLVR) verðtryggt, 3 | Indexed par yield, 3 yr. |
| 30106 | Par-vextir % (FLVR) verðtryggt, 10 | Indexed par yield, 10 yr. |
| 30110 | Eingreiðsluvextir % óverðtryggt, 3 | Non-indexed annuity rate, 3 yr. |
| 30107 | Eingreiðsluvextir % verðtryggt, 3 | Indexed annuity rate, 3 yr. |

Series ids 30101-30112 cover the fulla 3/5/10-year grid; read `seriesId`/`name` frá Svarið.

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "rates": [
    {
      "seriesId": 30101,
      "name": "Par-vextir % (FLVR) óverðtryggt, 3",
      "description": "",
      "rateDate": "2026-06-19",
      "percent": 7.69
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` er the Icelandic series label; `description` er empty fyrir this feed.
- `percent` er the annual yield.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no loan-term rates ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a published date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


