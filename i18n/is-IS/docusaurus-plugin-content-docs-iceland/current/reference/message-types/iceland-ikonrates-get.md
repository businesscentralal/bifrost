---
id: iceland-ikonrates-get
title: "Iceland.IkonRates.Get"
sidebar_label: "Iceland.IkonRates.Get"
sidebar_position: 31
description: "Beiðni- og svarsamningur fyrir Iceland.IkonRates.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the IKON reference interest rates frá the public XML data feed
(Seðlabanki Íslands feed group "IKON"). The feed publishes two daily fixings:
IKON rate A (first publication, ~11:01) og IKON rate B (second publication, ~13:01).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the IKON reference rate fixing fyrir a business date, eða its history over a span.

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
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value of each fixing.** |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Skilar one row per fixing *per business day* in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir the current value, Kallaðu á með **no body** (eða `{}`).
2. There eru two series: `seriesId` 31010 = IKON A (first/earlier fixing), 31011 = IKON B (second/later fixing).
3. Prefer IKON B Þegar you need the final daily value; A er the earlier intraday publication.
4. `percent` er the annual rate; check `rateDate`, as A og B getur carry different latest dates.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Series (stable seriesId)
| seriesId | Heiti | Meaning |
|---|---|---|
| 31010 | IKON vextir A | First publication (~11:01). |
| 31011 | IKON vextir B | Second publication (~13:01). |

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 2,
  "rates": [
    {
      "seriesId": 31010,
      "name": "IKON vextir A",
      "description": "IKON vextir A, fyrri birting kl 11:01",
      "rateDate": "2026-06-19",
      "percent": 7.409
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `percent` er the annual IKON rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no IKON rates ...` - no values fyrir the supplied date; retry without a date fyrir the latest values, eða pick a business date.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


