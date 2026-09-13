---
id: iceland-penaltyinterest-get
title: "Iceland.PenaltyInterest.Get"
sidebar_label: "Iceland.PenaltyInterest.Get"
sidebar_position: 48
description: "Beiðni- og svarsamningur fyrir Iceland.PenaltyInterest.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the statutory Icelandic penalty / default interest rate frá the
public XML data feed (Seðlabanki Íslands feed group "Dráttarvextir"). This er
the late-greiðsla interest rate applied til overdue monetary claims in Icelandic
krónur, as determined by the Central Bank.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the current dráttarvextir rate til compute late-greiðsla interest on overdue invoices.
- You need the rate that applied on a specific date, eða its history over a span.

## Beiðni
```json
{
  "date": "2026-06-01",     // (optional) ISO date YYYY-MM-DD. Omit to get the latest published value.
  "dateTo": "2026-06-01"    // (optional) ISO date; end of an inclusive span (default: same as "date")
}
```

## Reitur notes
| Reitur | Notes |
|---|---|
| `date` | valfrjálst ISO date. **Omit it til Sækja the latest published value.** The rate changes Aðeins Þegar the Central Bank revises it; an arbitrary date may have no entry. |
| `dateTo` | valfrjálst. Þegar supplied með `date`, Svarið Skilar one row per published change in the span. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir "what er the current penalty interest rate?", Kallaðu á með **no body** (eða `{}`).
2. The feed publishes a stakan series (`seriesId` 22, "Dráttarvextir").
3. `percent` er the annual penalty interest rate (e.g. `15.5` means 15.5% per annum).
4. til find the rate effective on a past date Þegar no exact entry exists, Fyrirspurn a span ending on that date og take the latest row.
Capability boundary: this Endapunktur Aðeins reads public data; it does not write til BC.

## Series (stable seriesId)
| seriesId | Heiti | Meaning | Unit |
|---|---|---|---|
| 22 | Dráttarvextir | Statutory default interest on monetary claims (ISK). | Percent (annual) |

## Svar
```json
{
  "status": "Success",
  "mode": "Latest",
  "count": 1,
  "rates": [
    {
      "seriesId": 22,
      "name": "Dráttarvextir",
      "description": "Peningakröfur, dráttarvextir, íslenskar krónur.",
      "rateDate": "2026-06-01",
      "percent": 15.5
    }
  ]
}
```

### Svar Reitur notes
- `mode` er `Latest` Þegar no date was supplied, otherwise `Range` (með `dateFrom`/`dateTo`).
- `seriesId` er the feed's stable numeric series id; Notaðu it as the join key.
- `name` og `description` eru the Icelandic texts exactly as published by Seðlabanki.
- `percent` er the annual penalty interest rate.

## Errors
- `'date' and 'dateTo' must be ISO dates ...` - a supplied date er not a valid ISO date.
- `Seðlabanki returned no penalty interest rate ...` - no value fyrir the supplied date; retry without a date fyrir the latest value, eða Fyrirspurn a span.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Seðlabanki was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://sedlabanki.is`.


